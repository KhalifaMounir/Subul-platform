import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Modal.module.css';
import { submitQuiz } from '../utils/course';

export default function QuizModal({
  currentQuiz,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  userAnswers,
  setUserAnswers,
  setShowQuizModal,
  setShowResultsModal,
  setScore,
  courseId,
}) {
  const selectOption = (option) => {
    console.log(`Selected option: ${option} at`, new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = option;
      return newAnswers;
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const closeQuiz = () => {
    console.log('Closing quiz modal at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    setShowQuizModal(false);
  };

  const handleSubmit = () => {
    submitQuiz(currentQuiz, userAnswers, setScore, setShowQuizModal, setShowResultsModal, courseId);
  };

  const question = currentQuiz[currentQuestionIndex];

  return (
    <div className={`${styles.modal} ${styles.active}`}>
      <div className={styles.modalContent}>
        <div className={styles.quizHeader}>
          <h2>اختبار الدرس</h2>
          <button className={styles.closeBtn} onClick={closeQuiz}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className={styles.quizBody}>
          <div className={styles.quizProgress}>
            <div className={styles.quizProgressBar}>
              <div
                className={styles.quizProgressFill}
                style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.length) * 100}%` }}
              ></div>
            </div>
            <span className={styles.quizCounter}>
              السؤال {currentQuestionIndex + 1} من {currentQuiz.length}
            </span>
          </div>
          <div className={styles.questionContainer}>
            <h3 className={styles.questionText}>{question.question}</h3>
            <div className={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <button
                  key={index}
                  className={`${styles.option} ${userAnswers[currentQuestionIndex] === option ? styles.selected : ''}`}
                  onClick={() => selectOption(option)}
                  disabled={userAnswers[currentQuestionIndex] !== undefined}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.quizActions}>
            <button
              className={styles.btnSecondary}
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              السابق
            </button>
            {currentQuestionIndex < currentQuiz.length - 1 ? (
              <button className={styles.btnPrimary} onClick={nextQuestion}>
                السؤال التالي
              </button>
            ) : (
              <button className={styles.btnPrimary} onClick={handleSubmit}>
                إرسال الاختبار
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}