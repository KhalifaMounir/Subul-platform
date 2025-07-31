'use client';

import { useRouter } from 'next/router'; // Changed from 'next/navigation'
import styles from '@/styles/Header.module.css';
import React from 'react';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from './LanguageSwitcher';

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
  const { t } = useTranslation('common');

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

  const goToJobs = () => {
    router.push('/jobs');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <i className="fas fa-book-open"></i>
            <span>{t('app_name')}</span>
          </div>
          <nav className={styles.nav}>
            <button 
              className={`${styles.navBtn} ${currentPage === 'dashboard' ? styles.active : ''}`} 
              onClick={goToDashboard}
            >
              <i className="fas fa-book-open"></i>
              <span>{t('my_courses')}</span>
            </button>
            <button 
              className={`${styles.navBtn} ${currentPage === 'profile' ? styles.active : ''}`} 
              onClick={goToProfile}
            >
              <i className="fas fa-user"></i>
              <span>{t('profile')}</span>
            </button>
            <button className={styles.navBtn} onClick={goToJobs}>
              <i className="fas fa-briefcase"></i>
              <span>{t('jobs')}</span>
            </button>
            
            {/* Language Switcher Component */}
            <div className={styles.languageSwitcherWrapper}>
              <LanguageSwitcher />
            </div>
            
            <button
              onClick={handleSignOut}
              className={`${styles.navBtn} ${styles.loginNavBtn}`}
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>{t('logout')}</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}