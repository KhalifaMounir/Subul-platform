import styles from '@/styles/StatsGrid.module.css'

export default function StatsGrid() {
  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <i className="fas fa-graduation-cap"></i>
        <div>
          <h3>0</h3>
          <p>الدورات المكتملة</p>
        </div>
      </div>
      <div className={styles.statCard}>
        <i className="fas fa-clock"></i>
        <div>
          <h3>0</h3>
          <p>ساعات التعلم</p>
        </div>
      </div>
      <div className={styles.statCard}>
        <i className="fas fa-trophy"></i>
        <div>
          <h3>0%</h3>
          <p>متوسط درجات الاختبارات</p>
        </div>
      </div>
      <div className={styles.statCard}>
        <i className="fas fa-certificate"></i>
        <div>
          <h3>0</h3>
          <p>الشهادات المحصلة</p>
        </div>
      </div>
    </div>
  )
}