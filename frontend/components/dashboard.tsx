import SearchFilter from './SearchFilter';
import StatsGrid from './StatsGrid';
import CoursesSection from './CoursesSection';
import styles from '@/styles/Dashboard.module.css';

interface DashboardProps {
  currentPage?: string; // made optional in case not always passed
}

export default function Dashboard({ currentPage }: DashboardProps) {
  return (
    <div className={`${styles.view} ${styles.active}`}>
      <div className={styles.container}>
        <div className={styles.welcomeSection}>
          <h1>أهلاً بك مرة أخرى!</h1>
          <p>تابع رحلة التعلم مع دوراتنا التفاعلية</p>
        </div>

        {/* Optional: use currentPage if needed */}
        {/* <p>Current page: {currentPage}</p> */}

        <SearchFilter />
        <StatsGrid />
        <CoursesSection />
      </div>
    </div>
  );
}
