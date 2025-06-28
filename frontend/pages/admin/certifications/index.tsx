import AdminCertifications from '@/components/AdminCertifications'

import { useState } from 'react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return <AdminCertifications isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />;
}