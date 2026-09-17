import React, { useState, useEffect } from 'react';
import { X, Smartphone, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  personaName: string;
  roleTitle: string;
  mobileNumber: string;
  onVerifySuccess: () => void;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  personaName,
  roleTitle,
  mobileNumber,
  onVerifySuccess,
}) => {
  const [otp, setOtp] = useState(['4', '8', '2', '9', '1', '0']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);

  useEffect(() => {
    if (isOpen) {
      setResendCountdown(30);
      const timer = setInterval(() => {
        setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerifySuccess();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="font-headline-sm font-bold text-sm sm:text-base text-primary">
                MOBILE OTP SIMULATION
              </div>
              <div className="font-label-micro text-xs text-outline">
                SECURE 2-FACTOR AGRINET AUTH
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="my-5 space-y-4">
          <div className="p-3.5 bg-surface-container-low dark:bg-surface-container-low rounded-xl border border-outline-variant/20">
            <div className="text-xs font-label-micro text-outline uppercase">VERIFYING IDENTITY</div>
            <div className="font-bold text-primary text-sm mt-0.5">{personaName}</div>
            <div className="text-xs text-secondary-fixed font-semibold">{roleTitle}</div>
            <div className="text-xs font-label-numeric text-on-surface-variant mt-1">
              One-Time Password dispatched to <span className="font-bold text-primary">{mobileNumber}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-label-micro text-outline uppercase mb-2">
              ENTER 6-DIGIT OTP
            </label>
            <div className="grid grid-cols-6 gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[idx] = e.target.value;
                    setOtp(newOtp);
                  }}
                  className="w-full h-12 text-center text-lg font-bold font-label-numeric rounded-xl bg-surface-container-low dark:bg-surface-container-low border border-outline-variant/40 text-primary focus:border-secondary-fixed focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-label-micro text-outline">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-secondary-fixed" />
              NPCI &amp; UIDAI Tokenized
            </span>
            {resendCountdown > 0 ? (
              <span>Resend in {resendCountdown}s</span>
            ) : (
              <button
                onClick={() => setResendCountdown(30)}
                className="text-secondary-fixed font-bold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Resend OTP
              </button>
            )}
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-lg font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-md"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>AUTHENTICATING CRYPTOGRAPHIC KEY...</span>
            </>
          ) : (
            <>
              <span>VERIFY OTP &amp; ENTER AS {personaName.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
