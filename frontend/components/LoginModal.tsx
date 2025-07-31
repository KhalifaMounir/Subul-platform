'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { X, Mail, Lock } from 'lucide-react';
import styles from '@/styles/LoginModal.module.css';
import { useTranslation } from 'next-i18next';

interface LoginModalProps {
  setIsLoggedIn: (value: boolean) => void;
  onClose: () => void;
}

export default function LoginModal({ setIsLoggedIn, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useTranslation('common');
  const isRTL = router.locale === 'ar';

  // ✅ Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isAdmin', String(data.is_admin));

        setIsLoggedIn(true);
        onClose();

        if (data.is_admin) {
          router.push('/admin/certifications');
        } else {
          router.push('/profile');
        }
      } else {
        setError(data.message || t('login_error'));
      }
    } catch (err) {
      setError(t('login_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.modal} ${styles.active}`}>
      <div className={styles.modalContent}>
        <div className={styles.loginContent}>
          <div className={styles.loginBackground}></div>

          <div className={styles.loginHeader}>
            <button
              onClick={onClose}
              className={styles.closeBtn}
              aria-label={t('cancel')}
            >
              <X size={20} />
            </button>

            <div className={styles.heroIcon}>
              <svg className={styles.heroIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className={styles.loginHeader}>{t('login_welcome')}</h2>
            <p>{t('login_to_start')}</p>
          </div>

          <div className={styles.loginBody}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>
                  {t('username')}
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder={t('enter_username')}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  {t('password')}
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={t('enter_password')}
                    className={styles.input}
                  />
                </div>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" disabled={isLoading} className={styles.loginBtn}>
                {isLoading ? t('login_loading') : t('login_btn')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}