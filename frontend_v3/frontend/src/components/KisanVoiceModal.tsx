import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  TrendingUp,
  AlertCircle,
  Activity,
  Layers,
  MessageSquare,
  Share2,
  Play,
  Square,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { Room, RoomEvent, Track } from 'livekit-client';
import type { Language } from '../translations';

interface KisanVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

interface ChatMessage {
  id: string;
  sender: 'farmer' | 'assistant';
  text: string;
  category?: 'price' | 'route' | 'legal' | 'freshness' | 'agronomy';
  data?: any;
}

interface PipelineTelemetry {
  stt: { engine: string; configured: boolean; latency?: string };
  llm: { model: string; valid: boolean; status: string };
  tts: { engine: string; available: boolean; voices: any };
  webrtc: { engine: string; configured: boolean };
}

const modalStrings = {
  mr: {
    title: "कृषिक्लिअर व्हॉईस सहाय्यक",
    subtitle: "मराठी व्हॉईस थेट संवाद (थेट बाजारभाव व नफा सल्ला)",
    chooseLang: "🗣️ बोलण्याची भाषा निवडा:",
    voiceMode: "थेट व्हॉईस",
    transcriptMode: "तपशील व चॅट",
    statusIdle: "माईक सुरू करण्यासाठी खालील बटण दाबा",
    statusRecording: "🔴 आवाज रेकॉर्ड होत आहे... बोलणे झाल्यावर लाल बटण दाबा",
    statusThinking: "कृषिक्लिअर उत्तर तयार करत आहे...",
    statusSpeaking: "उत्तर ऐका (मराठी न्यूरल आवाज)",
    btnStart: "🎙️ आवाज रेकॉर्ड करण्यासाठी येथे दाबा",
    btnStop: "⏹️ रेकॉर्डिंग पूर्ण — पाठवा",
    btnHelpIdle: "एकदा दाबा, बोला, आणि बोलणे झाल्यावर पुन्हा दाबा",
    btnHelpRecording: "तुम्ही स्वतः बंद करेपर्यंत रेकॉर्डिंग चालू राहील",
    dictationPrompt: "शेतकरी बंधू, बोला...",
    youAsked: "👨‍🌾 तुमचा प्रश्न:",
    replayVoice: "🔊 पुन्हा ऐका",
    viewCards: "सविस्तर तक्ता व पास पहा",
    soundOn: "आवाज चालू",
    muted: "मूक",
    activePipeline: "सक्रिय इंजिन",
    chatPlaceholder: "इथे मराठीत टाईप करा (मूक चॅट) किंवा माईक दाबा...",
    chipProfit: "💰 सर्वाधिक नफा पिके",
    chipHarvest: "🌱 काढणी व पेरणी वेळ",
    chipRoute: "🚚 रस्ता व नफा",
    chipMandi: "🍅 थेट बाजारभाव",
    chipPass: "📜 कलम 5D गेट पास",
    queryProfit: "सध्या कोणत्या पिकात सर्वाधिक नफा मिळतो?",
    queryHarvest: "टोमॅटो तोडणीची योग्य वेळ कोणती आणि कांदा बियाणे कधी पेरावे?",
    queryRoute: "नाशिकहून मुंबईला कोणता रस्ता जास्त नफा देईल?",
    queryMandi: "आज टोमॅटोचा बाजारभाव काय चालू आहे?",
    queryPass: "चेकपोस्टवर गाडी अडवतील का? मला पास द्या."
  },
  hi: {
    title: "कृषि-क्लियर वॉइस असिस्टेंट",
    subtitle: "हिंदी वॉइस सीधा संवाद (ताजा मंडी भाव व मुनाफा परामर्श)",
    chooseLang: "🗣️ बोलने की भाषा चुनें:",
    voiceMode: "लाइव वॉइस",
    transcriptMode: "चैट व विवरण",
    statusIdle: "माइक चालू करने के लिए नीचे बटन दबाएं",
    statusRecording: "🔴 आवाज रिकॉर्ड हो रही है... बोलना समाप्त होने पर लाल बटन दबाएं",
    statusThinking: "कृषि-क्लियर उत्तर तैयार कर रहा है...",
    statusSpeaking: "उत्तर सुनें (हिंदी न्यूरल आवाज)",
    btnStart: "🎙️ आवाज रिकॉर्ड करने के लिए यहाँ दबाएं",
    btnStop: "⏹️ रिकॉर्डिंग समाप्त — भेजें",
    btnHelpIdle: "एक बार दबाएं, बोलें, और समाप्त होने पर दोबारा दबाएं",
    btnHelpRecording: "जब तक आप बंद नहीं करेंगे तब तक रिकॉर्डिंग चालू रहेगी",
    dictationPrompt: "किसान भाई, बोलिए...",
    youAsked: "👨‍🌾 आपका सवाल:",
    replayVoice: "🔊 पुनः सुनें",
    viewCards: "विस्तृत चार्ट व पास देखें",
    soundOn: "आवाज चालू",
    muted: "मूक",
    activePipeline: "सक्रिय इंजन",
    chatPlaceholder: "यहाँ हिंदी में टाइप करें (मूक चैट) या माइक दबाएं...",
    chipProfit: "💰 सर्वाधिक मुनाफा फसलें",
    chipHarvest: "🌱 कटाई व बुवाई समय",
    chipRoute: "🚚 रास्ता और मुनाफा",
    chipMandi: "🍅 ताजा मंडी भाव",
    chipPass: "📜 धारा 5D गेट पास",
    queryProfit: "वर्तमान में किस फसल में सबसे ज्यादा मुनाफा है?",
    queryHarvest: "टमाटर की तुड़ाई कब करें और प्याज का बीज कब बोएं?",
    queryRoute: "नासिक से मुंबई कौन सा रास्ता सबसे ज्यादा फायदा देगा?",
    queryMandi: "आज टमाटर का मंडी भाव क्या है?",
    queryPass: "क्या चेकपोस्ट पर गाड़ी रोकेंगे? मुझे पास दो."
  },
  en: {
    title: "KrishiClear Voice Assistant",
    subtitle: "Multilingual Neural Voice (APMC Rates & Corridor Intelligence)",
    chooseLang: "🗣️ Select Voice Language:",
    voiceMode: "Voice Mode",
    transcriptMode: "Transcript & Cards",
    statusIdle: "Tap the microphone below to start recording",
    statusRecording: "🔴 Recording voice... Tap red button when done speaking",
    statusThinking: "KrishiClear is preparing your answer...",
    statusSpeaking: "Speaking answer (Neural Voice)",
    btnStart: "🎙️ Tap to Record Voice",
    btnStop: "⏹️ Stop Recording & Send",
    btnHelpIdle: "Tap once to speak, tap again when done",
    btnHelpRecording: "Recording will stay on until you manually stop it",
    dictationPrompt: "Listening to your voice...",
    youAsked: "👨‍🌾 You Asked:",
    replayVoice: "🔊 Replay Voice",
    viewCards: "View Full Cards & Table",
    soundOn: "Sound On",
    muted: "Muted",
    activePipeline: "Active Pipeline",
    chatPlaceholder: "Type your query (silent chat) or tap microphone...",
    chipProfit: "💰 Most Profitable Crops",
    chipHarvest: "🌱 Harvest & Sowing Guide",
    chipRoute: "🚚 Best Route & Profit",
    chipMandi: "🍅 Live Mandi Price",
    chipPass: "📜 APMC Gate Pass",
    queryProfit: "Which crops have the most profit right now?",
    queryHarvest: "When to cut crops like tomato and when to plant seeds?",
    queryRoute: "Which route to Mumbai gives the highest profit?",
    queryMandi: "What is the tomato mandi rate today?",
    queryPass: "Will police stop my truck? Give me gate pass."
  }
};

