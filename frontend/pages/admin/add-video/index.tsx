import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AddVideo from '@/components/admin/AddVideo';

export default function AdminAddVideo() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { cert_id } = router.query;

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const handleSuccess = (video: any) => {
    console.log('Video added:', video);
    setError(null);
    router.back();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    router.back();
  };

  const certIdNumber = typeof cert_id === 'string' ? parseInt(cert_id, 10) : undefined;

  if (!certIdNumber || isNaN(certIdNumber)) {
    return <div>معرف الشهادة غير صالح</div>;
  }

  return (
    <>
      {isModalOpen && (
        <AddVideo
          certId={certIdNumber}
          onClose={handleClose}
          onSuccess={handleSuccess}
          error={error}
        />
      )}
    </>
  );
}