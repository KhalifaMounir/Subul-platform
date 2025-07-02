import { useRouter } from 'next/router';
import Course from '@/components/Course';

export default function CoursePage() {
  const router = useRouter();
  const { cert_id } = router.query;

  return <Course certId={cert_id as string} />;
}

export async function getServerSideProps({ query, res }) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  return { props: {} };
}