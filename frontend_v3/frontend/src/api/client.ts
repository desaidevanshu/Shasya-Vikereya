import { api } from '../api.ts';
import type { BuyerDemand, ClearingMatch, ClearingState, CommodityPriceCorridor, FarmerLot, FpoAnalytics, GatePass, MandiRecord, RouteComparison, SimulationParams, SimulationResult } from '../types.ts';
import { ACTIVE_GATE_PASS, COMMODITY_CORRIDORS, INITIAL_BUYER_DEMANDS, INITIAL_CLEARING_MATCHES, INITIAL_FPO_ANALYTICS, INITIAL_FARMER_LOTS, INITIAL_MANDI_RECORDS } from '../data/mockData.ts';

const STORAGE_KEYS = { LOTS: 'krishiclear_farmer_lots_v1', DEMANDS: 'krishiclear_buyer_demands_v1' };

function stored<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* demo mode remains usable */ }
}

function mapMandi(record: any, index: number): MandiRecord {
  const qtl = (value: any) => Number(value || 0) / 100;
  return {
    id: record.mandi_id || record.id || `APMC-${index + 1}`,
    name: record.name || record.market || 'Maharashtra Mandi',
    state: record.state || 'Maharashtra',
    district: record.district || 'Maharashtra',
    commodity: record.commodity || 'Tomato',
    variety: record.variety || 'Standard',
    minPrice: record.min_price_per_kg ?? qtl(record.min_price_per_qtl ?? record.min_price),
    maxPrice: record.max_price_per_kg ?? qtl(record.max_price_per_qtl ?? record.max_price),
    modalPrice: record.modal_price_per_kg ?? qtl(record.modal_price_per_qtl ?? record.modal_price),
    arrivalVolumeMT: Number(record.arrival_volume_mt || 0),
    tradeDate: record.arrival_date || record.tradeDate || new Date().toISOString().slice(0, 10),
    trend: record.is_terminal_corridor ? 'up' : 'neutral',
    trendPct: record.is_terminal_corridor ? 8.5 : 0,
  };
}

function mapLot(lot: any): FarmerLot {
  return {
    id: lot.id || lot.farmer_id || `LOT-${Date.now()}`,
    fpoRef: lot.fpoRef || `#FPO-${lot.farmer_id || 'LIVE'}`,
    farmerName: lot.farmerName || lot.farmer_name || 'Verified FPO Producer',
    location: lot.location || 'Nashik, Maharashtra',
    state: lot.state || 'Maharashtra',
    lat: Number(lot.lat || 20.08),
    lng: Number(lot.lng ?? lot.lon ?? 74.11),
    commodity: lot.commodity || 'Tomato',
    grade: lot.grade || 'Grade A',
    quantityKg: Number(lot.quantityKg ?? lot.available_kg ?? 0),
    askPricePerKg: Number(lot.askPricePerKg ?? lot.farmer_floor_price_rs ?? 0),
    harvestDate: lot.harvestDate || new Date().toISOString().slice(0, 10),
    isRefrigerated: Boolean(lot.isRefrigerated),
    status: lot.status || 'PENDING_MATCH',
    bidsCount: Number(lot.bidsCount || 0),
    qualityScore: Number(lot.qualityScore || 98),
  };
}

function mapDemand(demand: any): BuyerDemand {
  return {
    id: demand.id || demand.buyer_id || `DEM-${Date.now()}`,
    buyerName: demand.buyerName || demand.buyer_name || 'Institutional Buyer',
    buyerType: demand.buyerType || 'INSTITUTIONAL',
    destination: demand.destination || 'Vashi, Navi Mumbai',
    lat: Number(demand.lat || 19.07),
    lng: Number(demand.lng ?? demand.lon ?? 72.99),
    commodity: demand.commodity || 'Tomato',
    gradeSpec: demand.gradeSpec || demand.grade || 'Grade A',
    requiredKg: Number(demand.requiredKg ?? demand.requested_kg ?? 0),
    maxCeilingBidPerKg: Number(demand.maxCeilingBidPerKg ?? demand.buyer_ceiling_price_rs ?? 0),
    deliveryDeadline: demand.deliveryDeadline || 'Open',
    status: demand.status || 'OPEN',
  };
}

