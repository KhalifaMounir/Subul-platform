'use client';

import { useRouter } from 'next/navigation';
import styles from '@/styles/Header.module.css';
import React from 'react';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  currentPage: 'home' | 'dashboard' | 'profile';
  setCurrentPage: React.Dispatch<React.SetStateAction<'home' | 'dashboard' | 'profile'>>;
}

export default function Header({
  isLoggedIn,
  onLogin,
  onLogout,
  currentPage,
  setCurrentPage,
}: HeaderProps) {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem('isLoggedIn');
    onLogout();
    router.push('/');
  };

  const goToDashboard = () => {
    setCurrentPage('dashboard');
    router.push('/dashboard');
  };

  const goToProfile = () => {
    router.push('/profile');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <i className="fas fa-book-open"></i>
            <span>سبل</span>
          </div>
          <nav className={styles.nav}>
            <button className={styles.navBtn} onClick={goToDashboard}>
              <i className="fas fa-book-open"></i>
              <span>دوراتي</span>
            </button>
            <button className={styles.navBtn} onClick={goToProfile}>
              <i className="fas fa-user"></i>
              <span>الملف الشخصي</span>
            </button>
            <button
              onClick={handleSignOut}
              className={`${styles.navBtn} ${styles.loginNavBtn}`}
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>تسجيل الخروج</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}