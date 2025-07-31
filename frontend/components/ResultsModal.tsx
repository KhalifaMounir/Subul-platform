import styles from '@/styles/Modal.module.css';

interface ResultsModalProps {
  onClose: () => void;
  onRetake: () => void;
  onGetCertificate: (courseId: any) => void;
  score: number;
  courseId: string | string[];
  showView: (view: ViewType | string) => void;
}
type ViewType = 'dashboard' | 'quiz' | 'results';

export default function ResultsModal({ onClose, onRetake, onGetCertificate, score, courseId, showView }: ResultsModalProps) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.resultsHeader}>
          <h2>نتائج الاختبار</h2>
        </div>
        <div className={styles.resultsBody}>
          <div className={styles.scoreDisplay}>
            <div className={styles.scoreCircle}>
              <span>{score}%</span>
            </div>
            <h3>{score >= 70 ? 'عمل رائع! لقد نجحت' : 'للأسف، لم تنجح'}</h3>
            <p>
              {score >= 70
                ? 'لقد أكملت الاختبار بنجاح'
                : 'تحتاج إلى 70% على الأقل للنجاح. حاول مرة أخرى'}
            </p>
          </div>
          <div className={styles.resultsActions}>
            <button className={styles.btnPrimary} onClick={() => showView('dashboard')}>
              متابعة التعلم
            </button>
            <button className={styles.btnSecondary} onClick={onRetake}>
              إعادة الاختبار
            </button>
            {score >= 70 && (
              <button
                className={styles.btnSuccess}
                onClick={() => onGetCertificate(courseId)}
              >
                <i className="fas fa-certificate"></i> احصل على الشهادة
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}