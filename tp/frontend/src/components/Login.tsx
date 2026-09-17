import React, { useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from './AuthContext';

interface LoginProps {
  lang: string;
}

export function Login({ lang }: LoginProps) {
  const { setRole } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (role: string) => {
    setLoading(true);
    try {
      // For demo purposes, we use anonymous auth.
      await signInAnonymously(auth);
      setRole(role);
    } catch (error) {
      console.error("Firebase Login failed (missing config?). Falling back to mock login.", error);
      // Fallback for hackathon demo if Firebase isn't configured yet
      setRole(role);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <h2>{lang === 'en' ? 'Welcome to KrishiClear' : 'कृषीक्लियर मध्ये आपले स्वागत आहे'}</h2>
      <p style={{ color: 'var(--text-muted)' }}>{lang === 'en' ? 'Select your role to continue' : 'पुढे जाण्यासाठी आपली भूमिका निवडा'}</p>
      
      <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn-primary" onClick={() => handleLogin('FARMER')} disabled={loading}>
          Farmer / शेतकरी
        </button>
        <button className="btn-secondary" onClick={() => handleLogin('FPO')} disabled={loading}>
          FPO / शेतकरी उत्पादक कंपनी
        </button>
        <button className="btn-accent" onClick={() => handleLogin('BUYER')} disabled={loading}>
          Buyer / खरेदीदार
        </button>
        <button className="btn-danger" onClick={() => handleLogin('ADMIN')} disabled={loading}>
          Admin / Ops
        </button>
      </div>
    </div>
  );
}
