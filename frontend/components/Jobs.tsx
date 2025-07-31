import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/Course.module.css';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import { useTranslation } from 'next-i18next';

dayjs.locale('ar');

const translateText = async (text) => {
  try {
    const res = await axios.post('http://localhost:5000/translate', {
      text,
      source: 'en',
      target: 'ar'
    });
    return res.data.translated || text;
  } catch (error) {
    return text; // fallback si erreur
  }
};

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [translatedJobs, setTranslatedJobs] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation('common');

  const jobsPerPage = 8;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/recommend_jobs', {
          withCredentials: true
        });

        if (res.data.jobs) {
          setJobs(res.data.jobs.slice(0, 300));
        }

        if (res.data.message) {
          setMessage(res.data.message);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const translateAllJobs = async () => {
      if (jobs.length === 0) return;

      setTranslating(true);
      const translated = await Promise.all(
        jobs.map(async (job) => {
          const translatedTitle = await translateText(job.title);
          const translatedLocation = await translateText(job.location);
          return {
            ...job,
            title: translatedTitle,
            location: translatedLocation
          };
        })
      );
      setTranslatedJobs(translated);
      setTranslating(false);
    };

    translateAllJobs();
  }, [jobs]);

  const filteredJobs = translatedJobs.filter(
    job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const goToPage = (page) => setCurrentPage(page);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className={`${styles.view} ${styles.active}`}>
      <div className={styles.courseContainer}>
        <div className={styles.courseSidebar} style={{ padding: '1rem', textAlign: 'center' }}>
          <h3>{t('job_opportunities')}</h3>
          <p>{t('discover_jobs')}</p>
          <p>{t('bringing_best_jobs')}</p>
        </div>

        <div className={styles.courseContent}>
          <h2 style={{ marginBottom: '1rem' }}>{t('available_jobs')}</h2>

          {loading || translating ? (
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
                {t('ai_job_message')}
              </p>
              <p style={{ fontSize: '1.2rem', maxWidth: '500px', lineHeight: '1.8' }}>
                {t('please_wait')}
              </p>

              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            <>
              {currentJobs.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1.5rem',
                    maxWidth: '720px',
                  }}
                >
                  {currentJobs.map((job) => (
                    <div
                      key={job.id}
                      style={{
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        padding: '2rem 1.5rem',
                        minWidth: '270px',
                        maxWidth: '340px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        border: '1px solid #e0e0e0',
                        position: 'relative',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <i className="fas fa-briefcase" style={{ color: '#0070f3', fontSize: '1.5rem', marginLeft: 8 }}></i>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{job.title}</h4>
                      </div>
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
                          <i className="fas fa-building" style={{ marginLeft: 6 }}></i> {t('company')}: {job.company}
                        </li>
                        <li>
                          <i className="fas fa-map-marker-alt" style={{ marginLeft: 6 }}></i> {t('location')}: {job.location}
                        </li>
                        <li>
                          <i className="fas fa-calendar-alt" style={{ marginLeft: 6 }}></i>
                          {t('date_posted')}: {dayjs(job.date_posted).format('D MMMM YYYY')}
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
                        {t('apply_now')}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '1.2rem', color: '#666', marginTop: '2rem' }}>
                  {message || t('no_matching_jobs')}
                </p>
              )}

              {filteredJobs.length > jobsPerPage && (
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                  <button onClick={prevPage} disabled={currentPage === 1} style={{ marginRight: '1rem' }}>
                    {t('previous')}
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => goToPage(i + 1)}
                      disabled={currentPage === i + 1}
                      style={{
                        margin: '0 0.25rem',
                        fontWeight: currentPage === i + 1 ? 'bold' : 'normal',
                        textDecoration: currentPage === i + 1 ? 'underline' : 'none',
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button onClick={nextPage} disabled={currentPage === totalPages} style={{ marginLeft: '1rem' }}>
                    {t('next')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
