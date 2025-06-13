let currentQuiz = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;

function initializeQuiz(quizzes) {
  console.log('Initializing quiz with', quizzes.length, 'questions at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  if (!Array.isArray(quizzes) || quizzes.length === 0) {
    console.error('Invalid or empty quizzes array at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }
  currentQuiz = quizzes;
  currentQuestionIndex = 0;
  userAnswers = [];
  score = 0;
  loadQuestion();
}

function loadQuestion() {
  console.log(`Loading question ${currentQuestionIndex + 1} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  const quizTitleEl = document.getElementById('quiz-title');
  const questionTextEl = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const quizProgressEl = document.getElementById('quiz-progress');
  const quizCounterEl = document.getElementById('quiz-counter');
  const prevQuestionBtn = document.getElementById('prev-question-btn');
  const nextQuestionBtn = document.getElementById('next-question-btn');
  const submitQuizBtn = document.getElementById('submit-quiz-btn');

  if (!quizTitleEl || !questionTextEl || !optionsContainer || !quizProgressEl || !quizCounterEl || 
      !prevQuestionBtn || !nextQuestionBtn || !submitQuizBtn) {
    console.error('Quiz modal elements not found at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }

  const question = currentQuiz[currentQuestionIndex];
  quizTitleEl.textContent = 'اختبار الدرس';
  questionTextEl.textContent = question.question;
  optionsContainer.innerHTML = '';

  question.options.forEach((option, index) => {
    const optionEl = document.createElement('button');
    optionEl.className = 'option-btn';
    optionEl.textContent = option;
    optionEl.onclick = () => selectOption(option);
    optionsContainer.appendChild(optionEl);
  });

  quizProgressEl.style.width = `${((currentQuestionIndex + 1) / currentQuiz.length) * 100}%`;
  quizCounterEl.textContent = `السؤال ${currentQuestionIndex + 1} من ${currentQuiz.length}`;
  prevQuestionBtn.disabled = currentQuestionIndex === 0;
  nextQuestionBtn.style.display = currentQuestionIndex < currentQuiz.length - 1 ? 'block' : 'none';
  submitQuizBtn.style.display = currentQuestionIndex === currentQuiz.length - 1 ? 'block' : 'none';
}

function selectOption(option) {
  console.log(`Selected option: ${option} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  userAnswers[currentQuestionIndex] = option;
  const optionButtons = document.querySelectorAll('.option-btn');
  optionButtons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === option) {
      btn.classList.add('selected');
    }
  });
}

function nextQuestion() {
  console.log('Moving to next question at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  if (currentQuestionIndex < currentQuiz.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  }
}

function prevQuestion() {
  console.log('Moving to previous question at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
}

function submitQuiz() {
  console.log('Submitting quiz at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  score = currentQuiz.reduce((total, question, index) => {
    return total + (userAnswers[index] === question.correctAnswer ? 1 : 0);
  }, 0);
  const percentage = Math.round((score / currentQuiz.length) * 100);

  const finalScoreEl = document.getElementById('final-score');
  const scoreMessageEl = document.getElementById('score-message');
  const passStatusEl = document.getElementById('pass-status');
  const getCertificateBtn = document.getElementById('get-certificate-btn');
  const resultsModal = document.getElementById('results-modal');
  const quizModal = document.getElementById('quiz-modal');

  if (!finalScoreEl || !scoreMessageEl || !passStatusEl || !getCertificateBtn || !resultsModal || !quizModal) {
    console.error('Results modal elements not found at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    return;
  }

  finalScoreEl.textContent = `${percentage}%`;
  scoreMessageEl.textContent = percentage >= 70 ? 'عمل رائع!' : 'حاول مرة أخرى!';
  passStatusEl.textContent = percentage >= 70 ? 'لقد نجحت!' : 'لم تجتز الاختبار.';
  getCertificateBtn.style.display = percentage >= 70 ? 'block' : 'none';

  quizModal.classList.remove('active');
  resultsModal.classList.add('active');

  const userData = JSON.parse(localStorage.getItem('userData')) || { quizScores: [] };
  userData.quizScores.push(percentage);
  localStorage.setItem('userData', JSON.stringify(userData));
}

function closeQuiz() {
  console.log('Closing quiz modal at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  const quizModal = document.getElementById('quiz-modal');
  if (quizModal) {
    quizModal.classList.remove('active');
  }
}

function closeResults() {
  console.log('Closing results modal at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  const resultsModal = document.getElementById('results-modal');
  if (resultsModal) {
    resultsModal.classList.remove('active');
  }
}

function retakeQuiz() {
  console.log('Retaking quiz at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
  closeResults();
  initializeQuiz(currentQuiz);
  const quizModal = document.getElementById('quiz-modal');
  if (quizModal) {
    quizModal.classList.add('active');
  }
}

function getCertificate() {
  console.log('Requesting certificate at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
}