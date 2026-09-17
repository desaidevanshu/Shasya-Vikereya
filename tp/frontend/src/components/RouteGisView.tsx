import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  Thermometer, 
  Fuel, 
  Clock, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  ArrowUpRight,
  TrendingUp,
  Truck,
  Sparkles,
  FileText
} from 'lucide-react';
import type { Language } from '../translations';

interface RouteGisViewProps {
  lang: Language;
  onOpenGatePass?: () => void;
}

interface Waypoint {
  name: string;
  lat: number;
  lon: number;
  elevation_m: number;
  eta_h: number;
  role: string;
}

interface EvaluatedRoute {
  id: string;
  name: string;
  tag: string;
  color: string;
  distance_km: number;
  duration_hours: number;
  fuel_litres: number;
  fuel_cost_rs: number;
  toll_cost_rs: number;
  total_logistics_cost_rs: number;
  logistics_cost_per_kg: number;
  vibration_bruising_pct: number;
  bruised_kg: number;
  bruise_loss_rs: number;
  thermal_loss_rs: number;
  quality_loss_rs: number;
  freshness_pct: number;
  farmer_net_payout_rs: number;
  farmer_net_per_kg: number;
  summary: string;
  is_winner: boolean;
  waypoints: Waypoint[];
  path: [number, number][];
}

interface RouteComparisonData {
  commodity: string;
  quantity_kg: number;
  ambient_temp_c: number;
  diesel_price_per_l: number;
  vehicle_used: string;
  is_refrigerated: boolean;
  buyer_agreed_price_per_kg: number;
  winning_route_id: string;
  profit_maximization_justification: string;
  routes: EvaluatedRoute[];
}

