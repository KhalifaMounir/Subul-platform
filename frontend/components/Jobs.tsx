import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/Course.module.css';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';

dayjs.locale('ar');

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/recommend_jobs', {
          withCredentials: true
        });
        setJobs(res.data);
      } catch (error) {
        console.error('Error fetching recommended jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(
    job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${styles.view} ${styles.active}`}>
      <div className={styles.courseContainer}>
        <div className={styles.courseSidebar}>
          <h3>فرص العمل</h3>
          <input
            type="text"
            placeholder="ابحث عن وظيفة..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginTop: '1rem', padding: '0.5rem', borderRadius: '8px' }}
          />
        </div>

        <div className={styles.courseContent}>
          <h2 style={{ marginBottom: '1rem' }}>الوظائف المتاحة لك</h2>

          {loading ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 1rem',
                textAlign: 'center',
                color: '#444',
              }}
            >
              <i
                className="fas fa-search"
                style={{
                  fontSize: '3rem',
                  color: '#0070f3',
                  animation: 'spin 1.5s linear infinite',
                  marginBottom: '1rem',
                }}
              ></i>
              <p style={{ fontSize: '1.2rem', maxWidth: '500px', lineHeight: '1.8' }}>
                نحن نستخدم الذكاء الاصطناعي للبحث عن أفضل فرص العمل التي تناسب مهاراتك، ويتم ترتيبها من الأكثر ملائمة إلى الأقل.
              </p>

              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    style={{
                      background: '#fff',
                      borderRadius: '16px',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                      padding: '2rem 1.5rem',
                      minWidth: '270px',
                      maxWidth: '340px',
                      flex: '1 1 300px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      border: '1px solid #e0e0e0',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <i
                        className="fas fa-briefcase"
                        style={{ color: '#0070f3', fontSize: '1.5rem', marginLeft: 8 }}
                      ></i>
                      <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{job.title}</h4>
                    </div>
                    <p style={{ color: '#444', marginBottom: '0.5rem', fontSize: '1rem' }}>{job.description}</p>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        color: '#666',
                        fontSize: '0.95rem',
                      }}
                    >
                      <li>
                        <i className="fas fa-building" style={{ marginLeft: 6 }}></i> الشركة: {job.company}
                      </li>
                      <li>
                        <i className="fas fa-map-marker-alt" style={{ marginLeft: 6 }}></i> الموقع: {job.location}
                      </li>
                      <li>
                        <i className="fas fa-calendar-alt" style={{ marginLeft: 6 }}></i>
                        تاريخ النشر: {dayjs(job.date_posted).format('D MMMM YYYY')}
                      </li>
                    </ul>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginTop: '1.5rem',
                        background: '#0070f3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 1.5rem',
                        fontWeight: 600,
                        fontSize: '1rem',
                        textDecoration: 'none',
                        textAlign: 'center',
                        display: 'inline-block',
                      }}
                    >
                      <i className="fas fa-paper-plane" style={{ marginLeft: 8 }}></i>
                      قدم الآن
                    </a>
                  </div>
                ))
              ) : (
                <p>لا توجد وظائف مطابقة حالياً.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
