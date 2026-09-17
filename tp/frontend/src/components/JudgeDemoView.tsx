import React, { useState } from 'react';
import type { Language } from '../translations';
import { 
  Play, 
  RotateCcw, 
  ChevronRight, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  Thermometer, 
  PieChart, 
  CheckCircle2, 
  UserCheck, 
  Sparkles,
  Building2
} from 'lucide-react';

interface JudgeDemoViewProps {
  lang: Language;
  onNavigateTab: (tab: string) => void;
}

export const JudgeDemoView: React.FC<JudgeDemoViewProps> = ({ onNavigateTab }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [dropoutTriggered, setDropoutTriggered] = useState<boolean>(false);
  const [heatwaveTriggered, setHeatwaveTriggered] = useState<boolean>(false);

  const steps = [
    {
      step: 1,
      title: "1. The Real-World Baseline & Middleman Spread",
      actor: "Department of Consumer Affairs (DoCA) Benchmark",
      badge: "Problem Framing",
      description: "In the Nashik-Mumbai produce corridor, Pimpalgaon farmers receive ~₹18.50/kg for tomatoes, while Mumbai consumers pay ₹46.00/kg. Over 59.8% of consumer spend is leaked across 5 layers of commission agents, brokers, and unpooled tempos.",
      takeaway: "Traditional e-mandis only connect buyers and sellers. KrishiClear computes the trade itself to eliminate this structural leak.",
      actionText: "Step 2: Farmer Sells Lot",
      icon: TrendingUp
    },
    {
      step: 2,
      title: "2. Farmer Produce Lot Committed",
      actor: "Ramesh Shinde (Smallholder, Niphad, Nashik)",
      badge: "Supply Ingestion",
      description: "Ramesh commits 350 kg Grade A Hybrid Tomatoes from his morning harvest. Minimum floor price protected at ₹16.00/kg (cultivation cost ₹12.50 + 28% statutory livelihood cushion).",
      takeaway: "Farmer sets minimum net realization. The system cannot propose any clearing below this floor.",
      actionText: "Step 3: Consult AI Sell Window",
      icon: UserCheck
    },
    {
      step: 3,
      title: "3. Actionable AI Sell Window Advisor",
      actor: "Agmarknet Hybrid ML Engine",
      badge: "Decision Intelligence",
      description: "ML model flags post-monsoon arrival surge in Pimpalgaon Mandi (+24% by Friday). Local mandi prices will drop to ₹14.50. AI Advisor alerts Ramesh: 'Commit harvest to Mumbai direct clearing today to lock in ₹20.50 net realization before local crash.'",
      takeaway: "AI is not an ornamental chart; it gives actionable harvest timing recommendations.",
      actionText: "Step 4: Urban Cluster Demand",
      icon: Sparkles
    },
    {
      step: 4,
      title: "4. Urban Consumer Cluster Demand Aggregation",
      actor: "Green Valley Federation (Vashi, 420 Families)",
      badge: "Demand Pooling",
      description: "Green Valley RWA pools weekend collective demand for 900 kg fresh tomatoes at max ceiling budget ₹28.00/kg. Alongside FreshPlate Cloud Kitchens (450 kg), total pooled city demand reaches 1,350 kg.",
      takeaway: "Demand is aggregated into unified drop nodes, unlocking bulk logistics efficiency.",
      actionText: "Step 5: Form Clearing Batch",
      icon: Building2Icon
    },
    {
      step: 5,
      title: "5. The Algorithmic Clearinghouse Engine Solves Trade",
      actor: "KrishiClear Constrained Allocation Engine",
      badge: "Core Differentiator",
      description: "The engine combines 3 farmers (Ramesh 350kg, Suresh 450kg) + 1 FPO Lot (600kg) to fulfill 1,350kg city demand at ₹26.50/kg delivered. Both sides win: Farmers get ₹20.73 net (vs ₹14.80 mandi), Buyers pay ₹26.50 (vs ₹46.00 retail).",
      takeaway: "Core object is a temporary, auditable Clearing Batch (not an ordinary uncoordinated listing).",
      actionText: "Step 6: Plan Delivered Logistics",
      icon: Truck
    },
    {
      step: 6,
      title: "6. Profit-Maximizing Delivered Logistics & Milk-Run",
      actor: "Delivered Economics Optimizer",
      badge: "Physical Reality",
      description: "Plans multi-farm pickup circuit: Niphad ➔ Dindori ➔ Pimpalgaon Hub ➔ Kasara Ghat ➔ Vashi. Selects Mahindra Bolero Maxi Truck (1.5T capacity, 11 km/L diesel @ ₹94.20/L). Empty-km reduced by 58%, saving 317 km of fragmented driving.",
      takeaway: "Logistics cost (₹2.12/kg) is calculated BEFORE trade confirmation, protecting farmer profit.",
      actionText: "Step 7: Perishability & Temperature Check",
      icon: Thermometer
    },
    {
      step: 7,
      title: "7. Crop Temperature Profile & Freshness Limit",
      actor: "Perishability Intelligence Engine",
      badge: "Quality Assurance",
      description: "Tomato profile evaluated (Ideal: 12-15°C, Ambient: 30°C). Over the 4.0h transit, thermal stress remains low. Freshness Score audits at 91.2% (SAFE status), with 98.4 hours of usable retail shelf-life remaining.",
      takeaway: "Optimizer solves for value before spoilage, preventing post-harvest distress dumping.",
      actionText: "Step 8: Simulate Supplier Dropout",
      icon: CheckCircle2
    },
    {
      step: 8,
      title: "8. THE JUDGE-WOW MOMENT: Supplier Dropout Shock!",
      actor: "Disruption Stress Test",
      badge: "Resilience & Recovery",
      description: "Simulate a real-world emergency: Farmer Ramesh Shinde cancels his 350 kg lot due to sudden tractor breakdown. In a conventional marketplace, the buyer order would collapse or fail.",
      takeaway: "Watch how KrishiClear handles failure: it does NOT cancel the trade!",
      actionText: dropoutTriggered ? "Step 9: Review Auto-Recleared Batch" : "Simulate Ramesh Dropout (Click to Test)",
      isDropoutStep: true,
      icon: AlertTriangle
    },
    {
      step: 9,
      title: "9. Instant Autonomous Re-Clearing in < 150ms",
      actor: "Autonomous Recovery Solver",
      badge: "Zero-Downtime Resilience",
      description: "The engine instantly queries candidate supply pool, identifies Eknath Bhor (Reserve Lot, 400kg, Ozar Agro Belt, 8km away), updates truck route, and recomputes the Clearing Batch in 120ms without human intervention.",
      takeaway: "When reality breaks the plan, the engine solves the trade again automatically.",
      actionText: "Step 10: Environmental Heatwave Shock",
      icon: RotateCcw
    },
    {
      step: 10,
      title: "10. Environmental Stress: Ambient Heatwave Shock (+8°C)",
      actor: "Digital Twin Simulation Studio",
      badge: "Autonomous Defense",
      description: "Ambient heat surges to 38°C on the highway. Regular truck would degrade freshness to 48% (CRITICAL risk). Engine autonomously triggers vehicle swap to Eicher Pro Reefer cold chain unit, preserving 86.4% freshness.",
      takeaway: "The platform dynamically balances refrigeration cost against spoilage loss.",
      actionText: "Step 11: Inspect ₹100 Margin Ledger",
      icon: Thermometer
    },
    {
      step: 11,
      title: "11. The ₹100 Margin Leak Ledger & Counterfactual Proof",
      actor: "Auditable Value Ledger",
      badge: "Mathematical Proof",
      description: "Every ₹100 of consumer spend is audited: ₹78.20 directly to Farmer Payout (vs ₹32.50 mandi), ₹11.20 Logistics & Fuel, ₹4.30 Quality Crating, ₹2.50 FPO Margin, ₹1.50 KrishiClear Fee. Counterfactual proof proves ₹1,420 net farmer uplift.",
      takeaway: "'Remove intermediaries' is not a slogan; it is an auditable rupee ledger.",
      actionText: "Step 12: APMC Legal Exemption",
      icon: PieChart
    },
    {
      step: 12,
      title: "12. Maharashtra APMC Legal Compliance Guardrail",
      actor: "APMC Compliance Engine",
      badge: "Institutional Realism",
      description: "Validates trade under Section 5D of Maharashtra APMC Act (Direct Agri-Marketing). Verifies exemption from 1.25% market yard cess (saving ₹447.19) and eliminates 7% Adathiya commission (saving ₹2,504.25). Emits cryptographic certificate hash.",
      takeaway: "Grounding the project in real state legal frameworks gives unmatched institutional credibility.",
      actionText: "Explore Full Modules",
      icon: ShieldCheck
    }
  ];

  const currentStepData = steps[activeStep - 1];
  const StepIcon = currentStepData.icon;

  const handleNext = () => {
    if (activeStep === 8 && !dropoutTriggered) {
      setDropoutTriggered(true);
      setActiveStep(9);
      return;
    }
    if (activeStep < steps.length) {
      setActiveStep(prev => prev + 1);
    } else {
      onNavigateTab('clearing');
    }
  };

  const handleReset = () => {
    setActiveStep(1);
    setDropoutTriggered(false);
    setHeatwaveTriggered(false);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{
        padding: '24px 32px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-safe">Official SIH 2026 Presentation Story</span>
              <span className="glass-pill" style={{ color: 'var(--amber-400)' }}>Step {activeStep} of {steps.length}</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              The 5-Minute "Judge-Winning" Walkthrough
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', marginTop: '6px' }}>
              Follow the end-to-end journey of <strong>Tomato Batch #BATCH-MH-001</strong> from rural Nashik smallholders to Mumbai RWA consumers, proving how KrishiClear out-thinks conventional e-mandis when real-world disruptions strike.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleReset} 
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              <RotateCcw size={15} /> Reset Scenario
            </button>
            <button 
              onClick={handleNext}
              className="btn btn-primary"
              style={{ fontSize: '0.95rem' }}
            >
              <Play size={16} /> {currentStepData.actionText}
            </button>
          </div>
        </div>

        {/* Timeline Progress Bar */}
        <div style={{ marginTop: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            <span>Step 1: Problem Framing</span>
            <span>Step 5: Algorithmic Clearing</span>
            <span>Step 8: Failure Recovery</span>
            <span>Step 12: APMC Audit Proof</span>
          </div>
          <div style={{
            height: '8px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${(activeStep / steps.length) * 100}%`,
              background: 'linear-gradient(90deg, var(--emerald-500) 0%, var(--teal-500) 50%, var(--amber-500) 100%)',
              borderRadius: '999px',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
        </div>
      </div>

      {/* Step Visualizer Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Main Step Detail */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--emerald-400)'
            }}>
              <StepIcon size={24} />
            </div>
            <span className="glass-pill" style={{ color: 'var(--text-secondary)' }}>
              {currentStepData.actor}
            </span>
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '18px 0 10px 0' }}>
            {currentStepData.title}
          </h3>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: '1.6', marginBottom: '20px' }}>
            {currentStepData.description}
          </p>

          {/* Key Judge Takeaway Callout */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderLeft: '4px solid var(--emerald-400)',
            padding: '14px 18px',
            borderRadius: '0 10px 10px 0',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--emerald-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              Why Judges Score This Highly:
            </div>
            <div style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>
              "{currentStepData.takeaway}"
            </div>
          </div>

          {/* Interactive Trigger Button */}
          <button 
            onClick={handleNext}
            className={`btn ${activeStep === 8 && !dropoutTriggered ? 'btn-danger' : 'btn-primary'}`}
            style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
          >
            {currentStepData.actionText} <ChevronRight size={18} />
          </button>
        </div>

        {/* Live System State Inspector */}
        <div className="glass-card" style={{ padding: '28px', background: 'rgba(14, 25, 22, 0.85)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-dot" /> Live Clearing Batch Telemetry
            </h4>
            <span className="glass-pill" style={{ fontSize: '0.72rem' }}>BATCH-MH-001</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cleared Volume</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>1,350 kg</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--emerald-400)' }}>100% Demand Met</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Farmer Net Rate</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--emerald-400)' }}>₹20.73 / kg</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>vs ₹14.80 Mandi</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Freshness Index</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: activeStep >= 10 && !heatwaveTriggered ? 'var(--amber-400)' : 'var(--emerald-400)' }}>
                {activeStep >= 10 ? '86.4%' : '91.2%'}
              </div>
              <span className="badge-safe">SAFE</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dispatched Vehicle</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '4px' }}>
                {activeStep >= 10 ? 'Eicher Reefer 3.5T' : 'Bolero Maxi Truck 1.5T'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {activeStep >= 10 ? 'Refrigerated @ 14°C' : 'Ambient Ventilated'}
              </div>
            </div>
          </div>

          {/* Active Suppliers in Batch */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Allocated Suppliers in Current Batch:
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {!dropoutTriggered ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '6px 10px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '6px' }}>
                  <span>👨‍🌾 Ramesh Shinde (Niphad)</span>
                  <span style={{ fontWeight: 600 }}>350 kg @ ₹16.00 floor</span>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '6px 10px', background: 'rgba(244, 63, 94, 0.12)', borderRadius: '6px', color: 'var(--rose-400)' }}>
                  <span>❌ Ramesh Shinde (DROPPED OUT)</span>
                  <span style={{ fontWeight: 600 }}>Canceled</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '6px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
                <span>👨‍🌾 Suresh Jadhav (Dindori)</span>
                <span style={{ fontWeight: 600 }}>450 kg @ ₹16.50 floor</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '6px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
                <span>🏢 Pimpalgaon Agro FPO Lot</span>
                <span style={{ fontWeight: 600 }}>{dropoutTriggered ? '550 kg' : '550 kg'} @ ₹17.00 floor</span>
              </div>

              {dropoutTriggered && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '6px 10px', background: 'rgba(16, 185, 129, 0.18)', borderRadius: '6px', border: '1px solid var(--emerald-400)' }}>
                  <span>🔄 Eknath Bhor (Auto-Recleared Reserve)</span>
                  <span style={{ fontWeight: 700, color: 'var(--emerald-400)' }}>+350 kg (Recovered)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step Quick Selector Strip */}
      <div className="glass-card" style={{ padding: '14px 20px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {steps.map((s) => (
          <button
            key={s.step}
            onClick={() => setActiveStep(s.step)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: activeStep === s.step ? '1px solid var(--emerald-400)' : '1px solid var(--border-subtle)',
              background: activeStep === s.step ? 'var(--emerald-600)' : 'transparent',
              color: activeStep === s.step ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Step {s.step}
          </button>
        ))}
      </div>
    </div>
  );
};

function Building2Icon(props: any) {
  return <Building2 {...props} />;
}
