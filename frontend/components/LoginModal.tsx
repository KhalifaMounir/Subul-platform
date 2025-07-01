'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, Lock } from 'lucide-react';
import styles from '@/styles/LoginModal.module.css';

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
        console.log('Login successful:', data);

        // ✅ Store session data
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isAdmin', String(data.is_admin));

        setIsLoggedIn(true);
        onClose();

        // ✅ Redirect based on admin status
        if (data.is_admin) {
          router.push('/admin/certifications');
        } else {
          router.push('/profile');
        }

      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
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
              aria-label="Close"
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
            <h2 className={styles.loginHeader}>مرحباً بك في سبل</h2>
            <p>تسجيل الدخول لبدء رحلة التعلم</p>
          </div>

          <div className={styles.loginBody}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>
                  اسم المستخدم
                  <Mail size={16} className={styles.inputIcon} />
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="أدخل اسم المستخدم"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  كلمة المرور
                  <Lock size={16} className={styles.inputIcon} />
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="أدخل كلمة المرور"
                    className={styles.input}
                  />
                </div>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" disabled={isLoading} className={styles.loginBtn}>
                {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}