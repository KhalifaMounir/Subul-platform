import styles from '@/styles/StatsGrid.module.css'
import { useTranslation } from 'next-i18next';

export default function StatsGrid() {
  const { t } = useTranslation('common');

  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <i className="fas fa-graduation-cap"></i>
        <div>
          <h3>0</h3>
          <p>{t('completed_courses', 'الدورات المكتملة')}</p>
        </div>
      </div>
      <div className={styles.statCard}>
        <i className="fas fa-clock"></i>
        <div>
          <h3>0</h3>
          <p>{t('learning_hours', 'ساعات التعلم')}</p>
        </div>
      </div>
      <div className={styles.statCard}>
        <i className="fas fa-trophy"></i>
        <div>
          <h3>0%</h3>
          <p>{t('average_quiz_score', 'متوسط درجات الاختبارات')}</p>
        </div>
      </div>
      <div className={styles.statCard}>
        <i className="fas fa-certificate"></i>
        <div>
          <h3>0</h3>
          <p>{t('earned_certificates', 'الشهادات المحصلة')}</p>
        </div>
      </div>
    </div>
  )
}