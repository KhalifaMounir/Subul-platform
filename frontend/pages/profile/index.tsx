import Profile from '@/components/Profile';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default Profile;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
