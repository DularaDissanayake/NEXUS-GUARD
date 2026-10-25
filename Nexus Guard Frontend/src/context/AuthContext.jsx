import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContextValue';
const storageKey = 'nexus-guard-user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(storageKey);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(storageKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [user]);

  const signIn = (email) => {
    const name = email.split('@')[0].replace(/[._-]+/g, ' ');
    setUser({
      email,
      name: name.replace(/\b\w/g, (letter) => letter.toUpperCase()),
    });
  };

  const signUp = (name, email) => {
    setUser({ name: name.trim(), email: email.trim().toLowerCase() });
  };

  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}