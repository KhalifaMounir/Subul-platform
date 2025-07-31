"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import styles from '@/styles/CoursesSection.module.css';

interface Course {
  id: number;
  name: string;
  description: string;
  duration: string;
  level: string;
  icon: string;
  progress: number;
  href: string;
}

export default function CoursesSection() {
  const router = useRouter();
  const pathname = usePathname();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation('common');

  const fetchMyCertifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/my-certifications', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/');
          return;
        }
        throw new Error(t('courses_error'));
      }
      const data = await response.json();
      console.log('Raw API response:', data);
      
      const mappedCourses = data.certifications.map((cert: { user_id: number; certification_id: number }) => {
        console.log('Processing cert:', cert);
        return {
          id: cert.certification_id, // Use certification_id instead of id
          name: `Certification ${cert.certification_id}`, // Temporary name, we'll need to fetch details
          description: 'تعلم مفاهيم Azure الأساسية والخدمات السحابية',
          duration: '6 ساعات',
          level: 'مبتدئ',
          icon: 'fa-cloud',
          progress: 0,
          href: '/course',
        };
      });
      
      console.log('Mapped courses:', mappedCourses);
      setCourses(mappedCourses);
      setError(null);
    } catch (err) {
      setError(t('courses_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProgress = () => {
    if (typeof window !== 'undefined') {
      const az900Progress = parseInt(localStorage.getItem('progress-az-900') || '0', 10);
      setCourses(prevCourses =>
        prevCourses.map(course => (course.id === 1 ? { ...course, progress: az900Progress } : course))
      );
    }
  };

  useEffect(() => {
    fetchMyCertifications();
    refreshProgress();
  }, []);

  useEffect(() => {
    refreshProgress();
  }, [pathname]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'progress-az-900') {
        const az900Progress = parseInt(e.newValue || '0', 10);
        setCourses(prevCourses =>
          prevCourses.map(course => (course.id === 1 ? { ...course, progress: az900Progress } : course))
        );
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isLoading) return <div className={styles.coursesSection}>{t('loading_courses')}</div>;
  if (error) return <div className={styles.coursesSection}>{error}</div>;

  return (
    <div className={styles.coursesSection}>
      <h2>{t('my_courses')}</h2>
      {courses.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <i className="fas fa-book-open"></i>
          </div>
          <h3>{t('no_courses_title')}</h3>
          <p>{t('no_courses_message')}</p>
          <div className={styles.emptyActions}>
            <Link href="/" className={styles.browseButton}>
              <i className="fas fa-search"></i>
              {t('browse_courses')}
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.coursesGrid}>
          {courses.map(course => {
            console.log('Rendering course:', course);
            return (
            <Link key={course.id} href={`/course/${course.id}`} className={styles.courseCard}>
              <div className={styles.courseImage}>
                <i className={`fas ${course.icon}`}></i>
              </div>
              <div className={styles.courseContent}>
                <h3>{course.name}</h3>
                <p>{course.description}</p>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${course.progress}%` }}></div>
                </div>
                <div className={styles.courseInfo}>
                  <span><i className="fas fa-clock"></i> {course.duration}</span>
                  <span><i className="fas fa-user"></i> {course.level}</span>
                  <span className={styles.progressText}>{course.progress}% {t('completed')}</span>
                  <span className={styles.bookedBadge}>{t('booked')}</span>
                </div>
                <button
                  className={styles.startButton}
                  style={{ opacity: 1 }}
                >
                  {t('start_course')}
                  <i className="fas fa-arrow-left"></i>
                </button>
              </div>
            </Link>
          );
          })}
        </div>
      )}
    </div>
  );
}