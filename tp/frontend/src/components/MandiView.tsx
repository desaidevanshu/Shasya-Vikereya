import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { translations, type Language } from '../translations';
import { 
  TrendingUp, 
  MapPin, 
  Clock, 
  Calendar, 
  ArrowUpRight, 
  Search,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Database,
  Compass,
  Sparkles,
  Mic
} from 'lucide-react';

interface MandiViewProps {
  lang: Language;
  onOpenVoice: () => void;
  onRunClearing: () => void;
}

export const MandiView: React.FC<MandiViewProps> = ({ lang, onOpenVoice, onRunClearing }) => {
  const t = translations[lang];
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [overview, setOverview] = useState<any>(null);
  const [corridor, setCorridor] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = async (crop: string) => {
    setLoading(true);
    try {
      const [ov, corr, fc] = await Promise.all([
        api.getMandiOverview(),
        api.getPriceCorridor(crop),
        api.getForecast(crop)
      ]);
      setOverview(ov);
      setCorridor(corr);
      setForecast(fc);
    } catch (err) {
      console.error("Failed to load mandi data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedCrop);
  }, [selectedCrop]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Header Bar */}
      <div className="panel" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="chip chip-gold" style={{ fontSize: '0.7rem' }}>{t.role_fpo.toUpperCase()} DASHBOARD</span>
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {t.app_title}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t.app_tagline}</p>
          </div>
          
          {/* Step 1: Voice AI trigger */}
          <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '1.1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={onOpenVoice}>
            <Mic size={20} />
            {lang === 'mr' ? 'थेट बोला (Voice AI)' : lang === 'hi' ? 'सीधे बोलें (Voice AI)' : 'Speak to Voice AI'}
          </button>
        </div>
      </div>

      {/* 2. Commodity Selector Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px'
      }}>
        {['Tomato', 'Onion', 'Bhindi(Ladies Finger)', 'Brinjal', 'Cabbage', 'Cauliflower', 'Green Chilli', 'Potato'].map(crop => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            style={{
              padding: '7px 16px',
              fontSize: '0.82rem',
              fontWeight: selectedCrop === crop ? 700 : 500,
              borderRadius: '8px',
              border: '1px solid',
              borderColor: selectedCrop === crop ? 'var(--brand-gold)' : 'var(--border-subtle)',
              background: selectedCrop === crop ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.02)',
              color: selectedCrop === crop ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {crop}
          </button>
        ))}
      </div>

      {/* 3. Valuation Band (Step 2: Review Prices) */}
      {corridor && (
        <div className="panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <span className="chip chip-gold" style={{ fontSize: '0.7rem' }}>STEP 2: REVIEW PRICES</span>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '4px', color: 'var(--text-primary)' }}>
                {t.apmc_benchmark} vs {t.role_clearing}
              </h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.apmc_benchmark}</div>
              <div className="num" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                ₹{corridor.modal_fair_price_per_kg?.toFixed(2)}
                <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)' }}>/kg</span>
              </div>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '20px', borderRadius: '12px', border: '1px solid var(--brand-gold)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--brand-gold)' }}>{t.farmer_realization}</div>
              <div className="num" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-gold)', marginTop: '4px' }}>
                ₹{corridor.buyer_ceiling_per_kg?.toFixed(2)}
                <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--brand-gold)' }}>/kg</span>
              </div>
            </div>
          </div>
          
          {/* Step 3: Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
             <button className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={onRunClearing}>
               <Sparkles size={20} />
               {t.btn_solve_clearing}
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
