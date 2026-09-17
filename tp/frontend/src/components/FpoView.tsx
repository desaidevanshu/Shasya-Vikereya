import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { translations, type Language } from '../translations';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  FileCheck2,
  Printer
} from 'lucide-react';

interface FpoViewProps {
  lang: Language;
}

export const FpoView: React.FC<FpoViewProps> = ({ lang }) => {
  const t = translations[lang];
  const [fpoData, setFpoData] = useState<any>(null);
  const [selectedSlip, setSelectedSlip] = useState<any | null>(null);

  useEffect(() => {
    api.getFpoAnalytics().then(setFpoData).catch(console.error);
  }, []);

  if (!fpoData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
        <p className="num">LOADING FPO COMMAND DESK...</p>
      </div>
    );
  }

  const { kpis, recent_batches, top_buyers } = fpoData;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      {/* Top Banner */}
      <div className="panel" style={{ padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="chip chip-gold">FPO FEDERATION WORKSTATION</span>
              <span className="num" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                REG: {fpoData.fpo_registration}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {fpoData.fpo_name}
            </h2>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {fpoData.district} • {fpoData.member_farmers_count} Active Farmer Members
            </div>
          </div>

          <button
            onClick={() => setSelectedSlip(recent_batches[0])}
            className="btn btn-secondary"
          >
            <FileCheck2 size={14} /> Electronic Weighment Slip
          </button>
        </div>
      </div>

      {/* Recaptured Margin Metric Panel */}
      <div className="panel" style={{ padding: '20px', marginBottom: '16px', borderLeft: '3px solid var(--brand-gold)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-gold)', textTransform: 'uppercase' }}>
              Cumulative Value Recaptured for Member Farmers
            </div>
            <div className="num" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginTop: '2px' }}>
              ₹{kpis.money_recovered_by_optimization_rs?.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Net additional profit unlocked vs. local mandi middleman deductions
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '240px' }}>
            <div className="panel" style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Avg Farmer Payout:</span>
              <strong className="num" style={{ color: 'var(--indicator-profit)' }}>₹{kpis.average_farmer_realization_per_kg}/kg</strong>
            </div>
            <div className="panel" style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Mandi Benchmark:</span>
              <strong className="num" style={{ color: 'var(--indicator-loss)' }}>₹{kpis.conventional_mandi_benchmark_per_kg}/kg</strong>
            </div>
            <div className="panel" style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Spoilage Rate:</span>
              <strong className="num" style={{ color: 'var(--logistics-cyan)' }}>{kpis.spoilage_waste_rate_pct}% (vs {kpis.conventional_spoilage_benchmark_pct}%)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div className="panel" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TOTAL VOLUME CLEARED</div>
          <div className="num" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
            {kpis.total_volume_cleared_tonnes} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>Tonnes</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>18 pooled milk-runs</div>
        </div>

        <div className="panel" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GROSS FPO TURNOVER</div>
          <div className="num" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-gold)', marginTop: '2px' }}>
            ₹{kpis.gross_turnover_rs?.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Escrow-settled direct trades</div>
        </div>

        <div className="panel" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>FARMER PAYOUT SHARE</div>
          <div className="num" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--indicator-profit)', marginTop: '2px' }}>
            82.0%
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Direct bank UPI disbursement</div>
        </div>

        <div className="panel" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AVG LOGISTICS COST</div>
          <div className="num" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--logistics-cyan)', marginTop: '2px' }}>
            ₹{kpis.average_logistics_cost_per_kg} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>/kg</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>-44% vs unpooled tempos</div>
        </div>
      </div>

      {/* Batches Table & Top Buyers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '16px' }}>
        <div className="panel" style={{ padding: '18px' }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '12px' }}>
            Recent Cleared Farm Batches
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recent_batches?.map((batch: any) => (
              <div 
                key={batch.batch_id}
                onClick={() => setSelectedSlip(batch)}
                style={{
                  background: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="num chip" style={{ fontSize: '0.68rem' }}>{batch.batch_id}</span>
                    <span className="chip chip-profit" style={{ fontSize: '0.65rem' }}>{batch.status}</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '3px' }}>
                    {batch.commodity} • {batch.quantity_kg?.toLocaleString()} kg
                  </div>
                  <div className="num" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Ref: {batch.upi_escrow_ref}
                  </div>
                </div>

                <div className="num" style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                    ₹{batch.farmer_net_realization_rs?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--brand-gold)' }}>
                    View Weighment
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel" style={{ padding: '18px' }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '12px' }}>
            Direct Buyer Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {top_buyers?.map((buyer: any, idx: number) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{buyer.name}</span>
                  <span className="num" style={{ color: 'var(--brand-gold)', fontWeight: 700 }}>{buyer.share_pct}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-surface-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${buyer.share_pct}%`, height: '100%', background: 'var(--brand-amber)', borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Electronic Weighment Slip Modal */}
      {selectedSlip && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            color: '#0f172a',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '480px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#b45309', letterSpacing: '0.05em' }}>
                  MSAMB ELECTRONIC WEIGHMENT ASSAY
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '2px' }}>
                  Digital Weighment Certificate
                </h4>
              </div>
              <button
                onClick={() => setSelectedSlip(null)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', color: '#64748b', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem', marginBottom: '14px' }}>
              <div><span style={{ color: '#64748b' }}>Batch:</span> <strong className="num">{selectedSlip.batch_id}</strong></div>
              <div><span style={{ color: '#64748b' }}>FPO ID:</span> <strong className="num">{fpoData.fpo_registration}</strong></div>
              <div><span style={{ color: '#64748b' }}>Commodity:</span> <strong>{selectedSlip.commodity}</strong></div>
              <div><span style={{ color: '#64748b' }}>Weight:</span> <strong className="num">{selectedSlip.quantity_kg?.toLocaleString()} kg</strong></div>
              <div><span style={{ color: '#64748b' }}>Net Realization:</span> <strong className="num" style={{ color: '#047857', fontSize: '1rem' }}>₹{selectedSlip.farmer_net_realization_rs?.toLocaleString()}</strong></div>
              <div><span style={{ color: '#64748b' }}>UPI Ref:</span> <span className="num">{selectedSlip.upi_escrow_ref}</span></div>
            </div>

            <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '6px', fontSize: '0.72rem', color: '#475569', marginBottom: '16px' }}>
              <strong>Maharashtra APMC Sec 5D Direct Marketing:</strong> Certified direct farm collection with 0% middleman adath and zero mandi cess.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-secondary"
                style={{ color: '#0f172a', borderColor: '#cbd5e1', fontSize: '0.78rem' }}
              >
                <Printer size={13} /> Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
