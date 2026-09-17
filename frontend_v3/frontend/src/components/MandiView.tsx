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
  Sparkles
} from 'lucide-react';

interface MandiViewProps {
  lang: Language;
}

export const MandiView: React.FC<MandiViewProps> = ({ lang }) => {
  const t = translations[lang];
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [overview, setOverview] = useState<any>(null);
  const [corridor, setCorridor] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<any[]>([]);

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

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await api.searchMandis(searchQuery, 'Maharashtra', selectedCrop, 100);
        setSearchResults(res);
      } catch (e) {
        console.error(e);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCrop]);

  const displayedMandis = (searchResults.length > 0 ? searchResults : (overview?.mandis || [])).filter((m: any) => {
    if (districtFilter === 'all') return true;
    return m.district?.toLowerCase().includes(districtFilter.toLowerCase());
  });

  const availableDistricts = Array.from(new Set((overview?.mandis || []).map((m: any) => m.district).filter(Boolean)));

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '28px 24px' }}>
      
      {/* 1. Header Bar */}
      <div className="panel" style={{ padding: '20px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="chip chip-gold" style={{ fontSize: '0.7rem' }}>COMMODITY INTELLIGENCE</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>data.gov.in Live Agmarknet Feed</span>
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Real-Time Mandi Arrivals & Statutory Price Corridor
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem'
            }}>
              <Calendar size={13} style={{ color: 'var(--brand-gold)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Reporting Date:</span>
              <strong className="num" style={{ color: 'var(--text-primary)' }}>{overview?.reporting_date || '12/09/2026'}</strong>
            </div>

            <button
              onClick={() => loadData(selectedCrop)}
              disabled={loading}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              <RefreshCw size={13} className={loading ? 'spin' : ''} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Commodity Selector Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '24px'
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
              transition: 'all 0.15s ease',
              boxShadow: selectedCrop === crop ? '0 2px 10px rgba(245, 158, 11, 0.15)' : 'none'
            }}
          >
            {crop}
          </button>
        ))}
      </div>

      {/* 3. Valuation Band & Predictive Advisory Grid */}
      {corridor && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1fr) minmax(320px, 1fr)',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Corridor Spread Card */}
          <div className="panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span className="chip chip-gold" style={{ fontSize: '0.7rem' }}>PRICE CORRIDOR</span>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '4px', color: 'var(--text-primary)' }}>
                  {selectedCrop} Valuation Band
                </h2>
              </div>
              <div className="num" style={{
                background: 'rgba(244, 63, 94, 0.08)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                color: '#fb7185',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700
              }}>
                Spread: {corridor.middleman_spread_pct}%
              </div>
            </div>

            {/* 4 Clean Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>FARMER FLOOR</div>
                <div className="num" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-gold)', marginTop: '2px' }}>
                  ₹{corridor.farmer_floor_per_kg?.toFixed(2)}
                  <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-muted)' }}>/kg</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Distress Liquidation Floor</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>MODAL FAIR RATE</div>
                <div className="num" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                  ₹{corridor.modal_fair_price_per_kg?.toFixed(2)}
                  <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-muted)' }}>/kg</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Origin Mandi Average</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>BUYER CEILING CAP</div>
                <div className="num" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--logistics-cyan)', marginTop: '2px' }}>
                  ₹{corridor.buyer_ceiling_per_kg?.toFixed(2)}
                  <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-muted)' }}>/kg</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Direct Procurement Cap</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TERMINAL RETAIL</div>
                <div className="num" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fb7185', marginTop: '2px' }}>
                  ₹{corridor.retail_benchmark_per_kg?.toFixed(2)}
                  <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-muted)' }}>/kg</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Mumbai/MMR Retail Price</div>
              </div>
            </div>

            {/* Direct Clearing Zone Visual Strip */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Farm Gate Min: ₹{corridor.min_modal_per_kg || 10}/kg</span>
                <span style={{ color: 'var(--brand-gold)', fontWeight: 600 }}>Direct Clearing Zone</span>
                <span>Retail Max: ₹{corridor.retail_benchmark_per_kg}/kg</span>
              </div>
              <div style={{ height: '7px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
                <div style={{ width: '22%', background: '#fb7185' }} title="Distress Sale Zone" />
                <div style={{ width: '48%', background: 'linear-gradient(90deg, #d97706 0%, #f59e0b 100%)' }} title="Optimal Disintermediated Corridor" />
                <div style={{ width: '30%', background: 'rgba(255, 255, 255, 0.15)' }} title="Middleman Margin Spread" />
              </div>
            </div>
          </div>

          {/* AI Sell Window Recommendation */}
          {forecast && (
            <div className="panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span className="chip chip-cyan" style={{ fontSize: '0.7rem' }}>PREDICTIVE ADVISORY</span>
                  <span className="num" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Region: {forecast.target_region || 'Nashik'}
                  </span>
                </div>

                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                  {forecast.ai_sell_window_recommendation}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '20px' }}>
                  {forecast.advisory_rationale}
                </p>
              </div>

              {/* 4 Day Forecast Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {forecast.daily_forecasts?.slice(0, 4).map((df: any, idx: number) => (
                  <div key={idx} style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '10px 8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{df.date_label}</div>
                    <div className="num" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-gold)', marginTop: '4px' }}>
                      ₹{df.projected_modal_price_rs?.toFixed(1)}
                    </div>
                    <div className="num" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {df.confidence_pct}% conf
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. High-Density Mandi Arrivals Data Grid */}
      <div className="panel" style={{ padding: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Live Agmarknet Mandi Records ({displayedMandis.length})
            </h2>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Official government APMC price records via data.gov.in API
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Filter by mandi or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '7px 12px 7px 34px',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  outline: 'none',
                  width: '220px'
                }}
              />
            </div>

            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '7px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              <option value="all">All Districts ({availableDistricts.length})</option>
              {availableDistricts.map((d: any) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Market / APMC</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>District</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Commodity</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Grade / Variety</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>Min (₹/qtl)</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>Max (₹/qtl)</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>Modal Price</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>Arrival Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>Corridor Classification</th>
              </tr>
            </thead>
            <tbody>
              {displayedMandis.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No matching APMC records found. Try modifying your search.
                  </td>
                </tr>
              ) : (
                displayedMandis.slice(0, 35).map((m: any, idx: number) => {
                  const modalKg = m.modal_price_per_kg || (m.modal_price_per_qtl ? m.modal_price_per_qtl / 100 : 0);
                  const isOrigin = m.is_origin_corridor || ['Nashik', 'Ahilyanagar', 'Pune', 'Kolhapur'].includes(m.district);
                  const isTerminal = m.is_terminal_corridor || ['Mumbai', 'Thane', 'Raigad', 'Nagpur'].includes(m.district);

                  return (
                    <tr key={idx} style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'
                    }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {m.name || m.market}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                        {m.district}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--brand-gold)', fontWeight: 500 }}>
                        {m.commodity}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                        {m.variety || 'Other'} • {m.grade || 'Local'}
                      </td>
                      <td className="num" style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                        ₹{m.min_price_per_qtl?.toLocaleString()}
                      </td>
                      <td className="num" style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                        ₹{m.max_price_per_qtl?.toLocaleString()}
                      </td>
                      <td className="num" style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <strong style={{ color: '#ffffff', fontSize: '0.88rem' }}>
                          ₹{modalKg.toFixed(2)} / kg
                        </strong>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          ₹{m.modal_price_per_qtl?.toLocaleString()} / qtl
                        </div>
                      </td>
                      <td className="num" style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        {m.arrival_date || '12/09/2026'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {isOrigin ? (
                          <span className="chip chip-gold" style={{ fontSize: '0.68rem' }}>
                            Origin Farm Gate
                          </span>
                        ) : isTerminal ? (
                          <span className="chip chip-cyan" style={{ fontSize: '0.68rem' }}>
                            Terminal MMR Sink
                          </span>
                        ) : (
                          <span className="chip" style={{ fontSize: '0.68rem' }}>
                            Regional APMC
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
