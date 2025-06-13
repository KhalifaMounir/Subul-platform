import { useRouter } from 'next/router';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import styles from '../styles/Header.module.css';

export default function Header({ isLoggedIn, setIsLoggedIn }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            <span>سُبُل</span>
          </Link>
          {isLoggedIn && (
            <>
              <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Toggle menu">
                <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
              </button>
              <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                <ul className={styles.navList}>
                  <li>
                    <Link
                      href="/"
                      className={`${styles.navLink} ${router.pathname === '/' ? styles.active : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      الرئيسية
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className={`${styles.navLink} ${router.pathname === '/profile' ? styles.active : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      الملف الشخصي
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleSignOut} className={styles.signOutBtn}>
                      تسجيل الخروج
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </header>
  );
}