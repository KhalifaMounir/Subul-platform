import Link from 'next/link'
import styles from '@/styles/CoursesSection.module.css'

export default function CoursesSection() {
  return (
    <div className={styles.coursesSection}>
      <h2>الدورات المتاحة</h2>
      <div className={styles.coursesGrid}>
        <Link href="/course" className={styles.courseCard}>
          <div className={styles.courseImage}>
            <i className="fas fa-cloud"></i>
          </div>
          <div className={styles.courseContent}>
            <h3>أساسيات Microsoft Azure (AZ-900)</h3>
            <p>تعلم مفاهيم Azure الأساسية والخدمات السحابية</p>
            <div className={styles.courseInfo}>
              <span><i className="fas fa-clock"></i> 6 ساعات</span>
              <span><i className="fas fa-user"></i> مبتدئ</span>
            </div>
          </div>
        </Link>
        <Link href="/course" className={styles.courseCard}>
          <div className={styles.courseImage}>
            <i className="fas fa-server"></i>
          </div>
          <div className={styles.courseContent}>
            <h3>Azure Administrator (AZ-104)</h3>
            <p>إدارة خدمات Azure والبنية التحتية بكفاءة</p>
            <div className={styles.courseInfo}>
              <span><i className="fas fa-clock"></i> 8 ساعات</span>
              <span><i className="fas fa-user"></i> متوسط</span>
            </div>
          </div>
        </Link>
        <Link href="/course" className={styles.courseCard}>
          <div className={styles.courseImage}>
            <i className="fas fa-cogs"></i>
          </div>
          <div className={styles.courseContent}>
            <h3>Azure Solutions Architect (AZ-305)</h3>
            <p>تصميم حلول سحابية متقدمة على Azure</p>
            <div className={styles.courseInfo}>
              <span><i className="fas fa-clock"></i> 10 ساعات</span>
              <span><i className="fas fa-user"></i> متقدم</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}