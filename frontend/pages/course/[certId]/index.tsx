import Course from '@/components/Course'
import { useRouter } from 'next/router'

export default function CoursePage() {
  const router = useRouter();
  const { certId } = router.query;

  return <Course certId={certId} />;
}