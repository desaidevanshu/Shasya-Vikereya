import React, { useState } from 'react';
import {
  User,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  QrCode,
  ArrowRight,
  TrendingDown,
  Heart,
  Truck,
} from 'lucide-react';
import { MarketplaceView } from '../marketplace/MarketplaceView.tsx';

interface ConsumerProfileViewProps {
  onOpenGatePass: () => void;
}

export const ConsumerProfileView: React.FC<ConsumerProfileViewProps> = ({
  onOpenGatePass,
}) => {
  const [activeDelivery, setActiveDelivery] = useState({
    id: 'BASKET-PUN-091',
    farmer: 'Ramesh Patil',
    farmLocation: 'Narayangaon, Junnar (Pune)',
    items: 'Fresh Red Onions (5kg), Vine Tomatoes (3kg), Capsicum (1kg)',
    harvestTime: 'Harvested Today at 06:15 AM',
    eta: 'Today by 04:30 PM (Doorstep Kothrud)',
    nirScore: '94% Grade A Provenance',
    pricePaid: 290,
    retailSupermarketPrice: 420,
    savings: 130,
    status: 'OUT_FOR_DELIVERY',
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Consumer Hero Banner */}
      <div className="bg-surface-container-low dark:bg-surface-container-low rounded-3xl p-6 border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300/40 dark:border-emerald-700/50">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-2xl font-bold text-primary">
                Ananya Deshmukh
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                Direct Retail Consumer ✓
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-body-md mt-0.5">
              Kothrud, Pune | Farm-to-Door Verified Traceability Member #D2C-8890
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-label-micro text-outline">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-secondary-fixed" />
                Kothrud Cluster Delivery Hub
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary-fixed" />
                100% Farm Origin Provenance
              </span>
              <span>•</span>
              <span className="text-secondary-fixed font-bold">
                Save 30% while Farmer Earns +35%
              </span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onOpenGatePass}
          className="px-4 py-2.5 rounded-2xl bg-secondary-fixed text-on-secondary-fixed font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer shadow-sm"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan Farm QR Traceability</span>
        </button>
      </div>

      {/* Active Doorstep Delivery Tracker */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest dark:bg-surface-container-low border border-secondary-fixed/40 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-secondary-fixed flex items-center justify-center">
              <Truck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary text-sm">ACTIVE FARM BASKET: {activeDelivery.id}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-secondary-fixed text-[10px] font-bold font-label-micro">
                  IN DIRECT TRANSIT
                </span>
              </div>
              <div className="text-xs text-on-surface-variant font-label-micro">
                Farmer: {activeDelivery.farmer} ({activeDelivery.farmLocation})
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-label-micro text-outline uppercase">ESTIMATED DOORSTEP ARRIVAL</div>
            <div className="font-bold text-secondary-fixed text-sm">{activeDelivery.eta}</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-label-micro">
          <div className="p-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/20">
            <div className="text-outline uppercase text-[10px]">PRODUCE CONTENTS</div>
            <div className="font-bold text-primary mt-0.5">{activeDelivery.items}</div>
            <div className="text-secondary-fixed text-[11px] mt-0.5">{activeDelivery.nirScore}</div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/20">
            <div className="text-outline uppercase text-[10px]">HARVEST FRESHNESS</div>
            <div className="font-bold text-primary mt-0.5">{activeDelivery.harvestTime}</div>
            <div className="text-outline text-[11px]">Bypassed 3-day mandi transit rot</div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/20">
            <div className="text-outline uppercase text-[10px]">PRICE TRANSPARENCY</div>
            <div className="font-bold font-label-numeric text-primary mt-0.5">Paid: ₹{activeDelivery.pricePaid}</div>
            <div className="text-outline text-[11px]">Supermarket MRP: ₹{activeDelivery.retailSupermarketPrice}</div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-secondary-fixed/40">
            <div className="text-secondary-fixed font-bold uppercase text-[10px]">YOUR SAVINGS</div>
            <div className="font-headline-sm text-xl font-extrabold text-secondary-fixed mt-0.5">
              Saved ₹{activeDelivery.savings} (31%)
            </div>
            <div className="text-on-surface-variant text-[11px]">Farmer earned +35% more than Mandi</div>
          </div>
        </div>
      </div>

      {/* Embedded Direct Farm Marketplace */}
      <MarketplaceView role="buyer" />
    </div>
  );
};
