import styles from '@/styles/Profile.module.css'
import { useRouter } from 'next/router'

export default function Profile() {
   const router = useRouter()



  return (
    <div className={`${styles.view} ${styles.active}`}>
      <div className={styles.container}>
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            <i className="fas fa-user"></i>
          </div>
          <div className={styles.profileInfo}>
            <h1>الملف الشخصي</h1>
            <p>تتبع تقدمك في التعلم وإنجازاتك</p>
          </div>
        </div>
        <div className={styles.profileStats}>
          <div className={styles.achievementCards}>
            <div className={styles.achievementCard}>
              <i className="fas fa-medal"></i>
              <h3>متعلم سريع</h3>
              <p>أكمل أول دورة</p>
            </div>
            <div className={styles.achievementCard}>
              <i className="fas fa-brain"></i>
              <h3>خبير الاختبارات</h3>
              <p>حصل على 90%+ في الاختبار</p>
            </div>
            <div className={`${styles.achievementCard} ${styles.locked}`}>
              <i className="fas fa-lock"></i>
              <h3>بطل الدورات</h3>
              <p>أكمل 5 دورات</p>
            </div>
          </div>

          <div className={styles.certificatesSection}>
            <h2>شهاداتي</h2>
            <div className={styles.certificatesGrid}>
              {/* Certificates will be loaded dynamically */}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}