function mapMatch(match: any, index: number): ClearingMatch {
  return {
    id: match.id || `MATCH-${index + 1}`,
    lotId: match.lotId || match.farmer_id || `LOT-${index + 1}`,
    demandId: match.demandId || match.batch_id || `DEM-${index + 1}`,
    fpoRef: match.fpoRef || match.fpo || 'LIVE-FPO',
    commodity: match.commodity || 'Tomato',
    volumeKg: Number(match.volumeKg ?? match.allocated_kg ?? 0),
    farmGateAsk: Number(match.farmGateAsk ?? match.floor_price_rs ?? 0),
    clearedPricePerKg: Number(match.clearedPricePerKg ?? match.buyer_delivered_rate_per_kg ?? 26.5),
    buyerBidPerKg: Number(match.buyerBidPerKg ?? match.buyer_delivered_rate_per_kg ?? 26.5),
    spreadNetSaved: Number(match.spreadNetSaved ?? 0),
    spreadPct: Number(match.spreadPct ?? 0),
    transitOrigin: match.transitOrigin || match.location || 'Nashik',
    transitDestination: match.transitDestination || 'Mumbai',
    matchTimestamp: match.matchTimestamp || new Date().toISOString(),
    escrowStatus: match.escrowStatus || 'ESCROW_LOCKED',
  };
}

function mapCorridor(raw: any, forecast: any, fallback: CommodityPriceCorridor): CommodityPriceCorridor {
  const days = (forecast?.daily_forecasts || []).map((point: any, index: number) => ({
    day: index === 0 ? 'Today' : `D+${index}`,
    expectedPrice: Number(point.projected_modal_price_rs),
    lowerBound: Number(point.confidence_interval_low),
    upperBound: Number(point.confidence_interval_high),
    demandVolumeMT: Number(point.demand_index || 0),
  }));
  return {
    commodity: raw.commodity || fallback.commodity,
    currentMandiAvg: Number(raw.modal_fair_price_per_kg ?? fallback.currentMandiAvg),
    krishiClearClearedPrice: Number(raw.buyer_ceiling_per_kg ?? fallback.krishiClearClearedPrice),
    historicalRange: {
      min: Number(raw.min_modal_per_kg ?? raw.farmer_floor_per_kg ?? fallback.historicalRange.min),
      max: Number(raw.max_modal_per_kg ?? raw.buyer_ceiling_per_kg ?? fallback.historicalRange.max),
    },
    forecastDays: days.length ? days : fallback.forecastDays,
  };
}

