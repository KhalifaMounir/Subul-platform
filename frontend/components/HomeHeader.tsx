import React from 'react';
import { LogIn } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import styles from '@/styles/HomeHeader.module.css';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
}

export default function Header({
  isLoggedIn,
  onLogin,
}: HeaderProps) {
  const { t } = useTranslation('common');

  return (
    <header className={styles.fixedHeader}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <i className="fas fa-book-open"></i>
            <span className={styles.logoText}>{t('app_name')}</span>
          </div>
          
          <nav className={styles.nav}>
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {!isLoggedIn && (
              <button
                onClick={onLogin}
                className={`${styles.navButton} ${styles.loginButton}`}
              >
                <LogIn className={styles.navIcon} />
                <span>{t('login')}</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}