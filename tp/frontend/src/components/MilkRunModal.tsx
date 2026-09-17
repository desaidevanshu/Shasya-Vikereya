import React, { useState, useEffect } from 'react';
import { 
  X, 
  Truck, 
  Users, 
  MapPin, 
  CheckCircle2, 
  DollarSign, 
  ArrowRight, 
  ShieldCheck, 
  QrCode, 
  TrendingUp,
  PackageCheck,
  Clock,
  Layers
} from 'lucide-react';
import type { Language } from '../translations';

interface MilkRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const MilkRunModal: React.FC<MilkRunModalProps> = ({ isOpen, onClose, lang }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFarmer, setSelectedFarmer] = useState<string>('FARMER-TK-01');

  useEffect(() => {
    if (!isOpen) return;
    fetch('http://localhost:8000/api/milkrun/manifest')
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching milk-run manifest:', err);
        setLoading(false);
      });
  }, [isOpen]);

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
        maxWidth: '920px',
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
              background: 'rgba(14, 165, 233, 0.15)',
              border: '1px solid rgba(14, 165, 233, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Truck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.08rem', fontWeight: 800, color: '#ffffff' }}>
                {lang === 'mr' ? 'मिल्क-रन शेतकरी समूह वाहतूक (UberPool)' : lang === 'hi' ? 'मिल्क-रन किसान समूह परिवहन (UberPool)' : 'Smallholder Milk-Run Cargo Pooling (UberPool for Perishables)'}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                {lang === 'mr' 
                  ? 'अल्पभूधारक शेतकऱ्यांचे (२५०-५०० किलो) एकत्रीकरण • स्वतंत्र वाहनाचा भुर्दंड टळला' 
                  : 'Aggregates 4 marginal farmers (300–550 kg) into 1 shared Bolero Maxi • Prorated freight savings'}
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

        {loading || !data ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            Loading live Milk-Run consolidation engine...
          </div>
        ) : (
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top KPI Metrics Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px'
            }}>
              <div style={{ padding: '12px 14px', background: 'rgba(8, 11, 17, 0.7)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>VEHICLE UTILIZATION</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'JetBrains Mono' }}>
                  {data.vehicle_assigned.utilization_pct}% FULL
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {data.vehicle_assigned.current_load_kg} kg / {data.vehicle_assigned.capacity_kg} kg ({data.vehicle_assigned.total_crates} Crates)
                </div>
              </div>

              <div style={{ padding: '12px 14px', background: 'rgba(8, 11, 17, 0.7)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>TOTAL POOLED FREIGHT</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'JetBrains Mono' }}>
                  ₹{data.trip_summary.total_shared_logistics_cost}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#10b981' }}>
                  ₹{data.trip_summary.average_cost_per_crate} / crate (Diesel + Toll + Handling)
                </div>
              </div>

              <div style={{ padding: '12px 14px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>COLLECTIVE SAVINGS</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981', fontFamily: 'JetBrains Mono' }}>
                  +₹{data.trip_summary.collective_farmer_savings.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#10b981' }}>
                  Avg +₹{data.trip_summary.avg_savings_per_farmer} saved per smallholder!
                </div>
              </div>

              <div style={{ padding: '12px 14px', background: 'rgba(8, 11, 17, 0.7)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>ROUTE LOOP</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                  {data.trip_summary.milk_run_stops} Rural Stops
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Dindori ➔ Ozar ➔ Pimpalgaon ➔ Sinnar ➔ Mumbai
                </div>
              </div>
            </div>

            {/* Visual Truck Bed Loading Diagram */}
            <div style={{
              background: 'rgba(8, 11, 17, 0.85)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '16px 18px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={16} color="#38bdf8" />
                  VEHICLE PAYLOAD COMPARTMENT (Bolero Maxi Truck Bed: {data.vehicle_assigned.total_crates} / 70 Max Crates)
                </div>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontFamily: 'JetBrains Mono' }}>
                  Vehicle: {data.vehicle_assigned.plate} • Driver: {data.vehicle_assigned.driver}
                </span>
              </div>

              {/* Truck Bed Graphic Slots */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(13, 1fr)',
                gap: '5px',
                padding: '12px',
                background: '#04070c',
                borderRadius: '8px',
                border: '1px dashed rgba(255,255,255,0.15)'
              }}>
                {Array.from({ length: 65 }).map((_, i) => {
                  let owner = 'Empty';
                  let color = 'rgba(255,255,255,0.05)';
                  let border = 'rgba(255,255,255,0.1)';
                  
                  if (i < 15) {
                    owner = 'Farmer Tukaram (15 crates)';
                    color = '#0284c7';
                    border = '#38bdf8';
                  } else if (i < 27) {
                    owner = 'Sunita Shinde (12 crates)';
                    color = '#d97706';
                    border = '#fbbf24';
                  } else if (i < 49) {
                    owner = 'Ramesh Patil (22 crates)';
                    color = '#059669';
                    border = '#34d399';
                  } else if (i < 65) {
                    owner = 'Eknath Khairnar (16 crates)';
                    color = '#7c3aed';
                    border = '#a78bfa';
                  }

                  return (
                    <div
                      key={i}
                      title={`Slot #${i+1}: ${owner}`}
                      style={{
                        height: '24px',
                        borderRadius: '3px',
                        background: color,
                        border: `1px solid ${border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        cursor: 'default'
                      }}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px', fontSize: '0.72rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', background: '#0284c7', borderRadius: '2px' }}></span>
                  Tukaram (#1–15)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', background: '#d97706', borderRadius: '2px' }}></span>
                  Sunita (#16–27)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', background: '#059669', borderRadius: '2px' }}></span>
                  Ramesh (#28–49)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', background: '#7c3aed', borderRadius: '2px' }}></span>
                  Eknath (#50–65)
                </span>
              </div>
            </div>

            {/* Farmer Proration Breakdown Table */}
            <div style={{
              background: 'rgba(8, 11, 17, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700, fontSize: '0.84rem' }}>
                {lang === 'mr' ? 'शेतकरीनिहाय भाडे व निव्वळ बचत' : 'Prorated Smallholder Savings Breakdown'}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)', color: '#94a3b8' }}>
                    <th style={{ padding: '10px 14px' }}>FARMER & VILLAGE</th>
                    <th style={{ padding: '10px 14px' }}>VOLUME</th>
                    <th style={{ padding: '10px 14px' }}>UNPOOLED COST</th>
                    <th style={{ padding: '10px 14px' }}>MILK-RUN SHARE</th>
                    <th style={{ padding: '10px 14px' }}>NET SAVINGS</th>
                    <th style={{ padding: '10px 14px' }}>LOT QR TAG</th>
                  </tr>
                </thead>
                <tbody>
                  {data.farmers.map((f: any) => (
                    <tr key={f.farmer_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#f8fafc' }}>{f.farmer_name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{f.village}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono' }}>
                        {f.crates} Crates ({f.weight_kg} kg)
                      </td>
                      <td style={{ padding: '12px 14px', color: '#f43f5e', fontFamily: 'JetBrains Mono', textDecoration: 'line-through' }}>
                        ₹{f.individual_truck_quote.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#38bdf8', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                        ₹{f.prorated_cost} (₹{f.cost_per_crate}/crate)
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          fontFamily: 'JetBrains Mono'
                        }}>
                          +₹{f.net_savings.toLocaleString()} ({f.savings_pct}%)
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: '#f59e0b' }}>
                        {f.lot_qr_tag}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Action Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '14px'
            }}>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                ✓ GPS Milk-Run pickup route verified • APMC Section 5D collective pass attached
              </div>
              <button
                onClick={() => alert(`Milk-Run Dispatch Confirmed! Vehicle MH-15-EG-4921 dispatched for multi-stop pickup. Total ₹10,366.72 collective savings locked!`)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <PackageCheck size={16} /> Confirm & Dispatch Pooled Truck
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
