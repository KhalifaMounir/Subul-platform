import styles from '@/styles/SearchFilter.module.css'

export default function SearchFilter() {
  return (
    <div className={styles.searchFilterSection}>
      <div className={styles.searchContainer}>
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="ابحث عن الدورات..."
          className={styles.searchInput}
        />
      </div>
      <div className={styles.filterContainer}>
        <select className={styles.filterSelect}>
          <option value="">جميع الفئات</option>
          <option value="programming">البرمجة</option>
          <option value="design">التصميم</option>
          <option value="business">الأعمال</option>
          <option value="language">اللغات</option>
        </select>
        <select className={styles.filterSelect}>
          <option value="">جميع المستويات</option>
          <option value="beginner">مبتدئ</option>
          <option value="intermediate">متوسط</option>
          <option value="advanced">متقدم</option>
        </select>
        <select className={styles.filterSelect}>
          <option value="">جميع المدد</option>
          <option value="short">أقل من 3 ساعات</option>
          <option value="medium">3-6 ساعات</option>
          <option value="long">أكثر من 6 ساعات</option>
        </select>
      </div>
    </div>
  )
}