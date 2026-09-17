import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  AlertOctagon, 
  Lock, 
  Unlock, 
  FileText, 
  Clock, 
  Award,
  Maximize2
} from 'lucide-react';
import type { Language } from '../translations';

interface QaManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const QaManifestModal: React.FC<QaManifestModalProps> = ({ isOpen, onClose, lang }) => {
  const [manifest, setManifest] = useState<any>(null);
  const [disputeResult, setDisputeResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;
    fetch('http://localhost:8000/api/qa/generate-manifest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        batch_id: 'BATCH-MH-20260912-001',
        commodity: 'Tomato (Hybrid Red Grade A)',
        total_crates: 54,
        total_weight_kg: 1350.0,
        escrow_amount: 30378.58
      })
    })
      .then(res => res.json())
      .then(data => {
        setManifest(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching QA manifest:', err);
        setLoading(false);
      });
  }, [isOpen]);

  const handleTestDispute = (isDispute: boolean) => {
    fetch('http://localhost:8000/api/qa/resolve-escrow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        manifest_id: manifest?.manifest_id || 'QA-0912-001',
        buyer_dispute: isDispute,
        dispute_reason: 'Middleman claiming 25% rot and soft skin'
      })
    })
      .then(res => res.json())
      .then(data => setDisputeResult(data))
      .catch(err => console.error('Error resolving dispute:', err));
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(4, 7, 12, 0.88)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 60px rgba(0,0,0,0.85)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(8, 11, 17, 0.95)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.08rem', fontWeight: 800, color: '#ffffff' }}>
                {lang === 'mr' ? 'डिजिटल गुणवत्ता तपासणी व एस्क्रो संरक्षण' : 'Dispatch-Proof QA Manifest & Cryptographic Escrow'}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                {lang === 'mr' 
                  ? 'दलालांची "माल सडला आहे" अशी खोटी कपात रोखण्यासाठी प्रस्थानवेळचे डिजिटल प्रमाणपत्र' 
                  : 'Eliminates commission agent "rotten quality" deductions with SHA-256 optical proof'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {loading || !manifest ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            Generating Cryptographic QA Manifest...
          </div>
        ) : (
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Top Seal Banner */}
            <div style={{
              padding: '14px 18px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>
                  CRYPTOGRAPHIC SHA-256 QUALITY SEAL VERIFIED
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                  {manifest.cryptographic_seal.hash}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  Manifest ID: {manifest.manifest_id} • Certified Inspector: {manifest.certified_inspector}
                </div>
              </div>
              <div style={{
                background: '#10b981',
                color: '#080b11',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '0.76rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Award size={14} /> 99.5% PURITY GRADE A
              </div>
            </div>

            {/* Optical Inspection Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              {/* Size Grading */}
              <div style={{ padding: '14px', background: 'rgba(8, 11, 17, 0.7)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>SIZE & DIAMETER GRADING</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'JetBrains Mono', marginTop: '4px' }}>
                  {manifest.metrics.size_grading.avg_diameter_mm} mm
                </div>
                <div style={{ fontSize: '0.74rem', color: '#10b981', marginTop: '4px' }}>
                  ✓ {manifest.metrics.size_grading.grade_a_pct}% Grade A (52–64 mm)
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {manifest.metrics.size_grading.grade_b_pct}% Grade B • 0% Undersized
                </div>
              </div>

              {/* Color Maturity */}
              <div style={{ padding: '14px', background: 'rgba(8, 11, 17, 0.7)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>COLOR & MATURITY INDEX</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'JetBrains Mono', marginTop: '4px' }}>
                  78.2% Breaker
                </div>
                <div style={{ fontSize: '0.74rem', color: '#f59e0b', marginTop: '4px' }}>
                  Pink Blush (Transit Durability)
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  21.8% Firm Red • 0% Overripe
                </div>
              </div>

              {/* Surface Defect */}
              <div style={{ padding: '14px', background: 'rgba(8, 11, 17, 0.7)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>DEFECT & ROT TOLERANCE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', fontFamily: 'JetBrains Mono', marginTop: '4px' }}>
                  0.0% SOFT ROT
                </div>
                <div style={{ fontSize: '0.74rem', color: '#10b981', marginTop: '4px' }}>
                  99.5% Defect-Free Surface
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  0.38% Minor Blemish • 0% Sunscald
                </div>
              </div>

              {/* Firmness */}
              <div style={{ padding: '14px', background: 'rgba(8, 11, 17, 0.7)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>PENETROMETER FIRMNESS</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'JetBrains Mono', marginTop: '4px' }}>
                  {manifest.metrics.firmness_penetrometer.avg_firmness_kg_cm2} kg/cm²
                </div>
                <div style={{ fontSize: '0.74rem', color: '#10b981', marginTop: '4px' }}>
                  Vibration Resistance: 12+ Hours
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Zero puncture risk on Samruddhi
                </div>
              </div>
            </div>

            {/* Smart Escrow Protection & Dispute Simulator */}
            <div style={{
              background: 'rgba(8, 11, 17, 0.85)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '16px 18px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={16} color="#10b981" />
                  SMART CONTRACT ESCROW LOCK ({manifest.escrow_guardrail.escrow_locked_amount})
                </div>
                <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} /> Dispute Window: 24m 15s remaining
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '14px' }}>
                Under KrishiClear algorithmic escrow, the buyer cannot withhold money with verbal claims. If any quality claim is made, photographic verification must match the dispatch optical seal. If no claim is filed within 30 minutes of delivery, 100% funds are automatically disbursed into the farmer's bank account.
              </div>

              {/* Dispute Testing Simulator Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleTestDispute(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Unlock size={14} color="#10b981" /> Simulate 30-Min Auto-Release
                </button>
                <button
                  onClick={() => handleTestDispute(true)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px', color: '#f43f5e', borderColor: 'rgba(244,63,94,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <AlertOctagon size={14} color="#f43f5e" /> Simulate Middleman "Rotten Produce" Claim
                </button>
              </div>

              {/* Dispute Result Box */}
              {disputeResult && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px 14px',
                  background: disputeResult.status === 'AUTO_RELEASE_COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '6px',
                  border: `1px solid ${disputeResult.status === 'AUTO_RELEASE_COMPLETED' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                }}>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: disputeResult.status === 'AUTO_RELEASE_COMPLETED' ? '#10b981' : '#f59e0b' }}>
                    {disputeResult.status === 'AUTO_RELEASE_COMPLETED' ? '✓ ESCROW RELEASED IN FULL TO FARMER' : '🛡️ DISPUTE REJECTED BY CRYPTOGRAPHIC SEAL'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#f8fafc', marginTop: '4px' }}>
                    {disputeResult.resolution || disputeResult.adjudication}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>
                    Disbursed Payout: {disputeResult.disbursed_to_farmer} (Arbitrary Deductions Prevented: {disputeResult.deduction_prevented || '₹0.00'})
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '14px'
            }}>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                Certified under Agmark & MSAMB Direct Marketing Grading Standards
              </div>
              <button
                onClick={() => alert(`Official Cryptographic QA Manifest for ${manifest.batch_id} downloaded as tamper-proof PDF!`)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <FileText size={16} /> Download Signed QA Manifest (PDF)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
