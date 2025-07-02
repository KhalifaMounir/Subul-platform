"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/CoursesSection.module.css';

interface Course {
  id: number;
  name: string;
  booked_by_user: boolean;
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

  const fallbackAttributes = [
    { description: 'تعلم مفاهيم Azure الأساسية والخدمات السحابية', duration: '6 ساعات', level: 'مبتدئ', icon: 'fa-cloud', progress: 0, href: '/course' },
    { description: 'إدارة خدمات Azure والبنية التحتية بكفاءة', duration: '8 ساعات', level: 'متوسط', icon: 'fa-server', progress: 0, href: '/course' },
    { description: 'تصميم حلول سحابية متقدمة على Azure', duration: '10 ساعات', level: 'متقدم', icon: 'fa-cogs', progress: 0, href: '/course' },
  ];

  const fetchCertifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/certifications', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/');
          return;
        }
        throw new Error('فشل جلب الدورات');
      }
      const data = await response.json();
      const mappedCourses = data.map((cert: { id: number; name: string; booked_by_user: boolean }, index: number) => ({
        id: cert.id,
        name: cert.name,
        booked_by_user: cert.booked_by_user,
        ...fallbackAttributes[index % fallbackAttributes.length],
      }));
      setCourses(mappedCourses);
      setError(null);
    } catch (err) {
      setError('تعذر تحميل الدورات. حاول مرة أخرى.');
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
    fetchCertifications();
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

  if (isLoading) return <div className={styles.coursesSection}>جاري تحميل الدورات...</div>;
  if (error) return <div className={styles.coursesSection}>{error}</div>;

  return (
    <div className={styles.coursesSection}>
      <h2>الدورات المتاحة</h2>
      <div className={styles.coursesGrid}>
        {courses.map(course => (
          <Link key={course.id} href={course.booked_by_user ? `/course?cert_id=${course.id}` : '#'} className={styles.courseCard}>
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
                <span className={styles.progressText}>{course.progress}% مكتمل</span>
                {course.booked_by_user ? (
                  <span className={styles.bookedBadge}>محجوز</span>
                ) : (
                  <span className={styles.notBookedBadge}>غير محجوز</span>
                )}
              </div>
              <button
                className={styles.startButton}
                disabled={!course.booked_by_user}
                style={{ opacity: course.booked_by_user ? 1 : 0.5 }}
              >
                {course.booked_by_user ? 'لنبدأ الدورة' : 'غير متاح'}
                <i className="fas fa-arrow-left"></i>
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}