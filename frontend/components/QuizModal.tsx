import { ViewType } from '@/utils/types'
import { quizActions } from '@/utils/actions'
import styles from '@/styles/Modal.module.css'

interface QuizModalProps {
  showView: (viewName: ViewType) => void
}

export default function QuizModal({ showView }: QuizModalProps) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.quizHeader}>
          <h2>اختبار الدرس</h2>
          <button className={styles.closeBtn} onClick={() => showView('dashboard')}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className={styles.quizBody}>
          <div className={styles.quizProgress}>
            <div className={styles.quizProgressBar}>
              <div className={styles.quizProgressFill}></div>
            </div>
            <span>السؤال 1 من 3</span>
          </div>
          <div className={styles.questionContainer}>
            <h3>السؤال سيظهر هنا</h3>
            <div className={styles.optionsContainer}>
              {/* Quiz options here */}
            </div>
          </div>
          <div className={styles.quizActions}>
            <button
              className={styles.btnSecondary}
              onClick={quizActions.prevQuestion}
              disabled
            >
              السابق
            </button>
            <button
              className={styles.btnPrimary}
              onClick={quizActions.nextQuestion}
            >
              السؤال التالي
            </button>
            <button
              className={styles.btnPrimary}
              onClick={() => {
                quizActions.submitQuiz()
                showView('results')
              }}
              style={{ display: 'none' }}
            >
              إرسال الاختبار
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}