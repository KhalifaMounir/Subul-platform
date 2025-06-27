import { useEffect, useState } from 'react';
import AddCertification from '@/components/admin/add_certifications';

export default function AdminCertifications() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsModalOpen(true); // Open modal on page load
  }, []);

  const handleSubmit = async (certName: string) => {
    if (!certName) {
      setError('اسم الشهادة مطلوب');
      return;
    }

    try {
      console.log('Adding certification:', certName);
      const response = await fetch('http://localhost:5000/admin/certifications', {
        method: 'POST',
        credentials: 'include', // Send cookies for authentication
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name: certName }),
      });
      console.log('Response status:', response.status);

      const data = await response.json();
      if (!response.ok) {
        console.error('Response error:', data.error || 'Unknown error');
        throw new Error(data.error || 'فشل في إضافة الشهادة');
      }

      console.log('Certification added:', data);
      setIsModalOpen(false);
      alert('تمت إضافة الشهادة بنجاح!');
    } catch (error: any) {
      const errorMessage = error.message || 'حدث خطأ أثناء إضافة الشهادة';
      console.error('Fetch error:', errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <>
      {isModalOpen && (
        <AddCertification
          onClose={() => {
            setIsModalOpen(false);
            setError(null);
          }}
          onSubmit={handleSubmit}
          error={error}
        />
      )}
    </>
  );
}