export const RouteGisView: React.FC<RouteGisViewProps> = ({ lang, onOpenGatePass }) => {
  const [commodity, setCommodity] = useState<string>('Tomato');
  const [quantityKg, setQuantityKg] = useState<number>(1350);
  const [ambientTemp, setAmbientTemp] = useState<number>(31.0);
  const [isRefrigerated, setIsRefrigerated] = useState<boolean>(false);
  const [vehicleType, setVehicleType] = useState<string>('bolero_maxi');
  const [trafficDelayPct, setTrafficDelayPct] = useState<number>(0);
  const [activeRouteId, setActiveRouteId] = useState<string>('route_b');
  
  const [comparisonData, setComparisonData] = useState<RouteComparisonData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylineLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markerLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Fetch route comparison from backend
  const fetchRouteComparison = async () => {
    setLoading(true);
    try {
      const url = `http://localhost:8000/api/logistics/compare-routes?commodity=${encodeURIComponent(commodity)}&quantity_kg=${quantityKg}&ambient_temp_c=${ambientTemp}&vehicle_type=${vehicleType}&traffic_delay_pct=${trafficDelayPct}&is_refrigerated=${isRefrigerated}`;
      const res = await fetch(url);
      if (res.ok) {
        const data: RouteComparisonData = await res.json();
        setComparisonData(data);
        if (!activeRouteId) {
          setActiveRouteId(data.winning_route_id);
        }
      }
    } catch (e) {
      console.error("Error fetching route comparison:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRouteComparison();
  }, [commodity, quantityKg, ambientTemp, isRefrigerated, vehicleType, trafficDelayPct]);

  // Initialize and update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create map
      const map = L.map(mapContainerRef.current, {
        center: [19.65, 73.55],
        zoom: 9,
        zoomControl: true,
        attributionControl: false
      });

      // Dark CartoDB Tiles matching Obsidian palette
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      polylineLayerGroupRef.current = L.layerGroup().addTo(map);
      markerLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const polyGroup = polylineLayerGroupRef.current;
    const markerGroup = markerLayerGroupRef.current;

    if (!map || !polyGroup || !markerGroup || !comparisonData) return;

    polyGroup.clearLayers();
    markerGroup.clearLayers();

    // Render each route line
    comparisonData.routes.forEach(route => {
      const isSelected = route.id === activeRouteId;
      const polyline = L.polyline(route.path, {
        color: route.color,
        weight: isSelected ? 6 : 3,
        opacity: isSelected ? 0.95 : 0.35,
        dashArray: route.id === 'route_b' ? undefined : (route.id === 'route_c' ? '6, 8' : undefined)
      });

      polyline.on('click', () => {
        setActiveRouteId(route.id);
      });

      polyGroup.addLayer(polyline);

      // If this route is selected, render its detailed waypoints
      if (isSelected) {
        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });

        route.waypoints.forEach((wp, idx) => {
          const isOrigin = idx === 0;
          const isDest = idx === route.waypoints.length - 1;
          const isBottleneck = wp.name.includes('Kasara') || wp.name.includes('Malshej');

          let markerBg = route.color;
          let label = `${idx + 1}`;
          if (isOrigin) { markerBg = '#10b981'; label = 'A'; }
          else if (isDest) { markerBg = '#0ea5e9'; label = 'B'; }
          else if (isBottleneck) { markerBg = '#f43f5e'; label = '⚠️'; }

          const customIcon = L.divIcon({
            className: 'custom-gis-pin',
            html: `
              <div style="
                background: ${markerBg};
                color: #ffffff;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 0.74rem;
                font-family: 'JetBrains Mono', monospace;
                box-shadow: 0 0 12px ${markerBg}99, 0 2px 6px rgba(0,0,0,0.8);
                border: 2px solid #080b11;
                cursor: pointer;
              ">
                ${label}
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          const marker = L.marker([wp.lat, wp.lon], { icon: customIcon });

          marker.bindPopup(`
            <div style="
              font-family: var(--font-sans, system-ui);
              padding: 4px 6px;
              color: #f1f5f9;
              min-width: 190px;
            ">
              <div style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">
                ${wp.role}
              </div>
              <div style="font-size: 0.92rem; font-weight: 700; color: #ffffff; margin-bottom: 6px;">
                ${wp.name}
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.78rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px; color: #cbd5e1;">
                <span>Elevation: <strong style="color: #0ea5e9;">${wp.elevation_m} m</strong></span>
                <span>ETA: <strong style="color: #f59e0b;">+${wp.eta_h}h</strong></span>
              </div>
            </div>
          `);

          markerGroup.addLayer(marker);
        });
      }
    });

  }, [comparisonData, activeRouteId]);

  const activeRoute = comparisonData?.routes.find(r => r.id === activeRouteId) || comparisonData?.routes[0];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '28px 24px' }}>
      {/* 1. Terminal Header */}
      <div className="panel" style={{
        padding: '20px 24px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="chip chip-cyan" style={{ fontSize: '0.7rem' }}>
              GEOSPATIAL DELIVERED ECONOMICS
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Nashik ➔ Mumbai Perishable Freight Corridor
            </span>
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
            GIS Smart Routing & Profit-Maximization Engine
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Distance alone is flawed. KrishiClear models road vibration bruising, Q₁₀ biological thermal decay curves, diesel fuel consumption, and tolls to select the route that <strong>maximizes farmer net profit</strong>.
          </p>
        </div>

        {/* Quick Action Button */}
        {onOpenGatePass && (
          <button
            onClick={onOpenGatePass}
            className="btn btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--brand-gold)',
              padding: '8px 16px',
              fontSize: '0.8rem'
            }}
          >
            <FileText size={15} />
            <span>APMC Sec 5D Gate Pass</span>
          </button>
        )}
      </div>

      {/* 2. Interactive Telemetry Controls Bar */}
      <div className="panel" style={{
        padding: '18px 22px',
        marginBottom: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        alignItems: 'center'
      }}>
        {/* Commodity Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
            Perishable Commodity
          </label>
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="input-obsidian"
            style={{ width: '100%', fontSize: '0.84rem', padding: '6px 10px' }}
          >
            <option value="Tomato">Tomato (Hybrid Red) • 12-15°C</option>
            <option value="Onion">Onion (Nashik Red) • 20-25°C</option>
            <option value="Spinach">Spinach (Palak) • 2-5°C (High Decay)</option>
            <option value="Grapes">Grapes (Nashik Export) • 0-2°C</option>
          </select>
        </div>

        {/* Vehicle Fleet */}
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
            Vehicle Fleet Allocation
          </label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="input-obsidian"
            style={{ width: '100%', fontSize: '0.84rem', padding: '6px 10px' }}
          >
            <option value="bolero_maxi">Mahindra Bolero Maxi (1.5 Tonne • 11 km/L)</option>
            <option value="tata_ace">Tata Ace Gold (1.0 Tonne • 14 km/L)</option>
            <option value="eicher_reefer">Eicher Pro Reefer (3.5 Tonne • Active Cold-Chain)</option>
          </select>
        </div>

        {/* Ambient Temperature Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Ambient Temperature
            </span>
            <span style={{ fontSize: '0.82rem', fontFamily: 'JetBrains Mono', color: ambientTemp > 34 ? '#f43f5e' : '#f59e0b', fontWeight: 700 }}>
              {ambientTemp.toFixed(1)}°C
            </span>
          </div>
          <input
            type="range"
            min="18"
            max="43"
            step="0.5"
            value={ambientTemp}
            onChange={(e) => setAmbientTemp(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: ambientTemp > 34 ? '#f43f5e' : '#f59e0b' }}
          />
        </div>

        {/* Traffic Delay Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Kasara Ghat Traffic Delay
            </span>
            <span style={{ fontSize: '0.82rem', fontFamily: 'JetBrains Mono', color: trafficDelayPct > 30 ? '#f43f5e' : '#0ea5e9', fontWeight: 700 }}>
              +{trafficDelayPct}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="5"
            value={trafficDelayPct}
            onChange={(e) => setTrafficDelayPct(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#0ea5e9' }}
          />
        </div>

        {/* Reefer Chiller Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setIsRefrigerated(!isRefrigerated)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid',
              background: isRefrigerated ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255,255,255,0.04)',
              borderColor: isRefrigerated ? '#0ea5e9' : 'var(--border-subtle)',
              color: isRefrigerated ? '#38bdf8' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Thermometer size={16} />
            {isRefrigerated ? 'Active Cold Chain: ON (12°C)' : 'Active Cold Chain: OFF (Ambient)'}
          </button>
        </div>
      </div>

      {/* 3. Main GIS Layout: Interactive Map + Route Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '20px', marginBottom: '24px' }}>
        {/* Leaflet Map Card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Map Status Bar */}
          <div style={{
            padding: '10px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.78rem',
            background: 'rgba(8, 11, 17, 0.8)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0ea5e9' }}></span>
                Route B: Expressway
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>
                Route A: NH-160
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e' }}></span>
                Route C: SH-44 Toll-Free
              </span>
            </div>

            <div style={{ color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', fontSize: '0.74rem' }}>
              Leaflet Engine • Live Corridor Geometry
            </div>
          </div>

          {/* Leaflet Canvas Container */}
          <div 
            ref={mapContainerRef} 
            style={{ 
              height: '460px', 
              width: '100%', 
              background: '#080b11',
              zIndex: 1
            }} 
          />

          {/* Bottom Telemetry Strip */}
          {activeRoute && (
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(14, 20, 31, 0.95)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Active Route Geometry
                </span>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: activeRoute.color }}>
                  {activeRoute.name}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '18px', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>DISTANCE</span>
                  <strong>{activeRoute.distance_km} km</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>TRANSIT ETA</span>
                  <strong style={{ color: '#f59e0b' }}>{activeRoute.duration_hours} hrs</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>DIESEL</span>
                  <strong>{activeRoute.fuel_litres} L</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>FRESHNESS</span>
                  <strong style={{ color: activeRoute.freshness_pct > 80 ? '#10b981' : '#f43f5e' }}>
                    {activeRoute.freshness_pct}%
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Route Cards & Profit Maximizer Comparison */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {comparisonData?.routes.map(route => {
            const isSelected = route.id === activeRouteId;
            return (
              <div
                key={route.id}
                onClick={() => setActiveRouteId(route.id)}
                style={{
                  background: isSelected ? 'rgba(14, 165, 233, 0.08)' : 'var(--bg-surface)',
                  border: `1px solid ${isSelected ? route.color : 'var(--border-subtle)'}`,
                  borderRadius: '8px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  boxShadow: isSelected ? `0 0 16px ${route.color}22` : 'none'
                }}
              >
                {/* Header Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    background: route.is_winner ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.06)',
                    color: route.is_winner ? '#10b981' : 'var(--text-muted)',
                    border: `1px solid ${route.is_winner ? '#10b98144' : 'transparent'}`
                  }}>
                    {route.tag}
                  </span>

                  <span style={{ fontSize: '0.82rem', fontFamily: 'JetBrains Mono', fontWeight: 800, color: route.is_winner ? '#10b981' : 'var(--text-primary)' }}>
                    ₹{route.farmer_net_per_kg.toFixed(2)}/kg net
                  </span>
                </div>

                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {route.name}
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                  {route.summary}
                </p>

                {/* Micro Metrics Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  background: 'rgba(8, 11, 17, 0.5)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontFamily: 'JetBrains Mono'
                }}>
                  <div>
                    <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>TIME</div>
                    <strong>{route.duration_hours}h</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>LOGISTICS</div>
                    <strong>₹{route.total_logistics_cost_rs}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>BRUISE LOSS</div>
                    <strong style={{ color: route.bruise_loss_rs > 500 ? '#f43f5e' : '#94a3b8' }}>
                      -₹{route.bruise_loss_rs}
                    </strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>FARMER NET</div>
                    <strong style={{ color: route.is_winner ? '#10b981' : '#ffffff' }}>
                      ₹{route.farmer_net_payout_rs}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Profit Maximization Deep-Dive Card (The Standout Blueprint Feature) */}
      {comparisonData && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
          border: '1px solid rgba(14, 165, 233, 0.3)',
          borderRadius: '8px',
          padding: '18px 22px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Award size={18} color="#0ea5e9" />
            <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: '#38bdf8' }}>
              Algorithmic Profit Maximization Proof: Why the Longer Route Wins
            </h3>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: '6px 0 14px 0' }}>
            {comparisonData.profit_maximization_justification}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            fontSize: '0.8rem',
            fontFamily: 'JetBrains Mono',
            background: 'rgba(8, 11, 17, 0.6)',
            padding: '12px 14px',
            borderRadius: '6px'
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>GROSS BUYER INVOICE</span>
              <strong style={{ color: '#ffffff' }}>
                {comparisonData.quantity_kg} kg @ ₹{comparisonData.buyer_agreed_price_per_kg}/kg = ₹{(comparisonData.quantity_kg * comparisonData.buyer_agreed_price_per_kg).toFixed(2)}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>EXPRESSWAY TOLL + FUEL</span>
              <strong style={{ color: '#f59e0b' }}>
                ₹{comparisonData.routes[0]?.fuel_cost_rs} fuel + ₹{comparisonData.routes[0]?.toll_cost_rs} toll
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>VIBRATION BRUISING AVOIDED</span>
              <strong style={{ color: '#10b981' }}>
                3.0% less bruising = +₹483 saved
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>FARMER NET PROFIT</span>
              <strong style={{ color: '#10b981', fontSize: '0.94rem' }}>
                ₹{comparisonData.routes[0]?.farmer_net_per_kg.toFixed(2)} / kg
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* 5. Perishable Thermal Decay & Commodity Temperature Science */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '18px 22px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Thermometer size={18} color="#f59e0b" />
          <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Perishable Thermal Degradation Model ($Q_{10}$ Decay Curves)
          </h3>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.4 }}>
          Each vegetable has a physiological respiration threshold. When ambient temperature exceeds the ideal range, respiration doubles every 10°C rise ($Q_{10} \approx 2.1$), rapidly degrading cellular firmness, skin integrity, and shelf-life.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'rgba(8, 11, 17, 0.6)', padding: '12px 14px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Tomato (Hybrid Red) Target
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b', margin: '4px 0' }}>
              12°C – 15°C
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              Susceptible to chilling injury below 10°C; rapid softness decay above 28°C.
            </div>
          </div>

          <div style={{ background: 'rgba(8, 11, 17, 0.6)', padding: '12px 14px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Onion (Nashik Red) Target
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>
              18°C – 25°C
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              High heat tolerance; vulnerable to high humidity (&gt;75% RH) and sprout decay.
            </div>
          </div>

          <div style={{ background: 'rgba(8, 11, 17, 0.6)', padding: '12px 14px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Spinach (Palak) Target
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f43f5e', margin: '4px 0' }}>
              2°C – 5°C
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              Extremely high respiration rate; wilts and turns yellow within 5 hours at &gt;30°C.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
