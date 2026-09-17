/**
 * KrishiClear Frontend API Client.
 * Connects directly to the FastAPI Backend which integrates live with data.gov.in
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

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
  createOrder: async (order: Record<string, unknown>) => fetchWithFallback(`${API_BASE_URL}/orders`, { method: 'POST', body: JSON.stringify(order) }),

  getOrders: async (role?: string, uid?: string) => {
    const params = new URLSearchParams();
    if (role) params.set('role', role);
    if (uid) params.set('uid', uid);
    return fetchWithFallback<{ orders: Record<string, unknown>[] }>(`${API_BASE_URL}/orders?${params.toString()}`, { method: 'GET' }, { orders: [] });
  },

  initiateOrderPayment: async (orderId: string) => fetchWithFallback(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}/payment`, { method: 'POST' }),

  updateOrder: async (orderId: string, updates: Record<string, unknown>) => fetchWithFallback(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}`, { method: 'PATCH', body: JSON.stringify(updates) }),

  verifyOrderPayment: async (orderId: string, payment: Record<string, string>) => fetchWithFallback(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}/payment/verify`, { method: 'POST', body: JSON.stringify(payment) }),

  getMandiOverview: async () => {
    return fetchWithFallback(`${API_BASE_URL}/mandi/overview`, { method: 'GET' });
  },

  askKisanAssistant: async (query: string, lang: 'en' | 'hi' | 'mr' = 'en') => {
    return fetchWithFallback(`${API_BASE_URL}/kisan/assistant`, {
      method: 'POST',
      body: JSON.stringify({ query, lang })
    }, {
          answer_text: `Shasya Vikreya is active for ${lang.toUpperCase()} mode. Please ask about mandi price, logistics, or farmer payout.`,
      lang,
      category: 'general',
      card: null
    });
  },

  generateVoice: async (text: string, lang: 'en' | 'hi' | 'mr' = 'en') => {
    const res = await fetch(`${API_BASE_URL}/kisan/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang })
    });

    if (!res.ok) {
      throw new Error(`TTS request failed: ${res.status}`);
    }

    return res.blob();
  },

  transcribeVoice: async (audio: Blob, lang: 'en' | 'hi' | 'mr' = 'en') => {
    const formData = new FormData();
    formData.append('file', audio, 'voice_input.webm');
    const res = await fetch(`${API_BASE_URL}/kisan/transcribe?lang=${lang}`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error(`Transcription request failed: ${res.status}`);
    return res.json() as Promise<{ success?: boolean; text?: string }>;
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

  getGatePass: async () => {
    return fetchWithFallback(`${API_BASE_URL}/compliance/gate-pass`, { method: 'GET' });
  },

  compareRoutes: async (params: {
    commodity?: string;
    quantityKg?: number;
    ambientTempC?: number;
    dieselPrice?: number;
    trafficDelayPct?: number;
    isRefrigerated?: boolean;
  } = {}) => {
    const query = new URLSearchParams({
      commodity: params.commodity || 'Tomato',
      quantity_kg: String(params.quantityKg ?? 14500),
      ambient_temp_c: String(params.ambientTempC ?? 31),
      diesel_price: String(params.dieselPrice ?? 94.2),
      traffic_delay_pct: String(params.trafficDelayPct ?? 0),
      is_refrigerated: String(params.isRefrigerated ?? false)
    });
    return fetchWithFallback(`${API_BASE_URL}/logistics/compare-routes?${query.toString()}`, { method: 'GET' });
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
