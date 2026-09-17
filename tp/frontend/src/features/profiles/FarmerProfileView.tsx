import React, { useState } from 'react';
import {
  Sprout,
  PlusCircle,
  TrendingUp,
  Scale,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Smartphone,
  Wallet,
  Building,
  Mic,
  DollarSign,
  Sparkles,
  Layers,
} from 'lucide-react';
import { INITIAL_FARMER_LOTS, INITIAL_MANDI_RECORDS } from '../../data/mockData.ts';
import type { FarmerLot } from '../../types.ts';

interface FarmerProfileViewProps {
  onOpenVoiceAssistant: () => void;
  onOpenGatePass: () => void;
}

export const FarmerProfileView: React.FC<FarmerProfileViewProps> = ({
  onOpenVoiceAssistant,
  onOpenGatePass,
}) => {
  const [lots, setLots] = useState<FarmerLot[]>([
    ...INITIAL_FARMER_LOTS.filter((l) => l.farmerName.includes('Patil') || l.location.includes('Narayangaon')),
    {
      id: 'LOT-RP-099',
      fpoRef: 'FPO-SYD-NASIK',
      farmerName: 'Ramesh Patil',
      location: 'Narayangaon, Junnar',
      state: 'Maharashtra',
      lat: 19.1172,
      lng: 73.9782,
      commodity: 'High-Altitude Tomato',
      grade: 'Grade A (NIR 94%)',
      quantityKg: 3500,
      askPricePerKg: 34.0,
      harvestDate: 'Today, 06:30 AM',
      isRefrigerated: true,
      status: 'PENDING_MATCH',
      bidsCount: 3,
      qualityScore: 94,
    },
  ]);

  const [newLot, setNewLot] = useState({
    commodity: 'Red Onion (Garva)',
    quantityKg: 2500,
    askPricePerKg: 28.5,
    grade: 'Grade A Export',
    isRefrigerated: true,
  });

  const [calcQuantity, setCalcQuantity] = useState(2500);
  const [calcAskPrice, setCalcAskPrice] = useState(28.5);

  const apmcModalPrice = 22.0;
  const apmcBrokerCutPct = 0.085;
  const apmcTareLossKg = calcQuantity * 0.042; // 4.2% tare loss
  const apmcNetWeight = calcQuantity - apmcTareLossKg;
  const apmcGross = apmcNetWeight * apmcModalPrice;
  const apmcCommission = apmcGross * apmcBrokerCutPct;
  const apmcNetPayout = apmcGross - apmcCommission;

  const krishiClearPrice = calcAskPrice;
  const krishiClearTareLossKg = 0; // zero tare skimming
  const krishiClearBrokerCutPct = 0; // 0% middleman
  const krishiClearNetPayout = calcQuantity * krishiClearPrice;
  const extraFarmerRealization = krishiClearNetPayout - apmcNetPayout;
  const extraPct = ((extraFarmerRealization / apmcNetPayout) * 100).toFixed(1);

  const handleCreateLot = (e: React.FormEvent) => {
    e.preventDefault();
    const created: FarmerLot = {
      id: `LOT-RP-${Math.floor(100 + Math.random() * 900)}`,
      fpoRef: 'FPO-SYD-NASIK',
      farmerName: 'Ramesh Patil',
      location: 'Narayangaon, Junnar',
      state: 'Maharashtra',
      lat: 19.1172,
      lng: 73.9782,
      commodity: newLot.commodity,
      grade: newLot.grade,
      quantityKg: Number(newLot.quantityKg),
      askPricePerKg: Number(newLot.askPricePerKg),
      harvestDate: 'Just Now',
      isRefrigerated: newLot.isRefrigerated,
      status: 'PENDING_MATCH',
      bidsCount: 0,
      qualityScore: 92,
    };
    setLots([created, ...lots]);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Profile Banner */}
      <div className="bg-surface-container-low dark:bg-surface-container-low rounded-3xl p-6 border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300/40 dark:border-emerald-700/50">
            <Sprout className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-2xl font-bold text-primary">
                Ramesh Patil
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                Farmer / Producer ✓
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-body-md mt-0.5">
              Narayangaon Cluster, Junnar Taluka, Pune District | Sahyadri FPO Member #SYD-8812
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-label-micro text-outline">
              <span className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-secondary-fixed" />
                +91 98220 45123
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-secondary-fixed" />
                Bank of Maharashtra (IMPS Direct)
              </span>
              <span>•</span>
              <span className="text-secondary-fixed font-bold">
                NIR Certified Field Tester
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenVoiceAssistant}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-2xl bg-surface-container border border-outline-variant/40 hover:bg-surface-container-high text-primary font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Mic className="w-4 h-4 text-secondary-fixed" />
            <span>Kisan Voice Assistant</span>
          </button>
          <button
            onClick={onOpenGatePass}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-2xl bg-secondary-fixed text-on-secondary-fixed font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Digital Gate Pass</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl border border-outline-variant/30">
          <div className="text-[10px] font-label-micro text-outline uppercase">T+0 ESCROW WALLET</div>
          <div className="font-headline-sm text-2xl font-extrabold text-secondary-fixed mt-1">₹84,250</div>
          <div className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-secondary-fixed" />
            Auto-credited to Bank of Maharashtra
          </div>
        </div>

        <div className="p-4 bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl border border-outline-variant/30">
          <div className="text-[10px] font-label-micro text-outline uppercase">MIDDLEMAN BROKERAGE SAVED</div>
          <div className="font-headline-sm text-2xl font-extrabold text-primary mt-1">₹18,420</div>
          <div className="text-xs text-secondary-fixed font-semibold mt-0.5">
            +₹7.30/kg over APMC Mandi
          </div>
        </div>

        <div className="p-4 bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl border border-outline-variant/30">
          <div className="text-[10px] font-label-micro text-outline uppercase">TARE THEFT DEFLECTED</div>
          <div className="font-headline-sm text-2xl font-extrabold text-primary mt-1">105 KG</div>
          <div className="text-xs text-on-surface-variant mt-0.5">
            Zero uncalibrated scale deductions
          </div>
        </div>

        <div className="p-4 bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl border border-outline-variant/30">
          <div className="text-[10px] font-label-micro text-outline uppercase">ACTIVE HARVEST LOTS</div>
          <div className="font-headline-sm text-2xl font-extrabold text-primary mt-1">{lots.length} Lots</div>
          <div className="text-xs text-on-surface-variant mt-0.5">
            {lots.reduce((acc, l) => acc + l.quantityKg, 0)} kg pooled in cold hub
          </div>
        </div>
      </div>

      {/* Main Grid: Left Lot Lister + Lots, Right Net Realization Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Active Lots & Lister */}
        <div className="lg:col-span-2 space-y-6">
          {/* New Lot Creation Form */}
          <div className="bg-surface-container-lowest dark:bg-surface-container-low p-6 rounded-3xl border border-outline-variant/30">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-secondary-fixed" />
                <h2 className="font-headline-sm text-lg font-bold text-primary">
                  List New Harvest Lot (Instant Bilateral Matching)
                </h2>
              </div>
              <span className="text-xs font-label-micro text-outline">
                ALGO-CLEAR T-01
              </span>
            </div>

            <form onSubmit={handleCreateLot} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                  COMMODITY &amp; VARIETY
                </label>
                <select
                  value={newLot.commodity}
                  onChange={(e) => setNewLot({ ...newLot, commodity: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/40 text-xs font-bold text-primary focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
                >
                  <option value="Red Onion (Garva)">Red Onion (Garva)</option>
                  <option value="High-Altitude Tomato">High-Altitude Tomato</option>
                  <option value="Bhagwa Pomegranate">Bhagwa Pomegranate</option>
                  <option value="Green Capsicum">Green Capsicum</option>
                  <option value="Thompson Seedless Grapes">Thompson Seedless Grapes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                  HARVEST QUANTITY (KG)
                </label>
                <input
                  type="number"
                  value={newLot.quantityKg}
                  onChange={(e) => setNewLot({ ...newLot, quantityKg: Number(e.target.value) })}
                  className="w-full h-11 px-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/40 text-xs font-bold font-label-numeric text-primary focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
                />
              </div>

              <div>
                <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                  MIN ASK PRICE (₹/KG)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newLot.askPricePerKg}
                  onChange={(e) => setNewLot({ ...newLot, askPricePerKg: Number(e.target.value) })}
                  className="w-full h-11 px-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/40 text-xs font-bold font-label-numeric text-primary focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-body-md text-on-surface">
                  <input
                    type="checkbox"
                    checked={newLot.isRefrigerated}
                    onChange={(e) => setNewLot({ ...newLot, isRefrigerated: e.target.checked })}
                    className="w-4 h-4 rounded text-secondary-fixed focus:ring-secondary-fixed"
                  />
                  <span>Reefer Pre-cooling at Narayangaon Cold Hub (Recommended +₹1.50/kg)</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-label-lg font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              >
                <span>PUBLISH LOT TO CLEARINGHOUSE →</span>
              </button>
            </form>
          </div>

          {/* Active Listings Table */}
          <div className="bg-surface-container-lowest dark:bg-surface-container-low p-6 rounded-3xl border border-outline-variant/30">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
              <div>
                <h3 className="font-headline-sm text-base font-bold text-primary">
                  Ramesh's Active Harvest Batches
                </h3>
                <p className="text-xs text-on-surface-variant font-body-md">
                  Track buyer matching status, digital weighbridge signoffs, and T+0 escrow release
                </p>
              </div>
              <span className="text-xs font-label-numeric font-bold text-secondary-fixed">
                {lots.length} POOLED
              </span>
            </div>

            <div className="space-y-3">
              {lots.map((lot) => (
                <div
                  key={lot.id}
                  className="p-4 rounded-2xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary text-sm">{lot.commodity}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-label-micro bg-emerald-50 dark:bg-emerald-950/60 text-secondary-fixed border border-emerald-300 dark:border-emerald-700/50">
                        {lot.grade}
                      </span>
                      {lot.isRefrigerated && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-label-micro bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-700/50">
                          Pre-cooled 14°C
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant font-label-micro">
                      <span>Lot: {lot.id}</span>
                      <span>•</span>
                      <span>Harvested: {lot.harvestDate}</span>
                      <span>•</span>
                      <span>Quality Score: {lot.qualityScore}% NIR</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="text-right">
                      <div className="text-xs text-outline font-label-micro">QUANTITY</div>
                      <div className="text-sm font-bold font-label-numeric text-primary">
                        {lot.quantityKg.toLocaleString()} KG
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-outline font-label-micro">ASK PRICE</div>
                      <div className="text-sm font-bold font-label-numeric text-secondary-fixed">
                        ₹{lot.askPricePerKg.toFixed(2)}/kg
                      </div>
                    </div>

                    <div>
                      {lot.status === 'PENDING_MATCH' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/50 text-amber-700 dark:text-amber-400 text-xs font-bold font-label-micro animate-pulse">
                          <Clock className="w-3 h-3" /> Netting...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-label-micro">
                          <CheckCircle2 className="w-3 h-3" /> Matched
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Net Realization Calculator */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest dark:bg-surface-container-low p-6 rounded-3xl border border-outline-variant/30">
            <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/20 mb-4">
              <Scale className="w-5 h-5 text-secondary-fixed" />
              <h3 className="font-headline-sm text-base font-bold text-primary">
                Net Earnings Realization Calculator
              </h3>
            </div>

            <p className="text-xs text-on-surface-variant font-body-md mb-4">
              Calculate exact extra rupees earned on KrishiClear versus Lasalgaon/Pimpalgaon APMC Mandi after factoring middleman cut and scale skimming.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                  BATCH WEIGHT (KG)
                </label>
                <input
                  type="number"
                  value={calcQuantity}
                  onChange={(e) => setCalcQuantity(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/40 text-xs font-bold font-label-numeric text-primary focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
                />
              </div>

              <div>
                <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                  KRISHICLEAR ASK PRICE (₹/KG)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={calcAskPrice}
                  onChange={(e) => setCalcAskPrice(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/40 text-xs font-bold font-label-numeric text-primary focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
                />
              </div>

              {/* Forensic Cost Breakdown */}
              <div className="p-4 rounded-2xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 space-y-3">
                <div className="text-xs font-label-micro font-bold text-primary uppercase pb-2 border-b border-outline-variant/20">
                  APMC Mandi Deductions
                </div>

                <div className="flex justify-between text-xs font-label-numeric">
                  <span className="text-outline">Uncalibrated Tare Theft (4.2%):</span>
                  <span className="text-error font-bold">-{apmcTareLossKg.toFixed(0)} kg (₹{(apmcTareLossKg * apmcModalPrice).toFixed(0)})</span>
                </div>

                <div className="flex justify-between text-xs font-label-numeric">
                  <span className="text-outline">Broker (Aadtiya) Cut (8.5%):</span>
                  <span className="text-error font-bold">-₹{apmcCommission.toFixed(0)}</span>
                </div>

                <div className="flex justify-between text-xs font-label-numeric pt-1 border-t border-outline-variant/20 font-bold">
                  <span className="text-primary">Mandi Net Payout:</span>
                  <span className="text-primary">₹{apmcNetPayout.toFixed(0)}</span>
                </div>
              </div>

              {/* KrishiClear Advantage Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-secondary-fixed/40">
                <div className="text-xs font-label-micro font-bold text-secondary-fixed uppercase">
                  KRISHICLEAR DIRECT NET PAYOUT
                </div>
                <div className="font-headline-sm text-2xl font-extrabold text-secondary-fixed mt-1">
                  ₹{krishiClearNetPayout.toFixed(0)}
                </div>
                <div className="mt-2 text-xs font-label-numeric font-bold text-primary">
                  Extra in Ramesh's Pocket: <span className="text-secondary-fixed">+₹{extraFarmerRealization.toFixed(0)} (+{extraPct}%)</span>
                </div>
                <div className="text-[11px] text-on-surface-variant mt-1">
                  Credited T+0 directly to Bank of Maharashtra via IMPS with 0% broker deductions.
                </div>
              </div>
            </div>
          </div>

          {/* Recent Payout History */}
          <div className="bg-surface-container-lowest dark:bg-surface-container-low p-6 rounded-3xl border border-outline-variant/30">
            <h3 className="font-headline-sm text-sm font-bold text-primary mb-3">
              Verified T+0 Bank Disbursals
            </h3>

            <div className="space-y-2.5 text-xs font-label-micro">
              <div className="p-2.5 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-primary">₹34,800 • UTR #MAHB882901</div>
                  <div className="text-outline text-[11px]">Red Onion Lot #LOT-RP-041 • GreenLeaf Pune</div>
                </div>
                <span className="text-secondary-fixed font-bold">CREDITED ✓</span>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-primary">₹49,450 • UTR #MAHB771650</div>
                  <div className="text-outline text-[11px]">Vine Tomatoes #LOT-RP-038 • Metro Cash &amp; Carry</div>
                </div>
                <span className="text-secondary-fixed font-bold">CREDITED ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
