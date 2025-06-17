import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '@/components/Header'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isAdminRoute = router.pathname.startsWith('/admin')
  const isHomePage = router.pathname === '/'
  const isCoursePage = router.pathname.startsWith('/course')

  // Show header only if NOT in admin route, NOT on home page, and NOT on course page
  const showHeader = !isAdminRoute && !isHomePage && !isCoursePage

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
          isLoggedIn={false}
          onLogin={() => {}}
          onLogout={() => {}}
          currentPage="home"
          setCurrentPage={() => {}}
        />
      )}

      <Component {...pageProps} />
    </>
  )
}