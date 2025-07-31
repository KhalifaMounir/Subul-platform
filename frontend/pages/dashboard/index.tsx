import Dashboard from '@/components/dashboard';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default Dashboard;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}