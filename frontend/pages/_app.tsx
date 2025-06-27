import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import { useState, useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'profile'>('home');

  // Check login status on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    // Optionally, verify session with backend
    const verifySession = async () => {
      try {
        const response = await fetch('http://localhost:5000/dashboard', {
          credentials: 'include',
        });
        if (!response.ok) {
          localStorage.removeItem('isLoggedIn');
          setIsLoggedIn(false);
          if (router.pathname !== '/') {
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Session verification failed:', error);
      }
    };
    if (loggedIn) verifySession();
  }, [router.pathname]);

  const handleLogin = () => {
    router.push('/'); // Show home page with login modal
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => {
      router.push('/');
    });
  };

  const isAdminRoute = router.pathname.startsWith('/admin');
  const isHomePage = router.pathname === '/';
  const isCoursePage = router.pathname.startsWith('/course');
  const showHeader = !isAdminRoute && !isHomePage && !isCoursePage;

  return (
    <>
      <Head>
        <title>سبل - منصة التعلم الإلكتروني</title>
        <meta name="description" content="منصة سبل للتعلم الإلكتروني التفاعلي" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </Head>

      {showHeader && (
        <Header
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
          onLogout={handleLogout}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      <Component {...pageProps} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </>
  );
}