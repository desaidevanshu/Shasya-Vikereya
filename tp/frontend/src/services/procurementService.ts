import { addDoc, collection, getDocs, query, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseReady } from '../config/firebase';
import { INITIAL_BUYER_DEMANDS, INITIAL_CLEARING_MATCHES, INITIAL_FARMER_LOTS, INITIAL_FPO_ANALYTICS } from '../data/mockData';
import type { BuyerDemand, FarmerLot, ClearingMatch, FpoAnalytics } from '../types';

const STORAGE_KEYS = {
  LOTS: 'krishiclear_farmer_lots_v1',
  DEMANDS: 'krishiclear_buyer_demands_v1',
  MATCHES: 'krishiclear_clearing_matches_v1',
  ANALYTICS: 'krishiclear_fpo_analytics_v1',
};

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silent fallback for restricted browsers
  }
}

async function syncToFirestoreIfEnabled<T>(collectionName: string, payload: T): Promise<void> {
  if (!isFirebaseReady || !db) return;

  try {
    await addDoc(collection(db, collectionName), {
      ...payload,
      createdAt: serverTimestamp(),
      source: 'krishiclear-procurement',
    });
  } catch {
    // firestore can remain optional for demo use; app falls back to localStorage
  }
}

export const procurementService = {
  async loadMarketplaceState() {
    if (isFirebaseReady && db) {
      try {
        const lotsSnap = await getDocs(query(collection(db, 'procurementLots')));
        const demandsSnap = await getDocs(query(collection(db, 'procurementDemands')));
        const matchesSnap = await getDocs(query(collection(db, 'procurementMatches')));

        const lots = lotsSnap.docs.map((doc) => ({ ...(doc.data() as FarmerLot), id: String(doc.id) }));
        const demands = demandsSnap.docs.map((doc) => ({ ...(doc.data() as BuyerDemand), id: String(doc.id) }));
        const matches = matchesSnap.docs.map((doc) => ({ ...(doc.data() as ClearingMatch), id: String(doc.id) }));

        if (lots.length || demands.length || matches.length) {
          return {
            lots,
            demands,
            matches,
            analytics: loadLocal<FpoAnalytics>(STORAGE_KEYS.ANALYTICS, INITIAL_FPO_ANALYTICS),
          };
        }
      } catch {
        // fall through to localStorage demo mode
      }
    }

    return {
      lots: loadLocal<FarmerLot[]>(STORAGE_KEYS.LOTS, INITIAL_FARMER_LOTS),
      demands: loadLocal<BuyerDemand[]>(STORAGE_KEYS.DEMANDS, INITIAL_BUYER_DEMANDS),
      matches: loadLocal<ClearingMatch[]>(STORAGE_KEYS.MATCHES, INITIAL_CLEARING_MATCHES),
      analytics: loadLocal<FpoAnalytics>(STORAGE_KEYS.ANALYTICS, INITIAL_FPO_ANALYTICS),
    };
  },

  async addLot(lot: Omit<FarmerLot, 'id' | 'fpoRef' | 'status' | 'bidsCount' | 'qualityScore'>): Promise<FarmerLot> {
    const newLot: FarmerLot = {
      ...lot,
      id: `LOT-${Date.now().toString().slice(-6)}`,
      fpoRef: `#FPO-${Math.floor(100 + Math.random() * 900)}`,
      status: 'PENDING_MATCH',
      bidsCount: 1,
      qualityScore: 98.2,
    };

    const current = loadLocal<FarmerLot[]>(STORAGE_KEYS.LOTS, INITIAL_FARMER_LOTS);
    const next = [newLot, ...current];
    saveLocal(STORAGE_KEYS.LOTS, next);
    await syncToFirestoreIfEnabled('procurementLots', newLot);
    return newLot;
  },

  async addDemand(demand: Omit<BuyerDemand, 'id' | 'status'>): Promise<BuyerDemand> {
    const newDemand: BuyerDemand = {
      ...demand,
      id: `DEM-${Date.now().toString().slice(-6)}`,
      status: 'OPEN',
    };

    const current = loadLocal<BuyerDemand[]>(STORAGE_KEYS.DEMANDS, INITIAL_BUYER_DEMANDS);
    const next = [newDemand, ...current];
    saveLocal(STORAGE_KEYS.DEMANDS, next);
    await syncToFirestoreIfEnabled('procurementDemands', newDemand);
    return newDemand;
  },

  async persistMatch(match: ClearingMatch): Promise<ClearingMatch> {
    const current = loadLocal<ClearingMatch[]>(STORAGE_KEYS.MATCHES, INITIAL_CLEARING_MATCHES);
    const next = [match, ...current];
    saveLocal(STORAGE_KEYS.MATCHES, next);
    await syncToFirestoreIfEnabled('procurementMatches', match);
    return match;
  },
};
