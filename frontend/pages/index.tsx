import Home from '@/components/Home';

import { useState } from 'react';

export default function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />;
}
