import styles from '@/styles/Profile.module.css'
import { useTranslation } from 'next-i18next';

export default function Profile() {
   const { t } = useTranslation('common');

  return (
    <div className={`${styles.view} ${styles.active}`}>
      <div className={styles.container}>
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            <i className="fas fa-user"></i>
          </div>
          <div className={styles.profileInfo}>
            <h1>{t('dashboard_title')}</h1>
            <p>{t('dashboard_subtitle')}</p>
          </div>
        </div>
        <div className={styles.profileStats}>
          <div className={styles.achievementCards}>
            <div className={styles.achievementCard}>
              <i className="fas fa-medal"></i>
              <h3>{t('fast_learner')}</h3>
              <p>{t('fast_learner_desc')}</p>
            </div>
            <div className={styles.achievementCard}>
              <i className="fas fa-brain"></i>
              <h3>{t('quiz_expert')}</h3>
              <p>{t('quiz_expert_desc')}</p>
            </div>
            <div className={`${styles.achievementCard} ${styles.locked}`}>
              <i className="fas fa-lock"></i>
              <h3>{t('course_champion')}</h3>
              <p>{t('course_champion_desc')}</p>
            </div>
          </div>

          <div className={styles.certificatesSection}>
            <h2>{t('my_certificates')}</h2>
            <div className={styles.certificatesGrid}>
              {/* Certificates will be loaded dynamically */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}