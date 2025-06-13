export function handleAuth(setIsLoggedIn, router) {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem('isLoggedIn')) {
    console.log('Signing out at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    router.push('/login');
  } else {
    console.log('Redirecting to login at', new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    router.push('/login');
  }
}

export function getUserData() {
  if (typeof window === 'undefined') return { completedCourses: [], totalHours: 0, quizScores: {}, certificates: [] };
  return JSON.parse(localStorage.getItem('userData')) || {
    completedCourses: [],
    totalHours: 0,
    quizScores: {},
    certificates: [],
  };
}

export function saveUserData(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('userData', JSON.stringify(data));
}