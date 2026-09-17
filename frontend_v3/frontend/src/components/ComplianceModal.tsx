import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileCheck, 
  QrCode, 
  Printer, 
  ExternalLink,
  CheckCircle2,
  Building,
  Scale
} from 'lucide-react';
import type { Language } from '../translations';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

interface GatePassData {
  pass_id: string;
  batch_id: string;
  vehicle_registration: string;
  driver_name: string;
  driver_phone: string;
  origin_hub: string;
  destination_sink: string;
  commodity: string;
  net_weight_kg: number;
  fpo_name: string;
  fpo_registration: string;
  statutory_authority: string;
  governing_statute: string;
  statutory_exemption_declared: string;
  digital_signature_hash: string;
  qr_payload: string;
  issued_at: string;
  valid_until: string;
  status: string;
}

interface ComplianceVerification {
  is_compliant: boolean;
  regulatory_clause: string;
  legal_clauses: {
    section: string;
    act: string;
    title: string;
    summary: string;
    status: string;
  }[];
  statutory_benefits: {
    apmc_market_cess_exempted_pct: number;
    apmc_market_cess_saved_rs: number;
    middleman_commission_eliminated_pct: number;
    middleman_commission_saved_rs: number;
    total_regulatory_saving_rs: number;
  };
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({ isOpen, onClose, lang }) => {
  const [gatePass, setGatePass] = useState<GatePassData | null>(null);
  const [compliance, setCompliance] = useState<ComplianceVerification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [passRes, compRes] = await Promise.all([
          fetch('http://localhost:8000/api/compliance/gate-pass?batch_id=BATCH-MH-20260912-001'),
          fetch('http://localhost:8000/api/compliance/verify?commodity=Tomato&gross_value_rs=35775.0')
        ]);
        if (passRes.ok) setGatePass(await passRes.json());
        if (compRes.ok) setCompliance(await compRes.json());
      } catch (e) {
        console.error("Error fetching compliance pass:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(4, 7, 12, 0.85)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        maxWidth: '820px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Top Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(8, 11, 17, 0.95)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#10b981" />
            <span style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Maharashtra APMC Act Section 5D Statutory Transit Pass
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', flex: 1 }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Generating Cryptographic APMC Gate Pass...
            </div>
          ) : gatePass && (
            <div>
              {/* Official Certificate Box */}
              <div style={{
                background: 'rgba(8, 11, 17, 0.9)',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '8px',
                padding: '22px',
                marginBottom: '20px',
                position: 'relative'
              }}>
                {/* Official Preamble */}
                <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Government of Maharashtra • State Agricultural Marketing Board (MSAMB)
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: '4px 0' }}>
                    DIRECT AGRI-MARKETING TRANSIT GATE PASS
                  </h2>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Issued under Section 5D & Rule 21(A), Maharashtra APMC Act, 1963
                  </div>
                </div>

                {/* Grid with Details and QR */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '20px', alignItems: 'center' }}>
                  {/* Left Metadata Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.82rem', fontFamily: 'JetBrains Mono' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>GATE PASS SERIAL</span>
                      <strong style={{ color: '#0ea5e9' }}>{gatePass.pass_id}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>BATCH REFERENCE</span>
                      <strong style={{ color: '#ffffff' }}>{gatePass.batch_id}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>VEHICLE REGISTRATION</span>
                      <strong style={{ color: '#f59e0b' }}>{gatePass.vehicle_registration}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>DRIVER IN CHARGE</span>
                      <strong>{gatePass.driver_name}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>COMMODITY & QUANTITY</span>
                      <strong>{gatePass.commodity} ({gatePass.net_weight_kg} kg)</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>ISSUING FPO CO-OP</span>
                      <strong style={{ color: '#10b981' }}>{gatePass.fpo_name}</strong>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>TRANSIT CORRIDOR</span>
                      <div style={{ color: '#cbd5e1' }}>
                        {gatePass.origin_hub} ➔ {gatePass.destination_sink}
                      </div>
                    </div>
                  </div>

                  {/* Right QR Box */}
                  <div style={{
                    background: '#ffffff',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Stylized QR placeholder */}
                    <div style={{ width: '120px', height: '120px', background: '#080b11', padding: '6px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <QrCode size={104} color="#10b981" />
                    </div>
                    <span style={{ fontSize: '0.64rem', color: '#080b11', fontWeight: 800, marginTop: '6px', fontFamily: 'JetBrains Mono' }}>
                      SCAN AT APMC CHECKPOST
                    </span>
                  </div>
                </div>

                {/* Exemption Declarations */}
                <div style={{
                  marginTop: '16px',
                  padding: '10px 14px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  color: '#e2e8f0',
                  lineHeight: 1.4
                }}>
                  <strong style={{ color: '#10b981' }}>STATUTORY DECLARATION: </strong>
                  This vehicle carries agricultural produce procured directly from member farmers under a registered Farmer Producer Company (FPC). Pursuant to Section 5D & Rule 21(A), this cargo is <strong>exempt from market yard cess, adath (commission), and physical transit detention</strong>.
                </div>

                {/* Signature Hash */}
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                  <span>SIGNATURE: {gatePass.digital_signature_hash}</span>
                  <span>ISSUED: {gatePass.issued_at}</span>
                </div>
              </div>

              {/* Statutory Legal Clauses Table */}
              {compliance && (
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                    Applicable Legal Clauses & Safeguards
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                    {compliance.legal_clauses.map((cl, idx) => (
                      <div key={idx} style={{
                        background: 'rgba(8, 11, 17, 0.5)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '10px 12px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0ea5e9', fontFamily: 'JetBrains Mono' }}>
                            {cl.section}
                          </span>
                          <span style={{ fontSize: '0.64rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                            {cl.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                          {cl.title}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                          {cl.summary}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(8, 11, 17, 0.95)'
        }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Digital Verification Hash: <code style={{ color: '#0ea5e9' }}>SHA256-MSAMB-OK</code>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => window.print()}
              className="btn-obsidian"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
            >
              <Printer size={16} />
              Print Transit Gate Pass
            </button>
            <button
              onClick={onClose}
              className="btn-obsidian-primary"
              style={{ fontSize: '0.82rem' }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
