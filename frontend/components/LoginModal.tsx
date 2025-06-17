import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { X, Mail, Lock } from 'lucide-react';
import styles from '@/styles/LoginModal.module.css';

interface LoginModalProps {
  setIsLoggedIn: (value: boolean) => void;
  onClose: () => void;
}

export default function LoginModal({ setIsLoggedIn, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Login submitted: email=', email); // Debug log

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'demo@subol.com' && password === 'demo123') {
      console.log('Login successful, redirecting to /dashboard'); // Debug log
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      onClose();
      router.push('/dashboard');
    } else {
      console.log('Login failed: invalid credentials'); // Debug log
      alert('البريد الإلكتروني أو كلمة المرور غير صحيحة. حاول مرة أخرى.');
    }

    setIsLoading(false);
  };

  return (
    <div className={`${styles.modal} ${styles.active}`}>
      <div className={styles.modalContent}>
        <div className={styles.loginContent}>
          <div className={styles.loginBackground}></div>
          <div className={styles.loginHeader}>
            <button onClick={() => { console.log('Close button clicked'); onClose(); }} className={styles.closeBtn}>
              <X size={20} />
            </button>
            <div className={styles.heroIcon}>
              <svg className={styles.heroIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className={styles.loginHeader}>مرحباً بك في سبل</h2>
            <p>تسجيل الدخول لبدء رحلة التعلم</p>
          </div>
          <div className={styles.loginBody}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="email">البريد الإلكتروني</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">كلمة المرور</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="أدخل كلمة المرور"
                  />
                  
                </div>
              </div>

              <button type="submit" disabled={isLoading} className={styles.loginBtn}>
                {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>
            </form>

            <div className={styles.demoCredentials}>
              <h4>للتجربة استخدم:</h4>
              <p><strong>البريد:</strong> demo@subol.com</p>
              <p><strong>كلمة المرور:</strong> demo123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}