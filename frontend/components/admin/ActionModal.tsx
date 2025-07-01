import React, { useState } from 'react';
import { Upload, FileText, Plus, Edit, Trash2 } from 'lucide-react';
import AdminModal from './AdminModal';
import { AdminAction } from '@/types/certification';
import styles from '@/styles/admin/ActionModal.module.css';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: AdminAction | null;
  onSubmit: (data: any) => void;
}

export default function ActionModal({ isOpen, onClose, action, onSubmit }: ActionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    name: '',
    description: '',
    videoFile: null as File | null,
    labGuideFile: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let submitData: any = {};
    
    switch (action?.type) {
      case 'add-certification':
        submitData = { 
          name: formData.name,
          description: formData.description
        };
        break;
      case 'add-video':
        submitData = { 
          title: formData.title, 
          file: formData.videoFile 
        };
        break;
      case 'add-lab-guide':
        submitData = { 
          title: formData.title, 
          file: formData.labGuideFile 
        };
        break;
      case 'add-quiz':
      case 'edit-quiz':
        submitData = {
          question: formData.question,
          options: formData.options.filter(option => option.trim() !== ''),
          answer: formData.correctAnswer
        };
        break;
      case 'add-lesson':
        submitData = { 
          title: formData.title,
          certification_id: action.targetId
        };
        break;
      case 'add-subpart':
        submitData = { 
          title: formData.title,
          duration: formData.duration,
          lesson_id: action.targetId,
          file: formData.videoFile
        };
        break;
      case 'delete-certification':
        submitData = { certificationId: action.targetId };
        break;
      case 'delete-video':
        submitData = { videoId: action.videoId };
        break;
      case 'delete-lab-guide':
        submitData = { labId: action.labId };
        break;
    }
    
    onSubmit(submitData);
    onClose();
    
    setFormData({
      title: '',
      duration: '',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      name: '',
      description: '',
      videoFile: null,
      labGuideFile: null,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const getModalContent = () => {
    switch (action?.type) {
      case 'add-certification':
        return (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>اسم الشهادة</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>وصف الشهادة</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={styles.textarea}
                required
              />
            </div>
            <button
              type="submit"
              className={`${styles.submitButton} ${styles.certificationButton}`}
            >
              <Plus size={16} />
              إضافة شهادة
            </button>
          </form>
        );

      case 'delete-certification':
        return (
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.confirmText}>هل أنت متأكد من حذف الشهادة؟</p>
            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={`${styles.submitButton} ${styles.deleteButton}`}
              >
                <Trash2 size={16} />
                تأكيد الحذف
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`${styles.submitButton} ${styles.cancelButton}`}
              >
                إلغاء
              </button>
            </div>
          </form>
        );

      case 'add-video':
        return (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>عنوان الفيديو</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>رفع ملف الفيديو</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFormData({ ...formData, videoFile: e.target.files?.[0] || null })}
                className={styles.fileInput}
                required
              />
            </div>
            <button
              type="submit"
              className={`${styles.submitButton} ${styles.uploadButton}`}
            >
              <Upload size={16} />
              إضافة الفيديو
            </button>
          </form>
        );

      case 'add-lab-guide':
        return (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>عنوان دليل المختبر</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>رفع ملف دليل المختبر</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFormData({ ...formData, labGuideFile: e.target.files?.[0] || null })}
                className={styles.fileInput}
              />
            </div>
            <button
              type="submit"
              className={`${styles.submitButton} ${styles.labGuideButton}`}
            >
              <FileText size={16} />
              إضافة دليل المختبر
            </button>
          </form>
        );

      case 'add-quiz':
      case 'edit-quiz':
        return (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>السؤال</label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className={styles.textarea}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>خيارات الإجابة</label>
              <div className={styles.optionsContainer}>
                {formData.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`الخيار ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className={styles.input}
                    required
                  />
                ))}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>الإجابة الصحيحة</label>
              <select
                value={formData.correctAnswer}
                onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                className={styles.select}
                required
              >
                <option value="">اختر الإجابة الصحيحة</option>
                {formData.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option || `الخيار ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className={`${styles.submitButton} ${styles.quizButton}`}
            >
              {action?.type === 'add-quiz' ? <Plus size={16} /> : <Edit size={16} />}
              {action?.type === 'add-quiz' ? 'إضافة اختبار' : 'تحديث الاختبار'}
            </button>
          </form>
        );

      case 'add-lesson':
        return (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>عنوان الدرس</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <button
              type="submit"
              className={`${styles.submitButton} ${styles.lessonButton}`}
            >
              <Plus size={16} />
              إضافة درس
            </button>
          </form>
        );

      case 'add-subpart':
        return (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>عنوان الجزء الفرعي</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>المدة</label>
              <input
                type="text"
                placeholder="مثال: 10:00"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>رفع ملف الفيديو</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFormData({ ...formData, videoFile: e.target.files?.[0] || null })}
                className={styles.fileInput}
                required
              />
            </div>
            <button
              type="submit"
              className={`${styles.submitButton} ${styles.subpartButton}`}
            >
              <Plus size={16} />
              إضافة جزء فرعي
            </button>
          </form>
        );

      case 'delete-video':
        return (
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.confirmText}>هل أنت متأكد من حذف الفيديو؟</p>
            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={`${styles.submitButton} ${styles.deleteButton}`}
              >
                <Trash2 size={16} />
                تأكيد الحذف
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`${styles.submitButton} ${styles.cancelButton}`}
              >
                إلغاء
              </button>
            </div>
          </form>
        );

      case 'delete-lab-guide':
        return (
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.confirmText}>هل أنت متأكد من حذف دليل المختبر؟</p>
            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={`${styles.submitButton} ${styles.deleteButton}`}
              >
                <Trash2 size={16} />
                تأكيد الحذف
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`${styles.submitButton} ${styles.cancelButton}`}
              >
                إلغاء
              </button>
            </div>
          </form>
        );

      default:
        return <div className={styles.errorText}>إجراء غير مدعوم</div>;
    }
  };

  const getModalTitle = () => {
    switch (action?.type) {
      case 'add-certification': return 'إضافة شهادة جديدة';
      case 'add-video': return 'إضافة فيديو';
      case 'add-lab-guide': return 'إضافة دليل مختبر';
      case 'add-quiz': return 'إضافة اختبار';
      case 'edit-quiz': return 'تعديل الاختبار';
      case 'add-lesson': return 'إضافة درس جديد';
      case 'add-subpart': return 'إضافة جزء فرعي جديد';
      case 'delete-certification': return 'تأكيد حذف الشهادة';
      case 'delete-video': return 'تأكيد حذف الفيديو';
      case 'delete-lab-guide': return 'تأكيد حذف دليل المختبر';
      default: return 'إجراء إداري';
    }
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={getModalTitle()}>
      {getModalContent()}
    </AdminModal>
  );
}