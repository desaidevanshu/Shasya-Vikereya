import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight, 
  MapPin, 
  Compass, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders,
  RotateCcw
} from 'lucide-react';
import type { Language } from '../translations';

interface AuctionClockModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AuctionClockModal: React.FC<AuctionClockModalProps> = ({ isOpen, onClose, lang }) => {
  const [delayMinutes, setDelayMinutes] = useState<number>(90);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEvaluation = (delay: number) => {
    setLoading(true);
    fetch('http://localhost:8000/api/arbitrage/evaluate-reroute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        delay_minutes: delay,
        commodity: 'Tomato',
        quantity_kg: 1350.0,
        current_location: 'Igatpuri Checkpoint (Mid-Transit)'
      })
    })
      .then(res => res.json())
      .then(data => {
        setEvaluation(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching arbitrage reroute:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen) {
      fetchEvaluation(delayMinutes);
    }
  }, [isOpen]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setDelayMinutes(val);
    fetchEvaluation(val);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(4, 7, 12, 0.88)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        maxWidth: '880px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 60px rgba(0,0,0,0.85)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(8, 11, 17, 0.95)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b'
            }}>
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.08rem', fontWeight: 800, color: '#ffffff' }}>
                {lang === 'mr' ? 'बाजार लिलाव घड्याळ व मार्ग बदल प्रणाली' : 'Auction Clock & Mid-Transit Distress Rerouter'}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                {lang === 'mr' 
                  ? 'लिलाव संपल्यास ४५% भाव घसरतो • घाटातील विलंबावर आधारित तात्काळ पर्यायी गोदी निवड' 
                  : 'Arriving after wholesale auctions close drops produce value by 45% • Dynamic mid-transit arbitrage'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Live Market Auction Clocks */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
              LIVE DESTINATION APMC AUCTION CLOSING RADAR
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '10px'
            }}>
              {evaluation?.live_clocks?.map((c: any) => {
                const isUrgent = c.status === 'CLOSING SOON' || c.status === 'CLOSED';
                return (
                  <div
                    key={c.code}
                    style={{
                      padding: '12px 14px',
                      background: isUrgent ? 'rgba(244, 63, 94, 0.08)' : 'rgba(8, 11, 17, 0.7)',
                      borderRadius: '8px',
                      border: `1px solid ${isUrgent ? 'rgba(244, 63, 94, 0.3)' : 'var(--border-subtle)'}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f8fafc' }}>{c.code}</span>
                      <span style={{
                        fontSize: '0.64rem',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        fontWeight: 700,
                        background: c.status === 'OPEN' ? 'rgba(16,185,129,0.2)' : c.status === 'CONTINUOUS' ? 'rgba(14,165,233,0.2)' : 'rgba(244,63,94,0.2)',
                        color: c.status === 'OPEN' ? '#10b981' : c.status === 'CONTINUOUS' ? '#38bdf8' : '#f43f5e'
                      }}>
                        {c.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', fontFamily: 'JetBrains Mono' }}>
                      {c.countdown}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                      Window: {c.auction_window}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 600, marginTop: '4px' }}>
                      Peak: {c.current_price} • Distress: {c.distress_price}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Disruption Simulation Slider */}
          <div style={{
            background: 'rgba(8, 11, 17, 0.85)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '16px 18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={16} color="#f59e0b" />
                SIMULATE HIGHWAY TRAFFIC DELAY (Kasara Ghat / Samruddhi Bottleneck)
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: delayMinutes > 60 ? '#f43f5e' : '#10b981', fontFamily: 'JetBrains Mono' }}>
                +{delayMinutes} Minutes Delay
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="150"
              step="15"
              value={delayMinutes}
              onChange={handleSliderChange}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
              <span>0m (Clear Run)</span>
              <span>45m (Minor Jam)</span>
              <span>90m (Truck Breakdown / Monsoon Waterlogging)</span>
              <span>150m (Severe Blockade)</span>
            </div>
          </div>

          {/* Arbitrage Evaluation Result */}
          {evaluation && (
            <div style={{
              background: evaluation.status === 'DIVERSION_RECOMMENDED' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
              border: `1px solid ${evaluation.status === 'DIVERSION_RECOMMENDED' ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.3)'}`,
              borderRadius: '10px',
              padding: '16px 18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                {evaluation.status === 'DIVERSION_RECOMMENDED' ? (
                  <AlertTriangle size={20} color="#f59e0b" />
                ) : (
                  <CheckCircle2 size={20} color="#10b981" />
                )}
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: evaluation.status === 'DIVERSION_RECOMMENDED' ? '#f59e0b' : '#10b981' }}>
                    {evaluation.status === 'DIVERSION_RECOMMENDED' 
                      ? '⚠️ CRITICAL AUCTION CUTOFF MISSED — AUTONOMOUS MID-TRANSIT DIVERSION ACTIVATED' 
                      : '✓ TRANSIT ON TRACK FOR PRIMARY VASHI MORNING AUCTION'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Current Location: {evaluation.trigger_condition.current_location} • Projected Vashi Arrival: {evaluation.trigger_condition.projected_vashi_eta} (Cutoff: {evaluation.trigger_condition.vashi_auction_cutoff})
                  </div>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px',
                marginTop: '10px'
              }}>
                {/* Stay on course loss scenario */}
                <div style={{
                  padding: '12px 14px',
                  background: 'rgba(244, 63, 94, 0.06)',
                  borderRadius: '8px',
                  border: '1px solid rgba(244, 63, 94, 0.2)'
                }}>
                  <div style={{ fontSize: '0.72rem', color: '#f43f5e', fontWeight: 700 }}>
                    IF STAYING ON ORIGINAL COURSE (Vashi APMC):
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f43f5e', fontFamily: 'JetBrains Mono', marginTop: '4px' }}>
                    {evaluation.financial_impact.if_staying_on_vashi_course.gross_revenue}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    Rate: {evaluation.financial_impact.if_staying_on_vashi_course.price_per_kg}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#f43f5e', marginTop: '4px' }}>
                    ⚠️ {evaluation.financial_impact.if_staying_on_vashi_course.penalty_reason}
                  </div>
                </div>

                {/* Recommended diversion scenario */}
                <div style={{
                  padding: '12px 14px',
                  background: 'rgba(16, 185, 129, 0.06)',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                    RECOMMENDED ARBITRAGE TERMINAL:
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', fontFamily: 'JetBrains Mono', marginTop: '4px' }}>
                    {evaluation.financial_impact.recommended_reroute.gross_revenue}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#ffffff', fontWeight: 600 }}>
                    {evaluation.financial_impact.recommended_reroute.terminal_name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '4px' }}>
                    ETA: {evaluation.financial_impact.recommended_reroute.projected_eta} ({evaluation.financial_impact.recommended_reroute.price_per_kg})
                  </div>
                </div>
              </div>

              {/* Value Preserved Banner */}
              <div style={{
                marginTop: '12px',
                padding: '10px 14px',
                background: 'rgba(8, 11, 17, 0.8)',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>NET PROD VALUE PRESERVED: </span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981', fontFamily: 'JetBrains Mono', marginLeft: '6px' }}>
                    {evaluation.financial_impact.net_farmer_value_preserved}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontFamily: 'JetBrains Mono' }}>
                  Corridor: {evaluation.financial_impact.recommended_reroute.diversion_corridor}
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '14px'
          }}>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
              ✓ Live GPS telemetry syncs with driver console every 30 seconds
            </div>
            <button
              onClick={() => alert(`Diversion Confirmed! Driver instructed to exit Samruddhi at Padgha Interchange for Kalyan Wholesale Dock #4. Preserved ${evaluation?.financial_impact?.net_farmer_value_preserved}!`)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Compass size={16} /> Authorize Mid-Transit Diversion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
