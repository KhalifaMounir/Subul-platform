"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Added: For router events and pathname
import Link from 'next/link';
import styles from '@/styles/CoursesSection.module.css';

export default function CoursesSection() {
  const router = useRouter();
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'أساسيات Microsoft Azure (AZ-900)',
      description: 'تعلم مفاهيم Azure الأساسية والخدمات السحابية',
      duration: '6 ساعات',
      level: 'مبتدئ',
      icon: 'fa-cloud',
      progress: 0,
      href: '/course',
    },
    {
      id: 2,
      title: 'Azure Administrator (AZ-104)',
      description: 'إدارة خدمات Azure والبنية التحتية بكفاءة',
      duration: '8 ساعات',
      level: 'متوسط',
      icon: 'fa-server',
      progress: 0,
      href: '/course',
    },
    {
      id: 3,
      title: 'Azure Solutions Architect (AZ-305)',
      description: 'تصميم حلول سحابية متقدمة على Azure',
      duration: '10 ساعات',
      level: 'متقدم',
      icon: 'fa-cogs',
      progress: 0,
      href: '/course',
    },
  ]);

  // Refresh progress from localStorage
  const refreshProgress = () => {
    if (typeof window !== 'undefined') {
      const az900Progress = parseInt(localStorage.getItem('progress-az-900') || '0', 10);
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === 1 ? { ...course, progress: az900Progress } : course
        )
      );
      console.log(`Read progress-az-900: ${az900Progress}%`); // Debug log
    }
  };

  // Load progress on mount
  useEffect(() => {
    refreshProgress();
  }, []);

  // Refresh progress on navigation using pathname change
  const pathname = usePathname();

  useEffect(() => {
    refreshProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Update progress on storage change
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'progress-az-900') {
        const az900Progress = parseInt(e.newValue || '0', 10);
        setCourses(prevCourses =>
          prevCourses.map(course =>
            course.id === 1 ? { ...course, progress: az900Progress } : course
          )
        );
        console.log(`Storage event: progress-az-900 updated to ${az900Progress}%`);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className={styles.coursesSection}>
      <h2>الدورات المتاحة</h2>
      <div className={styles.coursesGrid}>
        {courses.map((course) => (
          <Link key={course.id} href={course.href} className={styles.courseCard}>
            <div className={styles.courseImage}>
              <i className={`fas ${course.icon}`}></i>
            </div>
            <div className={styles.courseContent}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <div className={styles.courseInfo}>
                <span>
                  <i className="fas fa-clock"></i> {course.duration}
                </span>
                <span>
                  <i className="fas fa-user"></i> {course.level}
                </span>
                <span className={styles.progressText}>
                  {course.progress}% مكتمل
                </span>
              </div>
              <button className={styles.startButton}>
                لنبدأ الدورة
                <i className="fas fa-arrow-left"></i>
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}