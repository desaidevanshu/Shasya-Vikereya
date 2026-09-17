import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  role: string | null;
  setRole: (role: string) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  role: null,
  setRole: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch custom claim or from Firestore if implemented.
        // For hackathon/demo purposes without a real Firebase, we rely on setRole from Login.
        // If they just refreshed, default to something or re-fetch from API.
        const storedRole = localStorage.getItem('krishiclear_role') || 'FARMER';
        setRole(storedRole);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSetRole = (r: string) => {
    setRole(r);
    localStorage.setItem('krishiclear_role', r);
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, setRole: handleSetRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
