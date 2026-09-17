export interface MandiRecord {
  id: string;
  name: string;
  state: string;
  district: string;
  commodity: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalVolumeMT: number;
  tradeDate: string;
  trend: 'up' | 'down' | 'neutral';
  trendPct: number;
}

export interface CommodityPriceCorridor {
  commodity: string;
  currentMandiAvg: number;
  krishiClearClearedPrice: number;
  historicalRange: { min: number; max: number };
  forecastDays: {
    day: string;
    expectedPrice: number;
    lowerBound: number;
    upperBound: number;
    demandVolumeMT: number;
  }[];
}

export interface FarmerLot {
  id: string;
  fpoRef: string;
  farmerName: string;
  location: string;
  state: string;
  lat: number;
  lng: number;
  commodity: string;
  grade: string;
  quantityKg: number;
  askPricePerKg: number;
  harvestDate: string;
  isRefrigerated: boolean;
  status: 'PENDING_MATCH' | 'MATCHED' | 'IN_TRANSIT' | 'SETTLED' | 'DROPPED';
  bidsCount: number;
  qualityScore: number;
}

export interface BuyerDemand {
  id: string;
  buyerName: string;
  buyerType: 'INSTITUTIONAL' | 'RETAIL_CHAIN' | 'EXPORTER' | 'PROCESSOR';
  destination: string;
  lat: number;
  lng: number;
  commodity: string;
  gradeSpec: string;
  requiredKg: number;
  maxCeilingBidPerKg: number;
  deliveryDeadline: string;
  status: 'OPEN' | 'MATCHED' | 'FULFILLED';
}

export interface ClearingMatch {
  id: string;
  lotId: string;
  demandId: string;
  fpoRef: string;
  commodity: string;
  volumeKg: number;
  farmGateAsk: number;
  clearedPricePerKg: number;
  buyerBidPerKg: number;
  spreadNetSaved: number;
  spreadPct: number;
  transitOrigin: string;
  transitDestination: string;
  matchTimestamp: string;
  escrowStatus: 'ESCROW_LOCKED' | 'ESCROW_RELEASED' | 'PENDING';
}

export interface ClearingState {
  totalPools: number;
  activeFarmers: number;
  totalVolumeMT: number;
  clearedVolumeMT: number;
  avgClearingSpeedMs: number;
  netSavedRupees: number;
  matches: ClearingMatch[];
  unmatchedLots: FarmerLot[];
  openDemands: BuyerDemand[];
}

export interface SimulationParams {
  scenarioName: string;
  ambientTempC: number;
  trafficDelayPct: number;
  dieselPriceDeltaRs: number;
  temperatureSpikeC: number;
  simulateDropoutFarmerId?: string;
}

export interface SimulationResult {
  scenarioName: string;
  directBypassCost: number;
  traditionalApmcCost: number;
  spoilageRateDirectPct: number;
  spoilageRateApmcPct: number;
  farmerNetRealizationDeltaPct: number;
  transitDurationHours: number;
  co2EmissionsSavedKg: number;
  recommendedAction: string;
}

export interface RouteComparison {
  routeType: 'DIRECT_ALGORITHMIC' | 'TRADITIONAL_APMC';
  distanceKm: number;
  durationHours: number;
  transitSpoilagePct: number;
  tareWeightDeductionKg: number;
  tollAndMiddlemanFee: number;
  netFarmerPayout: number;
  freightCost: number;
  safetyScore: number;
}

export interface GatePass {
  passNumber: string;
  convoyId: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  originHub: string;
  destinationHub: string;
  cargoDescription: string;
  totalWeightMT: number;
  fastagRfidId: string;
  merkleRootHash: string;
  escrowVaultTx: string;
  issuedAt: string;
  expiresAt: string;
  reeferTempTarget: string;
  status: 'VALID_IN_TRANSIT' | 'COMPLETED' | 'REVOKED';
}

export interface FpoAnalytics {
  fpoName: string;
  registeredFarmers: number;
  totalVolumeHandledMT: number;
  totalDisbursedCrores: number;
  middlemanCommissionEliminatedRs: number;
  averageValueRecoveryPct: number;
  coldChainIntegrityPct: number;
  zeroTareValidationRatePct: number;
  upiSettlementSuccessRatePct: number;
}
