import Link from 'next/link'
import styles from '@/styles/CoursesSection.module.css'

export default function CoursesSection() {
  return (
    <div className={styles.coursesSection}>
      <h2>الدورات المتاحة</h2>
      <div className={styles.coursesGrid}>
        {/* Course cards will be loaded dynamically */}
        <Link href="/course" className={styles.courseCard}>
          <div className={styles.courseImage}>
            <i className="fas fa-code"></i>
          </div>
          <div className={styles.courseContent}>
            <h3>مقدمة في البرمجة</h3>
            <p>تعلم أساسيات البرمجة من البداية</p>
            <div className={styles.courseInfo}>
              <span><i className="fas fa-clock"></i> 4 ساعات</span>
              <span><i className="fas fa-user"></i> مبتدئ</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}