import type {
  MandiRecord,
  CommodityPriceCorridor,
  FarmerLot,
  BuyerDemand,
  ClearingMatch,
  ClearingState,
  SimulationParams,
  SimulationResult,
  RouteComparison,
  GatePass,
  FpoAnalytics,
} from '../types';
import {
  INITIAL_MANDI_RECORDS,
  COMMODITY_CORRIDORS,
  INITIAL_FARMER_LOTS,
  INITIAL_BUYER_DEMANDS,
  INITIAL_CLEARING_MATCHES,
  INITIAL_FPO_ANALYTICS,
  ACTIVE_GATE_PASS,
} from '../data/mockData';
import { procurementService } from '../services/procurementService';

// Local storage keys
const STORAGE_KEYS = {
  LOTS: 'krishiclear_farmer_lots_v1',
  DEMANDS: 'krishiclear_buyer_demands_v1',
  MATCHES: 'krishiclear_clearing_matches_v1',
  ANALYTICS: 'krishiclear_fpo_analytics_v1',
  DISBURSAL_HISTORY: 'krishiclear_disbursal_history_v1',
};

// Initial state helpers
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return fallback;
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export const apiClient = {
  // 2.1 Mandi Intelligence
  getMandiOverview: async (): Promise<{
    activeMarkets: number;
    commoditiesTracked: number;
    totalArrivalTodayMT: number;
    topGainers: MandiRecord[];
    records: MandiRecord[];
  }> => {
    await new Promise((r) => setTimeout(r, 80));
    return {
      activeMarkets: 184,
      commoditiesTracked: 42,
      totalArrivalTodayMT: 14890,
      topGainers: INITIAL_MANDI_RECORDS.filter((r) => r.trend === 'up'),
      records: INITIAL_MANDI_RECORDS,
    };
  },

  getMandiCorridor: async (commodity: string): Promise<CommodityPriceCorridor> => {
    await new Promise((r) => setTimeout(r, 60));
    const corridor = COMMODITY_CORRIDORS[commodity] || COMMODITY_CORRIDORS['Red Onion'];
    return corridor;
  },

  searchMandis: async (
    query?: string,
    state?: string,
    commodity?: string
  ): Promise<MandiRecord[]> => {
    await new Promise((r) => setTimeout(r, 70));
    let results = [...INITIAL_MANDI_RECORDS];
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.district.toLowerCase().includes(q) ||
          m.commodity.toLowerCase().includes(q)
      );
    }
    if (state) {
      results = results.filter((m) => m.state.toLowerCase() === state.toLowerCase());
    }
    if (commodity) {
      results = results.filter((m) =>
        m.commodity.toLowerCase().includes(commodity.toLowerCase())
      );
    }
    return results;
  },

  getCommodities: async (): Promise<string[]> => {
    return Object.keys(COMMODITY_CORRIDORS);
  },

  // 2.2 AI Forecasting
  getForecast: async (commodity: string, region = 'Western Maharashtra') => {
    await new Promise((r) => setTimeout(r, 80));
    const corridor = COMMODITY_CORRIDORS[commodity] || COMMODITY_CORRIDORS['Red Onion'];
    return {
      region,
      commodity,
      confidenceScore: 94.8,
      model: 'AgriCast-XGBoost-Ensemble-v4',
      corridor,
      summary: `Expected wholesale prices for ${commodity} in ${region} will trend upward over the next 72 hours driven by high export container volume at Nhava Sheva and dry weather in Solapur/Nashik belt.`,
    };
  },

  // 2.3 Clearing Engine
  getClearingState: async (): Promise<ClearingState> => {
    try {
      const res = await fetch('http://localhost:8000/api/clearing/state');
      if (res.ok) {
        const data = await res.json();
        return {
          totalPools: 42,
          activeFarmers: data.total_pooled_supply_kg > 0 ? 1842 : 0,
          totalVolumeMT: data.total_pooled_supply_kg / 1000,
          clearedVolumeMT: data.active_batch_count * 1.35, // dummy metric
          avgClearingSpeedMs: 18,
          netSavedRupees: data.active_batch_count * 30000, // dummy metric
          matches: Object.values(data.active_batches || {}).map((b: any) => ({
            id: b.batch_id,
            lotId: b.allocated_suppliers[0]?.farmer_id,
            demandId: b.allocated_buyers[0]?.buyer_id,
            fpoRef: b.allocated_suppliers[0]?.fpo,
            commodity: b.commodity,
            volumeKg: b.cleared_quantity_kg,
            farmGateAsk: b.allocated_suppliers[0]?.floor_price_rs,
            clearedPricePerKg: b.clearing_economics.buyer_delivered_rate_per_kg,
            buyerBidPerKg: 28.0,
            spreadNetSaved: b.clearing_economics.total_farmer_payout_rs,
            spreadPct: b.clearing_economics.farmer_uplift_pct,
            transitOrigin: b.route_plan.transit_origin,
            transitDestination: b.route_plan.transit_destination,
            matchTimestamp: b.cleared_at,
            escrowStatus: 'ESCROW_LOCKED'
          })),
          unmatchedLots: data.supply_pool,
          openDemands: data.demand_pool,
        } as unknown as ClearingState;
      }
    } catch(e) {}

    // Fallback to mock if backend is down
    const matches = getStored<ClearingMatch[]>(STORAGE_KEYS.MATCHES, INITIAL_CLEARING_MATCHES);
    const lots = getStored<FarmerLot[]>(STORAGE_KEYS.LOTS, INITIAL_FARMER_LOTS);
    const demands = getStored<BuyerDemand[]>(STORAGE_KEYS.DEMANDS, INITIAL_BUYER_DEMANDS);

    const totalSaved = matches.reduce((acc, m) => acc + m.spreadNetSaved, 0);
    const clearedVolume = matches.reduce((acc, m) => acc + m.volumeKg, 0) / 1000;

    return {
      totalPools: 42,
      activeFarmers: 1842,
      totalVolumeMT: 4280.4,
      clearedVolumeMT: clearedVolume,
      avgClearingSpeedMs: 18,
      netSavedRupees: totalSaved,
      matches,
      unmatchedLots: lots.filter((l) => l.status === 'PENDING_MATCH'),
      openDemands: demands.filter((d) => d.status === 'OPEN'),
    };
  },

  solveClearing: async (params: {
    ambientTempC: number;
    trafficDelayPct: number;
    dieselPrice: number;
    excludedSupplierId?: string;
  }): Promise<{
    matchedCount: number;
    totalClearedKg: number;
    netFarmerSurplusRs: number;
    matches: ClearingMatch[];
  }> => {
    try {
      const res = await fetch('http://localhost:8000/api/clearing/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ambient_temp_c: params.ambientTempC,
          traffic_delay_pct: params.trafficDelayPct,
          diesel_price: params.dieselPrice,
          excluded_supplier_id: params.excludedSupplierId
        })
      });
      if (res.ok) {
        const b = await res.json();
        const match: ClearingMatch = {
            id: b.batch_id,
            lotId: b.allocated_suppliers[0]?.farmer_id,
            demandId: b.allocated_buyers[0]?.buyer_id,
            fpoRef: b.allocated_suppliers[0]?.fpo,
            commodity: b.commodity,
            volumeKg: b.cleared_quantity_kg,
            farmGateAsk: b.allocated_suppliers[0]?.floor_price_rs,
            clearedPricePerKg: b.clearing_economics.buyer_delivered_rate_per_kg,
            buyerBidPerKg: 28.0,
            spreadNetSaved: b.clearing_economics.total_farmer_payout_rs,
            spreadPct: b.clearing_economics.farmer_uplift_pct,
            transitOrigin: b.route_plan.transit_origin,
            transitDestination: b.route_plan.transit_destination,
            matchTimestamp: b.cleared_at,
            escrowStatus: 'ESCROW_LOCKED'
        };
        const matches = [match];
        setStored(STORAGE_KEYS.MATCHES, matches);
        return {
          matchedCount: matches.length,
          totalClearedKg: b.cleared_quantity_kg,
          netFarmerSurplusRs: b.clearing_economics.total_farmer_payout_rs,
          matches,
        };
      }
    } catch(e) {}

    // Fallback to mock
    await new Promise((r) => setTimeout(r, 220));
    let matches = getStored<ClearingMatch[]>(STORAGE_KEYS.MATCHES, INITIAL_CLEARING_MATCHES);

    if (params.excludedSupplierId) {
      matches = matches.filter((m) => m.lotId !== params.excludedSupplierId);
    }

    const totalClearedKg = matches.reduce((acc, m) => acc + m.volumeKg, 0);
    const netFarmerSurplusRs = matches.reduce((acc, m) => acc + m.spreadNetSaved, 0);

    return {
      matchedCount: matches.length,
      totalClearedKg,
      netFarmerSurplusRs,
      matches,
    };
  },

  reclearMarket: async (droppedFarmerId: string): Promise<{
    reallocatedCount: number;
    message: string;
    newMatches: ClearingMatch[];
  }> => {
    try {
      const res = await fetch('http://localhost:8000/api/clearing/reclear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dropped_farmer_id: droppedFarmerId })
      });
      if (res.ok) {
        const b = await res.json();
        const match: ClearingMatch = {
            id: b.batch_id,
            lotId: b.allocated_suppliers[0]?.farmer_id,
            demandId: b.allocated_buyers[0]?.buyer_id,
            fpoRef: b.allocated_suppliers[0]?.fpo,
            commodity: b.commodity,
            volumeKg: b.cleared_quantity_kg,
            farmGateAsk: b.allocated_suppliers[0]?.floor_price_rs,
            clearedPricePerKg: b.clearing_economics.buyer_delivered_rate_per_kg,
            buyerBidPerKg: 28.0,
            spreadNetSaved: b.clearing_economics.total_farmer_payout_rs,
            spreadPct: b.clearing_economics.farmer_uplift_pct,
            transitOrigin: b.route_plan.transit_origin,
            transitDestination: b.route_plan.transit_destination,
            matchTimestamp: b.cleared_at,
            escrowStatus: 'ESCROW_LOCKED'
        };
        const newMatches = [match];
        setStored(STORAGE_KEYS.MATCHES, newMatches);
        return {
          reallocatedCount: newMatches.length,
          message: `System auto-recleared: Substitute found without fulfillment penalty.`,
          newMatches,
        };
      }
    } catch(e) {}

    await new Promise((r) => setTimeout(r, 180));
    let matches = getStored<ClearingMatch[]>(STORAGE_KEYS.MATCHES, INITIAL_CLEARING_MATCHES);
    matches = matches.filter((m) => m.lotId !== droppedFarmerId);
    setStored(STORAGE_KEYS.MATCHES, matches);

    return {
      reallocatedCount: matches.length,
      message: `System auto-recleared in 14ms: Farmer ${droppedFarmerId} drop-out absorbed by reserve FPO pool with zero fulfillment penalty.`,
      newMatches: matches,
    };
  },

  // 2.4 Digital Twin Simulation
  runSimulation: async (params: SimulationParams): Promise<SimulationResult> => {
    await new Promise((r) => setTimeout(r, 280));
    const tempImpact = (params.ambientTempC + params.temperatureSpikeC - 20) * 0.18;
    const trafficImpact = params.trafficDelayPct * 0.08;
    const fuelImpact = params.dieselPriceDeltaRs * 180;

    const directCost = 14200 + fuelImpact * 0.45;
    const apmcCost = 28600 + fuelImpact * 1.1 + (tempImpact + trafficImpact) * 3400;

    const spoilageDirect = Math.max(0.08, 0.12 + (params.temperatureSpikeC * 0.03));
    const spoilageApmc = Math.min(8.5, 3.2 + (params.ambientTempC * 0.12) + (params.trafficDelayPct * 0.06));
    const deltaFarmer = Math.max(12.0, 23.4 - (params.dieselPriceDeltaRs * 0.15) - (trafficImpact * 0.2));

    return {
      scenarioName: params.scenarioName,
      directBypassCost: Math.round(directCost),
      traditionalApmcCost: Math.round(apmcCost),
      spoilageRateDirectPct: Number(spoilageDirect.toFixed(2)),
      spoilageRateApmcPct: Number(spoilageApmc.toFixed(2)),
      farmerNetRealizationDeltaPct: Number(deltaFarmer.toFixed(1)),
      transitDurationHours: Number((2.8 + params.trafficDelayPct * 0.04).toFixed(1)),
      co2EmissionsSavedKg: 142,
      recommendedAction:
        params.temperatureSpikeC > 4
          ? 'Maintain reefer pre-cooling cycle at 12.5°C; bypass Moshi surface bypass to preserve shelf-life.'
          : 'Normal algorithmic dispatch clearance recommended. ZERO middleman tare loss confirmed.',
    };
  },

  // 2.5 Logistics & Route Compare
  compareRoutes: async (params?: {
    commodity?: string;
    quantityKg?: number;
    ambientTempC?: number;
    dieselPrice?: number;
    isRefrigerated?: boolean;
  }): Promise<{
    directRoute: RouteComparison;
    traditionalRoute: RouteComparison;
    savingsRupees: number;
    timeSavedHours: number;
  }> => {
    await new Promise((r) => setTimeout(r, 120));
    const qty = params?.quantityKg || 14500;
    const directPayout = qty * 31.2;
    const apmcPayout = qty * 24.5 - (qty * 0.042 * 24.5) - 3400; // tare theft deduction + dalaal fee

    return {
      directRoute: {
        routeType: 'DIRECT_ALGORITHMIC',
        distanceKm: 108.5,
        durationHours: 2.2,
        transitSpoilagePct: 0.12,
        tareWeightDeductionKg: 0,
        tollAndMiddlemanFee: 420, // FASTag toll only
        netFarmerPayout: Math.round(directPayout),
        freightCost: 4800,
        safetyScore: 99.4,
      },
      traditionalRoute: {
        routeType: 'TRADITIONAL_APMC',
        distanceKm: 174.0,
        durationHours: 6.8,
        transitSpoilagePct: 4.8,
        tareWeightDeductionKg: Math.round(qty * 0.042), // 4.2% tare theft
        tollAndMiddlemanFee: 18400, // 8.5% broker commission + uncalibrated weighing fees
        netFarmerPayout: Math.round(apmcPayout),
        freightCost: 9200,
        safetyScore: 61.2,
      },
      savingsRupees: Math.round(directPayout - apmcPayout),
      timeSavedHours: 4.6,
    };
  },

  // 2.6 Compliance & Gate Pass
  verifyCompliance: async (convoyId: string) => {
    await new Promise((r) => setTimeout(r, 90));
    return {
      convoyId,
      status: 'VERIFIED_COMPLIANT',
      merkleVerified: true,
      merkleRoot: '0x8F9A...41C7_ROOT',
      fastagValid: true,
      escrowLocked: true,
      escrowBalanceRs: 5840000,
      timestamp: new Date().toISOString(),
    };
  },

  getGatePass: async (passId?: string): Promise<GatePass> => {
    await new Promise((r) => setTimeout(r, 70));
    return ACTIVE_GATE_PASS;
  },

  getFpoAnalytics: async (): Promise<FpoAnalytics> => {
    await new Promise((r) => setTimeout(r, 60));
    const state = await procurementService.loadMarketplaceState();
    return state.analytics ?? INITIAL_FPO_ANALYTICS;
  },

  listProduce: async (lot: Omit<FarmerLot, 'id' | 'fpoRef' | 'status' | 'bidsCount' | 'qualityScore'>): Promise<FarmerLot> => {
    try {
      const res = await fetch('http://localhost:8000/api/farmer/list-produce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_name: lot.farmerName,
          location: lot.location,
          lat: lot.lat,
          lon: lot.lng,
          commodity: lot.commodity,
          grade: lot.grade,
          available_kg: lot.quantityKg,
          farmer_floor_price_rs: lot.askPricePerKg,
          hours_since_harvest: 2.0,
        })
      });
      if (res.ok) {
        const data = await res.json();
        const newLot: FarmerLot = {
          ...lot,
          id: data.lot.farmer_id,
          fpoRef: data.lot.fpo_affiliation,
          status: 'PENDING_MATCH',
          bidsCount: 1,
          qualityScore: 98.2,
        };
        const lots = getStored<FarmerLot[]>(STORAGE_KEYS.LOTS, INITIAL_FARMER_LOTS);
        setStored(STORAGE_KEYS.LOTS, [newLot, ...lots]);
        return newLot;
      }
    } catch(e) {}

    const newLot = await procurementService.addLot(lot);
    return newLot;
  },

  createDemand: async (demand: Omit<BuyerDemand, 'id' | 'status'>): Promise<BuyerDemand> => {
    try {
      const res = await fetch('http://localhost:8000/api/buyer/create-demand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_name: demand.buyerName,
          destination: demand.destination,
          lat: demand.lat,
          lon: demand.lng,
          commodity: demand.commodity,
          grade: demand.gradeSpec,
          requested_kg: demand.requiredKg,
          buyer_ceiling_price_rs: demand.maxCeilingBidPerKg,
          buyer_type: demand.buyerType
        })
      });
      if (res.ok) {
        const data = await res.json();
        const newDemand: BuyerDemand = {
          ...demand,
          id: data.demand.buyer_id,
          status: 'OPEN',
        };
        const demands = getStored<BuyerDemand[]>(STORAGE_KEYS.DEMANDS, INITIAL_BUYER_DEMANDS);
        setStored(STORAGE_KEYS.DEMANDS, [newDemand, ...demands]);
        return newDemand;
      }
    } catch(e) {}

    const newDemand = await procurementService.addDemand(demand);
    return newDemand;
  },

  // Disbursal Execution
  fireUpiDisbursal: async (): Promise<{
    txId: string;
    recipientsCount: number;
    totalAmountRs: number;
    executionSpeedMs: number;
    timestamp: string;
  }> => {
    await new Promise((r) => setTimeout(r, 550));
    const txId = `#UPI_KRS_${Math.floor(1000000 + Math.random() * 9000000)}`;
    const history = getStored<string[]>(STORAGE_KEYS.DISBURSAL_HISTORY, []);
    setStored(STORAGE_KEYS.DISBURSAL_HISTORY, [txId, ...history]);

    return {
      txId,
      recipientsCount: 1842,
      totalAmountRs: 1844290,
      executionSpeedMs: 140,
      timestamp: new Date().toISOString(),
    };
  },

  // Kisan Assistant queries
  askKisanAssistant: async (query: string, lang = 'en'): Promise<{
    answer: string;
    intent: string;
    quickStats?: { label: string; value: string }[];
  }> => {
    await new Promise((r) => setTimeout(r, 220));
    const lower = query.toLowerCase();

    if (lower.includes('onion') || lower.includes('कांदा') || lower.includes('pyruvate')) {
      return {
        intent: 'PRICE_QUERY',
        answer: 'Nashik Red Rabi export bulb is clearing at ₹31.20/kg via KrishiClear algorithmic match, beating Lasalgaon APMC modal price of ₹24.50/kg by +27.3%. Middleman commission of 8% is eliminated.',
        quickStats: [
          { label: 'Cleared Bid', value: '₹31.20 /kg' },
          { label: 'APMC Modal', value: '₹24.50 /kg' },
          { label: 'Extra Yield', value: '+₹1,47,400 per 22 MT' },
        ],
      };
    }

    if (lower.includes('pomegranate') || lower.includes('डाळिंब') || lower.includes('anar') || lower.includes('solapur')) {
      return {
        intent: 'EXPORT_QUALITY_QUERY',
        answer: 'Solapur Bhagwa Anar Euro-GAP AAA (Brix 16.8°) matched with Gulf Air Cargo Bay 04 at ₹168.50/kg vs local APMC ₹142.00/kg. Aril density is 94% with zero cold-chain degradation.',
        quickStats: [
          { label: 'Export Cleared', value: '₹168.50 /kg' },
          { label: 'Brix Level', value: '16.8° Prime' },
          { label: 'Reefer Temp', value: '13.8°C Nominal' },
        ],
      };
    }

    if (lower.includes('convoy') || lower.includes('truck') || lower.includes('mh-14') || lower.includes('transit')) {
      return {
        intent: 'LOGISTICS_STATUS',
        answer: 'Convoy MH-14-AZ-9904 is currently at Moshi Logistics Junction moving at 64.2 km/h. Chakan T-01 toll cleared in 0.04s. ETA to Pune Agri-Cargo Terminal is 38 minutes.',
        quickStats: [
          { label: 'Current Gate', value: 'Moshi Junction' },
          { label: 'Progress', value: '68.4% (74.2 / 108.5 km)' },
          { label: 'Tare Loss', value: '0.00% Verified' },
        ],
      };
    }

    return {
      intent: 'GENERAL_ASSISTANCE',
      answer: `KrishiClear algorithmic engine is active across 42 FPO pools. 1,842 farmers have received ₹18.44 Lakhs via T+0 NPCI IMPS-UPI high-ticket rails, eliminating middleman deductions.`,
      quickStats: [
        { label: 'Active FPOs', value: '42 Clusters' },
        { label: 'Value Recovery', value: '+23.4%' },
        { label: 'System Uptime', value: '99.98%' },
      ],
    };
  },
};
