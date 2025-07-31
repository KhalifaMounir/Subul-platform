import SearchFilter from './SearchFilter';
import StatsGrid from './StatsGrid';
import CoursesSection from './CoursesSection';
import styles from '@/styles/Dashboard.module.css';
import { useTranslation } from 'next-i18next';

export default function Dashboard() {
  const { t } = useTranslation('common');

  return (
    <div className={`${styles.view} ${styles.active}`}>
      <div className={styles.container}>
        <div className={styles.welcomeSection}>
          <h1>{t('welcome_back')}</h1>
          <p>{t('continue_learning')}</p>
        </div>
        <SearchFilter />
        <StatsGrid />
        <CoursesSection />
      </div>
    </div>
  );
}
