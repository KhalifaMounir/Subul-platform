import Link from 'next/link'
import { quizActions } from '@/utils/actions'
import styles from '@/styles/Course.module.css'

export default function Course() {
  return (
    <div className={`${styles.view} ${styles.active}`}>
      <div className={styles.courseContainer}>
        <div className={styles.courseSidebar}>
          <Link href="/dashboard" className={styles.backBtn}>
            <i className="fas fa-arrow-right"></i>
            العودة للدورات
          </Link>

          <div className={styles.courseInfo}>
            <h3>عنوان الدورة</h3>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
            <span>0% مكتمل</span>
          </div>

          <div className={styles.lessonsList}>
            {/* Lessons loaded dynamically */}
          </div>
        </div>

        <div className={styles.courseContent}>
          <div className={styles.videoPlayer}>
            <div className={styles.videoPlaceholder}>
              <i className="fas fa-play"></i>
              <p>اختر درساً لبدء التعلم</p>
            </div>
          </div>

          <div className={styles.lessonContent}>
            <h2>مرحباً بك في الدورة</h2>
            <p>اختر درساً من الشريط الجانبي لبدء رحلة التعلم.</p>

            <div className={styles.lessonActions}>
              <button
                className={styles.btnPrimary}
                onClick={() => {
                  quizActions.startQuiz()
                  // Navigate to /quiz if quiz is implemented
                }}
                style={{ display: 'none' }}
              >
                <i className="fas fa-question-circle"></i>
                خذ الاختبار
              </button>

              <button
                className={styles.btnSecondary}
                onClick={quizActions.nextLesson}
                style={{ display: 'none' }}
              >
                الدرس التالي
                <i className="fas fa-arrow-left"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
