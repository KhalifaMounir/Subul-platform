import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (!loggedIn && router.pathname !== '/login') {
      router.push('/login');
    } else if (loggedIn && router.pathname === '/login') {
      router.push('/');
    }
  }, [router.pathname]);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Component {...pageProps} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </>
  );
}