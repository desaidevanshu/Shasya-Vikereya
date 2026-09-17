import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Play, 
  Pause, 
  CheckCheck, 
  FileText, 
  Compass, 
  PhoneCall, 
  ShieldCheck, 
  Share2, 
  Smartphone,
  Volume2
} from 'lucide-react';
import type { Language } from '../translations';

interface WhatsAppSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenGatePass?: () => void;
}

export const WhatsAppSimulatorModal: React.FC<WhatsAppSimulatorModalProps> = ({ 
  isOpen, 
  onClose, 
  lang,
  onOpenGatePass 
}) => {
  const [data, setData] = useState<any>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;
    fetch('http://localhost:8000/api/whatsapp/dispatch-preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        batch_id: 'BATCH-MH-20260912-001',
        farmer_name: 'Tukaram G. Jadhav',
        farmer_phone: '+91 98224 81920',
        driver_name: 'Santosh K. Shinde',
        driver_phone: '+91 98231 44921',
        vehicle_reg: 'MH-15-EG-4921',
        commodity: 'Tomato (Hybrid Red Grade A)',
        quantity_kg: 1350.0,
        expected_net_payout: 30378.58,
        gate_pass_id: 'GP-MSAMB-2026-B340E4BE',
        lang: lang
      })
    })
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching WhatsApp dispatch payload:', err);
        setLoading(false);
      });
  }, [isOpen, lang]);

  const toggleVoiceNote = () => {
    if (!data?.voice_note?.audio_script) return;

    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis?.cancel();
      const utterance = new SpeechSynthesisUtterance(data.voice_note.audio_script);
      utterance.lang = lang === 'mr' ? 'mr-IN' : (lang === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis?.speak(utterance);
      setIsPlayingAudio(true);
    }
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
        background: '#0b141a', // WhatsApp Dark canvas
        border: '1px solid #1f2c34',
        borderRadius: '16px',
        maxWidth: '440px',
        width: '100%',
        maxHeight: '92vh',
        overflow: 'hidden',
        boxShadow: '0 24px 70px rgba(0,0,0,0.95)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* WhatsApp App Top Bar */}
        <div style={{
          padding: '12px 16px',
          background: '#1f2c34',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#e9edef'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#00a884',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1rem'
            }}>
              K
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.92rem', fontWeight: 700 }}>
                KrishiClear Terminal
                <span style={{ color: '#00a884', fontSize: '0.8rem' }}>✓</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#8696a0' }}>
                Official WhatsApp Business Verified
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              onClose();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#8696a0',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Body Wallpaper */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 14px',
          background: '#0b141a',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 0)',
          backgroundSize: '16px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* System Date Badge */}
          <div style={{ textAlign: 'center' }}>
            <span style={{
              background: '#182229',
              color: '#8696a0',
              fontSize: '0.68rem',
              padding: '4px 10px',
              borderRadius: '6px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}>
              TODAY • ENCRYPTED END-TO-END
            </span>
          </div>

          {/* Voice Note Message Bubble */}
          <div style={{
            alignSelf: 'flex-start',
            maxWidth: '88%',
            background: '#202c33',
            borderRadius: '8px',
            borderTopLeftRadius: '0px',
            padding: '10px 12px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
            color: '#e9edef'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#00a884', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Volume2 size={14} /> VOICE DISPATCH NOTE (मराठी/हिंदी)
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={toggleVoiceNote}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isPlayingAudio ? '#f43f5e' : '#00a884',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isPlayingAudio ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
              </button>

              <div style={{ flex: 1 }}>
                {/* Visual Audio Waveform Simulation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '18px' }}>
                  {[12, 18, 24, 14, 28, 16, 22, 30, 18, 12, 26, 14, 20, 16, 24, 12].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: '3px',
                        height: `${h * (isPlayingAudio ? 0.7 + Math.random() * 0.5 : 0.6)}px`,
                        background: isPlayingAudio ? '#00a884' : '#8696a0',
                        borderRadius: '2px',
                        transition: 'height 0.15s ease'
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.64rem', color: '#8696a0', marginTop: '4px' }}>
                  <span>{isPlayingAudio ? 'Playing voice note...' : '0:16'}</span>
                  <span>11:05 AM ✓✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Structured WhatsApp Card Message */}
          {data && (
            <div style={{
              alignSelf: 'flex-start',
              maxWidth: '92%',
              background: '#202c33',
              borderRadius: '8px',
              borderTopLeftRadius: '0px',
              padding: '12px 14px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
              color: '#e9edef',
              fontSize: '0.82rem',
              lineHeight: 1.5
            }}>
              <div style={{ fontWeight: 800, color: '#00a884', fontSize: '0.86rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px', marginBottom: '8px' }}>
                🟢 KRISHICLEAR VERIFIED DISPATCH
              </div>

              <div style={{ whiteSpace: 'pre-line' }}>
                {data.whatsapp_payload.interactive.body.text}
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.64rem', color: '#8696a0', marginTop: '4px' }}>
                11:06 AM ✓✓
              </div>

              {/* WhatsApp Interactive Action Buttons */}
              <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenGatePass) onOpenGatePass();
                  }}
                  style={{
                    background: '#182229',
                    border: '1px solid #2a3942',
                    color: '#00a884',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <FileText size={14} /> 📄 View Digital Gate Pass (QR)
                </button>

                <button
                  onClick={() => window.open(data.direct_links.google_maps_route, '_blank')}
                  style={{
                    background: '#182229',
                    border: '1px solid #2a3942',
                    color: '#00a884',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Compass size={14} /> 🗺️ Live GPS Tracking (Google Maps)
                </button>

                <button
                  onClick={() => alert(`Dialing Driver: ${data.recipient.driver_name} (${data.recipient.driver_phone})`)}
                  style={{
                    background: '#182229',
                    border: '1px solid #2a3942',
                    color: '#00a884',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <PhoneCall size={14} /> 📞 Call Driver (+91 98231 44921)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp Bottom Bar */}
        <div style={{
          padding: '10px 14px',
          background: '#1f2c34',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            flex: 1,
            background: '#2a3942',
            borderRadius: '20px',
            padding: '8px 14px',
            fontSize: '0.78rem',
            color: '#8696a0'
          }}>
            Type a message...
          </div>
          <button
            onClick={() => alert('Simulated WhatsApp message sent to farmer!')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#00a884',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
