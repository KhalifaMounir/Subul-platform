import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ViewLabGuide from '@/components/admin/ViewLabGuide';

export default function AdminViewLabGuide() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter();
  const { cert_id } = router.query;

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

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
        <ViewLabGuide
          certId={certIdNumber}
          onClose={handleClose}
        />
      )}
    </>
  );
}