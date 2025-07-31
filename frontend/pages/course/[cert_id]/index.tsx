import { useRouter } from 'next/router';
import Course from '@/components/Course';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function CoursePage() {
  const router = useRouter();
  const { cert_id } = router.query;

  return <Course certId={cert_id as string} />;
}

export async function getServerSideProps({ locale, params }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 