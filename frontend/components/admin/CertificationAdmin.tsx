// frontend/pages/admin/certif/CertificationsAdmin.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Shield, RefreshCw, AlertCircle, Database, Plus } from 'lucide-react';
import { Certification, AdminAction } from '@/types/certification';
import CertificationCard from '@/components/admin/CertificationCard';
import ActionModal from '@/components/admin/ActionModal';
import styles from '@/styles/admin/App.module.css';

const API_BASE_URL = 'http://localhost:5000';
//a"tini el component elli styles mte"hom mayemchic
class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  private async uploadFile(endpoint: string, file: File, additionalData?: Record<string, string>) {
    const url = `${API_BASE_URL}${endpoint}`;
    const formData = new FormData();
    formData.append('file', file);
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`File upload failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getCertifications(): Promise<Certification[]> {
    const data = await this.request<any[]>('/lessons-and-subparts');
    return data.map((cert) => ({
      ...cert,
      id: String(cert.id),
      lessons: cert.lessons.map((lesson: any) => ({
        ...lesson,
        id: String(lesson.id),
        completed: lesson.completed ?? false,
        subparts: lesson.subparts.map((subpart: any) => ({
          ...subpart,
          id: String(subpart.id),
          completed: subpart.completed ?? false,
          isQuiz: subpart.isQuiz ?? false,
        })),
      })),
    }));
  }

  async addCertification(name: string) {
    return this.request('/admin/certifications', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async addQuiz(certId: string, quizData: { question: string; options: string[]; answer: string }) {
    return this.request(`/admin/certifications/${Number(certId)}/quiz`, {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  }

  async editQuiz(certId: string, quizId: string, quizData: { question: string; options: string[]; answer: string }) {
    return this.request(`/admin/certifications/${Number(certId)}/quiz/${Number(quizId)}`, {
      method: 'PUT',
      body: JSON.stringify(quizData),
    });
  }

  async addVideo(certId: string, file: File, title: string) {
    return this.uploadFile(`/admin/certifications/${Number(certId)}/video`, file, { title });
  }

  async addLabGuide(certId: string, file: File) {
    return this.uploadFile(`/admin/certifications/${Number(certId)}/lab`, file);
  }

  async addLesson(certId: string, title: string) {
    return this.request('/admin/lessons', {
      method: 'POST',
      body: JSON.stringify({ title, certification_id: Number(certId) }),
    });
  }

  async addSubpart(lessonId: string, title: string, duration: string) {
    return this.request('/admin/subparts', {
      method: 'POST',
      body: JSON.stringify({ title, duration, lesson_id: Number(lessonId) }),
    });
  }
}

const apiService = new ApiService();

export default function CertificationsAdmin() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<AdminAction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCertifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const data = await apiService.getCertifications();
      setCertifications(data);
      clearTimeout(timeoutId);
    } catch (err: any) {
      console.error('خطأ في الجلب:', err);
      setError(
        err.name === 'AbortError'
          ? 'انتهت مهلة الطلب. يرجى التحقق من تشغيل الخادم على http://localhost:5000.'
          : err.message === 'Failed to fetch'
          ? 'لا يمكن الاتصال بالخادم. يرجى التأكد من تشغيل الخادم وتكوين CORS.'
          : 'حدث خطأ أثناء جلب الشهادات.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  const handleAdminAction = useCallback((action: AdminAction) => {
    setCurrentAction(action);
    setIsModalOpen(true);
  }, []);

  const handleActionSubmit = useCallback(
    async (data: {
      name?: string;
      title?: string;
      file?: File;
      question?: string;
      options?: string[];
      answer?: string;
      duration?: string;
      certification_id?: string;
      lesson_id?: string;
      quizId?: string;
    }) => {
      console.log('Action submitted:', { currentAction, data });
      try {
        if (!currentAction) throw new Error('No action specified');
        switch (currentAction.type) {
          case 'add-certification':
            if (!data.name) throw new Error('Certification name is required');
            await apiService.addCertification(data.name);
            break;
          case 'add-video':
            if (!currentAction.targetId) throw new Error('Target ID is required for adding video');
            if (!data.file || !data.title) throw new Error('File and title are required for adding video');
            await apiService.addVideo(currentAction.targetId, data.file, data.title);
            break;
          case 'add-lab-guide':
            if (!currentAction.targetId) throw new Error('Target ID is required for adding lab guide');
            if (!data.file) throw new Error('File is required for adding lab guide');
            await apiService.addLabGuide(currentAction.targetId, data.file);
            break;
          case 'add-quiz':
            if (!currentAction.targetId) throw new Error('Target ID is required for adding quiz');
            if (!data.question || !data.options || !data.answer) {
              throw new Error('Question, options, and answer are required for adding quiz');
            }
            await apiService.addQuiz(currentAction.targetId, {
              question: data.question,
              options: data.options,
              answer: data.answer,
            });
            break;
          case 'edit-quiz':
            if (!currentAction.targetId || !currentAction.quizId) {
              throw new Error('Target ID and quiz ID are required for editing quiz');
            }
            if (!data.question || !data.options || !data.answer) {
              throw new Error('Question, options, and answer are required for editing quiz');
            }
            await apiService.editQuiz(currentAction.targetId, currentAction.quizId, {
              question: data.question,
              options: data.options,
              answer: data.answer,
            });
            break;
          case 'add-lesson':
            if (!currentAction.targetId) throw new Error('Target ID is required for adding lesson');
            if (!data.title) throw new Error('Title is required for adding lesson');
            await apiService.addLesson(currentAction.targetId, data.title);
            break;
          case 'add-subpart':
            if (!currentAction.targetId) throw new Error('Target ID is required for adding subpart');
            if (!data.title || !data.duration) throw new Error('Title and duration are required for adding subpart');
            await apiService.addSubpart(currentAction.targetId, data.title, data.duration);
            break;
          default:
            throw new Error(`Unknown action type: ${currentAction.type}`);
        }
        console.log('Action completed successfully');
        await fetchCertifications();
      } catch (error: any) {
        console.error('Action failed:', { error: error.message, action: currentAction?.type, data });
        setError(`فشل في تنفيذ الإجراء: ${error.message}`);
      }
    },
    [currentAction, fetchCertifications]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentAction(null);
  }, []);

  const handleAddCertification = useCallback(() => {
    setCurrentAction({
      type: 'add-certification',
      targetType: 'certification',
    });
    setIsModalOpen(true);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.loadingContainer}>
          <div className={styles.loadingContent}>
            <RefreshCw className={`${styles.icon} ${styles.iconSpin}`} size={48} aria-hidden="true" />
            <h2 className={styles.loadingTitle}>جاري تحميل الشهادات</h2>
            <p className={styles.loadingText}>جلب بيانات الشهادات من قاعدة البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <AlertCircle className={styles.iconRed} size={48} aria-hidden="true" />
            <h2 className={styles.errorTitle}>خطأ في الاتصال</h2>
            <p className={styles.errorText}>{error}</p>
            <button
              onClick={fetchCertifications}
              className={styles.errorButton}
              aria-label="إعادة المحاولة"
            >
              حاول مرة أخرى
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <Shield className={styles.icon} size={32} aria-hidden="true" />
            <div>
              <h1 className={styles.headerTitle}>إدارة الشهادات</h1>
              <p className={styles.headerSubtitle}>إدارة الدروس والأجزاء الفرعية والاختبارات والمحتوى</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.statsContainer}>
              <Database size={16} aria-hidden="true" />
              <span>{certifications.length} شهادة</span>
            </div>
            <button
              onClick={handleAddCertification}
              className={styles.addButton}
              aria-label="إضافة شهادة جديدة"
            >
              <Plus size={16} aria-hidden="true" />
              إضافة شهادة
            </button>
            <button
              onClick={fetchCertifications}
              className={styles.refreshButton}
              aria-label="تحديث القائمة"
            >
              <RefreshCw size={16} aria-hidden="true" />
              تحديث
            </button>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        {certifications.length === 0 ? (
          <div className={styles.emptyContainer}>
            <Shield className={styles.iconGray} size={64} aria-hidden="true" />
            <h2 className={styles.emptyTitle}>لا توجد شهادات</h2>
            <p className={styles.emptyText}>لا توجد شهادات متاحة في قاعدة البيانات.</p>
            <button
              onClick={handleAddCertification}
              className={styles.addFirstButton}
              aria-label="إضافة أول شهادة"
            >
              <Plus size={16} aria-hidden="true" />
              إضافة أول شهادة
            </button>
          </div>
        ) : (
          <div className={styles.certificationsGrid}>
            {certifications.map((certification) => (
              <CertificationCard
                key={certification.id}
                certification={certification}
                onAdminAction={handleAdminAction}
              />
            ))}
          </div>
        )}
      </div>

      <ActionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        action={currentAction}
        onSubmit={handleActionSubmit}
      />
    </div>
  );
}