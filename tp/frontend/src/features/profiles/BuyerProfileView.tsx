import React, { useState } from 'react';
import {
  ShoppingBag,
  PlusCircle,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  ThermometerSnowflake,
  FileText,
  DollarSign,
  AlertCircle,
  Send,
  ArrowUpRight,
} from 'lucide-react';
import { INITIAL_BUYER_DEMANDS, INITIAL_FARMER_LOTS } from '../../data/mockData.ts';
import type { BuyerDemand } from '../../types.ts';

interface BuyerProfileViewProps {
  onOpenGatePass: () => void;
}

export const BuyerProfileView: React.FC<BuyerProfileViewProps> = ({
  onOpenGatePass,
}) => {
  const [demands, setDemands] = useState<BuyerDemand[]>(INITIAL_BUYER_DEMANDS);
  const [newRfq, setNewRfq] = useState({
    commodity: 'Grade A Red Onion',
    requiredKg: 4000,
    maxCeilingBidPerKg: 31.0,
    deliveryDeadline: 'Tomorrow, 08:00 AM',
    destination: 'GreenLeaf Central Kitchen, Kalyani Nagar, Pune',
  });

  const [escrowReleased, setEscrowReleased] = useState(false);

  const handleCreateRfq = (e: React.FormEvent) => {
    e.preventDefault();
    const created: BuyerDemand = {
      id: `DEM-GL-${Math.floor(100 + Math.random() * 900)}`,
      buyerName: 'GreenLeaf Kitchens & Hospitality',
      buyerType: 'INSTITUTIONAL',
      destination: newRfq.destination,
      lat: 18.5492,
      lng: 73.9038,
      commodity: newRfq.commodity,
      gradeSpec: 'Grade A (Optical NIR >90%)',
      requiredKg: Number(newRfq.requiredKg),
      maxCeilingBidPerKg: Number(newRfq.maxCeilingBidPerKg),
      deliveryDeadline: newRfq.deliveryDeadline,
      status: 'OPEN',
    };
    setDemands([created, ...demands]);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Buyer Hero Banner */}
      <div className="bg-surface-container-low dark:bg-surface-container-low rounded-3xl p-6 border border-emerald-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300/40 dark:border-emerald-700/50">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-2xl font-bold text-primary">
                GreenLeaf Kitchens &amp; Hospitality
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                Bulk Buyer / HoReCa ✓
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-body-md mt-0.5">
              Central Commissary &amp; Cold Receiving Dock, Kalyani Nagar, Pune | FSSAI #11520038000412
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-label-micro text-outline">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-secondary-fixed" />
                HoReCa Institutional Account
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary-fixed" />
                Escrow Vault Pre-Funded (₹2,50,000)
              </span>
              <span>•</span>
              <span className="text-secondary-fixed font-bold">
                Transparent 0% Broker Procurement
              </span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onOpenGatePass}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <FileText className="w-4 h-4" />
          <span>Verify Incoming Gate Pass</span>
        </button>
      </div>

      {/* Live Incoming Shipment Alert (Convoy Telemetry) */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest dark:bg-surface-container-low border border-secondary-fixed/40 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-secondary-fixed flex items-center justify-center">
              <Truck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary text-sm">IN-TRANSIT DELIVERY: REEFER CONVOY MH-14-AZ-9904</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-secondary-fixed text-[10px] font-bold font-label-micro">
                  ETA: 42 MINS
                </span>
              </div>
              <div className="text-xs text-on-surface-variant font-label-micro">
                Origin: Sahyadri FPO Packhouse (Nashik) ➔ Destination: GreenLeaf Kalyani Nagar Dock
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-300 dark:border-cyan-700/40 text-cyan-700 dark:text-cyan-400 text-xs font-label-numeric font-bold flex items-center gap-1.5">
              <ThermometerSnowflake className="w-3.5 h-3.5" />
              <span>CARGO TEMP: 13.8°C (OPTIMAL)</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-label-micro">
          <div className="p-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/20">
            <div className="text-outline uppercase text-[10px]">COMMODITY</div>
            <div className="font-bold text-primary mt-0.5">Red Onion (Garva) • Grade A</div>
            <div className="text-outline text-[11px]">NIR Purity: 94.2%</div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/20">
            <div className="text-outline uppercase text-[10px]">VERIFIED NET WEIGHT</div>
            <div className="font-bold font-label-numeric text-primary mt-0.5">3,500 KG</div>
            <div className="text-secondary-fixed text-[11px]">Axle Load Cell Verified</div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/20">
            <div className="text-outline uppercase text-[10px]">CLEARED UNIT PRICE</div>
            <div className="font-bold font-label-numeric text-secondary-fixed mt-0.5">₹29.80 / KG</div>
            <div className="text-outline text-[11px]">Mandi Market: ₹34.50 (Saved ₹4.70/kg)</div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/20 flex flex-col justify-between">
            <div className="text-outline uppercase text-[10px]">T+0 ESCROW RELEASE</div>
            {escrowReleased ? (
              <span className="text-secondary-fixed font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Escrow Disbursed to Farmers
              </span>
            ) : (
              <button
                onClick={() => setEscrowReleased(true)}
                className="w-full py-1.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-bold text-[11px] hover:opacity-90 transition-opacity cursor-pointer"
              >
                Sign Off &amp; Release Escrow
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main 2-Col Grid: Create RFQ + Active Orderbook */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Broadcast New RFQ Form */}
        <div className="bg-surface-container-lowest dark:bg-surface-container-low p-6 rounded-3xl border border-outline-variant/30">
          <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/20 mb-4">
            <PlusCircle className="w-5 h-5 text-secondary-fixed" />
            <h3 className="font-headline-sm text-base font-bold text-primary">
              Broadcast Institutional RFQ
            </h3>
          </div>

          <form onSubmit={handleCreateRfq} className="space-y-4 text-xs font-body-md">
            <div>
              <label className="block font-label-micro text-outline uppercase mb-1">
                COMMODITY REQUIREMENT
              </label>
              <select
                value={newRfq.commodity}
                onChange={(e) => setNewRfq({ ...newRfq, commodity: e.target.value })}
                className="w-full h-11 px-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/40 font-bold text-primary focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
              >
                <option value="Grade A Red Onion">Grade A Red Onion</option>
                <option value="High-Altitude Tomato">High-Altitude Tomato</option>
                <option value="Bhagwa Pomegranate">Bhagwa Pomegranate</option>
                <option value="Green Capsicum (Polytunnel)">Green Capsicum (Polytunnel)</option>
              </select>
            </div>

            <div>
              <label className="block font-label-micro text-outline uppercase mb-1">
                REQUIRED QUANTITY (KG)
              </label>
              <input
                type="number"
                value={newRfq.requiredKg}
                onChange={(e) => setNewRfq({ ...newRfq, requiredKg: Number(e.target.value) })}
                className="w-full h-11 px-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/40 font-bold font-label-numeric text-primary focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
              />
            </div>

            <div>
              <label className="block font-label-micro text-outline uppercase mb-1">
                CEILING BID PRICE (₹/KG MAX)
              </label>
              <input
                type="number"
                step="0.5"
                value={newRfq.maxCeilingBidPerKg}
                onChange={(e) => setNewRfq({ ...newRfq, maxCeilingBidPerKg: Number(e.target.value) })}
                className="w-full h-11 px-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/40 font-bold font-label-numeric text-primary focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
              />
            </div>

            <div>
              <label className="block font-label-micro text-outline uppercase mb-1">
                DELIVERY DEADLINE
              </label>
              <input
                type="text"
                value={newRfq.deliveryDeadline}
                onChange={(e) => setNewRfq({ ...newRfq, deliveryDeadline: e.target.value })}
                className="w-full h-11 px-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/40 font-bold text-primary focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-label-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>BROADCAST RFQ TO FPO POOLS →</span>
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Active Demands & Live Available FPO Lots */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest dark:bg-surface-container-low p-6 rounded-3xl border border-outline-variant/30">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
              <div>
                <h3 className="font-headline-sm text-base font-bold text-primary">
                  Active Procurement Contracts &amp; Demands
                </h3>
                <p className="text-xs text-on-surface-variant font-body-md">
                  Algorithmic netting pairs your demands with aggregated FPO lots in sub-millisecond auctions
                </p>
              </div>
              <span className="text-xs font-label-numeric font-bold text-secondary-fixed">
                {demands.length} ACTIVE
              </span>
            </div>

            <div className="space-y-3">
              {demands.map((d) => (
                <div
                  key={d.id}
                  className="p-4 rounded-2xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary text-sm">{d.commodity}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-label-micro bg-emerald-50 dark:bg-emerald-950/60 text-secondary-fixed border border-emerald-300 dark:border-emerald-700/50">
                        {d.gradeSpec}
                      </span>
                    </div>
                    <div className="text-xs text-on-surface-variant font-label-micro mt-1">
                      Dest: {d.destination} • Due: {d.deliveryDeadline}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="text-right">
                      <div className="text-xs text-outline font-label-micro">REQUIRED</div>
                      <div className="text-sm font-bold font-label-numeric text-primary">
                        {d.requiredKg.toLocaleString()} KG
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-outline font-label-micro">MAX CEILING</div>
                      <div className="text-sm font-bold font-label-numeric text-secondary-fixed">
                        ₹{d.maxCeilingBidPerKg.toFixed(2)}/kg
                      </div>
                    </div>

                    <div>
                      {d.status === 'MATCHED' ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-secondary-fixed text-xs font-bold font-label-micro border border-emerald-300 dark:border-emerald-700/50">
                          Matched &amp; In-Transit
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 text-xs font-bold font-label-micro border border-amber-300 dark:border-amber-700/50 animate-pulse">
                          Open Double Auction
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
