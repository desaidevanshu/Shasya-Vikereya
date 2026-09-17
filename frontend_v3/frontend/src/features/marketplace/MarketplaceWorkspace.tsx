import React from 'react';
import { ArrowLeft, Store, WalletCards } from 'lucide-react';
import { MarketplaceView } from './MarketplaceView.tsx';
import { OrderBoard } from './OrderBoard.tsx';
import type { UserRole } from '../landing/LandingView.tsx';
import { TransporterProfileView } from '../profiles/TransporterProfileView.tsx';

interface MarketplaceWorkspaceProps {
  role: UserRole;
  onBack: () => void;
  onOpenGatePass: () => void;
}

export const MarketplaceWorkspace: React.FC<MarketplaceWorkspaceProps> = ({ role, onBack, onOpenGatePass }) => {
  if (role === 'transporter') {
    return (
      <div className="space-y-6 pb-12 animate-in fade-in duration-300">
        <div className="flex justify-end">
          <button onClick={onBack} className="rounded-xl border border-outline-variant/50 px-4 py-2.5 text-xs font-bold text-primary">Back to transporter workspace</button>
        </div>
        <TransporterProfileView onOpenGatePass={onOpenGatePass} />
      </div>
    );
  }

  const marketplaceRole = role === 'farmer' || role === 'fpo' || role === 'buyer' ? role : 'buyer';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="bg-surface-container-low rounded-3xl border border-outline-variant/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-label-micro tracking-[0.18em] uppercase text-secondary-fixed font-bold">SHASYA VIKREYA // DIRECT TRADE DESK</p>
          <h1 className="font-headline-sm text-2xl font-extrabold text-primary mt-2 flex items-center gap-2"><Store className="w-6 h-6 text-secondary-fixed" />Marketplace workspace</h1>
          <p className="text-sm text-on-surface-variant mt-2">List produce, publish buyer requirements, reserve quantity, verify payment, and release dispatch from one place.</p>
        </div>
        <button onClick={onBack} className="rounded-xl border border-outline-variant/50 px-4 py-2.5 text-xs font-bold text-primary flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back to workspace</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-4"><p className="text-[10px] text-outline uppercase">1. Supply</p><p className="text-sm font-bold text-primary mt-1">Farmer/FPO lists crop, grade, quantity and ask price.</p></div>
        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-4"><p className="text-[10px] text-outline uppercase">2. Demand + payment</p><p className="text-sm font-bold text-primary mt-1">Buyer requirement is visible and payment is recorded.</p></div>
        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-4"><p className="text-[10px] text-outline uppercase">3. Dispatch</p><p className="text-sm font-bold text-primary mt-1">Transporter receives paid orders for smart-route planning.</p></div>
      </div>
      <OrderBoard role={marketplaceRole} title="Orders, requirements & payment ledger" />
      <MarketplaceView role={marketplaceRole} />
    </div>
  );
};