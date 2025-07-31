import styles from '@/styles/SearchFilter.module.css'
import { useTranslation } from 'next-i18next';

export default function SearchFilter() {
  const { t } = useTranslation('common');

  return (
    <div className={styles.searchFilterSection}>
      <div className={styles.searchContainer}>
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder={t('search_courses', 'ابحث عن الدورات...')}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.filterContainer}>
        <select className={styles.filterSelect}>
          <option value="">{t('all_categories', 'جميع الفئات')}</option>
          <option value="programming">{t('programming', 'البرمجة')}</option>
          <option value="design">{t('design', 'التصميم')}</option>
          <option value="business">{t('business', 'الأعمال')}</option>
          <option value="language">{t('languages', 'اللغات')}</option>
        </select>
        <select className={styles.filterSelect}>
          <option value="">{t('all_levels', 'جميع المستويات')}</option>
          <option value="beginner">{t('beginner', 'مبتدئ')}</option>
          <option value="intermediate">{t('intermediate', 'متوسط')}</option>
          <option value="advanced">{t('advanced', 'متقدم')}</option>
        </select>
        <select className={styles.filterSelect}>
          <option value="">{t('all_durations', 'جميع المدد')}</option>
          <option value="short">{t('short_duration', 'أقل من 3 ساعات')}</option>
          <option value="medium">{t('medium_duration', '3-6 ساعات')}</option>
          <option value="long">{t('long_duration', 'أكثر من 6 ساعات')}</option>
        </select>
      </div>
    </div>
  )
}