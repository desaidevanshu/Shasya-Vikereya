import React, { useEffect, useState } from 'react';
import { api } from '../api';

export const MandiTicker: React.FC = () => {
  const [tickerItems, setTickerItems] = useState<any[]>([
    { market: "Lasalgaon (Niphad)", commodity: "Onion", price: 43.0, trend: "up", diff: "+₹4.2" },
    { market: "Ghoti (Nashik)", commodity: "Tomato", price: 20.0, trend: "up", diff: "+₹1.5" },
    { market: "APMC Panvel (MMR)", commodity: "Tomato", price: 25.0, trend: "up", diff: "+₹3.0" },
    { market: "Pune (Manjri)", commodity: "Tomato", price: 15.0, trend: "down", diff: "-₹1.0" },
    { market: "Vadgaonpeth (Kolhapur)", commodity: "Bhindi", price: 20.0, trend: "up", diff: "+₹2.0" },
    { market: "Vita (Sangli)", commodity: "Onion", price: 50.0, trend: "up", diff: "+₹6.0" },
    { market: "APMC Nagpur", commodity: "Tomato", price: 23.0, trend: "neutral", diff: "0.0" },
    { market: "Pathardi (Ahilyanagar)", commodity: "Jowar", price: 25.5, trend: "up", diff: "+₹0.5" },
    { market: "Shrirampur", commodity: "Green Chilli", price: 17.5, trend: "down", diff: "-₹0.8" }
  ]);

  useEffect(() => {
    let cancelled = false;

    const loadLivePrices = async () => {
      try {
        const res: any = await api.getMandiOverview();
        const liveItems = (res?.mandis || [])
          .map((m: any) => ({
            market: `${m.name || m.market || 'Maharashtra Mandi'} (${m.district || 'Maharashtra'})`,
            commodity: m.commodity || 'Tomato',
            price: Number(m.modal_price_per_kg ?? (Number(m.modal_price_per_qtl || 0) / 100)),
            trend: m.is_terminal_corridor ? 'up' : 'neutral',
            diff: m.is_terminal_corridor ? 'MMR Premium' : 'Origin Farm'
          }))
          .filter((item: any) => Number.isFinite(item.price) && item.price > 0)
          .slice(0, 12);

        if (!cancelled && liveItems.length > 0) setTickerItems(liveItems);
      } catch {
        // Keep the last successful feed or the initial demo prices visible.
      }
    };

    loadLivePrices();
    const refreshTimer = window.setInterval(loadLivePrices, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
    };
  }, []);

  // Double items for smooth continuous loop
  const displayItems = [...tickerItems, ...tickerItems];

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      background: '#0b111e',
      borderTop: '1px solid rgba(148, 163, 184, 0.16)',
      borderBottom: '1px solid rgba(148, 163, 184, 0.22)',
      minHeight: '36px',
      padding: '7px 0',
      whiteSpace: 'nowrap',
      userSelect: 'none',
      position: 'relative',
      zIndex: 40
    }}
    className="ticker-wrap"
    title="Live APMC Ticker (Hover to pause)"
    >
      <div className="ticker-track" style={{ display: 'inline-flex', gap: '36px', width: 'max-content' }}>
        {displayItems.map((item, idx) => (
          <div key={idx} className="ticker-item" style={{ opacity: 0.85 }}>
            <span style={{ color: '#64748b', fontSize: '0.6rem' }}>●</span>
            <span style={{ fontWeight: 600, color: '#cbd5e1' }}>{item.market}</span>
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>{item.commodity}</span>
            <span className="num" style={{ fontWeight: 600, color: '#f8fafc' }}>
              ₹{Number(item.price).toFixed(2)}/kg
            </span>
            <span style={{
              fontSize: '0.66rem',
              fontWeight: 600,
              padding: '1px 5px',
              borderRadius: '3px',
              background: item.trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              color: item.trend === 'up' ? '#34d399' : item.trend === 'down' ? '#fb7185' : '#94a3b8'
            }}>
              {item.diff}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
