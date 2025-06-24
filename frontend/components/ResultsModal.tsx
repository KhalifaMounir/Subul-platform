import { ViewType } from '@/utils/types'
import { quizActions } from '@/utils/actions'
import styles from '@/styles/Modal.module.css'

interface ResultsModalProps {
  onClose: () => void;
  onRetake: () => void;
  onGetCertificate: (courseId: any) => void;
  score: number;
  courseId: string | string[];
  showView: (view: ViewType | string) => void;
}
// ...other import
// ...rest of ResultsModal component
export default function ResultsModal({ showView }: ResultsModalProps) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.resultsHeader}>
          <h2>نتائج الاختبار</h2>
        </div>
        <div className={styles.resultsBody}>
          <div className={styles.scoreDisplay}>
            <div className={styles.scoreCircle}>
              <span>0%</span>
            </div>
            <h3>عمل رائع!</h3>
            <p></p>
          </div>
          <div className={styles.resultsActions}>
            <button className={styles.btnPrimary} onClick={() => showView('dashboard')}>
              متابعة التعلم
            </button>
            <button className={styles.btnSecondary} onClick={quizActions.retakeQuiz}>
              إعادة الاختبار
            </button>
            <button
              className={styles.btnSuccess}
              onClick={() => {
                quizActions.getCertificate()
                showView('certificate')
              }}
              style={{ display: 'none' }}
            >
              <i className="fas fa-certificate"></i>
              احصل على الشهادة
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}