import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Modal.module.css';

export default function QuizResultsModal({
  isOpen,
  onClose,
  onRetake,
  onGetCertificate,
  score,
  courseId,
}) {
  if (!isOpen) return null;

  const isPassing = score >= 70;
  const scoreMessage = isPassing ? 'ممتاز! لقد نجحت!' : 'حاول مرة أخرى!';
  const passStatus = isPassing ? 'لقد حصلت على درجة النجاح' : 'تحتاج إلى 70% للنجاح';

  return (
    <div className={`${styles.modal} ${isOpen ? styles.active : ''}`}>
      <div className={styles.modalContent}>
        <div className={styles.quizHeader}>
          <h2>نتائج الاختبار</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faCertificate} />
          </button>
        </div>
        <div className={styles.resultsBody}>
          <div className={styles.scoreDisplay}>
            <div className={styles.scoreCircle}>{score}%</div>
            <h3 className={styles.scoreMessage}>{scoreMessage}</h3>
            <p className={styles.passStatus}>{passStatus}</p>
          </div>
          <div className={styles.resultsActions}>
            <button className={styles.btnPrimary} onClick={onClose}>
              متابعة التعلم
            </button>
            <button className={styles.btnSecondary} onClick={onRetake}>
              إعادة الاختبار
            </button>
            {isPassing && (
              <button
                className={styles.btnSuccess}
                onClick={() => onGetCertificate(courseId)}
              >
                <FontAwesomeIcon icon={faCertificate} />
                احصل على الشهادة
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}