import React, { useState } from 'react';
import {
  Sprout,
  Store,
  ShoppingBag,
  Truck,
  User,
  Shield,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Scale,
  Zap,
  Cpu,
  Layers,
  Clock,
  Sparkles,
  ChevronRight,
  Flame,
  ThermometerSnowflake,
} from 'lucide-react';
import { OtpModal } from './OtpModal.tsx';

export type UserRole =
  | 'farmer'
  | 'fpo'
  | 'buyer'
  | 'transporter'
  | 'consumer'
  | 'platform';

export interface PersonaConfig {
  role: UserRole;
  roleTitle: string;
  name: string;
  location: string;
  description: string;
  linkedMobile: string;
  buttonLabel: string;
  icon: React.ElementType;
  isHighlighted?: boolean;
}

const DEMO_PERSONAS: PersonaConfig[] = [
  {
    role: 'farmer',
    roleTitle: 'Farmer / Producer',
    name: 'Ramesh Patil',
    location: 'Narayangaon, Junnar (Pune)',
    description:
      'List fresh harvest, calculate net earnings, find nearby bulk buyers',
    linkedMobile: '+91 98220 45123',
    buttonLabel: 'Launch as Ramesh →',
    icon: Sprout,
  },
  {
    role: 'fpo',
    roleTitle: 'FPO / Collective',
    name: 'Sahyadri Farmers Agro FPO',
    location: 'Dindori Road, Nashik (Nashik)',
    description:
      'Aggregate 450+ smallholder members, cold hub storage, bulk contracts',
    linkedMobile: '+91 94225 18760',
    buttonLabel: 'Launch as Sahyadri →',
    icon: Store,
  },
  {
    role: 'buyer',
    roleTitle: 'Bulk Buyer / HoReCa',
    name: 'GreenLeaf Kitchens & Hospitality',
    location: 'Kalyani Nagar, Pune (Pune)',
    description:
      'Procure Grade A produce with transparent price breakdown & pooled fulfillment',
    linkedMobile: '+91 98230 77412',
    buttonLabel: 'Launch as GreenLeaf →',
    icon: ShoppingBag,
    isHighlighted: true,
  },
  {
    role: 'transporter',
    roleTitle: 'Transporter / Fleet',
    name: 'KisanLogistics Fleet (Sachin Shinde)',
    location: 'Chakan Hub, Pune (Pune)',
    description:
      'Multi-stop cluster collection, vehicle capacity management, trip tracking',
    linkedMobile: '+91 97632 99881',
    buttonLabel: 'Launch as KisanLogistics →',
    icon: Truck,
  },
  {
    role: 'consumer',
    roleTitle: 'Direct Retail Consumer',
    name: 'Ananya Deshmukh',
    location: 'Kothrud, Pune (Pune)',
    description:
      'Direct farm-to-door fresh orders with verified traceability and honest prices',
    linkedMobile: '+91 98811 34509',
    buttonLabel: 'Launch as Ananya →',
    icon: User,
  },
  {
    role: 'platform',
    roleTitle: 'Platform Operations',
    name: 'Platform Operations Admin',
    location: 'Agri-Tech Directorate, Pune (Pune)',
    description:
      'Macro deficit/surplus monitoring, escrow disbursements, fraud prevention',
    linkedMobile: '+91 20 2567 8900',
    buttonLabel: 'Launch as Platform →',
    icon: Shield,
  },
];