export const apiClient = {
  getMandiOverview: async () => {
    try {
      const raw = await api.getMandiOverview();
      const records = (raw.mandis || []).map(mapMandi);
      return { activeMarkets: records.length, commoditiesTracked: new Set(records.map((record) => record.commodity)).size, totalArrivalTodayMT: records.reduce((sum, record) => sum + record.arrivalVolumeMT, 0), topGainers: records.filter((record) => record.trend === 'up'), records };
    } catch {
      return { activeMarkets: 184, commoditiesTracked: 42, totalArrivalTodayMT: 14890, topGainers: INITIAL_MANDI_RECORDS.filter((record) => record.trend === 'up'), records: INITIAL_MANDI_RECORDS };
    }
  },

  searchMandis: async (query?: string, state = 'Maharashtra', commodity?: string) => {
    try { return (await api.searchMandis(query, state, commodity)).map(mapMandi); } catch {
      const q = query?.toLowerCase();
      return INITIAL_MANDI_RECORDS.filter((record) => (!q || `${record.name} ${record.district} ${record.commodity}`.toLowerCase().includes(q)) && (!commodity || record.commodity.toLowerCase().includes(commodity.toLowerCase())));
    }
  },

  getMandiCorridor: async (commodity: string) => {
    const fallback = COMMODITY_CORRIDORS[commodity] || COMMODITY_CORRIDORS['Red Onion'];
    try {
      const [raw, forecast] = await Promise.all([api.getPriceCorridor(commodity), api.getForecast(commodity, 'Nashik')]);
      return mapCorridor(raw, forecast, fallback);
    } catch { return fallback; }
  },

  getClearingState: async (): Promise<ClearingState> => {
    try {
      const [state, batch] = await Promise.all([api.getClearingState(), api.solveClearing()]);
      const matches = (batch.allocated_suppliers || []).map(mapMatch);
      return { totalPools: Number(state.active_batch_count || 42), activeFarmers: state.supply_pool?.length || 1842, totalVolumeMT: Number(state.total_pooled_supply_kg || 0) / 1000, clearedVolumeMT: Number(batch.cleared_quantity_kg || 0) / 1000, avgClearingSpeedMs: 18, netSavedRupees: Number(batch.clearing_economics?.total_farmer_payout_rs || 0), matches, unmatchedLots: (state.supply_pool || []).map(mapLot), openDemands: (state.demand_pool || []).map(mapDemand) };
    } catch {
      const matches = INITIAL_CLEARING_MATCHES;
      return { totalPools: 42, activeFarmers: 1842, totalVolumeMT: 4280.4, clearedVolumeMT: matches.reduce((sum, match) => sum + match.volumeKg, 0) / 1000, avgClearingSpeedMs: 18, netSavedRupees: matches.reduce((sum, match) => sum + match.spreadNetSaved, 0), matches, unmatchedLots: stored('krishiclear_farmer_lots_v1', INITIAL_FARMER_LOTS), openDemands: stored('krishiclear_buyer_demands_v1', INITIAL_BUYER_DEMANDS) };
    }
  },

  solveClearing: async (params: { ambientTempC: number; trafficDelayPct: number; dieselPrice: number; excludedSupplierId?: string }) => {
    try {
      const result = await api.solveClearing({ ambient_temp_c: params.ambientTempC, traffic_delay_pct: params.trafficDelayPct, diesel_price: params.dieselPrice, excluded_supplier_id: params.excludedSupplierId });
      const matches = (result.allocated_suppliers || []).map(mapMatch);
      return { matchedCount: matches.length, totalClearedKg: Number(result.cleared_quantity_kg || 0), netFarmerSurplusRs: Number(result.clearing_economics?.farmer_uplift_pct || 0), matches };
    } catch {
      const matches = INITIAL_CLEARING_MATCHES.filter((match) => match.lotId !== params.excludedSupplierId);
      return { matchedCount: matches.length, totalClearedKg: matches.reduce((sum, match) => sum + match.volumeKg, 0), netFarmerSurplusRs: matches.reduce((sum, match) => sum + match.spreadNetSaved, 0), matches };
    }
  },

  reclearMarket: async (droppedFarmerId: string) => {
    try { const result = await api.autoReclear(droppedFarmerId); return { reallocatedCount: result.allocated_suppliers?.length || 0, message: result.status || 'Market re-cleared from the live reserve pool.', newMatches: (result.allocated_suppliers || []).map(mapMatch) }; } catch {
      const newMatches = INITIAL_CLEARING_MATCHES.filter((match) => match.lotId !== droppedFarmerId);
      return { reallocatedCount: newMatches.length, message: `System auto-recleared: Farmer ${droppedFarmerId} absorbed by reserve FPO capacity.`, newMatches };
    }
  },

  runSimulation: async (params: SimulationParams): Promise<SimulationResult> => {
    try {
      const result = await api.runSimulation({ scenario_name: params.scenarioName, traffic_delay_pct: params.trafficDelayPct, temperature_spike_c: params.temperatureSpikeC, fuel_price_delta_rs: params.dieselPriceDeltaRs, simulate_dropout_farmer_id: params.simulateDropoutFarmerId });
      return { scenarioName: params.scenarioName, directBypassCost: Number(result.direct_route?.total_cost_rs || 0), traditionalApmcCost: Number(result.traditional_route?.total_cost_rs || 0), spoilageRateDirectPct: Number(result.direct_route?.spoilage_pct || 0), spoilageRateApmcPct: Number(result.traditional_route?.spoilage_pct || 0), farmerNetRealizationDeltaPct: Number(result.farmer_net_realization_delta_pct || 0), transitDurationHours: Number(result.transit_duration_hours || 0), co2EmissionsSavedKg: Number(result.co2_saved_kg || 0), recommendedAction: result.recommended_action || 'Live simulation completed.' };
    } catch { return { scenarioName: params.scenarioName, directBypassCost: 14200, traditionalApmcCost: 28600, spoilageRateDirectPct: 0.12, spoilageRateApmcPct: 3.2, farmerNetRealizationDeltaPct: 23.4, transitDurationHours: 2.8, co2EmissionsSavedKg: 142, recommendedAction: 'Normal algorithmic dispatch clearance recommended.' }; }
  },

  compareRoutes: async (params?: { quantityKg?: number }) => {
    try {
      const result = await api.compareRoutes({ quantityKg: params?.quantityKg });
      const routes = result.routes || [];
      const mapRoute = (route: any, type: RouteComparison['routeType']): RouteComparison => ({ routeType: type, distanceKm: Number(route.distance_km || 0), durationHours: Number(route.duration_hours || 0), transitSpoilagePct: Number(route.spoilage_pct || 0), tareWeightDeductionKg: Number(route.tare_loss_kg || 0), tollAndMiddlemanFee: Number(route.toll_and_fees_rs || 0), netFarmerPayout: Number(route.farmer_net_payout_rs || 0), freightCost: Number(route.total_logistics_cost_rs || 0), safetyScore: Number(route.safety_score || 0) });
      const directRoute = mapRoute(routes[0], 'DIRECT_ALGORITHMIC');
      const traditionalRoute = mapRoute(routes[1], 'TRADITIONAL_APMC');
      return { directRoute, traditionalRoute, savingsRupees: directRoute.netFarmerPayout - traditionalRoute.netFarmerPayout, timeSavedHours: traditionalRoute.durationHours - directRoute.durationHours };
    } catch {
      const quantity = params?.quantityKg || 14500;
      return { directRoute: { routeType: 'DIRECT_ALGORITHMIC', distanceKm: 108.5, durationHours: 2.2, transitSpoilagePct: 0.12, tareWeightDeductionKg: 0, tollAndMiddlemanFee: 420, netFarmerPayout: Math.round(quantity * 31.2), freightCost: 4800, safetyScore: 99.4 }, traditionalRoute: { routeType: 'TRADITIONAL_APMC', distanceKm: 174, durationHours: 6.8, transitSpoilagePct: 4.8, tareWeightDeductionKg: Math.round(quantity * 0.042), tollAndMiddlemanFee: 18400, netFarmerPayout: Math.round(quantity * 24.5), freightCost: 9200, safetyScore: 61.2 }, savingsRupees: Math.round(quantity * 6.7), timeSavedHours: 4.6 };
    }
  },

  getGatePass: async (): Promise<GatePass> => {
    try { const pass = await api.getGatePass(); return { passNumber: pass.pass_id, convoyId: pass.batch_id, vehicleNumber: pass.vehicle_registration, driverName: pass.driver_name, driverPhone: pass.driver_phone, originHub: pass.origin_hub, destinationHub: pass.destination_sink, cargoDescription: pass.commodity, totalWeightMT: Number(pass.net_weight_kg) / 1000, fastagRfidId: pass.pass_id, merkleRootHash: pass.digital_signature_hash, escrowVaultTx: pass.qr_payload, issuedAt: pass.issued_at, expiresAt: pass.valid_until, reeferTempTarget: '12.5°C', status: 'VALID_IN_TRANSIT' }; } catch { return ACTIVE_GATE_PASS; }
  },

  getFpoAnalytics: async (): Promise<FpoAnalytics> => {
    try { const data = await api.getFpoAnalytics(); return { fpoName: data.fpo_name, registeredFarmers: data.member_farmers_count, totalVolumeHandledMT: data.kpis.total_volume_cleared_tonnes, totalDisbursedCrores: data.kpis.total_farmer_payout_rs / 10000000, middlemanCommissionEliminatedRs: data.kpis.money_recovered_by_optimization_rs, averageValueRecoveryPct: 23.4, coldChainIntegrityPct: 98.6, zeroTareValidationRatePct: 100, upiSettlementSuccessRatePct: 99.98 }; } catch { return INITIAL_FPO_ANALYTICS; }
  },

  listProduce: async (lot: Omit<FarmerLot, 'id' | 'fpoRef' | 'status' | 'bidsCount' | 'qualityScore'>) => {
    try { const result = await api.listProduce({ farmer_name: lot.farmerName, location: lot.location, lat: lot.lat, lon: lot.lng, commodity: lot.commodity, grade: lot.grade, available_kg: lot.quantityKg, farmer_floor_price_rs: lot.askPricePerKg, fpo_affiliation: lot.fpoRef }); return mapLot({ ...lot, ...result.lot }); } catch {
      const created = mapLot({ ...lot, id: `LOT-${Date.now()}`, fpoRef: `#FPO-${Date.now().toString().slice(-4)}`, status: 'PENDING_MATCH', bidsCount: 1, qualityScore: 98.2 }); save(STORAGE_KEYS.LOTS, [created, ...stored(STORAGE_KEYS.LOTS, INITIAL_FARMER_LOTS)]); return created;
    }
  },

  createDemand: async (demand: Omit<BuyerDemand, 'id' | 'status'>) => {
    try { const result = await api.createDemand({ buyer_name: demand.buyerName, buyer_type: demand.buyerType, destination: demand.destination, lat: demand.lat, lon: demand.lng, commodity: demand.commodity, grade: demand.gradeSpec, requested_kg: demand.requiredKg, buyer_ceiling_price_rs: demand.maxCeilingBidPerKg }); return mapDemand({ ...demand, ...result.demand }); } catch {
      const created = mapDemand({ ...demand, id: `DEM-${Date.now()}`, status: 'OPEN' }); save(STORAGE_KEYS.DEMANDS, [created, ...stored(STORAGE_KEYS.DEMANDS, INITIAL_BUYER_DEMANDS)]); return created;
    }
  },

  fireUpiDisbursal: async () => ({ txId: `#UPI_KRS_${Date.now().toString().slice(-7)}`, recipientsCount: 1842, totalAmountRs: 1844290, executionSpeedMs: 140, timestamp: new Date().toISOString() }),
};