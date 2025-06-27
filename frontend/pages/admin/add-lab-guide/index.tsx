import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import AddLabGuide from '@/components/admin/AddLabGuide';

interface LabGuideResponse {
  id: number;
  cert_id: number;
  pdf_url: string;
}

export default function AdminAddLabGuide() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { cert_id } = router.query;

  const certIdNumber = typeof cert_id === 'string' ? parseInt(cert_id, 10) : undefined;

  // Handle file upload to the backend
  const handleUpload = useCallback(
    async (file: File): Promise<void> => {
      if (!file) return;

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('حجم الملف يجب أن يكون أقل من 10 ميجابايت');
        return;
      }

      setIsSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`http://localhost:5000/admin/certifications/${certIdNumber}/lab`, {
          method: 'POST',
          credentials: 'include', // Include cookies for authentication
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'فشل في رفع دليل المختبر' }));
          throw new Error(errorData.error || 'فشل في رفع دليل المختبر');
        }

        const data: LabGuideResponse = await response.json();
        handleSuccess(data);
      } catch (error: any) {
        console.error('Upload error:', error);
        setError(error.message || 'حدث خطأ أثناء رفع الملف');
      } finally {
        setIsSubmitting(false);
      }
    },
    [certIdNumber]
  );

  // Handle successful upload
  const handleSuccess = useCallback((labGuide: LabGuideResponse) => {
    console.log('Lab guide added:', labGuide);
    setError(null);
    setIsModalOpen(false);
    router.back(); // Navigate back to the previous page
  }, [router]);

  // Handle modal close
  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    router.back(); // Navigate back when modal is closed
  }, [router]);

  // Validate certIdNumber
  if (!certIdNumber || isNaN(certIdNumber)) {
    return <div className="text-red-500 text-center mt-8">معرف الشهادة غير صالح</div>;
  }

  return (
    <>
      {isModalOpen && (
        <AddLabGuide
          certId={certIdNumber}
          onClose={handleClose}
          onUpload={handleUpload}
          error={error}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}