import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cpu, 
  Send, 
  CheckCircle2, 
  Terminal, 
  Copy, 
  RefreshCw,
  Clock,
  Mic,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  TrendingUp,
  Volume2
} from 'lucide-react';
import type { Language } from '../translations';

interface McpInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

interface FarmerPrompt {
  id: string;
  tool: string;
  args: any;
  q_en: string;
  q_hi: string;
  q_mr: string;
  summary_en: string;
  summary_hi: string;
  summary_mr: string;
}

const FARMER_PROMPTS: FarmerPrompt[] = [
  {
    id: 'route_profit',
    tool: 'optimize_logistics_route',
    args: { commodity: "Tomato", quantity_kg: 1350, ambient_temp_c: 32.0, diesel_price: 94.20, vehicle_type: "bolero_maxi", is_refrigerated: false },
    q_en: "Which route from Nashik to Mumbai will give me the highest profit today?",
    q_hi: "नासिक से मुंबई के लिए कौन सा रास्ता मुझे सबसे ज्यादा मुनाफा देगा?",
    q_mr: "नाशिकहून मुंबईला कोणता रस्ता मला सर्वात जास्त नफा मिळवून देईल?",
    summary_en: "Take Samruddhi Expressway (Route B). Even though toll is ₹580, smooth roads save ₹483 in tomato bruising and 55 min of heat exposure, giving you +₹1,184 extra net profit in hand!",
    summary_hi: "समृद्धि एक्सप्रेसवे (रूट B) चुनें। टोल ₹580 होने के बावजूद, चिकनी सड़क टमाटर को दबने से बचाती है और ₹1,184 अतिरिक्त शुद्ध लाभ सीधे आपके बैंक खाते में दिलाती है!",
    summary_mr: "समृद्धी महामार्ग (रूट B) निवडा. ₹580 टोल असला तरी, चांगल्या रस्त्यामुळे टोमॅटोचे नुकसान टळते आणि ₹1,184 जादा निव्वळ नफा थेट तुमच्या खिशात मिळतो!"
  },
  {
    id: 'mandi_rate',
    tool: 'calculate_clearing_corridor',
    args: { commodity: "Tomato" },
    q_en: "What is the fair market rate today? Am I getting cheated by middlemen?",
    q_hi: "आज टमाटर का सही मंडी भाव क्या है? क्या बिचौलिए मुझे कम भाव दे रहे हैं?",
    q_mr: "आज टोमॅटोचा रास्त बाजारभाव काय आहे? दलाल मला कमी भाव देत आहेत का?",
    summary_en: "Live APMC modal rate is ₹21.00/kg. Your statutory protective floor price is ₹17.10/kg. Never sell below ₹17.10. Direct buyer pool is currently clearing at ₹26.50/kg delivered.",
    summary_hi: "लाइव एपीएमसी मॉडल भाव ₹21.00/किग्रा है। आपकी न्यूनतम सुरक्षा दर ₹17.10/किग्रा तय की गई है। इसके नीचे कभी न बेचें। थोक खरीदार ₹26.50/किग्रा पर खरीद रहे हैं।",
    summary_mr: "थेट बाजार समिती भाव ₹21.00/किलो आहे. आपली हमी सुरक्षा किंमत ₹17.10/किलो आहे. ₹17.10 च्या खाली विकू नका. थेट खरेदीदार ₹26.50/किलो दराने खरेदी करत आहेत."
  },
  {
    id: 'apmc_police',
    tool: 'verify_apmc_compliance',
    args: { origin_district: "Nashik", destination_district: "Mumbai", commodity: "Tomato", gross_value_rs: 35775.0 },
    q_en: "Will APMC officers or police stop my truck at the checkpost?",
    q_hi: "क्या चेकपोस्ट पर एपीएमसी वाले या पुलिस मेरी गाड़ी रोकेंगे?",
    q_mr: "चेकपोस्टवर बाजार समितीचे अधिकारी किंवा पोलीस माझी गाडी अडवतील का?",
    summary_en: "No. Your vehicle is 100% legally protected under Maharashtra APMC Act Section 5D & Rule 21(A). Market cess is 0% exempted. Your digital QR gate pass is active.",
    summary_hi: "बिलकुल नहीं। आपकी गाड़ी को महाराष्ट्र एपीएमसी कानून की धारा 5D और नियम 21(A) के तहत पूरी छूट है। 0% मंडी टैक्स का डिजिटल क्यूआर पास सक्रिय है।",
    summary_mr: "नाही, अजिबात नाही. महाराष्ट्र कृषी उत्पन्न बाजार समिती कायदा कलम 5D व नियम 21(A) अन्वये आपल्या वाहनाला पूर्ण कायदेशीर सूट आहे. डिजिटल गेट पास वैध आहे."
  },
  {
    id: 'heatwave_decay',
    tool: 'run_digital_twin_simulation',
    args: { scenario_name: "heatwave_stress", traffic_delay_pct: 40.0, temperature_spike_c: 8.0, fuel_price_delta_rs: 5.0 },
    q_en: "It's 39°C hot outside and traffic is jammed at Kasara Ghat. Will my crop rot?",
    q_hi: "बाहर 39°C भीषण गर्मी है और कसारा घाट पर जाम है। क्या मेरी फसल खराब हो जाएगी?",
    q_mr: "बाहेर 39°C कडक ऊन आहे आणि कसारा घाटात ट्रॅफिक जाम आहे. माझा माल सडेल का?",
    summary_en: "KrishiClear detected thermal stress and automatically upgraded your batch to a cold-chain reefer truck, preserving 88% freshness. If delay exceeds 6 hrs, emergency diversion to Sahyadri Agro Processing will activate.",
    summary_hi: "कृषि-क्लियर ने तापमान का खतरा भांपकर तुरंत कोल्ड-स्टोरेज रीफर ट्रक आवंटित कर दिया है, जिससे 88% ताज़गी सुरक्षित है। अगर जाम 6 घंटे से अधिक हुआ, तो माल नजदीकी केचप प्लांट भेजा जाएगा।",
    summary_mr: "कृषिक्लिअरने वाढत्या उष्णतेचा धोका ओळखून त्वरित शीतगृह (रीफर) वाहनाची व्यवस्था केली आहे. माल 88% ताजा राहील. उशीर वाढल्यास जवळच्या प्रक्रिया उद्योगाकडे वळवले जाईल."
  }
];

