/**
 * KrishiClear Frontend API Client.
 * Connects directly to the FastAPI Backend which integrates live with data.gov.in
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export async function fetchWithFallback<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call failed for ${url}, using fallback.`, err);
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw err;
  }
}

export const api = {
  getMandiOverview: async () => {
    return fetchWithFallback(`${API_BASE_URL}/mandi/overview`, { method: 'GET' });
  },

  getPriceCorridor: async (commodity = "Tomato") => {
    return fetchWithFallback(`${API_BASE_URL}/mandi/corridor?commodity=${encodeURIComponent(commodity)}`, { method: 'GET' });
  },

  searchMandis: async (query?: string, state = "Maharashtra", commodity?: string, limit = 50) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (state) params.append('state', state);
    if (commodity) params.append('commodity', commodity);
    params.append('limit', String(limit));
    return fetchWithFallback(`${API_BASE_URL}/mandi/search?${params.toString()}`, { method: 'GET' }, []);
  },

  getAvailableCommodities: async (state = "Maharashtra") => {
    return fetchWithFallback(`${API_BASE_URL}/mandi/commodities?state=${encodeURIComponent(state)}`, { method: 'GET' }, {
      state,
      total: 0,
      commodities: ['Tomato', 'Onion', 'Bhindi(Ladies Finger)', 'Brinjal', 'Cabbage', 'Cauliflower', 'Green Chilli', 'Potato']
    });
  },

  getForecast: async (commodity = "Tomato", region = "Nashik") => {
    return fetchWithFallback(`${API_BASE_URL}/forecast?commodity=${encodeURIComponent(commodity)}&region=${encodeURIComponent(region)}`, { method: 'GET' });
  },

  getClearingState: async () => {
    return fetchWithFallback(`${API_BASE_URL}/clearing/state`, { method: 'GET' });
  },

  solveClearing: async (params: { ambient_temp_c?: number; traffic_delay_pct?: number; diesel_price?: number; excluded_supplier_id?: string } = {}) => {
    return fetchWithFallback(`${API_BASE_URL}/clearing/solve`, {
      method: 'POST',
      body: JSON.stringify({
        ambient_temp_c: params.ambient_temp_c ?? 30.0,
        traffic_delay_pct: params.traffic_delay_pct ?? 0.0,
        diesel_price: params.diesel_price ?? 94.20,
        excluded_supplier_id: params.excluded_supplier_id ?? null
      })
    });
  },

  autoReclear: async (droppedFarmerId: string) => {
    return fetchWithFallback(`${API_BASE_URL}/clearing/reclear`, {
      method: 'POST',
      body: JSON.stringify({ dropped_farmer_id: droppedFarmerId })
    });
  },

  runSimulation: async (params: {
    scenario_name?: string;
    traffic_delay_pct?: number;
    temperature_spike_c?: number;
    fuel_price_delta_rs?: number;
    simulate_dropout_farmer_id?: string | null;
  }) => {
    return fetchWithFallback(`${API_BASE_URL}/simulation/run`, {
      method: 'POST',
      body: JSON.stringify({
        scenario_name: params.scenario_name || "custom",
        traffic_delay_pct: params.traffic_delay_pct || 0.0,
        temperature_spike_c: params.temperature_spike_c || 0.0,
        fuel_price_delta_rs: params.fuel_price_delta_rs || 0.0,
        simulate_dropout_farmer_id: params.simulate_dropout_farmer_id || null
      })
    });
  },

  getCompliance: async () => {
    return fetchWithFallback(`${API_BASE_URL}/compliance/verify`, { method: 'GET' });
  },

  getFpoAnalytics: async () => {
    return fetchWithFallback(`${API_BASE_URL}/fpo/analytics`, { method: 'GET' });
  },

  listProduce: async (lot: any) => {
    return fetchWithFallback(`${API_BASE_URL}/farmer/list-produce`, {
      method: 'POST',
      body: JSON.stringify(lot)
    });
  },

  createDemand: async (rfq: any) => {
    return fetchWithFallback(`${API_BASE_URL}/buyer/create-demand`, {
      method: 'POST',
      body: JSON.stringify(rfq)
    });
  }
};
