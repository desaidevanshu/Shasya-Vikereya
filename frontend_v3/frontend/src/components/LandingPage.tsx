import React, { useEffect, useState } from 'react';
import { ArrowRight, BarChart3, Download, Languages, MapPinned, ShoppingBasket, Smartphone, Truck } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches);
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    if (window.__krishiInstallPrompt) setInstallPrompt(window.__krishiInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) {
      setShowInstallHelp(true);
      return;
    }
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    window.__krishiInstallPrompt = undefined;
  };

  return (
    <main className="min-h-screen bg-surface text-on-surface overflow-hidden">
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5"><img src="/logo%20with%20name.png" alt="Shasya Vikreya" className="h-12 w-auto object-contain" /></div>
        <div className="flex items-center gap-2">
          {!isInstalled && <button onClick={() => void install()} className="rounded-xl border border-secondary-fixed/50 text-secondary-fixed px-3 py-2 text-xs font-bold flex items-center gap-2"><Download className="w-4 h-4" />Install app</button>}
          <button onClick={onStart} className="rounded-xl bg-primary text-on-primary px-4 py-2 text-xs font-bold">Sign in <ArrowRight className="inline w-3.5 h-3.5 ml-1" /></button>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-16 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-secondary-fixed font-bold mb-5">DIRECT FARM-GATE CLEARINGHOUSE</p>
          <h1 className="font-headline-lg text-4xl sm:text-6xl font-extrabold tracking-tight text-primary leading-[1.05]">Better prices begin with a clearer route.</h1>
          <p className="mt-6 text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">Shasya Vikreya connects farmers and FPOs directly with households, retailers, and bulk buyers. Demand, payment, cold-chain logistics, and settlement move through one transparent workspace.</p>
          <div className="mt-8 flex flex-wrap gap-3"><button onClick={onStart} className="rounded-xl bg-secondary-fixed text-on-secondary-fixed px-5 py-3 text-sm font-bold">Enter the marketplace <ArrowRight className="inline w-4 h-4 ml-2" /></button>{!isInstalled && <button onClick={() => void install()} className="rounded-xl border border-outline-variant/60 px-5 py-3 text-sm font-bold text-primary"><Download className="inline w-4 h-4 mr-2" />Install on this device</button>}</div>
          {showInstallHelp && !isInstalled && <div className="mt-4 rounded-2xl border border-secondary-fixed/40 bg-secondary-fixed/10 p-4 text-sm text-on-surface-variant"><div className="flex items-start justify-between gap-3"><div><strong className="text-primary">Install Shasya Vikreya</strong><p className="mt-1">{isIos ? 'In Safari, tap Share, then Add to Home Screen.' : 'Open your browser menu and choose Install app or Add to Home screen.'}</p></div><button onClick={() => setShowInstallHelp(false)} aria-label="Close install instructions" className="text-outline">×</button></div></div>}
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-on-surface-variant"><span>✓ Direct buyer discovery</span><span>✓ Transparent price and quantity</span><span>✓ Smart dispatch routes</span></div>
        </div>
        <div className="relative rounded-3xl bg-surface-container-low border border-outline-variant/40 p-5 sm:p-7 shadow-xl">
          <div className="flex items-center justify-between border-b border-outline-variant/25 pb-4"><div><p className="text-[10px] uppercase tracking-[0.18em] text-outline font-bold">LIVE CLEARING SNAPSHOT</p><p className="text-sm font-bold text-primary mt-1">Nashik → Mumbai corridor</p></div><span className="text-xs text-secondary-fixed font-bold">ACTIVE</span></div>
          <div className="grid grid-cols-2 gap-3 mt-5"><div className="rounded-2xl bg-surface-container p-4"><p className="text-[10px] text-outline uppercase">Farmer uplift</p><p className="text-2xl font-extrabold text-secondary-fixed mt-1">+26.4%</p><p className="text-[11px] text-on-surface-variant mt-1">after direct clearing</p></div><div className="rounded-2xl bg-surface-container p-4"><p className="text-[10px] text-outline uppercase">Spoilage target</p><p className="text-2xl font-extrabold text-primary mt-1">&lt;1.2%</p><p className="text-[11px] text-on-surface-variant mt-1">with cold-chain routing</p></div></div>
          <div className="mt-3 rounded-2xl bg-surface-container p-4 space-y-3 text-xs"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-on-surface-variant"><ShoppingBasket className="w-4 h-4 text-secondary-fixed" />Buyer requirement</span><strong className="text-primary">12,000 kg onion</strong></div><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-on-surface-variant"><MapPinned className="w-4 h-4 text-secondary-fixed" />Optimized dispatch</span><strong className="text-secondary-fixed">Samruddhi Route B</strong></div><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-on-surface-variant"><Truck className="w-4 h-4 text-secondary-fixed" />Settlement</span><strong className="text-secondary-fixed">Payment verified</strong></div></div>
        </div>
      </section>

      <section className="bg-surface-container-low border-y border-outline-variant/25"><div className="max-w-7xl mx-auto px-5 sm:px-8 py-14"><div className="grid md:grid-cols-3 gap-5"><div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/25"><ShoppingBasket className="w-5 h-5 text-secondary-fixed" /><h2 className="font-bold text-primary mt-4">One visible demand board</h2><p className="text-sm text-on-surface-variant mt-2 leading-relaxed">Buyers publish the crop, grade, quantity, destination, and price. Farmers and FPOs see what is genuinely needed before listing.</p></div><div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/25"><BarChart3 className="w-5 h-5 text-secondary-fixed" /><h2 className="font-bold text-primary mt-4">AI-informed decisions</h2><p className="text-sm text-on-surface-variant mt-2 leading-relaxed">Demand forecasting, mandi signals, farmer realization, and route economics help the network plan with evidence instead of guesswork.</p></div><div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/25"><Truck className="w-5 h-5 text-secondary-fixed" /><h2 className="font-bold text-primary mt-4">From payment to delivery</h2><p className="text-sm text-on-surface-variant mt-2 leading-relaxed">Verified orders become dispatch work. Transporters receive paid requirements and compare cold-chain routes, costs, time, and risk.</p></div></div></div></section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid md:grid-cols-2 gap-8 items-start"><div><p className="text-xs uppercase tracking-[0.18em] text-secondary-fixed font-bold">BUILT FOR INDIA'S FIELD REALITY</p><h2 className="font-headline-sm text-3xl font-extrabold text-primary mt-3">Simple enough for a farmer. Detailed enough for a network.</h2><p className="text-sm text-on-surface-variant mt-4 leading-relaxed">Use the role that matches your work: farmer, FPO, buyer, transporter, consumer, or platform operations. Every workspace keeps the next useful action close and the economics visible.</p></div><div className="grid grid-cols-2 gap-3"><div className="p-4 rounded-2xl border border-outline-variant/30"><Smartphone className="w-5 h-5 text-secondary-fixed" /><p className="font-bold text-primary mt-3">PWA-ready</p><p className="text-xs text-on-surface-variant mt-1">Install and return like an app.</p></div><div className="p-4 rounded-2xl border border-outline-variant/30"><Languages className="w-5 h-5 text-secondary-fixed" /><p className="font-bold text-primary mt-3">Multilingual</p><p className="text-xs text-on-surface-variant mt-1">English, Hindi, Marathi, plus translation support.</p></div><div className="p-4 rounded-2xl border border-outline-variant/30"><BarChart3 className="w-5 h-5 text-secondary-fixed" /><p className="font-bold text-primary mt-3">Transparent stats</p><p className="text-xs text-on-surface-variant mt-1">Prices, uplift, quantity, and spoilage in view.</p></div><div className="p-4 rounded-2xl border border-outline-variant/30"><MapPinned className="w-5 h-5 text-secondary-fixed" /><p className="font-bold text-primary mt-3">Smart routing</p><p className="text-xs text-on-surface-variant mt-1">Route choice tied to delivered economics.</p></div></div></section>

      <footer className="border-t border-outline-variant/25 px-5 sm:px-8 py-8 text-center text-xs text-on-surface-variant">Shasya Vikreya · Direct farm-to-buyer clearing, intelligent logistics, and fairer realization.</footer>
    </main>
  );
}
