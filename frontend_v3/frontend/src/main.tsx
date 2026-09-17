import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from './components/AuthContext.tsx';

declare global {
  interface Window {
    __krishiInstallPrompt?: any;
  }
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  window.__krishiInstallPrompt = event;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
