import React from 'react';
import { BookOpen, User, LogIn, LogOut } from 'lucide-react';
import styles from '@/styles/HomeHeader.module.css';

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
  const handleSignOut = () => {
    onLogout();
  };

  const goToDashboard = () => {
    if (isLoggedIn) {
      setCurrentPage('dashboard');
    }
  };

  const goToProfile = () => {
    if (isLoggedIn) {
      setCurrentPage('profile');
    }
  };

  const goToHome = () => {
    setCurrentPage('home');
  };

  return (
    <header className={styles.fixedHeader}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
            <div className={styles.logo} onClick={goToHome}>
                <i className="fas fa-book-open"></i>
                <span className={styles.logoText}>سبل</span>
            </div>
          
          <nav className={styles.nav}>
            {isLoggedIn && (
              <>
                <button 
                  onClick={goToDashboard}
                  className={`${styles.navButton} ${
                    currentPage === 'dashboard' 
                      ? styles.navButtonActive
                      : styles.navButtonDefault
                  }`}
                >
                  <BookOpen className={styles.navIcon} />
                  <span>دوراتي</span>
                </button>
                
                <button 
                  onClick={goToProfile}
                  className={`${styles.navButton} ${
                    currentPage === 'profile' 
                      ? styles.navButtonActive
                      : styles.navButtonDefault
                  }`}
                >
                  <User className={styles.navIcon} />
                  <span>الملف الشخصي</span>
                </button>
              </>
            )}
            
            {isLoggedIn ? (
              <button
                onClick={handleSignOut}
                className={`${styles.navButton} ${styles.logoutButton}`}
              >
                <LogOut className={styles.navIcon} />
                <span>تسجيل الخروج</span>
              </button>
            ) : (
              <button
                onClick={onLogin}
                className={`${styles.navButton} ${styles.loginButton}`}
              >
                <LogIn className={styles.navIcon} />
                <span>تسجيل الدخول</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}