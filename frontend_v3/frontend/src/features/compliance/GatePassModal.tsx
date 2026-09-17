import React, { useState, useEffect } from 'react';
import { X, QrCode, ShieldCheck, Printer, Check, Copy } from 'lucide-react';
import { GatePass } from '../../types.ts';
import { apiClient } from '../../api/client.ts';

interface GatePassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GatePassModal: React.FC<GatePassModalProps> = ({ isOpen, onClose }) => {
  const [pass, setPass] = useState<GatePass | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadGatePass();
    }
  }, [isOpen]);

  const loadGatePass = async () => {
    const res = await apiClient.getGatePass();
    setPass(res);
  };

  const copyHash = () => {
    if (!pass) return;
    navigator.clipboard.writeText(pass.merkleRootHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !pass) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-secondary-fixed" />
            <div>
              <div className="font-headline-sm font-bold text-base text-primary">
                CRYPTOGRAPHIC DIGITAL TRANSIT GATE PASS
              </div>
              <div className="font-label-micro text-xs text-outline">
                FASTag RFID T-01 &amp; MERKLE PROOF ROOT VALIDATED
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Body (Printable aesthetic) */}
        <div className="my-5 p-5 rounded-xl bg-surface-container-low dark:bg-surface-container-low border border-outline-variant/30 space-y-4 font-label-micro text-xs">
          {/* Top Pass Strip */}
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <div>
              <div className="text-outline text-[10px] uppercase">PASS IDENTIFIER</div>
              <div className="font-label-numeric font-bold text-sm text-primary">{pass.passNumber}</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-secondary-fixed/20 text-secondary-fixed font-bold font-label-numeric">
              {pass.status}
            </span>
          </div>

          {/* QR & Vehicle Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-surface-container-lowest dark:bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20">
            <div className="flex flex-col items-center justify-center p-2 border border-outline-variant/30 rounded-lg">
              <QrCode className="w-20 h-20 text-primary" />
              <span className="text-[9px] font-label-numeric text-outline mt-1">SCAN FOR FASTAG T-01</span>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <div>
                <span className="text-outline">CONVOY / VEHICLE:</span>
                <span className="font-label-numeric font-bold text-primary block text-sm">{pass.vehicleNumber}</span>
              </div>
              <div>
                <span className="text-outline">DRIVER / ESCORT:</span>
                <span className="text-on-surface font-semibold block">{pass.driverName} ({pass.driverPhone})</span>
              </div>
              <div>
                <span className="text-outline">FASTAG RFID TAG:</span>
                <span className="font-label-numeric text-secondary-fixed font-bold block">{pass.fastagRfidId}</span>
              </div>
            </div>
          </div>

          {/* Transit Route */}
          <div className="space-y-2 bg-surface-container-lowest dark:bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20">
            <div>
              <span className="text-outline">ORIGIN DISPATCH HUB:</span>
              <span className="text-primary font-medium block">{pass.originHub}</span>
            </div>
            <div>
              <span className="text-outline">DESTINATION CARGO DOCK:</span>
              <span className="text-primary font-medium block">{pass.destinationHub}</span>
            </div>
            <div>
              <span className="text-outline">CERTIFIED CARGO MANIFEST:</span>
              <span className="text-primary font-bold block">{pass.cargoDescription}</span>
            </div>
          </div>

          {/* Merkle Proof & Cryptographic Integrity */}
          <div className="space-y-1.5 bg-surface-container-lowest dark:bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="text-outline">MERKLE ROOT HASH:</span>
              <button
                onClick={copyHash}
                className="flex items-center gap-1 text-secondary-fixed hover:underline text-[10px]"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'COPIED' : 'COPY HASH'}</span>
              </button>
            </div>
            <div className="font-label-numeric text-[11px] text-primary truncate bg-surface-container p-1.5 rounded">
              {pass.merkleRootHash}
            </div>

            <div className="flex justify-between pt-2 text-[10px] text-outline">
              <span>ISSUED: {pass.issuedAt}</span>
              <span>EXPIRES: {pass.expiresAt}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-label-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT / SAVE PDF</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            CLOSE GATE PASS
          </button>
        </div>
      </div>
    </div>
  );
};
