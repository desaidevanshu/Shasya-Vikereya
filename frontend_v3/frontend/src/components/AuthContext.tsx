import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface AuthContextValue {
  currentUser: User | null;
  role: string | null;
  loading: boolean;
  setRole: (role: string | null) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  createAccount: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, async (user) => {
    setCurrentUser(user);
    if (!user) {
      setRoleState(null);
      setLoading(false);
      return;
    }
    const pendingRole = localStorage.getItem('krishiclear_pending_role');
    const profileRef = doc(db, 'userProfiles', user.uid);
    let firestoreRole: string | undefined;
    try {
      const profile = await getDoc(profileRef);
      firestoreRole = profile.exists() ? profile.data().role as string | undefined : undefined;
    } catch {
      firestoreRole = undefined;
    }
    const assignedRole = firestoreRole || localStorage.getItem(`krishiclear_role_${user.uid}`) || pendingRole || null;
    if (!firestoreRole && assignedRole) {
      try {
        await setDoc(profileRef, { uid: user.uid, email: user.email || '', displayName: user.displayName || '', role: assignedRole, roleAssignedAt: serverTimestamp() }, { merge: true });
      } catch {
        // Keep the UID-scoped local value until Firestore rules are configured.
      }
      localStorage.setItem(`krishiclear_role_${user.uid}`, assignedRole);
      localStorage.removeItem('krishiclear_pending_role');
    }
    setRoleState(assignedRole);
    setLoading(false);
  }), []);

  const setRole = async (nextRole: string | null) => {
    if (!nextRole) return;
    setRoleState(nextRole);
    if (!currentUser) {
      localStorage.setItem('krishiclear_pending_role', nextRole);
      return;
    }
    const profileRef = doc(db, 'userProfiles', currentUser.uid);
    try {
      const profile = await getDoc(profileRef);
      if (profile.exists() && profile.data().role) {
        setRoleState(profile.data().role as string);
        return;
      }
      await setDoc(profileRef, { uid: currentUser.uid, email: currentUser.email || '', role: nextRole, roleAssignedAt: serverTimestamp() }, { merge: true });
    } catch {
      // The local UID-scoped role remains usable until Firestore rules are configured.
    }
    localStorage.setItem(`krishiclear_role_${currentUser.uid}`, nextRole);
  };

  const value: AuthContextValue = {
    currentUser,
    role,
    loading,
    setRole,
    signInWithEmail: (email, password) => signInWithEmailAndPassword(auth, email, password).then(() => undefined),
    createAccount: (email, password) => createUserWithEmailAndPassword(auth, email, password).then(() => undefined),
    signInWithGoogle: () => signInWithPopup(auth, new GoogleAuthProvider()).then(() => undefined),
    signOutUser: () => signOut(auth),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
