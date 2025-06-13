import { saveUserData, getUserData } from './auth';
import { courses } from './data';

export function getCertificate(course, setCurrentCertificate, setShowCertificateModal) {
  console.log('Requesting certificate at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  const userData = getUserData();
  const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
  const courseCompleted = completedLessons === course.lessons.length;

  if (!courseCompleted) {
    alert('يجب إكمال جميع دروس الدورة للحصول على الشهادة');
    return;
  }

  const now = new Date();
  const certificate = {
    id: Date.now(),
    courseId: course.id,
    courseName: course.title,
    studentName: 'الطالب',
    completionDate: now.toLocaleDateString('ar-SA'),
    score: userData.quizScores[course.id]
      ? Math.round(userData.quizScores[course.id].reduce((a, b) => a + b, 0) / userData.quizScores[course.id].length)
      : 0,
    certificateNumber: `SUBUL-${course.id}-${Date.now()}`
  };

  if (!userData.certificates) userData.certificates = [];
  const existingCert = userData.certificates.find(cert => cert.courseId === course.id);
  if (!existingCert) {
    userData.certificates.push(certificate);
    userData.certificatesCount = userData.certificates.length;
    saveUserData(userData);
  }

  setCurrentCertificate(certificate);
  setShowCertificateModal(true);
}

export function downloadCertificate(certificate) {
  if (!certificate) return;
  alert('سيتم تحميل الشهادة قريباً. هذه ميزة تجريبية.');
}

export function printCertificate(certificate) {
  if (!certificate) return;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>شهادة - ${certificate.courseName}</title>
      <style>
        body { margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .certificate { transform: none !important; }
        .certificate-border { border: 8px solid #fbbf24; border-radius: 1rem; padding: 2rem; background: linear-gradient(135deg, #fffbeb, #fef3c7); }
        .certificate-inner { text-align: center; padding: 2rem; }
        .certificate-logo i { font-size: 4rem; color: #f59e0b; margin-bottom: 1rem; }
        .certificate-logo h1 { font-size: 2.5rem; font-weight: 800; color: #111827; }
        .certificate h2 { font-size: 2rem; font-weight: 700; color: #f59e0b; margin-bottom: 1rem; }
        .certificate-text { font-size: 1.125rem; color: #374151; margin-bottom: 0.5rem; }
        .student-name, .course-name { font-size: 1.5rem; font-weight: 700; color: #111827; margin: 1rem 0; border-bottom: 2px solid #f59e0b; display: inline-block; padding-bottom: 0.5rem; }
        .certificate-details { margin: 2rem 0; display: flex; justify-content: space-around; flex-wrap: wrap; gap: 1rem; }
        .certificate-details p { font-size: 1rem; color: #4b5563; }
        .certificate-signature { margin-top: 3rem; }
        .signature-line { border-top: 2px solid #9ca3af; padding-top: 1rem; margin: 0 auto; width: 200px; }
        .signature-line p { font-size: 0.875rem; color: #4b5563; }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="certificate-border">
          <div class="certificate-inner">
            <div class="certificate-logo">
              <i class="fas fa-graduation-cap"></i>
              <h1>سبل</h1>
            </div>
            <h2>شهادة إتمام</h2>
            <p class="certificate-text">هذا يشهد أن</p>
            <h3 class="student-name">${certificate.studentName}</h3>
            <p class="certificate-text">قد أتم بنجاح دورة</p>
            <h3 class="course-name">${certificate.courseName}</h3>
            <div class="certificate-details">
              <p>تاريخ الإتمام: ${certificate.completionDate}</p>
              <p>الدرجة النهائية: ${certificate.score}%</p>
            </div>
            <div class="certificate-signature">
              <div class="signature-line">
                <p>منصة سبل للتعلم الإلكتروني</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}