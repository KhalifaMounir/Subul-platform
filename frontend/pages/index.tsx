import Home from '@/components/Home';
import { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
