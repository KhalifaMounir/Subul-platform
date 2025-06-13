import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faClock, faTrophy, faCertificate } from '@fortawesome/free-solid-svg-icons';
import { getUserData } from '../utils/auth';

export default function Profile() {
  const [userData, setUserData] = useState({
    completedCourses: [],
    totalHours: 0,
    quizScores: {},
    certificates: [],
  });

  useEffect(() => {
    console.log('Loading user profile data at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    setUserData(getUserData());
  }, []);

  const completedCoursesCount = userData.completedCourses.length;
  const totalHours = userData.totalHours;
  const averageScore = Object.values(userData.quizScores).flat().length
    ? Math.round(
        Object.values(userData.quizScores)
          .flat()
          .reduce((a, b) => a + b, 0) /
          Object.values(userData.quizScores).flat().length
      )
    : 0;
  const certificatesCount = userData.certificates.length;

  return (
    <main style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--gray-900)', marginBottom: '2rem' }}>
          الملف الشخصي
        </h1>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div
            style={{
              background: 'var(--white)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: 'var(--shadow)',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '1rem' }}>
              إحصائيات التعلم
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}
                />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--gray-900)' }}>
                  {completedCoursesCount}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>دورات مكتملة</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <FontAwesomeIcon
                  icon={faClock}
                  style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}
                />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--gray-900)' }}>
                  {totalHours}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>ساعات تعلم</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <FontAwesomeIcon
                  icon={faTrophy}
                  style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '0.5rem' }}
                />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--gray-900)' }}>
                  {averageScore}%
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>متوسط الدرجات</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <FontAwesomeIcon
                  icon={faCertificate}
                  style={{ fontSize: '2rem', color: 'var(--warning)', marginBottom: '0.5rem' }}
                />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--gray-900)' }}>
                  {certificatesCount}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>شهادات</p>
              </div>
            </div>
          </div>
          <div
            style={{
              background: 'var(--white)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: 'var(--shadow)',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '1rem' }}>
              الشهادات المكتسبة
            </h2>
            {userData.certificates.length === 0 ? (
              <p style={{ fontSize: '1rem', color: 'var(--gray-600)' }}>لم تكتمل أي دورات بعد للحصول على شهادات.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {userData.certificates.map((cert) => (
                  <li
                    key={cert.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem',
                      borderBottom: '1px solid var(--gray-200)',
                    }}
                  >
                    <FontAwesomeIcon icon={faCertificate} style={{ color: 'var(--warning)' }} />
                    <div>
                      <p style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--gray-900)' }}>
                        {cert.courseName}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                        تاريخ الإتمام: {cert.completionDate} | الدرجة: {cert.score}%
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}