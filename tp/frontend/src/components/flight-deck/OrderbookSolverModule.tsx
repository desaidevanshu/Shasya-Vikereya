import React, { useState } from 'react';
import { Cpu, CheckCircle, RefreshCw, Eye, X } from 'lucide-react';
import type { ClearingMatch } from '../../types.ts';
import { INITIAL_CLEARING_MATCHES } from '../../data/mockData.ts';

interface OrderbookSolverModuleProps {
  onReclear?: () => void;
}

export const OrderbookSolverModule: React.FC<OrderbookSolverModuleProps> = ({ onReclear }) => {
  const [matches, setMatches] = useState<ClearingMatch[]>(INITIAL_CLEARING_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<ClearingMatch | null>(null);
  const [isReclearing, setIsReclearing] = useState(false);

  const handleReclear = () => {
    setIsReclearing(true);
    setTimeout(() => {
      setIsReclearing(false);
      if (onReclear) onReclear();
    }, 400);
  };

  const totalSaved = matches.reduce((acc, m) => acc + m.spreadNetSaved, 0);

  return (
    <div className="flex flex-col bg-surface-container-low dark:bg-surface-container-low rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/30 h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 gap-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary-container dark:text-secondary-fixed" />
          <span className="font-headline-sm text-sm sm:text-base text-primary uppercase font-bold tracking-tight">
            ALGORITHMIC SOLVER // NETTING MATRIX [42 FPO POOLS]
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReclear}
            disabled={isReclearing}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-surface-container dark:bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReclearing ? 'animate-spin text-secondary-fixed' : ''}`} />
            <span className="font-label-micro">{isReclearing ? 'SOLVING...' : 'RE-CLEAR'}</span>
          </button>
          <span className="font-label-micro text-xs px-2.5 py-1 rounded-full bg-surface-container-highest dark:bg-surface-container-high text-primary-container dark:text-secondary-fixed font-bold">
            ENGINE: HFT-MATCH-v4 (18µs)
          </span>
        </div>
      </div>

      {/* Orderbook Table */}
      <div className="overflow-x-auto my-1 flex-1">
        <table className="w-full text-left font-label-micro border-collapse min-w-[560px]">
          <thead>
            <tr className="text-outline border-b border-outline-variant/20 text-[11px] uppercase tracking-wider">
              <th className="pb-2 font-medium">FPO LOT REF</th>
              <th className="pb-2 font-medium">PRODUCE CLASS</th>
              <th className="pb-2 font-medium text-right">VOLUME</th>
              <th className="pb-2 font-medium text-right">FARM GATE ASK</th>
              <th className="pb-2 font-medium text-right">BUYER BID (CLEARED)</th>
              <th className="pb-2 font-medium text-right">SPREAD NET SAVED</th>
              <th className="pb-2 font-medium text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/15 text-xs">
            {matches.map((match) => (
              <tr
                key={match.id}
                className="hover:bg-surface-container/60 transition-colors group cursor-pointer"
                onClick={() => setSelectedMatch(match)}
              >
                <td className="py-2.5 font-label-numeric font-bold text-secondary-fixed">
                  {match.fpoRef}
                </td>
                <td className="py-2.5 font-body-md text-primary font-medium">
                  {match.commodity}
                </td>
                <td className="py-2.5 font-label-numeric text-on-surface text-right">
                  {match.volumeKg.toLocaleString()} KG
                </td>
                <td className="py-2.5 font-label-numeric text-outline text-right">
                  ₹{match.farmGateAsk.toFixed(2)}/kg
                </td>
                <td className="py-2.5 font-label-numeric text-primary-container dark:text-secondary-fixed font-bold text-right">
                  ₹{match.clearedPricePerKg.toFixed(2)}/kg
                </td>
                <td className="py-2.5 font-label-numeric text-secondary-fixed font-bold text-right">
                  +₹{match.spreadNetSaved.toLocaleString()} (+{match.spreadPct}%)
                </td>
                <td className="py-2.5 text-center">
                  <span className="p-1 rounded bg-surface-container text-on-surface-variant group-hover:text-on-surface inline-flex items-center justify-center">
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Match Details Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-secondary-fixed" />
                <span className="font-headline-sm font-bold text-base text-primary">
                  CRYPTOGRAPHIC CLEARING RECEIPT
                </span>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 font-label-micro text-xs">
              <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-2">
                <div className="flex justify-between">
                  <span className="text-outline">MATCH ID:</span>
                  <span className="font-label-numeric font-bold text-primary">{selectedMatch.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">FPO POOL REF:</span>
                  <span className="font-label-numeric font-bold text-secondary-fixed">{selectedMatch.fpoRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">COMMODITY:</span>
                  <span className="font-bold text-primary">{selectedMatch.commodity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">ALLOCATED VOLUME:</span>
                  <span className="font-label-numeric font-semibold text-on-surface">{selectedMatch.volumeKg.toLocaleString()} KG</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-2">
                <div className="flex justify-between">
                  <span className="text-outline">ORIGIN HUB:</span>
                  <span className="font-medium text-on-surface">{selectedMatch.transitOrigin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">DESTINATION BAY:</span>
                  <span className="font-medium text-on-surface">{selectedMatch.transitDestination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">ESCROW STATUS:</span>
                  <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary-container dark:text-secondary-fixed font-bold font-label-numeric">
                    {selectedMatch.escrowStatus}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-secondary-fixed/10 border border-secondary-fixed/30 flex justify-between items-center">
                <div>
                  <div className="text-secondary-fixed font-bold text-[11px] uppercase">COMMISSION ELIMINATED:</div>
                  <div className="text-xs text-on-surface-variant">Zero Dalaal Intermediary Squeeze</div>
                </div>
                <div className="font-label-numeric font-bold text-base text-secondary-fixed">
                  +₹{selectedMatch.spreadNetSaved.toLocaleString()}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedMatch(null)}
              className="w-full py-2 rounded-xl bg-primary text-on-primary font-label-lg font-bold hover:opacity-90 transition-opacity"
            >
              DISMISS RECEIPT
            </button>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-outline-variant/20 font-label-micro text-xs text-on-surface-variant">
        <span>42 BIDS PAIR-CLEARED // ZERO DALAAL OVERHEAD</span>
        <span className="font-label-numeric font-bold text-secondary-fixed">
          COMMISSION DEDUCTIONS ELIMINATED: ₹{totalSaved.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