export const KisanVoiceModal: React.FC<KisanVoiceModalProps> = ({ isOpen, onClose, lang }) => {
  // Mode toggle: 'voice' = Fullscreen Voice Orb experience, 'transcript' = Chat & cards
  const [viewMode, setViewMode] = useState<'voice' | 'transcript'>('voice');
  const [showTelemetry, setShowTelemetry] = useState<boolean>(false);

  // Active language in modal: 'mr' | 'hi' | 'en' (defaults to saved or parent or 'mr')
  const [modalLang, setModalLang] = useState<'mr' | 'hi' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('krishiclear_voice_lang') as 'mr' | 'hi' | 'en';
      if (saved && ['mr', 'hi', 'en'].includes(saved)) return saved;
    }
    return (lang === 'hi' || lang === 'mr') ? lang : 'mr';
  });

  const s = modalStrings[modalLang] || modalStrings.mr;

  // Audio playback toggle: default unmuted, but respects user mute
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [isListening, setIsListening] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const recordingTimerRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const [interimText, setInterimText] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [livekitStatus, setLivekitStatus] = useState<'connected' | 'connecting' | 'idle'>('idle');

  // Manual Push-to-Talk tracking refs
  const isListeningRef = useRef<boolean>(false);
  const finalTranscriptRef = useRef<string>('');

  // Last turn memory for Voice Mode display
  const [lastFarmerText, setLastFarmerText] = useState<string>('');
  const [lastAiResponse, setLastAiResponse] = useState<string>('');
  const [lastCardData, setLastCardData] = useState<any>(null);

  const [telemetry, setTelemetry] = useState<PipelineTelemetry>({
    stt: { engine: "Groq Whisper Turbo", configured: true, latency: "<150ms" },
    llm: { model: "Gemini 3.6 Flash", valid: true, status: "ACTIVE" },
    tts: { engine: "Edge Neural TTS", available: true, voices: {} },
    webrtc: { engine: "LiveKit Cloud WebRTC", configured: true }
  });

  // Real-time engine & fallback tracking for side display
  const [activeEngines, setActiveEngines] = useState<{
    stt: string;
    sttIsFallback: boolean;
    llm: string;
    llmIsFallback: boolean;
    tts: string;
    ttsIsFallback: boolean;
    transport: string;
  }>({
    stt: 'Groq Whisper Turbo',
    sttIsFallback: false,
    llm: 'Gemini 3.6 Flash',
    llmIsFallback: false,
    tts: 'Edge Neural TTS',
    ttsIsFallback: false,
    transport: 'LiveKit Cloud WebRTC'
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const livekitRoomRef = useRef<Room | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioStreamRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioUrlRef = useRef<string | null>(null);
  const isSubmittingRef = useRef<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Fetch telemetry status on open
  useEffect(() => {
    if (!isOpen) return;
    fetch('http://localhost:8000/api/kisan/telemetry')
      .then(r => r.json())
      .then(data => {
        if (data && data.stt) {
          setTelemetry(data);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  // Connect to LiveKit WebRTC Room when modal opens
  useEffect(() => {
    if (!isOpen) {
      if (livekitRoomRef.current) {
        livekitRoomRef.current.disconnect();
        livekitRoomRef.current = null;
      }
      stopSpeaking();
      return;
    }

    const connectLiveKit = async () => {
      try {
        setLivekitStatus('connecting');
        const res = await fetch('http://localhost:8000/api/livekit/token?room=kisan-room&identity=' + encodeURIComponent('farmer-' + Date.now()));
        const data = await res.json();
        if (data.success && data.token && data.server_url) {
          const room = new Room({
            adaptiveStream: true,
            dynacast: true,
          });

          room.on(RoomEvent.TrackSubscribed, (track) => {
            if (track.kind === Track.Kind.Audio) {
              console.log("LiveKit WebRTC remote audio track received (managed by audio pipeline):", track.sid);
              // Avoid attaching unmanaged duplicate audio tags to document.body to prevent two voices
            }
          });

          room.on(RoomEvent.Disconnected, () => {
            setLivekitStatus('idle');
          });

          await room.connect(data.server_url, data.token);
          livekitRoomRef.current = room;
          setLivekitStatus('connected');
          setActiveEngines(prev => ({ ...prev, transport: 'LiveKit Cloud WebRTC' }));
        } else {
          setLivekitStatus('idle');
          setActiveEngines(prev => ({ ...prev, transport: 'HTTP REST (Fallback)' }));
        }
      } catch (err) {
        console.warn("LiveKit connecting in fallback mode:", err);
        setLivekitStatus('idle');
        setActiveEngines(prev => ({ ...prev, transport: 'HTTP REST (Fallback)' }));
      }
    };

    connectLiveKit();

    return () => {
      if (livekitRoomRef.current) {
        livekitRoomRef.current.disconnect();
        livekitRoomRef.current = null;
      }
      if (audioElRef.current) {
        audioElRef.current.remove();
        audioElRef.current = null;
      }
      stopSpeaking();
    };
  }, [isOpen]);

  // Clean text for natural speech (strips asterisks, markdown, bullets, etc.)
  const cleanTextForSpeech = (rawText: string): string => {
    if (!rawText) return '';
    return rawText
      .replace(/[*_#`~>]/g, '') // remove markdown symbols like * ** # `
      .replace(/•|\-|\+/g, ' ') // remove bullets and dashes
      .replace(/https?:\/\/\S+/g, '') // remove URLs
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove markdown links, keep text
      .replace(/\s+/g, ' ') // collapse multiple spaces
      .trim();
  };

  // Play Neural Edge-TTS audio with bulletproof lifecycle (strictly ONE voice at a time)
  const playNeuralSpeech = async (text: string, voiceLang?: string) => {
    const clean = cleanTextForSpeech(text);
    if (!clean || isMuted) return;

    const targetLang = (voiceLang || modalLang) as 'mr' | 'hi' | 'en';
    stopSpeaking();
    setIsSpeaking(true);

    try {
      // 1. Primary: Edge-TTS backend streaming
      const response = await fetch('http://localhost:8000/api/kisan/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean, lang: targetLang })
      });

      if (response.ok) {
        const blob = await response.blob();
        if (blob.size < 100) {
          throw new Error("Empty audio response from TTS server");
        }
        const url = URL.createObjectURL(blob);
        activeAudioUrlRef.current = url;
        const audio = new Audio(url);
        activeAudioStreamRef.current = audio;
        setActiveEngines(prev => ({ ...prev, tts: `Edge Neural (${targetLang.toUpperCase()})`, ttsIsFallback: false }));

        let hasStartedPlayback = false;

        audio.onplay = () => {
          hasStartedPlayback = true;
          setIsSpeaking(true);
        };

        audio.onended = () => {
          // Unhook all event listeners immediately to prevent accidental error cascades
          audio.onended = null;
          audio.onerror = null;
          audio.onplay = null;
          if (activeAudioStreamRef.current === audio) {
            activeAudioStreamRef.current = null;
          }
          if (activeAudioUrlRef.current === url) {
            activeAudioUrlRef.current = null;
          }
          setIsSpeaking(false);
          setTimeout(() => {
            try { URL.revokeObjectURL(url); } catch (e) {}
          }, 1000);
        };

        audio.onerror = (e) => {
          audio.onended = null;
          audio.onerror = null;
          audio.onplay = null;
          if (activeAudioStreamRef.current === audio) {
            activeAudioStreamRef.current = null;
          }
          if (activeAudioUrlRef.current === url) {
            activeAudioUrlRef.current = null;
          }
          setIsSpeaking(false);
          setTimeout(() => {
            try { URL.revokeObjectURL(url); } catch (err) {}
          }, 500);

          // ONLY trigger browser speech fallback if audio NEVER started playing!
          // NEVER replay if speech already finished or was stopped!
          if (!hasStartedPlayback) {
            console.warn("Edge-TTS audio playback failed to initialize, falling back to browser speech:", e);
            setActiveEngines(prev => ({ ...prev, tts: 'Browser Speech (Fallback)', ttsIsFallback: true }));
            fallbackBrowserSpeech(clean, targetLang);
          }
        };

        try {
          await audio.play();
          return;
        } catch (playErr: any) {
          // If aborted due to pause or deliberate cancel, DO NOT trigger fallback speech
          if (playErr.name === 'AbortError') {
            return;
          }
          audio.onended = null;
          audio.onerror = null;
          audio.onplay = null;
          if (activeAudioStreamRef.current === audio) {
            activeAudioStreamRef.current = null;
          }
          console.warn("Audio play() failed, falling back to browser speech:", playErr);
          setActiveEngines(prev => ({ ...prev, tts: 'Browser Speech (Fallback)', ttsIsFallback: true }));
          fallbackBrowserSpeech(clean, targetLang);
          return;
        }
      }
    } catch (e) {
      console.warn("Edge-TTS stream error, falling back to browser speech:", e);
    }

    // 2. Automated Fallback: Browser Speech Synthesis (only if Edge-TTS completely failed to fetch)
    setActiveEngines(prev => ({ ...prev, tts: 'Browser Speech (Fallback)', ttsIsFallback: true }));
    fallbackBrowserSpeech(clean, targetLang);
  };

  const fallbackBrowserSpeech = (cleanText: string, voiceLang?: string) => {
    if (!synthRef.current || isMuted) {
      setIsSpeaking(false);
      return;
    }
    // Cancel any previous utterance first
    try { synthRef.current.cancel(); } catch (e) {}

    const targetLang = voiceLang || modalLang;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langCode = targetLang === 'mr' ? 'mr-IN' : (targetLang === 'hi' ? 'hi-IN' : 'en-IN');
    utterance.lang = langCode;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = synthRef.current.getVoices ? synthRef.current.getVoices() : [];
    const prefix = langCode.toLowerCase().slice(0, 2);
    const matchedVoice = voices.find(v =>
      v.lang.toLowerCase().replace('_', '-').startsWith(prefix) &&
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('India'))
    ) || voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(prefix));

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    try {
      synthRef.current.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (activeAudioStreamRef.current) {
      const audio = activeAudioStreamRef.current;
      // CRITICAL: Unhook error and ended listeners FIRST so stopping never triggers fallback speech!
      audio.onplay = null;
      audio.onended = null;
      audio.onerror = null;
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.removeAttribute('src');
        audio.load();
      } catch (e) {}
      activeAudioStreamRef.current = null;
    }
    if (activeAudioUrlRef.current) {
      try { URL.revokeObjectURL(activeAudioUrlRef.current); } catch (e) {}
      activeAudioUrlRef.current = null;
    }
    if (synthRef.current) {
      try { synthRef.current.cancel(); } catch (e) {}
    }
    setIsSpeaking(false);
  };

  // Helper to switch language
  const handleLanguageChange = (newLang: 'mr' | 'hi' | 'en') => {
    stopSpeaking();
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('krishiclear_voice_lang', newLang); } catch (e) {}
    }
    if (isListeningRef.current) {
      isListeningRef.current = false;
      setIsListening(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try { mediaRecorderRef.current.stop(); } catch (e) {}
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
    }

    setModalLang(newLang);
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLang === 'mr' ? 'mr-IN' : (newLang === 'hi' ? 'hi-IN' : 'en-IN');
    }
    const greetingText = newLang === 'mr'
      ? "नमस्कार शेतकरी बंधूंनो! मी कृषिक्लिअर व्हॉईस सहाय्यक आहे. खालील माईकचे बटण दाबून थेट बोला — आजचा बाजारभाव, समृद्धी महामार्गाचा नफा, किंवा बाजार समितीच्या कायदेशीर सवलतीबद्दल विचारा."
      : newLang === 'hi'
        ? "नमस्ते किसान भाई! मैं कृषि-क्लियर वॉइस सहायक हूँ। नीचे माइक दबाकर सीधे बोलें — आज का मंडी भाव, सबसे ज्यादा मुनाफा देने वाला रास्ता या कानूनी छूट के बारे में पूछें।"
        : "Hello Farmer & FPO Member! I am your KrishiClear Voice Assistant. Tap the microphone below and speak naturally — ask about live APMC prices, profit-maximizing routes, or legal APMC exemptions.";

    setMessages([
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: greetingText
      }
    ]);
    setLastAiResponse(greetingText);
  };

  // Initialize greeting & Speech Recognition
  useEffect(() => {
    if (!isOpen) return;

    const savedLang = typeof window !== 'undefined' ? (localStorage.getItem('krishiclear_voice_lang') as 'mr' | 'hi' | 'en') : null;
    const initialLang = (savedLang && ['mr', 'hi', 'en'].includes(savedLang)) ? savedLang : ((lang === 'hi' || lang === 'mr') ? lang : 'mr');
    setModalLang(initialLang);

    const greetingText = initialLang === 'mr'
      ? "नमस्कार शेतकरी बंधूंनो! मी कृषिक्लिअर व्हॉईस सहाय्यक आहे. खालील माईकचे बटण दाबून थेट बोला — आजचा बाजारभाव, समृद्धी महामार्गाचा नफा, किंवा बाजार समितीच्या कायदेशीर सवलतीबद्दल विचारा."
      : initialLang === 'hi'
        ? "नमस्ते किसान भाई! मैं कृषि-क्लियर वॉइस सहायक हूँ। नीचे माइक दबाकर सीधे बोलें — आज का मंडी भाव, सबसे ज्यादा मुनाफा देने वाला रास्ता या कानूनी छूट के बारे में पूछें।"
        : "Hello Farmer & FPO Member! I am your KrishiClear Voice Assistant. Tap the microphone below and speak naturally — ask about live APMC prices, profit-maximizing routes, or legal APMC exemptions.";

    setMessages([
      {
        id: '1',
        sender: 'assistant',
        text: greetingText
      }
    ]);
    setLastAiResponse(greetingText);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // KEEP LISTENING: Only user stops when done!
      recognition.interimResults = true; // Stream words in real time!
      recognition.lang = initialLang === 'mr' ? 'mr-IN' : (initialLang === 'hi' ? 'hi-IN' : 'en-IN');

      recognition.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
        setInterimText('');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptRef.current = (finalTranscriptRef.current + ' ' + transcript).trim();
          } else {
            currentInterim += transcript;
          }
        }

        const fullSpoken = (finalTranscriptRef.current + ' ' + currentInterim).trim();
        if (fullSpoken) {
          setInterimText(currentInterim || fullSpoken);
          setInputText(fullSpoken);
        }
        // CRITICAL: NEVER AUTO-SUBMIT! Only the farmer clicks Stop to send!
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          setIsListening(false);
          isListeningRef.current = false;
        }
      };

      recognition.onend = () => {
        // If user hasn't pressed Stop, auto-restart continuous listening
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isOpen, lang]);

  // Audio recording hardware starter
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '');

      const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(250);
      return true;
    } catch (err) {
      console.warn("Microphone access error:", err);
      alert(modalLang === 'mr' ? 'मायक्रोफोन परवानगी नाकारली आहे किंवा मायक्रोफोन उपलब्ध नाही.' : modalLang === 'hi' ? 'माइक्रोफोन अनुमति अस्वीकृत है या समर्थित नहीं है।' : 'Microphone permission denied or not supported.');
      return false;
    }
  };

  // Toggle Microphone (Strict Manual Control: Record when ON, Stop & Submit when OFF)
  const toggleListening = async () => {
    if (isListening) {
      // 1. User clicked STOP - commit transcript and send!
      isListeningRef.current = false;
      setIsListening(false);

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop());
            mediaStreamRef.current = null;
          }

          const capturedText = (finalTranscriptRef.current + ' ' + interimText).trim() || inputText.trim();
          setInterimText('');
          finalTranscriptRef.current = '';

          // If browser speech recognition captured clean text:
          if (capturedText && capturedText.length > 2) {
            handleSendQuery(capturedText, { isVoiceInput: true });
            return;
          }

          // If Web Speech did not capture text, transcribe via Groq Whisper Turbo (<150ms):
          if (audioBlob.size > 500) {
            setLoading(true);
            setActiveEngines(prev => ({ ...prev, stt: `Groq Whisper Turbo (${modalLang.toUpperCase()})`, sttIsFallback: false }));
            try {
              const formData = new FormData();
              formData.append('file', audioBlob, 'voice_input.webm');
              const res = await fetch(`http://localhost:8000/api/kisan/transcribe?lang=${modalLang}`, {
                method: 'POST',
                body: formData
              });
              const data = await res.json();
              if (data.success && data.text) {
                handleSendQuery(data.text, { isVoiceInput: true });
              }
            } catch (err) {
              console.error("Groq Whisper transcription error:", err);
            } finally {
              setLoading(false);
            }
          }
        };

        mediaRecorderRef.current.stop();
        return;
      }

      const textToSend = (finalTranscriptRef.current + ' ' + interimText).trim() || inputText.trim();
      setInterimText('');
      finalTranscriptRef.current = '';

      if (textToSend) {
        handleSendQuery(textToSend, { isVoiceInput: true });
      }
      return;
    }

    // 2. User clicked START - begin recording voice
    stopSpeaking();
    finalTranscriptRef.current = '';
    setInterimText('');
    setInputText('');

    const started = await startAudioRecording();
    if (!started) return;

    isListeningRef.current = true;
    setIsListening(true);
    setRecordingSeconds(0);

    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    if (recognitionRef.current) {
      recognitionRef.current.lang = modalLang === 'mr' ? 'mr-IN' : (modalLang === 'hi' ? 'hi-IN' : 'en-IN');
      try {
        recognitionRef.current.start();
        setActiveEngines(prev => ({ ...prev, stt: `Live Recording (${modalLang.toUpperCase()})`, sttIsFallback: false }));
      } catch (err) {
        console.warn("Web Speech start error:", err);
      }
    }
  };

  // Process Farmer Question
  const handleSendQuery = async (queryText?: string, options?: { isVoiceInput?: boolean }) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend) return;

    if (isSubmittingRef.current) {
      console.warn("Query already in flight. Skipping duplicate submission.");
      return;
    }
    isSubmittingRef.current = true;
    stopSpeaking(); // Cut off any previous voice cleanly

    setLastFarmerText(textToSend);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'farmer',
      text: textToSend
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setInterimText('');
    finalTranscriptRef.current = '';
    setLoading(true);

    // If typed in chat or clicked chips, always stop any active audio
    const isVoice = options?.isVoiceInput ?? false;
    if (!isVoice) {
      stopSpeaking();
    }

    try {
      const res = await fetch('http://localhost:8000/api/kisan/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend, lang: modalLang })
      });
      const result = await res.json();
      setActiveEngines(prev => ({ ...prev, llm: 'Gemini 3.6 Flash', llmIsFallback: false }));

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: result.answer_text,
        category: result.category,
        data: result.card
      };
      setMessages(prev => [...prev, aiMsg]);
      setLastAiResponse(result.answer_text);
      setLastCardData(result.card);

      // ONLY speak if this was initiated by Voice Input, we are in Voice Mode, and not muted!
      if (isVoice && viewMode === 'voice' && !isMuted) {
        const speechLang = result.lang || modalLang;
        playNeuralSpeech(result.answer_text, speechLang);
      } else {
        // Chat mode or typed: NEVER speak out loud
        stopSpeaking();
      }
    } catch (e) {
      console.error("Error evaluating farmer voice query:", e);
      setActiveEngines(prev => ({ ...prev, llm: 'Agronomy DB (Fallback)', llmIsFallback: true }));
      const fallback = modalLang === 'mr'
        ? "माफ करा, सर्व्हरशी संपर्क होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा."
        : modalLang === 'hi'
          ? "क्षमा करें, सर्वर से संपर्क नहीं हो पाया। कृपया पुनः प्रयास करें।"
          : "Sorry, could not connect to server. Please try again.";
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'assistant', text: fallback }]);
      setLastAiResponse(fallback);
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
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
      background: 'rgba(4, 7, 12, 0.90)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        background: '#0a0f18',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        maxWidth: '920px',
        width: '100%',
        height: '88vh',
        maxHeight: '760px',
        overflow: 'hidden',
        boxShadow: '0 25px 70px rgba(0,0,0,0.9)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(10, 15, 24, 0.98)'
        }}>
          {/* Left: Title, Language Selector & Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.18)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <Mic size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.02rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                {modalLang === 'mr' ? 'कृषिक्लिअर व्हॉईस सहाय्यक' : modalLang === 'hi' ? 'कृषि-क्लियर वॉइस असिस्टेंट' : 'KrishiClear Voice Assistant'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                {modalLang === 'mr' ? 'मराठी / हिंदी / English थेट संवाद' : modalLang === 'hi' ? 'हिंदी / मराठी / English सीधा संवाद' : 'Multilingual Neural Voice AI'}
              </div>
            </div>

            {/* Mode Switcher Pill */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '3px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <button
                onClick={() => {
                  stopSpeaking();
                  setViewMode('voice');
                }}
                style={{
                  background: viewMode === 'voice' ? '#10b981' : 'transparent',
                  color: viewMode === 'voice' ? '#080b11' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Radio size={13} />
                {modalLang === 'mr' ? 'थेट व्हॉईस' : modalLang === 'hi' ? 'लाइव वॉइस' : 'Voice Mode'}
              </button>
              <button
                onClick={() => {
                  stopSpeaking();
                  setViewMode('transcript');
                }}
                style={{
                  background: viewMode === 'transcript' ? '#10b981' : 'transparent',
                  color: viewMode === 'transcript' ? '#080b11' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
              >
                <MessageSquare size={13} />
                {modalLang === 'mr' ? 'तपशील / चॅट' : modalLang === 'hi' ? 'चैट व विवरण' : 'Transcript & Cards'}
              </button>
            </div>
          </div>

          {/* Right: Mute Audio, Telemetry Pill & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Audio Mute/Unmute Toggle */}
            <button
              onClick={() => {
                if (!isMuted) stopSpeaking();
                setIsMuted(!isMuted);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                background: isMuted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.12)',
                border: `1px solid ${isMuted ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.3)'}`,
                borderRadius: '16px',
                fontSize: '0.72rem',
                color: isMuted ? '#f87171' : '#10b981',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title={isMuted ? "Audio muted (Click to unmute)" : "Audio enabled (Click to mute)"}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              {isMuted ? 'Muted' : 'Sound On'}
            </button>

            {/* Non-intrusive Telemetry Pill */}
            <button
              onClick={() => setShowTelemetry(!showTelemetry)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 11px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '20px',
                fontSize: '0.72rem',
                color: '#10b981',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Click to view live engine telemetry & fallbacks"
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
              LiveKit & Neural Pipeline
              <Activity size={12} />
            </button>

            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                style={{
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#f43f5e',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <VolumeX size={14} /> Stop
              </button>
            )}

            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                color: 'var(--text-muted)',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Telemetry Drawer (Non-intrusive ambient overlay) */}
        {showTelemetry && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.98)',
            borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '12px 20px',
            fontSize: '0.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>🎙️ STT:</span>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>Groq Whisper Large-v3 Turbo (&lt;150ms)</span>
              <span style={{ color: '#64748b', fontSize: '0.68rem' }}>[Fallback: Web Speech]</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>🧠 AI Brain:</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>Google Gemini 3.6 Flash</span>
              <span style={{ color: '#64748b', fontSize: '0.68rem' }}>[Fallback: Offline ICAR DB]</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>🔊 Voice:</span>
              <span style={{ color: '#a855f7', fontWeight: 600 }}>Edge-TTS Neural (Swara / Aarohi)</span>
              <span style={{ color: '#64748b', fontSize: '0.68rem' }}>[Zero Asterisks]</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>⚡ WebRTC:</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>LiveKit Cloud</span>
            </div>
          </div>
        )}

        {/* MAIN BODY CONTAINER WITH PERMANENT SIDE ENGINE PIPELINE */}
        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          minHeight: 0
        }}>
          {/* Main Stage: Voice Orb or Transcript Log */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0
          }}>
            {viewMode === 'voice' ? (
          /* ========================================================= */
          /*                 MODE 1: LIQUID VOICE ORB                  */
          /* ========================================================= */
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 28px',
            position: 'relative',
            overflowY: 'auto'
          }}>
            {/* Prominent Dedicated Language Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '30px',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8' }}>
                {s.chooseLang}
              </span>
              <button
                onClick={() => handleLanguageChange('mr')}
                style={{
                  background: modalLang === 'mr' ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                  color: modalLang === 'mr' ? '#04070c' : '#e2e8f0',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  border: modalLang === 'mr' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                🚩 मराठी (Marathi)
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                style={{
                  background: modalLang === 'hi' ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                  color: modalLang === 'hi' ? '#04070c' : '#e2e8f0',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  border: modalLang === 'hi' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                🚩 हिंदी (Hindi)
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                style={{
                  background: modalLang === 'en' ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                  color: modalLang === 'en' ? '#04070c' : '#e2e8f0',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  border: modalLang === 'en' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                🌐 English
              </button>
            </div>

            {/* Real-time Listening / Status Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              background: isListening
                ? 'rgba(239, 68, 68, 0.18)'
                : loading
                ? 'rgba(234, 179, 8, 0.16)'
                : isSpeaking
                ? 'rgba(56, 189, 248, 0.16)'
                : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${
                isListening
                  ? 'rgba(239, 68, 68, 0.45)'
                  : loading
                  ? 'rgba(234, 179, 8, 0.4)'
                  : isSpeaking
                  ? 'rgba(56, 189, 248, 0.4)'
                  : 'rgba(255, 255, 255, 0.1)'
              }`,
              borderRadius: '24px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: isListening ? '#f87171' : loading ? '#eab308' : isSpeaking ? '#38bdf8' : 'var(--text-muted)'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isListening ? '#ef4444' : loading ? '#eab308' : isSpeaking ? '#38bdf8' : '#64748b',
                boxShadow: isListening ? '0 0 10px #ef4444' : isSpeaking ? '0 0 10px #38bdf8' : 'none',
                display: 'inline-block'
              }}></span>
              {isListening
                ? `${s.statusRecording} (${formatTime(recordingSeconds)})`
                : loading
                ? s.statusThinking
                : isSpeaking
                ? s.statusSpeaking
                : s.statusIdle}
            </div>

            {/* Siri / ChatGPT-style Fluid Sound Orb */}
            <div style={{
              position: 'relative',
              width: '180px',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '16px 0'
            }}>
              {/* Outer Ripple Wave 1 */}
              <div style={{
                position: 'absolute',
                width: isListening ? '220px' : isSpeaking ? '200px' : '170px',
                height: isListening ? '220px' : isSpeaking ? '200px' : '170px',
                borderRadius: '50%',
                background: isListening
                  ? 'radial-gradient(circle, rgba(239, 68, 68, 0.28) 0%, rgba(239, 68, 68, 0) 70%)'
                  : isSpeaking
                  ? 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(56, 189, 248, 0) 70%)'
                  : 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0) 70%)',
                transition: 'all 0.3s ease',
                animation: isListening || isSpeaking ? 'pulse 2s infinite' : 'none'
              }} />

              {/* Glowing Liquid Core Orb */}
              <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: isListening
                  ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
                  : loading
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : isSpeaking
                  ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
                  : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                boxShadow: isListening
                  ? '0 0 50px rgba(239, 68, 68, 0.7)'
                  : isSpeaking
                  ? '0 0 50px rgba(16, 185, 129, 0.65)'
                  : '0 0 35px rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={toggleListening}
              >
                {isListening ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Square size={38} color="#ffffff" fill="#ffffff" />
                    <span style={{ fontSize: '0.74rem', marginTop: '4px', fontWeight: 800 }}>{formatTime(recordingSeconds)}</span>
                  </div>
                ) : loading ? (
                  <RefreshCw size={44} className="animate-spin" />
                ) : isSpeaking ? (
                  <Volume2 size={48} />
                ) : (
                  <Mic size={48} />
                )}
              </div>
            </div>

            {/* Real-time Streaming Dictation Box */}
            {(interimText || isListening) && (
              <div style={{
                maxWidth: '640px',
                width: '100%',
                padding: '12px 18px',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                textAlign: 'center',
                color: '#f87171',
                fontSize: '0.94rem',
                fontWeight: 600,
                marginBottom: '14px'
              }}>
                🎙️ {interimText || s.dictationPrompt}
              </div>
            )}

            {/* Spoken Text Cards (Transparent Dialog) */}
            <div style={{ maxWidth: '680px', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lastFarmerText && (
                <div style={{
                  padding: '10px 16px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>
                    <span style={{ color: '#10b981', fontWeight: 700, marginRight: '6px' }}>{s.youAsked}</span>
                    "{lastFarmerText}"
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Groq Whisper &lt;150ms</span>
                </div>
              )}

              {lastAiResponse && (
                <div style={{
                  padding: '14px 18px',
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ fontSize: '0.94rem', color: '#f8fafc', lineHeight: 1.5 }}>
                    <span style={{ color: '#38bdf8', fontWeight: 700, marginRight: '6px' }}>🤖 Kisan AI:</span>
                    {cleanTextForSpeech(lastAiResponse)}
                  </div>

                  {/* Playback Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => playNeuralSpeech(lastAiResponse, modalLang)}
                        style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          color: '#10b981',
                          borderRadius: '8px',
                          padding: '5px 12px',
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Play size={13} /> {s.replayVoice}
                      </button>

                      <button
                        onClick={() => {
                          stopSpeaking();
                          setViewMode('transcript');
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#e2e8f0',
                          borderRadius: '8px',
                          padding: '5px 12px',
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Layers size={13} /> {s.viewCards}
                      </button>
                    </div>

                    <span style={{ fontSize: '0.7rem', color: '#a855f7' }}>🔊 Microsoft Neural Voice Active</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Giant Push-To-Talk Button with Visual Timer & Help Note */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
              <button
                onClick={toggleListening}
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  background: isListening ? '#ef4444' : '#10b981',
                  color: '#080b11',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isListening ? '0 0 35px rgba(239, 68, 68, 0.7)' : '0 0 25px rgba(16, 185, 129, 0.5)',
                  transition: 'all 0.2s ease'
                }}
              >
                {isListening ? (
                  <Square size={36} color="#ffffff" fill="#ffffff" />
                ) : (
                  <Mic size={40} color="#080b11" />
                )}
              </button>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.86rem', color: isListening ? '#f87171' : '#10b981', fontWeight: 800 }}>
                  {isListening ? `${s.btnStop} (${formatTime(recordingSeconds)})` : s.btnStart}
                </span>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                  {isListening ? s.btnHelpRecording : s.btnHelpIdle}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /*                 MODE 2: CHAT & TRANSCRIPT LOG             */
          /* ========================================================= */
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {/* Prominent Dedicated Language Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '6px 16px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '30px',
              marginBottom: '4px',
              alignSelf: 'center'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8' }}>
                {s.chooseLang}
              </span>
              <button
                onClick={() => handleLanguageChange('mr')}
                style={{
                  background: modalLang === 'mr' ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                  color: modalLang === 'mr' ? '#04070c' : '#e2e8f0',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  border: modalLang === 'mr' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                🚩 मराठी (Marathi)
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                style={{
                  background: modalLang === 'hi' ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                  color: modalLang === 'hi' ? '#04070c' : '#e2e8f0',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  border: modalLang === 'hi' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                🚩 हिंदी (Hindi)
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                style={{
                  background: modalLang === 'en' ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                  color: modalLang === 'en' ? '#04070c' : '#e2e8f0',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  border: modalLang === 'en' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                🌐 English
              </button>
            </div>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'farmer' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: m.sender === 'farmer' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    background: m.sender === 'farmer' ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
                    color: m.sender === 'farmer' ? '#04070c' : '#f8fafc',
                    fontWeight: m.sender === 'farmer' ? 600 : 400,
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    border: m.sender === 'farmer' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  {m.text}
                </div>

                {/* Render Rich Interactive Cards if attached */}
                {m.data && (
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '0.82rem',
                    color: '#e2e8f0'
                  }}>
                    <div style={{ fontWeight: 700, color: '#10b981', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={14} /> {m.data.title || 'Official KrishiClear Manifest'}
                    </div>

                    {/* Gate Pass Card */}
                    {m.data.type === 'gate_pass' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div><strong>Pass ID:</strong> {m.data.pass_id || m.data.passId}</div>
                        <div><strong>Vehicle:</strong> {m.data.vehicle}</div>
                        <div><strong>Statute:</strong> {m.data.statute}</div>
                        <div style={{ color: '#10b981' }}><strong>Exemption:</strong> {m.data.exemption}</div>
                      </div>
                    )}

                    {/* Price Corridor Card */}
                    {m.data.type === 'price_corridor' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        <div style={{ color: '#f59e0b' }}><strong>Floor:</strong> {m.data.farmer_floor || `₹${m.data.floor}/kg`}</div>
                        <div style={{ color: '#10b981' }}><strong>Modal Fair:</strong> {m.data.modal_fair || `₹${m.data.modal}/kg`}</div>
                        <div style={{ color: '#38bdf8' }}><strong>Ceiling:</strong> {m.data.buyer_ceiling}</div>
                      </div>
                    )}

                    {/* Route Winner Card */}
                    {m.data.type === 'route_winner' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div><strong>Winner:</strong> {m.data.winning_route || m.data.winningRoute}</div>
                        <div style={{ color: '#10b981' }}><strong>Net Payout:</strong> {m.data.farmer_net_rate}</div>
                        <div><strong>Advantage:</strong> {m.data.profit_gain}</div>
                        <div><strong>Damage:</strong> {m.data.bruise_damage}</div>
                      </div>
                    )}

                    {/* Freshness Alert Card */}
                    {m.data.type === 'freshness_alert' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div style={{ color: '#10b981' }}><strong>Safety:</strong> {m.data.freshness_level}</div>
                        <div><strong>Chiller:</strong> {m.data.chiller_status}</div>
                        <div style={{ gridColumn: 'span 2' }}><strong>Diversion Hub:</strong> {m.data.emergency_hub}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ alignSelf: 'flex-start', color: '#10b981', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px' }}>
                <RefreshCw size={16} className="animate-spin" />
                {modalLang === 'mr' ? 'बाजारभाव व कृषी माहितीची तपासणी चालू आहे...' : modalLang === 'hi' ? 'मंडी भाव व कृषि परामर्श प्राप्त हो रहा है...' : 'Querying agricultural knowledge base and live corridor...'}
              </div>
            )}
          </div>
        )}
          </div>

          {/* Permanent Side Engine Status Rail (Always shows active engines & fallbacks, zero interference) */}
          <div style={{
            width: '190px',
            background: 'rgba(8, 12, 20, 0.95)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flexShrink: 0,
            overflowY: 'auto'
          }}>
            <div style={{
              fontSize: '0.66rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#94a3b8',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              paddingBottom: '8px'
            }}>
              <Activity size={13} color="#10b981" />
              <span>Active Pipeline</span>
            </div>

            {/* STT Status Card */}
            <div style={{
              padding: '8px 10px',
              borderRadius: '8px',
              background: isListening ? 'rgba(244, 63, 94, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${isListening ? 'rgba(244, 63, 94, 0.4)' : 'rgba(255, 255, 255, 0.06)'}`,
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.64rem', color: '#94a3b8', fontWeight: 700 }}>🎙️ STT SPEECH</span>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isListening ? '#f43f5e' : (activeEngines.sttIsFallback ? '#f59e0b' : '#10b981'),
                  boxShadow: isListening ? '0 0 8px #f43f5e' : 'none'
                }} />
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: isListening ? '#f43f5e' : '#e2e8f0' }}>
                {activeEngines.stt}
              </div>
              <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '1px' }}>
                {activeEngines.sttIsFallback ? 'Fallback mode' : '<150ms noise-immune'}
              </div>
            </div>

            {/* LLM Status Card */}
            <div style={{
              padding: '8px 10px',
              borderRadius: '8px',
              background: loading ? 'rgba(234, 179, 8, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${loading ? 'rgba(234, 179, 8, 0.4)' : 'rgba(255, 255, 255, 0.06)'}`,
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.64rem', color: '#94a3b8', fontWeight: 700 }}>🧠 AI BRAIN</span>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: loading ? '#eab308' : (activeEngines.llmIsFallback ? '#f59e0b' : '#10b981'),
                  boxShadow: loading ? '0 0 8px #eab308' : 'none'
                }} />
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: loading ? '#eab308' : '#e2e8f0' }}>
                {activeEngines.llm}
              </div>
              <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '1px' }}>
                {activeEngines.llmIsFallback ? 'Offline fallback' : 'High-speed reasoning'}
              </div>
            </div>

            {/* TTS Status Card */}
            <div style={{
              padding: '8px 10px',
              borderRadius: '8px',
              background: isSpeaking ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${isSpeaking ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.06)'}`,
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.64rem', color: '#94a3b8', fontWeight: 700 }}>🔊 VOICE (TTS)</span>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isSpeaking ? '#38bdf8' : (activeEngines.ttsIsFallback ? '#f59e0b' : '#10b981'),
                  boxShadow: isSpeaking ? '0 0 8px #38bdf8' : 'none'
                }} />
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: isSpeaking ? '#38bdf8' : '#e2e8f0' }}>
                {activeEngines.tts}
              </div>
              <div style={{ fontSize: '0.62rem', color: '#a855f7', marginTop: '1px' }}>
                Zero Asterisks Spoken
              </div>
            </div>

            {/* Transport Status Card */}
            <div style={{
              padding: '8px 10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.64rem', color: '#94a3b8', fontWeight: 700 }}>⚡ TRANSPORT</span>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: livekitStatus === 'connected' ? '#10b981' : '#f59e0b'
                }} />
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#e2e8f0' }}>
                {activeEngines.transport}
              </div>
              <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '1px' }}>
                {livekitStatus === 'connected' ? 'Ultra low-latency room' : 'HTTP REST fallback'}
              </div>
            </div>

            {/* LiveKit status badge */}
            <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.66rem', color: '#10b981', fontWeight: 600 }}>All Systems Nominal</span>
            </div>
          </div>
        </div>

        {/* Quick Voice Chips & Bottom Input Bar - ONLY DISPLAYED IN TRANSCRIPT / TEXT MODE */}
        {viewMode === 'transcript' && (
          <>
            {/* Quick Demo Text Chips */}
            <div style={{
              padding: '10px 18px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(8, 11, 17, 0.95)',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}>
              <button
                onClick={() => {
                  stopSpeaking();
                  handleSendQuery(s.queryProfit, { isVoiceInput: false });
                }}
                style={{ fontSize: '0.74rem', padding: '5px 12px', borderRadius: '16px', color: '#10b981', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', cursor: 'pointer' }}
              >
                {s.chipProfit}
              </button>
              <button
                onClick={() => {
                  stopSpeaking();
                  handleSendQuery(s.queryHarvest, { isVoiceInput: false });
                }}
                style={{ fontSize: '0.74rem', padding: '5px 12px', borderRadius: '16px', color: '#e2e8f0', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
              >
                {s.chipHarvest}
              </button>
              <button
                onClick={() => {
                  stopSpeaking();
                  handleSendQuery(s.queryRoute, { isVoiceInput: false });
                }}
                style={{ fontSize: '0.74rem', padding: '5px 12px', borderRadius: '16px', color: '#e2e8f0', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
              >
                {s.chipRoute}
              </button>
              <button
                onClick={() => {
                  stopSpeaking();
                  handleSendQuery(s.queryMandi, { isVoiceInput: false });
                }}
                style={{ fontSize: '0.74rem', padding: '5px 12px', borderRadius: '16px', color: '#e2e8f0', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
              >
                {s.chipMandi}
              </button>
              <button
                onClick={() => {
                  stopSpeaking();
                  handleSendQuery(s.queryPass, { isVoiceInput: false });
                }}
                style={{ fontSize: '0.74rem', padding: '5px 12px', borderRadius: '16px', color: '#e2e8f0', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
              >
                {s.chipPass}
              </button>
            </div>

            {/* Bottom Input Bar for typing (Silent Chat) */}
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(10, 15, 24, 0.98)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => {
                  stopSpeaking();
                  setInputText(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    stopSpeaking();
                    handleSendQuery(inputText, { isVoiceInput: false });
                  }
                }}
                placeholder={s.chatPlaceholder}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '0.86rem',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => {
                  stopSpeaking();
                  handleSendQuery(inputText, { isVoiceInput: false });
                }}
                disabled={loading || !inputText.trim()}
                style={{
                  background: inputText.trim() ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                  color: inputText.trim() ? '#080b11' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  cursor: inputText.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
