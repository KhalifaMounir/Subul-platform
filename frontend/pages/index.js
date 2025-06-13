import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faClock, faTrophy, faCertificate, faSearch } from '@fortawesome/free-solid-svg-icons';
import CourseCard from '../components/CourseCard';
import { courses } from '../utils/data';
import { getUserData } from '../utils/auth';

export default function Home() {
  const [userData, setUserData] = useState({ completedCourses: [], totalHours: 0, quizScores: {}, certificates: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');

  useEffect(() => {
    console.log('Loading user progress at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    setUserData(getUserData());
  }, []);

  // Calculate stats
  const completedCoursesCount = userData.completedCourses?.length || 0;
  const totalHours = userData.totalHours || 0;
  const averageScore = Object.values(userData.quizScores).flat().length
    ? Math.round(
        Object.values(userData.quizScores)
          .flat()
          .reduce((a, b) => a + b, 0) /
          Object.values(userData.quizScores).flat().length
      )
    : 0;
  const certificatesCount = userData.certificates?.length || 0;

  // Filter courses (basic implementation; can be expanded)
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? course.category === categoryFilter : true;
    const matchesLevel = levelFilter ? course.level === levelFilter : true;
    const matchesDuration = durationFilter ? course.durationFilter === durationFilter : true;
    return matchesSearch && matchesCategory && matchesLevel && matchesDuration;
  });

  return (
    <main style={{ padding: '2rem 0' }}>
      <div className="container">
        <div className="welcome-section" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--gray-900)' }}>
            أهلاً بك مرة أخرى!
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--gray-600)' }}>
            تابع رحلة التعلم مع دوراتنا التفاعلية
          </p>
        </div>

        <div
          className="stats-section"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          <div
            className="stat-card"
            style={{
              background: 'var(--white)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: 'var(--shadow)',
              textAlign: 'center',
            }}
          >
            <FontAwesomeIcon
              icon={faGraduationCap}
              style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}
            />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--gray-900)' }}>
              {completedCoursesCount}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>دورات مكتملة</p>
          </div>
          <div
            className="stat-card"
            style={{
              background: 'var(--white)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: 'var(--shadow)',
              textAlign: 'center',
            }}
          >
            <FontAwesomeIcon
              icon={faClock}
              style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}
            />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--gray-900)' }}>
              {totalHours}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>ساعات تعلم</p>
          </div>
          <div
            className="stat-card"
            style={{
              background: 'var(--white)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: 'var(--shadow)',
              textAlign: 'center',
            }}
          >
            <FontAwesomeIcon
              icon={faTrophy}
              style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '0.5rem' }}
            />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--gray-900)' }}>
              {averageScore}%
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>متوسط الدرجات</p>
          </div>
          <div
            className="stat-card"
            style={{
              background: 'var(--white)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: 'var(--shadow)',
              textAlign: 'center',
            }}
          >
            <FontAwesomeIcon
              icon={faCertificate}
              style={{ fontSize: '2rem', color: 'var(--warning)', marginBottom: '0.5rem' }}
            />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--gray-900)' }}>
              {certificatesCount}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>شهادات حصلت عليها</p>
          </div>
        </div>

        <div className="search-filter-section" style={{ marginBottom: '2rem' }}>
          <div
            className="search-container"
            style={{
              position: 'relative',
              maxWidth: '400px',
              marginBottom: '1rem',
            }}
          >
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--gray-400)',
              }}
            />
            <input
              type="text"
              id="search-input"
              placeholder="ابحث عن الدورات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 2.5rem 0.75rem 1rem',
                border: '2px solid var(--gray-200)',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                background: 'var(--white)',
              }}
            />
          </div>
          <div
            className="filter-container"
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '2px solid var(--gray-200)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                background: 'var(--white)',
                minWidth: '150px',
              }}
            >
              <option value="">جميع الفئات</option>
              <option value="programming">البرمجة</option>
              <option value="design">التصميم</option>
              <option value="business">الأعمال</option>
              <option value="language">اللغات</option>
            </select>
            <select
              id="level-filter"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '2px solid var(--gray-200)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                background: 'var(--white)',
                minWidth: '150px',
              }}
            >
              <option value="">جميع المستويات</option>
              <option value="beginner">مبتدئ</option>
              <option value="intermediate">متوسط</option>
              <option value="advanced">متقدم</option>
            </select>
            <select
              id="duration-filter"
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '2px solid var(--gray-200)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                background: 'var(--white)',
                minWidth: '150px',
              }}
            >
              <option value="">جميع المدد</option>
              <option value="short">أقل من 3 ساعات</option>
              <option value="medium">3-6 ساعات</option>
              <option value="long">أكثر من 6 ساعات</option>
            </select>
          </div>
        </div>

        <div
          className="courses-section"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </main>
  );
}