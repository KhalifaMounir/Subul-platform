import { useState } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/LoginModal.module.css';

export default function LoginModal({ setIsLoggedIn }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'demo@subol.com' && password === 'demo123') {
      console.log('Login successful, redirecting to / at', new Date().toLocaleString());
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      router.push('/');
    } else {
      console.log('Login failed: Invalid credentials at', new Date().toLocaleString());
      alert('البريد الإلكتروني أو كلمة المرور غير صحيحة. حاول مرة أخرى.');
    }
  };

  const closeLoginModal = () => {
    console.log('Closing login modal at', new Date().toLocaleString());
    router.push('/');
  };

  return (
    <div className={`${styles.modal} ${styles.active}`}>
      <div className={styles.modalContent}>
        <div className={styles.loginContent}>
          <div className={styles.loginBackground}></div>
          <div className={styles.loginHeader}>
            <h2>مرحباً بك في سبل</h2>
            <p>تسجيل الدخول لبدء رحلة التعلم</p>
            <button className={styles.closeBtn} onClick={closeLoginModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className={styles.loginBody}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="username">البريد الإلكتروني</label>
                <div className={styles.inputWrapper}>
                  <FontAwesomeIcon icon={faEnvelope} />
                  <input
                    type="email"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="أدخل بريدك الإلكتروني"
                    autoComplete="username"
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">كلمة المرور</label>
                <div className={styles.inputWrapper}>
                  <FontAwesomeIcon icon={faLock} />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="أدخل كلمة المرور"
                    autoComplete="current-password"
                  />
                </div>
              </div>
              <button type="submit" className={styles.loginBtn}>
                <FontAwesomeIcon icon={faLock} />
                تسجيل الدخول
              </button>
            </form>
            <div className={styles.demoCredentials}>
              <p>للتجربة استخدم:</p>
              <p>البريد: demo@subol.com</p>
              <p>كلمة المرور: demo123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}