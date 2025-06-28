import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import styles from '@/styles/AdminCertifications.module.css';

interface Certification {
  id: number;
  name: string;
  booked_by_user: boolean;
}

interface AdminCertificationsProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

export default function AdminCertifications({ isLoggedIn, setIsLoggedIn }: AdminCertificationsProps) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch certifications with timeout
  const fetchCertifications = async () => {
    try {
      setIsLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch('http://localhost:5000/certifications', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data: Certification[] = await response.json();
        setCertifications(data);
        setError(null);
      } else {
        const errorText = await response.text();
        console.error('Fetch certifications failed:', response.status, response.statusText, errorText);
        if (response.status === 401) {
          setIsLoggedIn(false);
          localStorage.setItem('isLoggedIn', 'false');
          setError('يرجى تسجيل الدخول للوصول إلى الشهادات');
          router.push('/login');
        } else {
          setError(`فشل في جلب الشهادات: ${response.statusText} (${response.status})`);
        }
      }
    } catch (err: any) {
      console.error('Fetch certifications error:', err);
      setError(
        err.name === 'AbortError'
          ? 'انتهت مهلة الطلب. تأكد من تشغيل الخادم على http://localhost:5000.'
          : err.message === 'Failed to fetch'
          ? 'لا يمكن الاتصال بالخادم. تأكد من تشغيل الخادم على http://localhost:5000 وتحقق من إعدادات CORS.'
          : 'حدث خطأ أثناء جلب الشهادات. حاول مرة أخرى.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleCertClick = (cert: Certification) => {
    setSelectedCert(cert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCert(null);
    router.push('/dashboard');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>جميع الشهادات</h1>
      {isLoading && <p className={styles.loading}>جاري تحميل الشهادات...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!isLoading && !error && certifications.length === 0 && (
        <p className={styles.noCertifications}>لا توجد شهادات متاحة.</p>
      )}
      {!isLoading && !error && certifications.length > 0 && (
        <div className={styles.certList}>
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className={styles.certItem}
              onClick={() => handleCertClick(cert)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCertClick(cert);
                }
              }}
            >
              <h2 className={styles.certName}>{cert.name}</h2>
              <p className={styles.certStatus}>
                {cert.booked_by_user ? 'محجوزة بواسطتك' : 'غير محجوزة'}
              </p>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedCert && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>تفاصيل الشهادة</h2>
              <button
                onClick={handleCloseModal}
                className={styles.closeBtn}
                aria-label="إغلاق النافذة"
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p><strong>المعرف:</strong> {selectedCert.id}</p>
              <p><strong>الاسم:</strong> {selectedCert.name}</p>
              <p>
                <strong>الحالة:</strong>{' '}
                {selectedCert.booked_by_user ? 'محجوزة بواسطتك' : 'غير محجوزة'}
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={handleCloseModal} className={styles.btnSecondary}>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}