import LoginModal from '../components/LoginModal';

export default function Login({ setIsLoggedIn }) {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--gray-50)' }}>
      <LoginModal setIsLoggedIn={setIsLoggedIn} />
    </main>
  );
}