import Home from '@/components/Home';

export default function LoginPage({ isLoggedIn, setIsLoggedIn }: { isLoggedIn: boolean; setIsLoggedIn: (value: boolean) => void }) {
  return <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />;
}