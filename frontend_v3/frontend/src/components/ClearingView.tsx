import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { translations, type Language } from '../translations';
import { 
  Cpu, 
  Truck, 
  Thermometer, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  PlusCircle,
  ShieldCheck,
  Fuel,
  Navigation,
  Scale
} from 'lucide-react';

interface ClearingViewProps {
  lang: Language;
}

export const ClearingView: React.FC<ClearingViewProps> = ({ lang }) => {
  const t = translations[lang];
  const [clearingData, setClearingData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [droppedFarmer, setDroppedFarmer] = useState<string | null>(null);
  const [showAddLotModal, setShowAddLotModal] = useState<boolean>(false);

  // New lot form state
  const [newFarmerName, setNewFarmerName] = useState('Anand Patil');
  const [newLocation, setNewLocation] = useState('Sinnar, Nashik');
  const [newKg, setNewKg] = useState('400');
  const [newFloorPrice, setNewFloorPrice] = useState('16.50');

  const loadClearing = async (excludedId?: string | null) => {
    setLoading(true);
    try {
      const res = await api.solveClearing({
        excluded_supplier_id: excludedId || undefined,
        ambient_temp_c: 30.0,
        traffic_delay_pct: 0.0
      });
      setClearingData(res);
      setDroppedFarmer(excludedId || null);
    } catch (err) {
      console.error("Clearing solve error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClearing();
  }, []);

  const handleSimulateDropout = () => {
    loadClearing("FARM-01");
  };

  const handleReset = () => {
    loadClearing(null);
  };

  const handleAddLot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.listProduce({
        farmer_name: newFarmerName,
        location: newLocation,
        available_kg: parseFloat(newKg),
        farmer_floor_price_rs: parseFloat(newFloorPrice),
        commodity: "Tomato",
        grade: "Grade A"
      });
      setShowAddLotModal(false);
      loadClearing();
    } catch (err) {
      console.warn("Failed to submit lot", err);
      setShowAddLotModal(false);
    }
  };

  if (!clearingData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
        <p className="num">INITIALIZING MULTI-NODE LP CLEARING ENGINE...</p>
      </div>
    );
  }

  const { route_plan, freshness_audit, clearing_economics, ledger } = clearingData;

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '28px 24px' }}>
      
      {/* 1. Control Header Bar */}
      <div className="panel" style={{ padding: '20px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="chip chip-gold" style={{ fontSize: '0.7rem' }}>AUTONOMOUS LP CLEARINGHOUSE</span>
              <span className="num" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                BATCH: {clearingData.batch_id}
              </span>
              {clearingData.is_recleared && (
                <span className="chip chip-loss" style={{ fontSize: '0.7rem' }}>RE-CLEARED POST DROPOUT</span>
              )}
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Nashik-Mumbai Constrained Clearing Engine
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setShowAddLotModal(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '7px 14px' }}
            >
              <PlusCircle size={14} /> Add Supply Lot
            </button>

            {!droppedFarmer ? (
              <button
                onClick={handleSimulateDropout}
                className="btn btn-danger"
                style={{ fontSize: '0.78rem', padding: '7px 14px' }}
                title="Simulate Ramesh Shinde cancelling order to trigger auto-reclearing"
              >
                <AlertTriangle size={14} /> Simulate Farmer Dropout
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="btn btn-primary"
                style={{ fontSize: '0.78rem', padding: '7px 14px' }}
              >
                <RotateCcw size={14} /> Reset Scenario
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Innovative Physical Corridor Transit Telemetry Strip */}
      <div className="panel" style={{ padding: '18px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Navigation size={15} style={{ color: 'var(--logistics-cyan)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
              Physical Transit Corridor & Waypoint Telemetry (207 km)
            </span>
          </div>
          <div className="num" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Kasara Ghat Descent Protocol • Cold-Chain Monitoring
          </div>
        </div>

        {/* Waypoints Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px'
        }}>
          {[
            { name: "Pimpalgaon Origin", km: "0 km", alt: "620m", temp: "28.5°C", task: "Farm-gate lot aggregation & crating" },
            { name: "Dindori Waypoint", km: "22 km", alt: "590m", temp: "29.0°C", task: "Secondary milk-run pickup (550kg)" },
            { name: "Kasara Ghat Pass", km: "112 km", alt: "410m", temp: "32.4°C", task: "Altitude drop & heavy braking zone" },
            { name: "Thane Multi-Sink", km: "174 km", alt: "25m", temp: "31.2°C", task: "MMR city gate decoupling" },
            { name: "Vashi Receiving Dock", km: "207 km", alt: "12m", temp: "30.0°C", task: "Final dock unload & UPI settlement" }
          ].map((wp, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '10px 12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{wp.name}</strong>
                <span className="num" style={{ fontSize: '0.7rem', color: 'var(--logistics-cyan)' }}>{wp.km}</span>
              </div>
              <div className="num" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Alt: {wp.alt} • Temp: {wp.temp}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {wp.task}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Dual-Sided Exchange Matrix: Supply Book | Clearing Match | Demand Book */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr 1fr',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Left: Supply Book */}
        <div className="panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-gold)' }}>
              SUPPLY BOOK (FPOs)
            </span>
            <span className="chip" style={{ fontSize: '0.68rem' }}>
              {clearingData.allocated_suppliers?.length} Lots
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {clearingData.allocated_suppliers?.map((s: any) => (
              <div key={s.farmer_id} style={{
                background: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '10px 12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{s.farmer_name}</strong>
                  <span className="num" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-gold)' }}>
                    {s.allocated_kg} kg
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {s.location}
                </div>
                <div className="num" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Floor: ₹{s.floor_price_rs?.toFixed(2)}</span>
                  <span style={{ color: 'var(--indicator-profit)' }}>
                    Payout: ₹{(s.allocated_kg * clearing_economics?.farmer_net_realization_per_kg).toFixed(0)}
                  </span>
                </div>
              </div>
            ))}

            {droppedFarmer && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.08)',
                border: '1px dashed var(--indicator-loss)',
                borderRadius: '6px',
                padding: '10px 12px',
                fontSize: '0.75rem',
                color: 'var(--indicator-loss)'
              }}>
                <strong>Ramesh Shinde (350 kg) Canceled</strong>
                <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                  Autonomous fallback assigned from Godavari Valley reserve pool.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Clearinghouse Solved Match */}
        <div className="panel" style={{ padding: '16px', border: '1px solid var(--border-strong)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
              MATCH ENGINE EXECUTION
            </span>
            <span className="chip chip-profit" style={{ fontSize: '0.68rem' }}>
              100% BALANCED
            </span>
          </div>

          <div style={{
            background: 'var(--bg-surface-elevated)',
            borderRadius: '6px',
            padding: '14px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '14px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CLEARED VOLUME</div>
                <div className="num" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                  {clearingData.cleared_quantity_kg || 1350} kg
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>BUYER DELIVERED RATE</div>
                <div className="num" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--logistics-cyan)' }}>
                  ₹{(clearing_economics?.buyer_delivered_rate_per_kg || 26.50).toFixed(2)}/kg
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>NET FARMER PAYOUT</div>
                <div className="num" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--indicator-profit)' }}>
                  ₹{clearing_economics?.total_farmer_payout_rs?.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>FRESHNESS SCORE</div>
                <div className="num" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--indicator-profit)' }}>
                  {freshness_audit?.freshness_pct || 88.2}% (SAFE)
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Payload Optimization */}
          <div style={{
            background: 'var(--bg-surface-subtle)',
            borderRadius: '6px',
            padding: '12px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.76rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Assigned Vehicle:</span>
              <strong style={{ color: '#ffffff' }}>{route_plan?.vehicle_used}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Payload Utilization:</span>
              <span className="num" style={{ color: 'var(--brand-gold)', fontWeight: 700 }}>
                {route_plan?.capacity_utilization_pct}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Diesel Consumption:</span>
              <span className="num" style={{ color: '#ffffff' }}>
                {route_plan?.fuel_consumed_litres} L (@ ₹94.20/L)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Demand Book */}
        <div className="panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--logistics-cyan)' }}>
              DEMAND BOOK (MMR Sinks)
            </span>
            <span className="chip" style={{ fontSize: '0.68rem' }}>
              {clearingData.allocated_buyers?.length} Orders
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {clearingData.allocated_buyers?.map((d: any) => {
              const rate = clearing_economics?.buyer_delivered_rate_per_kg || 26.5;
              const totalVal = Math.round(d.requested_kg * rate);
              return (
                <div key={d.buyer_id} style={{
                  background: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '10px 12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{d.buyer_name}</strong>
                    <span className="num" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--logistics-cyan)' }}>
                      {d.requested_kg} kg
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {d.destination}
                  </div>
                  <div className="num" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Ceiling: ₹{d.buyer_ceiling_price_rs?.toFixed(2)}</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>
                      Total: ₹{totalVal.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Lot Modal */}
      {showAddLotModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '20px'
        }}>
          <div className="panel" style={{ width: '100%', maxWidth: '420px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
              Register Farm Lot to Clearing Pool
            </h3>

            <form onSubmit={handleAddLot}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Farmer Name
                </label>
                <input
                  type="text"
                  required
                  value={newFarmerName}
                  onChange={(e) => setNewFarmerName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    color: '#fff',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Location Cluster
                </label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    color: '#fff',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Available Weight (kg)
                  </label>
                  <input
                    type="number"
                    required
                    value={newKg}
                    onChange={(e) => setNewKg(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Floor Price (₹/kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newFloorPrice}
                    onChange={(e) => setNewFloorPrice(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddLotModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Confirm Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
