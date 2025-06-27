import { useState, useCallback } from 'react';
import styles from '@/styles/App.module.css';
import AddLabGuide from '@/components/admin/AddLabGuide';
import AddVideo from '@/components/admin/AddVideo';
import EditQuiz from '@/components/admin/EditQuiz';
import DeleteConfirmation from '@/components/admin/DeleteConfirmation';
import ViewLabGuide from '@/components/admin/ViewLabGuide';

type ModalType = 'add-lab-guide' | 'add-video' | 'edit-quiz' | 'view-lab-guide' | 'delete-confirmation' | null;

interface LabGuideResponse {
  id: number;
  cert_id: number;
  pdf_url: string;
}

interface QuizData {
  question: string;
  options: string[];
  answer: string;
}

const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [error, setError] = useState<string | null>(null);

  // Sample certification ID for demo
  const sampleCertId = 1;
  const sampleQuizId = 1;

  const handleSuccess = useCallback((data: any) => {
    console.log('Success:', data);
    setError(null);
    setActiveModal(null);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    console.log('Delete confirmed');
    setActiveModal(null);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Admin Interface Components</h1>

        <div className={styles.grid}>
          <button
            onClick={() => setActiveModal('add-lab-guide')}
            className={styles.card}
            aria-label="Add a new lab guide"
          >
            <div className={`${styles.icon} ${styles.iconBlue}`}>📚</div>
            <h3 className={styles.cardTitle}>Add Lab Guide</h3>
            <p className={styles.cardDescription}>Upload PDF lab guides</p>
          </button>

          <button
            onClick={() => setActiveModal('add-video')}
            className={styles.card}
            aria-label="Add a new video"
          >
            <div className={`${styles.icon} ${styles.iconPurple}`}>🎥</div>
            <h3 className={styles.cardTitle}>Add Video</h3>
            <p className={styles.cardDescription}>Upload instructional videos</p>
          </button>

          <button
            onClick={() => setActiveModal('edit-quiz')}
            className={styles.card}
            aria-label="Edit quiz questions"
          >
            <div className={`${styles.icon} ${styles.iconYellow}`}>❓</div>
            <h3 className={styles.cardTitle}>Edit Quiz</h3>
            <p className={styles.cardDescription}>Modify quiz questions</p>
          </button>

          <button
            onClick={() => setActiveModal('view-lab-guide')}
            className={styles.card}
            aria-label="View lab guides"
          >
            <div className={`${styles.icon} ${styles.iconGreen}`}>👁️</div>
            <h3 className={styles.cardTitle}>View Lab Guide</h3>
            <p className={styles.cardDescription}>Preview lab guides</p>
          </button>

          <button
            onClick={() => setActiveModal('delete-confirmation')}
            className={styles.card}
            aria-label="Confirm delete operations"
          >
            <div className={`${styles.icon} ${styles.iconRed}`}>🗑️</div>
            <h3 className={styles.cardTitle}>Delete Confirmation</h3>
            <p className={styles.cardDescription}>Confirm delete operations</p>
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}
      </div>

      {activeModal === 'add-lab-guide' && (
        <AddLabGuide
          certId={sampleCertId}
          onClose={() => setActiveModal(null)}
          onUpload={(file: File) => console.log('Upload file:', file)} // Placeholder, replace with actual API call
          error={error}
          isSubmitting={false}
        />
      )}

      {activeModal === 'add-video' && (
        <AddVideo
          certId={sampleCertId}
          onClose={() => setActiveModal(null)}
          onSuccess={handleSuccess}
          error={error}
        />
      )}

      {activeModal === 'edit-quiz' && (
        <EditQuiz
          certId={sampleCertId}
          quizId={sampleQuizId}
          initialData={{
            question: 'ما هو البروتوكول المستخدم لنقل الملفات؟',
            options: ['HTTP', 'FTP', 'SMTP', 'DNS'],
            answer: 'FTP',
          }}
          onClose={() => setActiveModal(null)}
          onSuccess={handleSuccess}
          error={error}
        />
      )}

      {activeModal === 'view-lab-guide' && (
        <ViewLabGuide
          certId={sampleCertId}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'delete-confirmation' && (
        <DeleteConfirmation
          title="حذف الشهادة"
          message="هل أنت متأكد من أنك تريد حذف هذه الشهادة؟ سيتم حذف جميع المحتويات المرتبطة بها."
          itemName="شهادة الشبكات المتقدمة"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setActiveModal(null)}
          type="certification"
        />
      )}
    </div>
  );
};

export default App;