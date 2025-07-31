import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import { appWithTranslation } from 'next-i18next';
import { useTranslation } from 'next-i18next';

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'profile'>('home');
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const { t } = useTranslation('common');

  useEffect(() => {
    const loggedIn = typeof window !== 'undefined' ? localStorage.getItem('isLoggedIn') === 'true' : false;
    setIsLoggedIn(loggedIn);

    const verifySession = async () => {
      try {
        const response = await fetch('http://localhost:5000/dashboard', {
          credentials: 'include',
        });
        if (!response.ok) {
          localStorage.removeItem('isLoggedIn');
          setIsLoggedIn(false);
          if (router.pathname !== '/' && !router.pathname.startsWith('/admin')) {
            router.push('/');
          }
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Session verification failed:', error);
      } finally {
        setIsAuthChecking(false);
      }
    };
    if (loggedIn) {
      verifySession();
    } else {
      setIsAuthChecking(false);
    }
  }, [router.pathname]);

  // Check if user is trying to access protected routes without being logged in
  useEffect(() => {
    const loggedIn = typeof window !== 'undefined' ? localStorage.getItem('isLoggedIn') === 'true' : false;
    const protectedRoutes = ['/dashboard', '/profile', '/jobs', '/course'];
    const isProtectedRoute = protectedRoutes.some(route => router.pathname.startsWith(route));
    
    if (!loggedIn && isProtectedRoute && router.pathname !== '/') {
      router.push('/');
    }
  }, [router.pathname, router]);

  useEffect(() => {
    const dir = router.locale === 'ar' ? 'rtl' : 'ltr';
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('dir', dir);
    }
  }, [router.locale]);

  const handleLogin = () => {
    router.push('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => router.push('/'));
  };

  const isAdminRoute = router.pathname.startsWith('/admin');
  const isHomePage = router.pathname === '/';
  const isCoursePage = router.pathname.startsWith('/course');
  const showHeader = !isAdminRoute && !isHomePage ;

  // Check if user is not logged in and trying to access protected routes
  const loggedIn = typeof window !== 'undefined' ? localStorage.getItem('isLoggedIn') === 'true' : false;
  const protectedRoutes = ['/dashboard', '/profile', '/jobs', '/course'];
  const isProtectedRoute = protectedRoutes.some(route => router.pathname.startsWith(route));
  
  // If not logged in and trying to access protected route, show loading and redirect
  if (!loggedIn && isProtectedRoute && router.pathname !== '/') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Checking session...
      </div>
    );
  }

  // Don't render anything while checking authentication (except on home page)
  if (isAuthChecking && router.pathname !== '/') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Checking session...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>سبل - منصة التعلم الإلكتروني</title>
        <meta name="description" content="منصة سبل للتعلم الإلكتروني التفاعلي" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
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

// This is the crucial part - wrap your App with appWithTranslation
export default appWithTranslation(App);