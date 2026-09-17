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
    api.getMandiOverview().then((res: any) => {
      if (res?.mandis && res.mandis.length > 0) {
        const mapped = res.mandis.slice(0, 12).map((m: any) => ({
          market: `${m.name} (${m.district})`,
          commodity: m.commodity,
          price: m.modal_price_per_kg || (m.modal_price_per_qtl / 100),
          trend: m.is_terminal_corridor ? "up" : "neutral",
          diff: m.is_terminal_corridor ? "MMR Premium" : "Origin Farm"
        }));
        setTickerItems(mapped);
      }
    }).catch(() => {});
  }, []);

  // Double items for smooth continuous loop
  const displayItems = [...tickerItems, ...tickerItems];

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      background: 'rgba(5, 8, 15, 0.95)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '4px 0',
      whiteSpace: 'nowrap',
      userSelect: 'none'
    }}
    className="ticker-wrap"
    title="Live APMC Ticker (Hover to pause)"
    >
      <div className="ticker-track" style={{ display: 'inline-flex', gap: '36px' }}>
        {displayItems.map((item, idx) => (
          <div key={idx} className="ticker-item" style={{ opacity: 0.85 }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '0.6rem' }}>●</span>
            <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{item.market}</span>
            <span style={{ color: 'var(--brand-gold)', fontWeight: 600 }}>{item.commodity}</span>
            <span className="num" style={{ fontWeight: 600, color: '#f8fafc' }}>
              ₹{item.price.toFixed(2)}/kg
            </span>
            <span style={{
              fontSize: '0.66rem',
              fontWeight: 600,
              padding: '1px 5px',
              borderRadius: '3px',
              background: item.trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              color: item.trend === 'up' ? '#34d399' : item.trend === 'down' ? '#fb7185' : 'var(--text-muted)'
            }}>
              {item.diff}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