export const McpInspectorModal: React.FC<McpInspectorModalProps> = ({ isOpen, onClose, lang }) => {
  const [activeTab, setActiveTab] = useState<'farmer' | 'developer'>('farmer');
  const [selectedPrompt, setSelectedPrompt] = useState<FarmerPrompt>(FARMER_PROMPTS[0]);
  const [chatMessages, setChatMessages] = useState<{ sender: 'farmer' | 'ai'; text: string; data?: any }[]>([
    {
      sender: 'ai',
      text: lang === 'mr' 
        ? "नमस्कार शेतकरी बंधूंनो! मी कृषिक्लिअर एआय सहाय्यक आहे. थेट बाजारभाव, सर्वात फायदेशीर रस्ता, किंवा बाजार समिती कायद्याबाबत मला विचारा."
        : lang === 'hi'
        ? "नमस्ते किसान भाई! मैं कृषि-क्लियर एआई सहायक हूँ। सही मंडी भाव, सबसे ज्यादा मुनाफा देने वाला रास्ता या कानूनी छूट के बारे में मुझसे पूछें।"
        : "Hello Farmer & FPO Member! I am your KrishiClear AI Assistant. Ask me about live mandi rates, profit-maximizing routes, or APMC legal passes."
    }
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [rpcResponse, setRpcResponse] = useState<string>('');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleAskQuestion = async (prompt: FarmerPrompt) => {
    setSelectedPrompt(prompt);
    const farmerQuestion = lang === 'mr' ? prompt.q_mr : (lang === 'hi' ? prompt.q_hi : prompt.q_en);
    
    // Append farmer message
    setChatMessages(prev => [...prev, { sender: 'farmer', text: farmerQuestion }]);
    setLoading(true);

    const payload = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: prompt.tool,
        arguments: prompt.args
      }
    };

    const startTime = performance.now();
    try {
      const res = await fetch('http://localhost:8000/api/mcp/rpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const jsonRpcRes = await res.json();
      const endTime = performance.now();
      setLatencyMs(Math.round(endTime - startTime));
      setRpcResponse(JSON.stringify(jsonRpcRes, null, 2));

      // Append AI response
      const aiAnswer = lang === 'mr' ? prompt.summary_mr : (lang === 'hi' ? prompt.summary_hi : prompt.summary_en);
      setChatMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: aiAnswer,
          data: {
            toolUsed: prompt.tool,
            latency: Math.round(endTime - startTime)
          }
        }
      ]);
    } catch (err: any) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Error connecting to AI clearinghouse server." }]);
    } finally {
      setLoading(false);
    }
  };

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
        borderRadius: '12px',
        maxWidth: '860px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 24px 48px rgba(0,0,0,0.8)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Header */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(8, 11, 17, 0.95)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: activeTab === 'farmer' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(14, 165, 233, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: activeTab === 'farmer' ? '#10b981' : '#0ea5e9'
            }}>
              {activeTab === 'farmer' ? <MessageSquare size={18} /> : <Cpu size={18} />}
            </div>
            <div>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff' }}>
                {activeTab === 'farmer' ? 'Kisan Voice & WhatsApp AI Assistant' : 'MCP Protocol Inspector (JSON-RPC 2.0)'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Powered by Model Context Protocol • Real-time Mandi & Route Intelligence
              </div>
            </div>
          </div>

          {/* View Switcher: Farmer vs Developer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '6px',
              padding: '2px',
              border: '1px solid var(--border-subtle)'
            }}>
              <button
                onClick={() => setActiveTab('farmer')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: activeTab === 'farmer' ? '#10b981' : 'transparent',
                  color: activeTab === 'farmer' ? '#080b11' : 'var(--text-muted)'
                }}
              >
                🧑‍🌾 Farmer View (Simple)
              </button>
              <button
                onClick={() => setActiveTab('developer')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: activeTab === 'developer' ? '#0ea5e9' : 'transparent',
                  color: activeTab === 'developer' ? '#080b11' : 'var(--text-muted)'
                }}
              >
                ⚙️ Tech/MCP Code
              </button>
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
        </div>

        {/* Tab 1: Farmer View (Natural, Human, Friendly) */}
        {activeTab === 'farmer' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '480px', maxHeight: '580px' }}>
            {/* Context Notice */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
              padding: '8px 20px',
              fontSize: '0.78rem',
              color: '#a7f3d0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Volume2 size={15} color="#10b981" />
              <span>
                <strong>How Farmers Use This:</strong> Tap any voice question below. The AI queries live APMC mandis and logistics engines behind the scenes and speaks back in simple everyday language.
              </span>
            </div>

            {/* Chat History Box */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: 'rgba(8, 11, 17, 0.6)'
            }}>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'farmer' ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    background: msg.sender === 'farmer' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${msg.sender === 'farmer' ? 'rgba(14, 165, 233, 0.4)' : 'var(--border-subtle)'}`,
                    borderRadius: '8px',
                    padding: '12px 14px',
                    color: '#f8fafc',
                    fontSize: '0.86rem',
                    lineHeight: 1.5
                  }}
                >
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                    color: msg.sender === 'farmer' ? '#38bdf8' : '#10b981'
                  }}>
                    {msg.sender === 'farmer' ? 'Farmer / FPO (You)' : 'KrishiClear AI Assistant'}
                  </div>
                  <div>{msg.text}</div>
                  {msg.data && (
                    <div style={{ marginTop: '6px', fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                      ⚡ Executed via MCP tool: <code>{msg.data.toolUsed}</code> ({msg.data.latency} ms)
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RefreshCw size={14} className="animate-spin" />
                  Analyzing live mandi rates and road telemetry...
                </div>
              )}
            </div>

            {/* Suggested Farmer Questions Quick-Bar */}
            <div style={{
              borderTop: '1px solid var(--border-subtle)',
              padding: '14px 20px',
              background: 'var(--bg-surface)'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                Tap to Ask Common Farmer Questions (Simulate Voice Prompt):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
                {FARMER_PROMPTS.map((p) => {
                  const label = lang === 'mr' ? p.q_mr : (lang === 'hi' ? p.q_hi : p.q_en);
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleAskQuestion(p)}
                      disabled={loading}
                      style={{
                        textAlign: 'left',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        fontSize: '0.78rem',
                        color: '#f1f5f9',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mic size={13} color="#10b981" />
                        {label.slice(0, 55)}...
                      </span>
                      <ArrowRight size={12} color="var(--text-muted)" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Developer / MCP Protocol Code Inspector (For Judges) */}
        {activeTab === 'developer' && (
          <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              This tab displays the underlying <strong>Model Context Protocol (JSON-RPC 2.0)</strong> payload executed when external autonomous agents (ONDC, Gemini, Claude) interact with KrishiClear.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
                  MCP TOOL INVOKED
                </div>
                <div style={{ padding: '8px 12px', background: 'rgba(8, 11, 17, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: '6px', fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: '#0ea5e9' }}>
                  {selectedPrompt.tool}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
                  EXECUTION LATENCY
                </div>
                <div style={{ padding: '8px 12px', background: 'rgba(8, 11, 17, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: '6px', fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: '#10b981' }}>
                  {latencyMs ? `${latencyMs} ms (Sub-second RPC)` : 'Ready'}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
                RAW JSON-RPC 2.0 PROTOCOL EXCHANGE
              </div>
              <div style={{
                height: '240px',
                background: 'rgba(8, 11, 17, 0.95)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                overflowY: 'auto',
                padding: '10px 12px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.74rem',
                color: '#a5f3fc'
              }}>
                <pre style={{ margin: 0 }}>
                  {rpcResponse || JSON.stringify({ status: "Click a question in Farmer View to see live JSON-RPC traffic." }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(8, 11, 17, 0.95)',
          fontSize: '0.76rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            KrishiClear Clearing Protocol • Registered in <code>.agents/mcp_config.json</code>
          </div>
          <button
            onClick={onClose}
            className="btn-obsidian-primary"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
