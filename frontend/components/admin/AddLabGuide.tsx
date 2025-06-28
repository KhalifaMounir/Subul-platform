import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, X, Loader, RefreshCw } from 'lucide-react';
import styles from '@/styles/AddLabGuide.module.css';

interface AddLabGuideProps {
  onClose: () => void;
  onUpload: (file: File, certName: string) => void; // Changed to certName
  error: string | null;
  isSubmitting: boolean;
}

interface Certification {
  id: number;
  name: string;
  booked_by_user?: boolean;
}

const AddLabGuide: React.FC<AddLabGuideProps> = ({ onClose, onUpload, error, isSubmitting }) => {
  const [file, setFile] = useState<File | null>(null);
  const [certName, setCertName] = useState<string>(''); // Changed to certName
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isLoadingCerts, setIsLoadingCerts] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch certifications from backend
  const fetchCertifications = async () => {
    try {
      setIsLoadingCerts(true);
      const response = await fetch('http://localhost:5000/api/certifications', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Certifications fetched:', data);
        setCertifications(data);
        setFetchError(null);
      } else {
        const errorText = await response.text();
        console.error('Fetch certifications failed:', response.status, response.statusText, errorText);
        if (response.status === 401) {
          setFetchError('يرجى تسجيل الدخول للوصول إلى الشهادات');
        } else if (response.status === 403) {
          setFetchError('غير مصرح لك للوصول إلى الشهادات');
        } else {
          setFetchError(`فشل في جلب الشهادات: ${response.status} ${response.statusText}`);
        }
      }
    } catch (err) {
      console.error('Fetch certifications error:', err);
      setFetchError(
        err.message === 'Failed to fetch'
          ? 'لا يمكن الاتصال بالخادم. تأكد من تشغيل الخادم على http://localhost:5000 وتحقق من إعدادات CORS.'
          : 'حدث خطأ أثناء جلب الشهادات. تأكد من تشغيل الخادم وتسجيل الدخول.'
      );
    } finally {
      setIsLoadingCerts(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === 'application/pdf' ||
        droppedFile.type === 'video/mp4' ||
        droppedFile.type === 'video/quicktime'
      ) {
        setFile(droppedFile);
        setUploadError(null);
      } else {
        setUploadError('يرجى اختيار ملف PDF أو MP4 أو MOV فقط');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (
        selectedFile.type === 'application/pdf' ||
        selectedFile.type === 'video/mp4' ||
        selectedFile.type === 'video/quicktime'
      ) {
        setFile(selectedFile);
        setUploadError(null);
      } else {
        setUploadError('يرجى اختيار ملف PDF أو MP4 أو MOV فقط');
      }
    }
  };

  const handleCertSelect = (name: string) => {
    setCertName(name);
    setDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !certName || isSubmitting) return;
    onUpload(file, certName); // Pass certName instead of certId
  };

  const handleClose = () => {
    setFile(null);
    setCertName('');
    setUploadError(null);
    setFetchError(null);
    setDropdownOpen(false);
    onClose();
  };

  const handleRetry = () => {
    setFetchError(null);
    fetchCertifications();
  };

  const selectedCertName = certName || 'اختر شهادة';

  return (
    <div className={styles.root}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <h2>إضافة دليل مختبر</h2>
            <button
              className={styles.closeBtn}
              onClick={handleClose}
              disabled={isSubmitting}
              aria-label="إغلاق النافذة"
            >
              <X size={20} />
            </button>
          </div>

          <div className={styles.body}>
            {fetchError && (
              <div className={styles.errorMessage}>
                {fetchError}
                <button
                  onClick={handleRetry}
                  className={styles.retryBtn}
                  disabled={isSubmitting}
                  aria-label="إعادة المحاولة"
                >
                  <RefreshCw size={16} /> إعادة المحاولة
                </button>
              </div>
            )}
            {certifications.length === 0 && !fetchError && !isLoadingCerts && (
              <div className={styles.errorMessage}>
                لا توجد شهادات متاحة. يرجى إضافة شهادات أولاً.
              </div>
            )}
            {isLoadingCerts && (
              <div className={styles.errorMessage}>
                جاري تحميل الشهادات...
              </div>
            )}
            {certifications.length > 0 && !isLoadingCerts && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    اختر الشهادة
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => !isLoadingCerts && !isSubmitting && setDropdownOpen(!dropdownOpen)}
                      disabled={isLoadingCerts || isSubmitting}
                      className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      {selectedCertName}
                    </button>
                    {dropdownOpen && (
                      <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto z-10">
                        {certifications.map((cert) => (
                          <div
                            key={cert.id}
                            onClick={() => !isSubmitting && handleCertSelect(cert.name)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                if (!isSubmitting) handleCertSelect(cert.name);
                              }
                            }}
                            className={`px-4 py-2 text-sm text-right cursor-pointer hover:bg-blue-100 ${certName === cert.name ? 'bg-blue-100' : ''}`}
                            role="option"
                            aria-selected={certName === cert.name}
                            tabIndex={0}
                          >
                            {cert.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''} ${file ? styles.hasFile : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="رفع ملف PDF أو MP4 أو MOV هنا"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,video/mp4,video/quicktime"
                    onChange={handleFileSelect}
                    className={styles.hiddenInput}
                    disabled={isSubmitting}
                    aria-hidden="true"
                  />
                  <div className={styles.uploadContent}>
                    {file ? (
                      <>
                        <FileText size={48} className={styles.fileIcon} />
                        <p className={styles.fileName}>{file.name}</p>
                        <p className={styles.fileSize}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload size={48} className={styles.uploadIcon} />
                        <p className={styles.uploadText}>
                          اسحب وأفلت ملف PDF أو MP4 أو MOV هنا أو انقر للتحديد
                        </p>
                        <p className={styles.uploadSubtext}>
                          يدعم ملفات PDF، MP4، أو MOV فقط (حتى 10MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {file && (
                  <div className={styles.filePreview}>
                    <div className={styles.fileInfo}>
                      <FileText size={20} />
                      <span>{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className={styles.removeFile}
                      disabled={isSubmitting}
                      aria-label={`إزالة الملف ${file.name}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {(error || uploadError) && (
                  <div className={styles.errorMessage}>
                    {error || uploadError}
                  </div>
                )}

                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={handleClose}
                    className={styles.btnSecondary}
                    disabled={isSubmitting}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className={styles.btnPrimary}
                    disabled={!file || !certName || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size={16} className={styles.spinner} />
                        جاري الرفع...
                      </>
                    ) : (
                      'رفع الدليل'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLabGuide;