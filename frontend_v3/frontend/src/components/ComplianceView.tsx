import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { translations, type Language } from '../translations';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Scale, 
  Download, 
  ExternalLink,
  Award,
  QrCode
} from 'lucide-react';

interface ComplianceViewProps {
  lang: Language;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({ lang }) => {
  const t = translations[lang];
  const [complianceData, setComplianceData] = useState<any>(null);

  useEffect(() => {
    api.getCompliance().then(setComplianceData).catch(console.error);
  }, []);

  if (!complianceData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
        <p>Verifying Maharashtra APMC Legal Compliance Guardrails...</p>
      </div>
    );
  }

  const { statutory_benefits, farmer_safeguard_checks } = complianceData;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Banner */}
      <div className="glass-card" style={{
        padding: '24px 30px',
        marginBottom: '24px',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.06) 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-safe">Statutory Framework Verified</span>
              <span className="glass-pill" style={{ color: 'var(--emerald-400)' }}>
                {complianceData.compliance_passport_id}
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              APMC Mandi Legal Compliance Guardrail
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Grounding the platform in real state law. KrishiClear operates under direct marketing provisions of the Maharashtra APMC Act, legally waiving market cess and commission agent fees.
            </p>
          </div>
        </div>
      </div>

      {/* Official Certificate Card */}
      <div className="glass-card" style={{
        padding: '36px',
        border: '1px solid var(--emerald-400)',
        background: 'linear-gradient(135deg, rgba(14, 25, 22, 0.95) 0%, rgba(10, 18, 16, 0.95) 100%)',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        marginBottom: '24px'
      }}>
        {/* Certificate Header */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
            <ShieldCheck size={32} color="var(--emerald-400)" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              DIRECT AGRI-MARKETING COMPLIANCE PASSPORT
            </h3>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Under {complianceData.statutory_framework} ({complianceData.regulatory_clause})
          </div>
        </div>

        {/* Certificate Body */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '28px' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Transaction Authority</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '2px' }}>{complianceData.origin_jurisdiction}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Destination: {complianceData.destination_jurisdiction}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Statutory Channel Mode</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '2px' }}>{complianceData.legal_channel_mode}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--emerald-400)', marginTop: '2px' }}>100% Tax & Cess Compliant</div>
          </div>
        </div>

        {/* Stat Box */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.06)',
          border: '1px solid var(--border-accent)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '28px'
        }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: 'var(--emerald-400)' }}>
            Statutory Savings Realized (Per Cleared Batch #BATCH-MH-001):
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>APMC Cess Exempted (1.25%)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ₹{statutory_benefits.apmc_market_cess_saved_rs}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--emerald-400)' }}>Statutory Market Fee Saved</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Middleman Adath Eliminated (7.0%)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ₹{statutory_benefits.middleman_commission_saved_rs}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--emerald-400)' }}>Commission Cut Avoided</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Regulatory Saving</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald-400)' }}>
                ₹{statutory_benefits.total_regulatory_saving_rs}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--emerald-400)' }}>Passed to Farmer & Buyer</div>
            </div>
          </div>
        </div>

        {/* Farmer Safeguards List */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px' }}>Farmer Safeguards Verified:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--emerald-400)" />
              <span>Farmer Floor Price Protection Active (Zero distress underpricing permitted).</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--emerald-400)" />
              <span>Digital Weighment Certified (Standard calibrated crate weights).</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--emerald-400)" />
              <span>Dispute Settlement Tribunal: {farmer_safeguard_checks.dispute_tribunal_mechanism}.</span>
            </div>
          </div>
        </div>

        {/* Certificate Footer / Hash */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            Verified Hash: <code style={{ color: 'var(--emerald-400)' }}>{complianceData.compliance_passport_id}</code>
          </div>
          <div>Issued: {complianceData.timestamp}</div>
        </div>
      </div>
    </div>
  );
};