interface LandingViewProps {
  onSelectRole: (role: UserRole) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onSelectRole }) => {
  const [authMode, setAuthMode] = useState<'instant' | 'otp'>('instant');
  const [selectedPersona, setSelectedPersona] = useState<PersonaConfig | null>(
    null
  );
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  const handleLaunch = (persona: PersonaConfig) => {
    if (authMode === 'instant') {
      onSelectRole(persona.role);
    } else {
      setSelectedPersona(persona);
      setIsOtpOpen(true);
    }
  };

  const handleOtpSuccess = () => {
    if (selectedPersona) {
      setIsOtpOpen(false);
      onSelectRole(selectedPersona.role);
    }
  };

  return (
    <div className="space-y-16 pb-12 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="text-center pt-8 sm:pt-12 max-w-4xl mx-auto px-4">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container border border-outline-variant/40 text-xs font-label-micro text-secondary-fixed mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
          <span className="font-bold tracking-wider uppercase">
            HFT CLEARINGHOUSE // DIRECT COLD-CHAIN NETTING PROTOCOL
          </span>
        </div>

        <h1 className="font-headline-lg text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary leading-tight">
          Eliminating Middleman Extortion in Indian Agriculture.
        </h1>

        <p className="mt-5 text-base sm:text-xl text-on-surface-variant font-body-md max-w-2xl mx-auto leading-relaxed">
          Shasya Vikreya replaces exploitative APMC mandi middlemen with a high-frequency bilateral clearing matrix, calibrated zero-tare weighing, and instant T+0 bank escrow payouts.
        </p>

        {/* 4 Pillars Summary Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mt-8">
          <div className="p-3 bg-surface-container-low dark:bg-surface-container-low rounded-xl border border-outline-variant/30 text-left">
            <div className="text-[10px] font-label-micro text-outline uppercase">NET REALIZATION LIFT</div>
            <div className="font-headline-sm text-xl font-bold text-secondary-fixed mt-0.5">+26.4%</div>
            <div className="text-[11px] text-on-surface-variant">Bypasses 8.5% broker cuts</div>
          </div>

          <div className="p-3 bg-surface-container-low dark:bg-surface-container-low rounded-xl border border-outline-variant/30 text-left">
            <div className="text-[10px] font-label-micro text-outline uppercase">TARE THEFT ELIMINATION</div>
            <div className="font-headline-sm text-xl font-bold text-primary mt-0.5">0.0 KG Loss</div>
            <div className="text-[11px] text-on-surface-variant">Replaces uncalibrated scales</div>
          </div>

          <div className="p-3 bg-surface-container-low dark:bg-surface-container-low rounded-xl border border-outline-variant/30 text-left">
            <div className="text-[10px] font-label-micro text-outline uppercase">ESCROW SETTLEMENT</div>
            <div className="font-headline-sm text-xl font-bold text-secondary-fixed mt-0.5">T+0 Instant</div>
            <div className="text-[11px] text-on-surface-variant">Direct IMPS / UPI to farmer</div>
          </div>

          <div className="p-3 bg-surface-container-low dark:bg-surface-container-low rounded-xl border border-outline-variant/30 text-left">
            <div className="text-[10px] font-label-micro text-outline uppercase">COLD TRANSIT SPOILAGE</div>
            <div className="font-headline-sm text-xl font-bold text-primary mt-0.5">&lt; 1.2%</div>
            <div className="text-[11px] text-on-surface-variant">Down from 18.5% in mandi trucks</div>
          </div>
        </div>
      </section>

      {/* Demo Persona Login Grid Section (Matches user image exactly) */}
      <section className="max-w-6xl mx-auto px-4" id="login-section">
        {/* Toggle Mode Switcher (Instant 1-Click Access / Mobile OTP Simulation) */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="text-center mb-3">
            <h2 className="font-headline-sm text-xl sm:text-2xl font-bold text-primary">
              Select Demo Identity to Launch Profile
            </h2>
            <p className="text-xs text-on-surface-variant font-body-md mt-1">
              Test each stakeholder perspective across the decentralized agriculture supply chain.
            </p>
          </div>

          <div className="inline-flex items-center p-1.5 rounded-full bg-surface-container dark:bg-surface-container border border-outline-variant/40 shadow-sm">
            <button
              onClick={() => setAuthMode('instant')}
              className={`px-5 py-2 rounded-full text-xs font-label-lg font-bold transition-all ${
                authMode === 'instant'
                  ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Instant 1-Click Access
            </button>
            <button
              onClick={() => setAuthMode('otp')}
              className={`px-5 py-2 rounded-full text-xs font-label-lg font-bold transition-all ${
                authMode === 'otp'
                  ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Mobile OTP Simulation
            </button>
          </div>
        </div>

        {/* 6 Cards 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_PERSONAS.map((p) => {
            const IconComp = p.icon;
            return (
              <div
                key={p.role}
                className={`bg-surface-container-lowest dark:bg-surface-container-low rounded-3xl p-6 border transition-all flex flex-col justify-between hover:shadow-xl ${
                  p.isHighlighted
                    ? 'border-emerald-500/60 ring-1 ring-emerald-500/20 shadow-md'
                    : 'border-outline-variant/30 hover:border-outline-variant/60'
                }`}
              >
                {/* Card Top: Icon & KYC Badge */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-800/40">
                      <IconComp className="w-5 h-5" />
                    </div>

                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-400 text-xs font-label-micro font-bold">
                      <span>KYC Verified</span>
                      <span>✓</span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-headline-sm text-lg font-extrabold text-primary">
                      {p.roleTitle}
                    </h3>
                    <div className="font-body-md text-sm font-bold text-primary mt-0.5">
                      {p.name}
                    </div>
                    <div className="text-xs text-outline font-label-micro mt-0.5">
                      {p.location}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-3.5 text-xs text-on-surface-variant font-body-md leading-relaxed min-h-[36px]">
                    {p.description}
                  </p>
                </div>

                {/* Bottom Meta & Launch Button */}
                <div className="mt-6 pt-4 border-t border-outline-variant/20 space-y-3">
                  <div className="flex items-center justify-between text-xs font-label-micro">
                    <span className="text-outline">Linked Mobile:</span>
                    <span className="font-label-numeric font-semibold text-primary">
                      {p.linkedMobile}
                    </span>
                  </div>

                  <button
                    onClick={() => handleLaunch(p)}
                    className={`w-full py-3 rounded-2xl font-label-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                      p.isHighlighted
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-primary text-on-primary hover:opacity-90 dark:bg-surface-container-highest dark:text-on-surface dark:border dark:border-outline-variant/40 dark:hover:bg-surface-container-high'
                    }`}
                  >
                    <span>{p.buttonLabel}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Forensic Comparison Section: APMC Middleman Mandi vs KrishiClear */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-surface-container-low dark:bg-surface-container-low p-6 sm:p-8 rounded-3xl border border-outline-variant/30">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="font-headline-sm text-2xl font-bold text-primary">
              Why the Traditional APMC Mandi System is Broken
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant font-body-md mt-1">
              A detailed forensic breakdown of what smallholder farmers lose on a typical 14.5 MT consignment of perishable horticulture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-error/30">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 text-xs font-label-micro">
                <span className="font-bold text-error">TRADITIONAL APMC MANDI ROUTE</span>
                <span className="px-2.5 py-0.5 rounded-full bg-error/15 text-error font-bold font-label-numeric">
                  LOSS: 26.4%
                </span>
              </div>

              <ul className="mt-4 space-y-3 text-xs font-body-md text-on-surface-variant">
                <li className="flex items-start gap-2">
                  <span className="text-error font-bold">✗</span>
                  <div>
                    <strong className="text-primary">8.5% Commission Agent (Aadtiya) Fee:</strong> Dalaals extract arbitrary commissions despite doing no grading or packaging.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error font-bold">✗</span>
                  <div>
                    <strong className="text-primary">Uncalibrated Tare Deduction (-4.2%):</strong> Mandi weighbridges deliberately deduct 609 kg per truck under the guise of "tare dirt".
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error font-bold">✗</span>
                  <div>
                    <strong className="text-primary">Transit &amp; Yard Spoilage (18.5%):</strong> Unrefrigerated open trucks baking in 38°C sun waiting 4–8 hours for mandi gate auction.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error font-bold">✗</span>
                  <div>
                    <strong className="text-primary">Delayed Payments (15–45 Days):</strong> Informal promissory notes and cash deductions leaving farmers in debt trap cycles.
                  </div>
                </li>
              </ul>
            </div>

            {/* The KrishiClear Way */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-secondary-fixed/50 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 text-xs font-label-micro">
                <span className="font-bold text-secondary-fixed">KRISHICLEAR DIRECT PROTOCOL</span>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed/20 text-secondary-fixed font-bold font-label-numeric">
                  NET BENEFIT: +₹1,47,400
                </span>
              </div>

              <ul className="mt-4 space-y-3 text-xs font-body-md text-on-surface-variant">
                <li className="flex items-start gap-2">
                  <span className="text-secondary-fixed font-bold">✓</span>
                  <div>
                    <strong className="text-primary">0% Broker Fee / 18 µs Netting:</strong> Double-sided algorithmic orderbook matches FPO supply with institutional buyers directly.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary-fixed font-bold">✓</span>
                  <div>
                    <strong className="text-primary">Axle Load Cell Sensor Verification:</strong> Zero tare skimming. Real weights captured digitally on FASTag RFID gates.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary-fixed font-bold">✓</span>
                  <div>
                    <strong className="text-primary">Cold-Chain Reefer Bypass (1.2% Loss):</strong> Direct transit from pre-cooled packhouses to institutional delivery docks.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary-fixed font-bold">✓</span>
                  <div>
                    <strong className="text-primary">Instant T+0 UPI Escrow:</strong> Automated smart contract triggers bank credit the moment the delivery dock scans the QR manifest.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* OTP Verification Modal */}
      {selectedPersona && (
        <OtpModal
          isOpen={isOtpOpen}
          onClose={() => setIsOtpOpen(false)}
          personaName={selectedPersona.name}
          roleTitle={selectedPersona.roleTitle}
          mobileNumber={selectedPersona.linkedMobile}
          onVerifySuccess={handleOtpSuccess}
        />
      )}
    </div>
  );
};
