import React, { useState } from 'react';
import Header from './HomeHeader';
import LoginModal from './LoginModal';
import styles from '@/styles/Home.module.css';
import { useTranslation } from 'next-i18next';

interface HomeProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

function App({ isLoggedIn, setIsLoggedIn }: HomeProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { t } = useTranslation('common'); // Add namespace

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
  };

  return (
    <div className={`${styles.minHeightScreen} ${styles.backgroundGradient}`}>
      <Header
        onLogin={handleLoginClick}
        isLoggedIn={isLoggedIn}
      />

      <main className={styles.main}>
        <HomePage onLoginClick={handleLoginClick} />
      </main>

      {showLoginModal && <LoginModal onClose={handleModalClose} setIsLoggedIn={setIsLoggedIn} />}
    </div>
  );
}

// HomePage Component
function HomePage({ onLoginClick }: { onLoginClick: () => void }) {
  const { t } = useTranslation('common'); // Add namespace
  
  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeContent}>
        <div className={styles.heroSection}>
          <div className={styles.heroIcon}>
            <svg className={styles.heroIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className={styles.heroTitle}>
            {t('welcome_to_course')} <span className={styles.heroTitleGradient}>{t('app_name')}</span>
          </h1>
          <p className={styles.heroDescription}>
            {t('interactive_learning_desc')}
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {[
            {
              iconType: 'blue',
              title: t('interactive_learning'),
              description: t('interactive_learning_feature_desc'),
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              ),
            },
            {
              iconType: 'purple',
              title: t('expert_trainers'),
              description: t('expert_trainers_desc'),
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              ),
            },
            {
              iconType: 'green',
              title: t('certified_certificates'),
              description: t('certified_certificates_desc'),
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              ),
            },
          ].map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles[`featureIcon${feature.iconType.charAt(0).toUpperCase() + feature.iconType.slice(1)}`]}`}>
                <svg className={styles.featureIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {feature.icon}
                </svg>
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>

        <button onClick={onLoginClick} className={styles.ctaButton}>
          <svg className={styles.ctaIcon} fill="none" stroke="currentColor" viewBox="-6 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          {t('start_learning_now')}
        </button>
      </div>
    </div>
  );
}

export default App;