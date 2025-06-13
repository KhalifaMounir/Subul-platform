// Certificate functionality
let currentCertificate = null;

function getCertificate() {
  const currentCourse = getCurrentCourse();
  const currentLesson = getCurrentLesson();
  
  if (!currentCourse || !currentLesson) return;
  
  // Check if course is completed
  const completedLessons = currentCourse.lessons_data.filter(lesson => lesson.completed).length;
  const courseCompleted = completedLessons === currentCourse.lessons_data.length;
  
  if (!courseCompleted) {
    alert('يجب إكمال جميع دروس الدورة للحصول على الشهادة');
    return;
  }
  
  // Generate certificate
  generateCertificate(currentCourse);
}

function generateCertificate(course) {
  const userData = getUserData();
  const now = new Date();
  
  const certificate = {
    id: Date.now(),
    courseId: course.id,
    courseName: course.title,
    studentName: 'الطالب', // In a real app, this would be the actual user name
    completionDate: now.toLocaleDateString('ar-SA'),
    score: userData.quizScores[course.id] ? 
      Math.round(Object.values(userData.quizScores[course.id]).reduce((a, b) => a + b, 0) / Object.values(userData.quizScores[course.id]).length) : 
      0,
    certificateNumber: `SUBUL-${course.id}-${Date.now()}`
  };
  
  // Save certificate
  if (!userData.certificates) {
    userData.certificates = [];
  }
  
  // Check if certificate already exists
  const existingCert = userData.certificates.find(cert => cert.courseId === course.id);
  if (!existingCert) {
    userData.certificates.push(certificate);
    userData.certificatesCount = userData.certificates.length;
    saveUserData(userData);
    updateStats();
  }
  
  currentCertificate = certificate;
  showCertificate(certificate);
}

function showCertificate(certificate) {
  // Update certificate content
  document.getElementById('cert-course-name').textContent = certificate.courseName;
  document.getElementById('cert-date').textContent = certificate.completionDate;
  document.getElementById('cert-score').textContent = certificate.score + '%';
  
  // Show certificate modal
  document.getElementById('certificate-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCertificate() {
  document.getElementById('certificate-modal').classList.remove('active');
  document.body.style.overflow = 'auto';
  currentCertificate = null;
}

function downloadCertificate() {
  if (!currentCertificate) return;
  
  // Create a canvas to draw the certificate
  const certificate = document.getElementById('certificate');
  
  // Use html2canvas library (you would need to include it)
  // For now, we'll simulate the download
  const link = document.createElement('a');
  link.download = `شهادة-${currentCertificate.courseName}.png`;
  
  // In a real implementation, you would convert the certificate to image
  // For demo purposes, we'll just show an alert
  alert('سيتم تحميل الشهادة قريباً. هذه ميزة تجريبية.');
}

function printCertificate() {
  if (!currentCertificate) return;
  
  const printWindow = window.open('', '_blank');
  const certificateHTML = document.getElementById('certificate').outerHTML;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>شهادة - ${currentCertificate.courseName}</title>
      <link rel="stylesheet" href="style.css">
      <style>
        body { margin: 0; padding: 20px; }
        .certificate { transform: none !important; }
      </style>
    </head>
    <body>
      ${certificateHTML}
    </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.print();
}

function loadCertificates() {
  const userData = getUserData();
  const certificatesGrid = document.getElementById('certificates-grid');
  
  if (!userData.certificates || userData.certificates.length === 0) {
    certificatesGrid.innerHTML = `
      <div class="no-certificates">
        <i class="fas fa-certificate"></i>
        <h3>لا توجد شهادات بعد</h3>
        <p>أكمل الدورات للحصول على الشهادات</p>
      </div>
    `;
    return;
  }
  
  certificatesGrid.innerHTML = '';
  userData.certificates.forEach(cert => {
    const certCard = createCertificateCard(cert);
    certificatesGrid.appendChild(certCard);
  });
}

function createCertificateCard(certificate) {
  const card = document.createElement('div');
  card.className = 'certificate-card';
  card.onclick = () => showCertificate(certificate);
  
  card.innerHTML = `
    <div class="certificate-preview">
      <i class="fas fa-certificate"></i>
    </div>
    <div class="certificate-info">
      <h4>${certificate.courseName}</h4>
      <p>تاريخ الإتمام: ${certificate.completionDate}</p>
      <p>الدرجة: ${certificate.score}%</p>
      <button class="view-certificate-btn">عرض الشهادة</button>
    </div>
  `;
  
  return card;
}