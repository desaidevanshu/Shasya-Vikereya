import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { translations, type Language } from '../translations';
import { 
  ShoppingBag, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Receipt
} from 'lucide-react';

interface MarketplaceViewProps {
  lang: Language;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ lang }) => {
  const t = translations[lang];
  const [clearingState, setClearingState] = useState<any>(null);
  const [filterCommodity, setFilterCommodity] = useState<string>('all');
  const [showRfqModal, setShowRfqModal] = useState<boolean>(false);
  const [rfqSuccess, setRfqSuccess] = useState<string | null>(null);

  // RFQ Form state
  const [buyerName, setBuyerName] = useState('');
  const [destination, setDestination] = useState('Vashi, Navi Mumbai');
  const [crop, setCrop] = useState('Tomato');
  const [grade, setGrade] = useState('Grade A');
  const [qtyKg, setQtyKg] = useState('1000');
  const [maxPrice, setMaxPrice] = useState('24.00');

  useEffect(() => {
    api.getClearingState().then(setClearingState).catch(console.error);
  }, []);

  const handlePlaceRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDemand({
        buyer_name: buyerName || "Institutional Procurement Partner",
        destination,
        commodity: crop,
        grade,
        requested_kg: parseFloat(qtyKg),
        buyer_ceiling_price_rs: parseFloat(maxPrice),
        buyer_type: "Commercial Bulk Buyer"
      });
      setRfqSuccess(`RFQ broadcasted for ${qtyKg} kg ${crop} to ${destination}. Incorporated into clearing solver.`);
      setShowRfqModal(false);
      const updated = await api.getClearingState();
      setClearingState(updated);
      setTimeout(() => setRfqSuccess(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const supplyLots = [
    {
      lot_id: "LOT-NAS-01",
      farmer_name: "Kisan Tukaram Shinde",
      fpo: "Pimpalgaon Farmer Producer Co.",
      location: "Pimpalgaon, Nashik",
      commodity: "Tomato",
      variety: "Hybrid Red (Abhinav)",
      grade: "Grade A",
      available_kg: 800,
      floor_price_rs: 16.50,
      mumbai_delivered_est_rs: 19.85,
      harvest_hours_ago: 3.5,
      shelf_life_remaining_days: 5.5
    },
    {
      lot_id: "LOT-NAS-02",
      farmer_name: "Sunil Baburao Patil",
      fpo: "Dindori Horti Cluster",
      location: "Dindori, Nashik",
      commodity: "Tomato",
      variety: "Desi Table Tomato",
      grade: "Grade A",
      available_kg: 550,
      floor_price_rs: 17.00,
      mumbai_delivered_est_rs: 20.40,
      harvest_hours_ago: 4.0,
      shelf_life_remaining_days: 5.0
    },
    {
      lot_id: "LOT-LAS-03",
      farmer_name: "Vishnu Ganpat Gaikwad",
      fpo: "Lasalgaon Onion Producers",
      location: "Lasalgaon, Nashik",
      commodity: "Onion",
      variety: "Nashik Red Export",
      grade: "Grade A (55mm+)",
      available_kg: 3500,
      floor_price_rs: 41.00,
      mumbai_delivered_est_rs: 44.50,
      harvest_hours_ago: 24.0,
      shelf_life_remaining_days: 45.0
    },
    {
      lot_id: "LOT-JUN-04",
      farmer_name: "Rameshwar Jadhav",
      fpo: "Junnar Farmer Alliance",
      location: "Junnar, Pune",
      commodity: "Bhindi(Ladies Finger)",
      variety: "Green Super",
      grade: "Grade A",
      available_kg: 650,
      floor_price_rs: 20.00,
      mumbai_delivered_est_rs: 23.20,
      harvest_hours_ago: 2.0,
      shelf_life_remaining_days: 3.5
    },
    {
      lot_id: "LOT-KOL-05",
      farmer_name: "Mahadev Mane",
      fpo: "Kolhapur Agro Producers",
      location: "Vadgaonpeth, Kolhapur",
      commodity: "Green Chilli",
      variety: "Lavangi Spicy",
      grade: "Grade A",
      available_kg: 900,
      floor_price_rs: 28.00,
      mumbai_delivered_est_rs: 31.80,
      harvest_hours_ago: 6.0,
      shelf_life_remaining_days: 8.0
    }
  ];

  const filteredLots = supplyLots.filter(l => {
    if (filterCommodity === 'all') return true;
    return l.commodity.toLowerCase() === filterCommodity.toLowerCase();
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      {/* Top Banner */}
      <div className="panel" style={{ padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="chip chip-gold">DIRECT B2B PROCUREMENT SINK</span>
              <span className="num" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                APMC SEC 5D CESS EXEMPTION VERIFIED
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Institutional Produce Catalog & Direct Orders
            </h2>
          </div>

          <button
            onClick={() => setShowRfqModal(true)}
            className="btn btn-primary"
          >
            <Plus size={14} /> Create Procurement RFQ
          </button>
        </div>
      </div>

      {rfqSuccess && (
        <div className="panel" style={{
          padding: '12px 16px',
          marginBottom: '16px',
          borderColor: 'var(--indicator-profit)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.82rem'
        }}>
          <CheckCircle2 size={16} color="var(--indicator-profit)" />
          {rfqSuccess}
        </div>
      )}

      {/* Commodity Filters */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
        {['all', 'Tomato', 'Onion', 'Bhindi(Ladies Finger)', 'Green Chilli'].map(c => (
          <button
            key={c}
            onClick={() => setFilterCommodity(c)}
            style={{
              padding: '5px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              borderRadius: '6px',
              border: '1px solid',
              borderColor: filterCommodity === c ? 'var(--brand-gold)' : 'var(--border-subtle)',
              background: filterCommodity === c ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
              color: filterCommodity === c ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            {c === 'all' ? 'All Aggregated Lots (5)' : c}
          </button>
        ))}
      </div>

      {/* Lots Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '14px',
        marginBottom: '24px'
      }}>
        {filteredLots.map(lot => (
          <div key={lot.lot_id} className="panel" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span className="num chip" style={{ fontSize: '0.68rem' }}>{lot.lot_id}</span>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {lot.commodity} • {lot.variety}
                </h4>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <MapPin size={12} /> {lot.location}
                </div>
              </div>

              <span className="chip chip-gold" style={{ fontSize: '0.68rem' }}>
                {lot.grade}
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              background: 'var(--bg-surface-subtle)',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '12px'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>AVAILABLE VOLUME</div>
                <div className="num" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                  {lot.available_kg.toLocaleString()} kg
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>FARM-GATE FLOOR</div>
                <div className="num" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand-gold)', marginTop: '2px' }}>
                  ₹{lot.floor_price_rs.toFixed(2)}/kg
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>HARVEST AGE</div>
                <div className="num" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {lot.harvest_hours_ago} hrs ago
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>EST. LANDED (MUMBAI)</div>
                <div className="num" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--logistics-cyan)', marginTop: '2px' }}>
                  ₹{lot.mumbai_delivered_est_rs.toFixed(2)}/kg
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                FPO: {lot.fpo}
              </span>

              <button
                onClick={() => {
                  setCrop(lot.commodity);
                  setQtyKg(String(Math.min(lot.available_kg, 1000)));
                  setMaxPrice(String(lot.mumbai_delivered_est_rs));
                  setShowRfqModal(true);
                }}
                className="btn btn-secondary"
                style={{ fontSize: '0.74rem', padding: '5px 10px' }}
              >
                Place RFQ <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Pipeline Table */}
      <div className="panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Active Corridor Dispatches & Settlement Pipeline
            </h3>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Direct B2B consignments under transit monitoring
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: "ORD-901", buyer: "Green Valley Apartment RWA, Vashi", crop: "Tomato (Grade A)", qty: "800 kg", val: "₹18,500", status: "IN_TRANSIT", route: "Nashik ➔ Vashi Dock 4", eta: "1 hr 45 min", escrow: "UPI_ESCROW_LOCKED" },
            { id: "ORD-902", buyer: "FreshPlate Cloud Kitchens, Mumbai", crop: "Tomato (Grade A)", qty: "550 kg", val: "₹12,800", status: "TRUCK_POOLED", route: "Dindori ➔ Andheri Hub", eta: "2 hrs 10 min", escrow: "UPI_ESCROW_LOCKED" },
            { id: "ORD-884", buyer: "Kothrud Society Consumers, Pune", crop: "Onion (Nashik Red)", qty: "3,000 kg", val: "₹1,26,000", status: "SETTLED", route: "Lasalgaon ➔ Pune Depo", eta: "Delivered", escrow: "UPI_TRANSFERRED" }
          ].map(order => (
            <div key={order.id} style={{
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="num chip" style={{ fontSize: '0.68rem' }}>{order.id}</span>
                  <span className={`chip ${order.status === 'SETTLED' ? 'chip-profit' : 'chip-cyan'}`} style={{ fontSize: '0.68rem' }}>
                    {order.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {order.buyer} — {order.qty} {order.crop}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {order.route} • ETA: {order.eta}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="num" style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                  {order.val}
                </div>
                <div className="num" style={{ fontSize: '0.7rem', color: 'var(--indicator-profit)', marginTop: '2px' }}>
                  {order.escrow}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RFQ Modal */}
      {showRfqModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '20px'
        }}>
          <div className="panel" style={{ width: '100%', maxWidth: '440px', padding: '22px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>
              Create Direct Bulk Procurement RFQ
            </h3>

            <form onSubmit={handlePlaceRfq}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Procuring Entity
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Apex Central Kitchens"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Commodity
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: '0.82rem'
                    }}
                  >
                    <option value="Tomato">Tomato</option>
                    <option value="Onion">Onion</option>
                    <option value="Bhindi(Ladies Finger)">Bhindi</option>
                    <option value="Green Chilli">Green Chilli</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Required Volume (kg)
                  </label>
                  <input
                    type="number"
                    required
                    value={qtyKg}
                    onChange={(e) => setQtyKg(e.target.value)}
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

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Target Delivery Dock
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    color: '#fff',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value="Vashi, Navi Mumbai">Vashi Dock 4, Navi Mumbai</option>
                  <option value="Dadar Wholesale Sinks, Mumbai">Dadar Sinks, Mumbai</option>
                  <option value="Kothrud Depo, Pune">Kothrud Depo, Pune</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowRfqModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Confirm RFQ Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
