import React, { useState } from 'react';
import { Chrome, Mail, LockKeyhole } from 'lucide-react';
import { useAuth } from './AuthContext.tsx';
import { isFirebaseConfigured } from '../config/firebase.ts';

export function AuthScreen() {
  const { currentUser, role, setRole, signInWithEmail, createAccount, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(role || 'farmer');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isRoleSetup = Boolean(currentUser && !role);

  const messageFor = (authError: any) => ({
    'auth/invalid-credential': 'The email or password is incorrect.',
    'auth/email-already-in-use': 'An account already exists for this email.',
    'auth/weak-password': 'Use a password with at least 6 characters.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
  }[authError?.code] || 'Authentication failed. Please try again.');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (isRoleSetup) {
        setRole(selectedRole);
        return;
      }
      if (mode === 'signin') await signInWithEmail(email, password);
      else {
        await createAccount(email, password);
        await setRole(selectedRole);
      }
    } catch (authError) {
      setError(messageFor(authError));
    } finally {
      setBusy(false);
    }
  };

  const googleSignIn = async () => {
    setBusy(true);
    setError('');
    try {
      await signInWithGoogle();
      if (mode === 'signup') await setRole(selectedRole);
    } catch (authError) {
      setError(messageFor(authError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-xl p-7 sm:p-9">
        <p className="text-xs font-label-micro tracking-[0.2em] uppercase text-secondary-fixed font-bold">SHASYA VIKREYA // SECURE ACCESS</p>
        <h1 className="font-headline-lg text-3xl font-extrabold text-primary mt-3">Welcome back.</h1>
        <p className="text-sm text-on-surface-variant mt-2 mb-7">{isRoleSetup ? 'Choose the workspace that matches your work.' : 'Sign in to access the farm-to-buyer clearinghouse.'}</p>
        {!isFirebaseConfigured && <p className="rounded-xl bg-error/10 border border-error/30 text-error text-sm p-3 mb-4">Firebase web configuration is missing from the frontend environment.</p>}
        <form onSubmit={submit} className="space-y-4">
          {(mode === 'signup' || isRoleSetup) && <label className="block text-xs font-bold text-on-surface-variant">Your role
            <select className="w-full mt-1 rounded-xl bg-surface-container border border-outline-variant/50 py-3 px-3 text-sm outline-none focus:border-secondary-fixed" value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}>
              <option value="farmer">Farmer / Producer</option>
              <option value="fpo">FPO / Collective</option>
              <option value="buyer">Bulk Buyer / HoReCa</option>
              <option value="transporter">Transporter / Fleet</option>
              <option value="consumer">Direct Retail Consumer</option>
              <option value="platform">Platform Operations</option>
            </select>
          </label>}
          {!isRoleSetup && <>
          <label className="block text-xs font-bold text-on-surface-variant">Email address
            <span className="relative block mt-1"><Mail className="absolute left-3 top-3.5 w-4 h-4 text-outline" /><input className="w-full rounded-xl bg-surface-container border border-outline-variant/50 py-3 pl-10 pr-3 text-sm outline-none focus:border-secondary-fixed" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></span>
          </label>
          <label className="block text-xs font-bold text-on-surface-variant">Password
            <span className="relative block mt-1"><LockKeyhole className="absolute left-3 top-3.5 w-4 h-4 text-outline" /><input className="w-full rounded-xl bg-surface-container border border-outline-variant/50 py-3 pl-10 pr-3 text-sm outline-none focus:border-secondary-fixed" type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} /></span>
          </label>
          </>}
          {error && <p role="alert" className="text-sm text-error">{error}</p>}
          <button className="w-full rounded-xl bg-secondary-fixed text-on-secondary-fixed py-3 text-sm font-bold disabled:opacity-50" disabled={busy || (!isRoleSetup && !isFirebaseConfigured)} type="submit">{isRoleSetup ? 'Continue to workspace' : mode === 'signin' ? 'Sign in' : 'Create account'}</button>
        </form>
        {!isRoleSetup && <>
          <div className="flex items-center gap-3 my-5 text-xs text-outline"><span className="h-px bg-outline-variant/40 flex-1" />OR<span className="h-px bg-outline-variant/40 flex-1" /></div>
          <button className="w-full rounded-xl border border-outline-variant/60 py-3 text-sm font-bold text-primary flex items-center justify-center gap-2 hover:bg-surface-container disabled:opacity-50" disabled={busy || !isFirebaseConfigured} onClick={googleSignIn} type="button"><Chrome className="w-4 h-4" /> Continue with Google</button>
          <button className="w-full mt-5 text-xs text-secondary-fixed font-bold" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }} type="button">{mode === 'signin' ? 'New to Shasya Vikreya? Create an account' : 'Already have an account? Sign in'}</button>
        </>}
      </section>
    </main>
  );
}
