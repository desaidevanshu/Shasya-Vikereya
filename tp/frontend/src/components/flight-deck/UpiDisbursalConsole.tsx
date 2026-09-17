import React, { useState } from 'react';
import { Zap, ShieldCheck, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { apiClient } from '../../api/client.ts';

export const UpiDisbursalConsole: React.FC = () => {
  const [armEscrow, setArmEscrow] = useState(true);
  const [forceT0, setForceT0] = useState(true);
  const [isFiring, setIsFiring] = useState(false);
  const [disbursalResult, setDisbursalResult] = useState<{
    txId: string;
    recipientsCount: number;
    totalAmountRs: number;
    executionSpeedMs: number;
    timestamp: string;
  } | null>(null);

  const handleDisburse = async () => {
    if (!armEscrow) {
      alert('Please ARM the Escrow Vault before firing settlement.');
      return;
    }
    setIsFiring(true);
    try {
      const res = await apiClient.fireUpiDisbursal();
      setDisbursalResult(res);
    } catch {
      // ignore
    } finally {
      setIsFiring(false);
    }
  };

  return (
    <div className="flex flex-col bg-surface-container-low dark:bg-surface-container-low rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/30 h-full justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-secondary-fixed animate-pulse" />
            <span className="font-headline-sm text-sm sm:text-base text-primary uppercase font-bold tracking-tight">
              INSTANT UPI DISBURSAL FIRING CONSOLE
            </span>
          </div>
          <span className="font-label-micro text-xs px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">
            NPCI RAILS ARMED
          </span>
        </div>

        {/* Toggles */}
        <div className="space-y-2 mb-4">
          {/* Toggle 1: Arm Escrow Vault */}
          <div
            onClick={() => setArmEscrow(!armEscrow)}
            className="cursor-pointer bg-surface-container-lowest dark:bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20 hover:border-outline-variant/40 flex items-center justify-between transition-colors select-none"
          >
            <div>
              <div className="font-headline-sm text-xs sm:text-sm font-bold text-primary">
                ARM ESCROW VAULT
              </div>
              <div className="font-label-micro text-xs text-outline">
                HOLDING ₹58,40,000 RBI ESCROW BALANCE
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`font-label-micro text-[11px] font-bold ${
                  armEscrow ? 'text-secondary-fixed' : 'text-outline'
                }`}
              >
                {armEscrow ? 'ARMED [ON]' : 'STANDBY [OFF]'}
              </span>
              <div
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  armEscrow ? 'bg-secondary-fixed' : 'bg-surface-container-highest'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    armEscrow ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </div>
            </div>
          </div>

          {/* Toggle 2: Execute T+0 Route */}
          <div
            onClick={() => setForceT0(!forceT0)}
            className="cursor-pointer bg-surface-container-lowest dark:bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20 hover:border-outline-variant/40 flex items-center justify-between transition-colors select-none"
          >
            <div>
              <div className="font-headline-sm text-xs sm:text-sm font-bold text-primary">
                EXECUTE T+0 ROUTE
              </div>
              <div className="font-label-micro text-xs text-outline">
                BYPASS NEFT BATCH // FORCE IMPS-UPI HIGH TICKET
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`font-label-micro text-[11px] font-bold ${
                  forceT0 ? 'text-secondary-fixed' : 'text-outline'
                }`}
              >
                {forceT0 ? 'ROUTED [ON]' : 'NORMAL [OFF]'}
              </span>
              <div
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  forceT0 ? 'bg-secondary-fixed' : 'bg-surface-container-highest'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    forceT0 ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Target Payout Summary Card */}
        <div className="bg-surface-container dark:bg-surface-container p-3.5 rounded-xl border border-outline-variant/20 mb-4">
          <div className="flex justify-between items-center text-xs font-label-micro mb-1.5">
            <span className="text-outline uppercase">TARGET PAYOUT:</span>
            <span className="font-label-numeric font-bold text-primary">BATCH 09</span>
          </div>
          <div className="font-label-numeric font-bold text-lg sm:text-xl text-primary">
            1,842 FARMERS → ₹18,44,290.00
          </div>
          <div className="flex justify-between text-outline font-label-micro text-[11px] mt-2 pt-2 border-t border-outline-variant/15">
            <span>AVG SPEED: 140ms</span>
            <span className="text-secondary-fixed font-bold">SUCCESS PROBABILITY: 99.99%</span>
          </div>
        </div>
      </div>

      {/* Disbursal Confirmation Modal */}
      {disbursalResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest dark:bg-surface-container-lowest border border-secondary-fixed/50 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed/20 flex items-center justify-center text-secondary-fixed">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="font-headline-sm text-base font-bold text-primary">
                  UPI SETTLEMENT BROADCASTED
                </div>
                <div className="font-label-micro text-xs text-secondary-fixed">
                  NPCI IMPS-UPI RAILS CONFIRMED
                </div>
              </div>
            </div>

            <div className="bg-surface-container p-3.5 rounded-xl font-label-numeric text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-outline">TXID HASH:</span>
                <span className="font-bold text-primary">{disbursalResult.txId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">DISBURSED SUM:</span>
                <span className="font-bold text-secondary-fixed">₹{disbursalResult.totalAmountRs.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">RECIPIENTS:</span>
                <span className="font-semibold text-on-surface">{disbursalResult.recipientsCount} Verified Farmers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">EXECUTION LATENCY:</span>
                <span className="font-semibold text-secondary-fixed">{disbursalResult.executionSpeedMs} ms</span>
              </div>
            </div>

            <button
              onClick={() => setDisbursalResult(null)}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-lg font-bold hover:opacity-90 transition-opacity"
            >
              CLOSE CONSOLE
            </button>
          </div>
        </div>
      )}

      {/* Primary Trigger Button */}
      <button
        onClick={handleDisburse}
        disabled={isFiring}
        className="w-full py-3.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-headline-sm font-bold text-sm tracking-wide shadow-lg hover:shadow-secondary-fixed/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isFiring ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>FIRING NPCI RAILS...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5" />
            <span>DISBURSE NET SETTLEMENT NOW</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
