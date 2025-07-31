import JobsComponent from '@/components/Jobs'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Jobs() {
  return <JobsComponent />
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
