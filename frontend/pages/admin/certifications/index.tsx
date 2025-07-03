import React, { useState, useEffect, useCallback } from 'react';
import { Shield, RefreshCw, AlertCircle, Database, Plus } from 'lucide-react';
import { Certification, AdminAction } from '@/types/certification';
import CertificationCard from '@/components/admin/CertificationCard';
import ActionModal from '@/components/admin/ActionModal';
import styles from '@/styles/admin/App.module.css';

const API_BASE_URL = 'http://localhost:5000';

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
      console.log(`API response for ${endpoint}:`, response.status, await response.clone().json());
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
          videoId: subpart.video_id ? String(subpart.video_id) : undefined,
          labGuideUrl: subpart.lab_guide_url ?? null, // Optional
          labGuideId: subpart.lab_guide_id ? String(subpart.lab_guide_id) : undefined,
        })),
      })),
    }));
  }

  async addCertification(name: string, description: string) {
    return this.request('/admin/certifications', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  }

  async addQuiz(subpartId: string, quizData: { question: string; options: string[]; answer: string }) {
    return this.request(`/admin/subparts/${subpartId}/quiz`, {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  }

  async editQuiz(subpartId: string, quizId: string, quizData: { question: string; models: string[]; answer: string }) {
    return this.request(`/admin/subparts/${subpartId}/quiz/${quizId}`, {
      method: 'PUT',
      body: JSON.stringify(quizData),
    });
  }

  async addVideo(subpartId: string, objectKey: string, title: string) {
    return this.request(`/admin/subparts/${subpartId}/video`, {
      method: 'POST',
      body: JSON.stringify({ title, object_key: objectKey }),
    });
  }

  async addLabGuide(subpartId: string, objectKey: string, title: string) {
    return this.request(`/admin/subparts/${subpartId}/lab`, {
      method: 'POST',
      body: JSON.stringify({ title, object_key: objectKey }),
    });
  }

  async addLesson(certId: string, title: string) {
    return this.request('/admin/lessons', {
      method: 'POST',
      body: JSON.stringify({ title, certification_id: certId }),
    });
  }

  async addSubpart(lessonId: string, title: string, duration: string) {
    return this.request('/admin/subparts', {
      method: 'POST',
      body: JSON.stringify({ title, duration, lesson_id: Number(lessonId) }),
    });
  }

  async deleteCertification(certId: string) {
    return this.request(`/admin/certifications/${certId}`, {
      method: 'DELETE',
    });
  }

  async deleteQuiz(subpartId: string, quizId: string) {
    return this.request(`/admin/subparts/${subpartId}/quiz/${quizId}`, {
      method: 'DELETE',
    });
  }

  async deleteVideo(subpartId: string, videoId: string) {
    return this.request(`/admin/subparts/${subpartId}/video/${videoId}`, {
      method: 'DELETE',
    });
  }

  async deleteLabGuide(subpartId: string, labId: string) {
    return this.request(`/admin/subparts/${subpartId}/lab/${labId}`, {
      method: 'DELETE',
    });
  }

  async getCertificationByName(name: string) {
    return this.request(`/api/certifications/by-name?name=${encodeURIComponent(name)}`);
  }

  async getLabGuide(subpartId: string) {
    return this.request(`/admin/subparts/${subpartId}/lab`);
  }

  async getVideo(subpartId: string) {
    return this.request(`/admin/subparts/${subpartId}/video`);
  }
}

const apiService = new ApiService();

function App() {
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
      console.log('Fetched certifications:', data);
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

  const handleAdminAction = useCallback(async (action: AdminAction) => {
    setCurrentAction(action);
    setIsModalOpen(true);
  }, []);

  const handleActionSubmit = useCallback(
    async (data: {
      name?: string;
      description?: string;
      title?: string;
      objectKey?: string;
      question?: string;
      options?: string[];
      answer?: string;
      duration?: string;
      certification_id?: string;
      lesson_id?: string;
      quizId?: string;
      videoId?: string;
      labId?: string;
    }) => {
      console.log('تم إرسال الإجراء:', currentAction, data);
      try {
        if (!currentAction) return;
        switch (currentAction.type) {
          case 'add-certification':
            if (data.name && data.description) await apiService.addCertification(data.name, data.description);
            break;
          case 'add-video':
            if (currentAction.targetId && data.objectKey && data.title) {
              await apiService.addVideo(currentAction.targetId, data.objectKey, data.title);
            }
            break;
          case 'add-lab-guide':
            if (currentAction.targetId && data.objectKey && data.title) {
              await apiService.addLabGuide(currentAction.targetId, data.objectKey, data.title);
            }
            break;
          case 'add-quiz':
            if (currentAction.targetId && data.question && data.options && data.answer) {
              await apiService.addQuiz(currentAction.targetId, {
                question: data.question,
                options: data.options,
                answer: data.answer,
              });
            }
            break;
          case 'edit-quiz':
            if (currentAction.targetId && currentAction.quizId && data.question && data.options && data.answer) {
              await apiService.editQuiz(currentAction.targetId, currentAction.quizId, {
                question: data.question,
                models: data.options,
                answer: data.answer,
              });
            }
            break;
          case 'add-lesson':
            if (currentAction.targetId && data.title) {
              await apiService.addLesson(currentAction.targetId, data.title);
            }
            break;
          case 'add-subpart':
            if (currentAction.targetId && data.title && data.duration) {
              await apiService.addSubpart(currentAction.targetId, data.title, data.duration);
            } else {
              console.error('Missing required fields for add-subpart:', data);
            }
            break;
          case 'delete-certification':
            if (currentAction.targetId) {
              await apiService.deleteCertification(currentAction.targetId);
            }
            break;
          case 'delete-quiz':
            if (currentAction.targetId && currentAction.quizId) {
              await apiService.deleteQuiz(currentAction.targetId, currentAction.quizId);
            }
            break;
          case 'delete-video':
            if (currentAction.targetId && currentAction.videoId) {
              await apiService.deleteVideo(currentAction.targetId, currentAction.videoId);
            }
            break;
          case 'delete-lab-guide':
            if (currentAction.targetId && currentAction.labId) {
              await apiService.deleteLabGuide(currentAction.targetId, currentAction.labId);
            }
            break;
          default:
            if (currentAction && 'type' in currentAction) {
              console.warn('Unknown action type:', (currentAction as any).type);
            } else {
              console.warn('Unknown action: currentAction is null or invalid');
            }
        }
        await fetchCertifications();
      } catch (error: any) {
        console.error('فشل الإجراء:', error);
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

export default React.memo(App);