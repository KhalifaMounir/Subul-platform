if (!localStorage.getItem('isLoggedIn')) {
  console.log('No login detected, redirecting to /login at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  window.location.href = '/login';
}

function handleAuth() {
  if (localStorage.getItem('isLoggedIn')) {
    console.log('Signing out at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  } else {
    console.log('Redirecting to login at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    window.location.href = '/login';
  }
}

function updateAuthButton() {
  const authBtn = document.getElementById('auth-btn');
  const authIcon = document.getElementById('auth-icon');
  const authTextEl = document.getElementById('auth-text');

  if (!authBtn || !authIcon || !authTextEl) {
    console.error('Auth button elements not found at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }

  if (localStorage.getItem('isLoggedIn')) {
    authIcon.className = 'fas fa-sign-out-alt';
    authTextEl.textContent = 'تسجيل الخروج';
    authBtn.classList.remove('login-nav-btn');
    authBtn.classList.add('signout-nav-btn');
  } else {
    authIcon.className = 'fas fa-sign-in-alt';
    authTextEl.textContent = 'تسجيل الدخول';
    authBtn.classList.remove('signout-nav-btn');
    authBtn.classList.add('login-nav-btn');
  }
  authBtn.onclick = handleAuth;
}

function getUserData() {
  return JSON.parse(localStorage.getItem('userData')) || {
    completedCourses: [],
    totalHours: 0,
    quizScores: [],
    certificates: [],
  };
}

function saveUserData(data) {
  localStorage.setItem('userData', JSON.stringify(data));
}

function loadUserProgress() {
  console.log('Loading user progress at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  const userData = getUserData();
  const userInfo = {
    completedCourses: document.getElementById('completed-courses'),
    totalHours: document.getElementById('total-hours'),
    quizScore: document.getElementById('quiz-score'),
    certificatesCount: document.getElementById('certificates-count'),
  };

  if (Object.values(userInfo).some(el => !el)) {
    console.error('One or more user data elements not found at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }

  userInfo.completedCourses.textContent = userData.completedCourses.length;
  userInfo.totalHours.textContent = userData.totalHours;
  userInfo.quizScore.textContent = userData.quizScores.length > 0 
    ? Math.round(userData.quizScores.reduce((a, b) => a + b, 0) / userData.quizScores.length) + '%'
    : '0%';
  userInfo.certificatesCount.textContent = userData.certificates.length;
}

function setupNavigation() {
  console.log('Setting up navigation at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      if (this.id !== 'auth-btn') {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const view = this.getAttribute('data-view');
        showView(view);
      }
    });
  });
}

function showView(viewId) {
  console.log(`Showing view: ${viewId} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
  const viewEl = document.getElementById(`${viewId}-view`);
  if (viewEl) {
    viewEl.classList.add('active');
  } else {
    console.error(`View element #${viewId}-view not found at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  }
}

function loadCourses() {
  console.log('Attempting to load courses at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  const coursesGrid = document.getElementById('courses-grid');
  if (!coursesGrid) {
    console.error('Courses grid element (#courses-grid) not found at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }
  coursesGrid.innerHTML = '';

  if (typeof courses === 'undefined' || !Array.isArray(courses)) {
    console.error('Courses data is undefined or not an array at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    coursesGrid.innerHTML = `
      <div class="no-results">
        <i class="fas fa-exclamation-circle"></i>
        <h3>خطأ في تحميل الدورات</h3>
        <p>يرجى التحقق من ملف بيانات الدورات أو الاتصال بالدعم.</p>
      </div>
    `;
    return;
  }

  if (courses.length === 0) {
    console.warn('Courses array is empty at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    coursesGrid.innerHTML = `
      <div class="no-results">
        <i class="fas fa-info-circle"></i>
        <h3>لا توجد دورات متاحة</h3>
        <p>ترقب المزيد من الدورات قريباً!</p>
      </div>
    `;
    return;
  }

  courses.forEach(course => {
    const progress = course.progress || 0;
    const courseCard = document.createElement('div');
    courseCard.className = 'course-card';
    courseCard.innerHTML = `
      <div class="course-image">
        <i class="fas fa-${course.icon || 'laptop-code'}"></i>
      </div>
      <div class="course-content">
        <h3 class="course-title">${course.title}</h3>
        <p class="course-description">${course.description}</p>
        <div class="course-meta">
          <span class="course-duration">
            <i class="fas fa-clock"></i>
            ${course.duration}
          </span>
          <span class="course-lessons">
            <i class="fas fa-book"></i>
            ${course.lessonCount} دروس
          </span>
        </div>
        <div class="course-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
        </div>
        <button class="course-cta" onclick="startCourse(${course.id})">
          ${progress > 0 ? 'متابعة الدورة' : 'ابدأ الدورة'}
        </button>
      </div>
    `;
    coursesGrid.appendChild(courseCard);
  });
  console.log(`Successfully loaded ${courses.length} courses at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
}

function startCourse(courseId) {
  console.log(`Starting course with ID: ${courseId} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  const course = courses.find(c => c.id === courseId);
  if (!course) {
    console.error(`Course with ID ${courseId} not found at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }

  const courseTitleEl = document.getElementById('course-title');
  const courseProgressEl = document.getElementById('course-progress');
  const progressTextEl = document.getElementById('progress-text');
  const lessonsListEl = document.getElementById('lessons-list');
  const lessonTitleEl = document.getElementById('lesson-title');
  const lessonDescriptionEl = document.getElementById('lesson-description');
  const videoPlayerEl = document.getElementById('video-player');
  const takeQuizBtn = document.getElementById('take-quiz-btn');
  const nextLessonBtn = document.getElementById('next-lesson-btn');

  if (!courseTitleEl || !courseProgressEl || !progressTextEl || !lessonsListEl || 
      !lessonTitleEl || !lessonDescriptionEl || !videoPlayerEl || !takeQuizBtn || !nextLessonBtn) {
    console.error('One or more course view elements not found at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }

  courseTitleEl.textContent = course.title;
  courseProgressEl.style.width = `${course.progress || 0}%`;
  progressTextEl.textContent = `${course.progress || 0}% مكتمل`;
  lessonsListEl.innerHTML = '';

  if (!course.lessons || course.lessons.length === 0) {
    console.warn(`No lessons found for course ID ${courseId} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    lessonsListEl.innerHTML = `
      <div class="no-results">
        <i class="fas fa-info-circle"></i>
        <p>لا توجد دروس متاحة لهذه الدورة حالياً.</p>
      </div>
    `;
    lessonTitleEl.textContent = 'مرحباً بك في الدورة';
    lessonDescriptionEl.textContent = 'لا توجد دروس لعرضها حالياً.';
    videoPlayerEl.innerHTML = `
      <div class="video-placeholder">
        <i class="fas fa-exclamation-circle"></i>
        <p>لا يوجد محتوى فيديو متاح.</p>
      </div>
    `;
    takeQuizBtn.style.display = 'none';
    nextLessonBtn.style.display = 'none';
    showView('course');
    return;
  }

  course.lessons.forEach((lesson, index) => {
    const lessonItem = document.createElement('button');
    lessonItem.className = `lesson-item ${lesson.completed ? 'completed' : ''} ${index === 0 ? 'active' : ''}`;
    lessonItem.innerHTML = `
      <i class="fas fa-${lesson.completed ? 'check-circle' : 'play-circle'}"></i>
      <div class="lesson-info">
        <h4>${lesson.title}</h4>
        <p>${lesson.duration}</p>
      </div>
    `;
    lessonItem.addEventListener('click', () => loadLesson(courseId, lesson.id));
    lessonsListEl.appendChild(lessonItem);
  });

  loadLesson(courseId, course.lessons[0].id);
  showView('course');
}

function loadLesson(courseId, lessonId) {
  console.log(`Loading lesson ${lessonId} for course ${courseId} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  const course = courses.find(c => c.id === courseId);
  if (!course) {
    console.error(`Course with ID ${courseId} not found at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }

  const lesson = course.lessons.find(l => l.id === lessonId);
  if (!lesson) {
    console.error(`Lesson with ID ${lessonId} not found at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }

  const lessonTitleEl = document.getElementById('lesson-title');
  const lessonDescriptionEl = document.getElementById('lesson-description');
  const videoPlayerEl = document.getElementById('video-player');
  const takeQuizBtn = document.getElementById('take-quiz-btn');
  const nextLessonBtn = document.getElementById('next-lesson-btn');
  const lessonItems = document.querySelectorAll('.lesson-item');

  if (!lessonTitleEl || !lessonDescriptionEl || !videoPlayerEl || !takeQuizBtn || !nextLessonBtn) {
    console.error('Lesson view elements not found at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }

  lessonTitleEl.textContent = lesson.title;
  lessonDescriptionEl.textContent = `تعلم ${lesson.title} في ${lesson.duration}. هذا الدرس جزء من رحلتك لتطوير مهاراتك الوظيفية.`;

  // Load video if available, otherwise show placeholder
  if (lesson.videoUrl) {
    videoPlayerEl.innerHTML = `
      <video id="lesson-video" controls width="100%" style="border-radius: 8px;">
        <source src="${lesson.videoUrl}" type="video/mp4">
        <p>متصفحك لا يدعم تشغيل الفيديو. حاول استخدام متصفح آخر أو تحقق من مسار الفيديو.</p>
      </video>
    `;
    const videoEl = videoPlayerEl.querySelector('#lesson-video');
    videoEl.addEventListener('error', () => {
      console.error(`Failed to load video for lesson ${lessonId}: ${lesson.videoUrl} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
      videoPlayerEl.innerHTML = `
        <div class="video-placeholder">
          <i class="fas fa-exclamation-circle"></i>
          <p>خطأ في تحميل الفيديو. تحقق من أن ملف الفيديو موجود في المسار الصحيح.</p>
        </div>
      `;
    });
    videoEl.addEventListener('play', () => {
      console.log(`Video started playing for lesson ${lessonId} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    });
    videoEl.addEventListener('ended', () => {
      console.log(`Video ended for lesson ${lessonId} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    });
  } else {
    videoPlayerEl.innerHTML = `
      <div class="video-placeholder">
        <i class="fas fa-play"></i>
        <p>محتوى ${lesson.title} (محاكاة فيديو)</p>
      </div>
    `;
  }
  takeQuizBtn.style.display = lesson.quizzes && lesson.quizzes.length > 0 ? 'block' : 'none';
  nextLessonBtn.style.display = course.lessons.findIndex(l => l.id === lessonId) < course.lessons.length - 1 ? 'block' : 'none';

  lessonItems.forEach(item => item.classList.remove('active'));
  const activeItem = Array.from(lessonItems).find(item => item.querySelector('h4').textContent === lesson.title);
  if (activeItem) {
    activeItem.classList.add('active');
  }

  localStorage.setItem('currentLesson', JSON.stringify({ courseId, lessonId }));
}

function nextLesson() {
  console.log('Navigating to next lesson at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  const activeLessonItem = document.querySelector('.lesson-item.active');
  if (!activeLessonItem) {
    console.error('No active lesson found at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }

  const lessonTitle = activeLessonItem.querySelector('h4').textContent;
  const course = courses.find(c => c.lessons.some(l => l.title === lessonTitle));
  if (!course) {
    console.error('Course not found for active lesson at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }

  const currentLessonIndex = course.lessons.findIndex(l => l.title === lessonTitle);
  if (currentLessonIndex < course.lessons.length - 1) {
    loadLesson(course.id, course.lessons[currentLessonIndex + 1].id);
  }
}

function startQuiz() {
  console.log('Starting quiz at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  const currentLesson = JSON.parse(localStorage.getItem('currentLesson'));
  if (!currentLesson) {
    console.error('No current lesson found for quiz at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }

  const course = courses.find(c => c.id === currentLesson.courseId);
  if (!course) {
    console.error(`Course with ID ${currentLesson.courseId} not found at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }

  const lesson = course.lessons.find(l => l.id === currentLesson.lessonId);
  if (!lesson || !lesson.quizzes || lesson.quizzes.length === 0) {
    console.error(`No quizzes found for lesson ${currentLesson.lessonId} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    alert('لا توجد اختبارات متاحة لهذا الدرس.');
    return;
  }

  window.initializeQuiz(lesson.quizzes);
  const quizModal = document.getElementById('quiz-modal');
  if (quizModal) {
    quizModal.classList.add('active');
  } else {
    console.error('Quiz modal not found at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  }
}

function initializeSearchAndFilter() {
  console.log('Initializing search and filter at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const levelFilter = document.getElementById('level-filter');
  const durationFilter = document.getElementById('duration-filter');

  if (!searchInput || !categoryFilter || !levelFilter || !durationFilter) {
    console.error('Search/filter elements not found at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }

  searchInput.addEventListener('input', () => console.log('Search input:', searchInput.value));
  categoryFilter.addEventListener('change', () => console.log('Category filter:', categoryFilter.value));
  levelFilter.addEventListener('change', () => console.log('Level filter:', levelFilter.value));
  durationFilter.addEventListener('change', () => console.log('Duration filter:', durationFilter.value));
}

function updateStats() {
  console.log('Updating stats at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  loadUserProgress();
}

function initializeApp() {
  console.log('Initializing app at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  updateAuthButton();
  loadUserProgress();
  setupNavigation();
  initializeSearchAndFilter();
  loadCourses();
  showView('dashboard');
}


document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  if (localStorage.getItem('isLoggedIn')) {
    initializeApp();
  } else {
    console.log('User not logged in, redirecting to /login');
    window.location.href = '/login';
  }
});