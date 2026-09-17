import React, { useRef, useState, useEffect } from 'react';
import { X, Mic, Volume2, Send, Bot, Sparkles } from 'lucide-react';
import { api } from '../../api.ts';
import type { Language } from '../../translations.ts';

interface KisanVoiceWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const voicePrompts: Record<Language, string> = {
  en: 'Check Nashik Red Onion clearing price vs Lasalgaon APMC',
  hi: 'नाशिक के प्याज का मंडी भाव और लसलगांव एपीएमसी तुलना बताओ',
  mr: 'नाशिक कांद्याचा भाव आणि लासलगाव APMC तुलना सांग',
};

const voiceIntro: Record<Language, string> = {
  en: 'Namaste! I am your KrishiClear Voice Assistant. Ask me about mandi prices, cold-chain delivery, or FPO settlement in English, Hindi, or Marathi.',
  hi: 'नमस्ते! मैं आपका कृषि-क्लियर वॉइस असिस्टेंट हूं। मंडी भाव, शीत श्रृंखला, या एफपीओ सेटलमेंट के बारे में हिंदी या अंग्रेज़ी में पूछें।',
  mr: 'नमस्कार! मी तुमचा कृषिक्लिअर व्हॉईस असिस्टंट आहे. बाजारभाव, कोल्ड-चेन, किंवा एफपीओ सेटलमेंट बद्दल मराठी, हिंदी किंवा इंग्रजीत विचारा.',
};

export const KisanVoiceWidget: React.FC<KisanVoiceWidgetProps> = ({ isOpen, onClose, lang }) => {
  const [query, setQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(lang);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [conversation, setConversation] = useState<
    { role: 'user' | 'assistant'; text: string; stats?: { label: string; value: string }[] }[]
  >(() => {
    try {
      const saved = localStorage.getItem('krishiclear_voice_history_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // Start with a fresh conversation when stored history is unavailable.
    }
    return [{ role: 'assistant', text: voiceIntro.en }];
  });
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    setSelectedLanguage(lang);
    setConversation((prev) => {
      const next = [...prev];
      if (next.length > 0 && next[0].role === 'assistant') {
        next[0] = { ...next[0], text: voiceIntro[lang] };
      } else {
        next.unshift({ role: 'assistant', text: voiceIntro[lang] });
      }
      return next;
    });
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem('krishiclear_voice_history_v1', JSON.stringify(conversation));
    } catch {
      // History remains in memory for the current session.
    }
  }, [conversation]);

  const speakText = async (text: string) => {
    audioRef.current?.pause();
    audioRef.current = null;

    try {
      const audioBlob = await api.generateVoice(text, selectedLanguage);
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audioRef.current = audio;
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audio.src);
      };
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
      return;
    } catch {
      // Browser speech keeps the assistant usable when neural TTS is unavailable.
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'mr' ? 'mr-IN' : 'en-IN';
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAsk = async (textToAsk?: string) => {
    const q = textToAsk || query;
    if (!q.trim()) return;

    setConversation((prev) => [...prev, { role: 'user', text: q }]);
    setQuery('');

    try {
      const res = await api.askKisanAssistant(q, selectedLanguage);
      const answerText = res.answer_text || res.answer || 'I am here to help with mandi price, logistics, and farmer settlement.';

      setConversation((prev) => [
        ...prev,
        { role: 'assistant', text: answerText },
      ]);

      speakText(answerText);
    } catch (error) {
      const fallback = selectedLanguage === 'mr'
        ? 'माफ करा, सर्व्हरशी संपर्क होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.'
        : selectedLanguage === 'hi'
          ? 'क्षमा करें, सर्वर से संपर्क नहीं हो पाया। कृपया फिर से प्रयास करें।'
          : 'Sorry, I could not reach the server. Please try again.';

      setConversation((prev) => [...prev, { role: 'assistant', text: fallback }]);
      speakText(fallback);
    }
  };

  const toggleMicListening = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      mediaRecorderRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    // Prefer recorded audio so the backend uses Groq Whisper consistently.
    // Browser SpeechRecognition remains the fallback when recording is unavailable.
    if (SpeechRecognition && (!navigator.mediaDevices?.getUserMedia || !('MediaRecorder' in window))) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage === 'mr' ? 'mr-IN' : selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          transcript += event.results[index][0].transcript;
        }
        setQuery(transcript);
        if (event.results[event.results.length - 1].isFinal) {
          setIsListening(false);
          handleAsk(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
      try {
        recognition.start();
        setIsListening(true);
        return;
      } catch {
        recognitionRef.current = null;
      }
    }

    if (!navigator.mediaDevices?.getUserMedia || !('MediaRecorder' in window)) {
      setQuery(voicePrompts[selectedLanguage]);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setIsListening(false);
        try {
          const result = await api.transcribeVoice(new Blob(audioChunksRef.current, { type: recorder.mimeType }), selectedLanguage);
          if (result.text) handleAsk(result.text);
        } catch {
          setQuery(voicePrompts[selectedLanguage]);
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsListening(true);
    } catch {
      setQuery(voicePrompts[selectedLanguage]);
      setIsListening(false);
    }
  };

  useEffect(() => () => {
    recognitionRef.current?.stop();
    mediaRecorderRef.current?.stop();
    audioRef.current?.pause();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col h-[560px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-secondary-fixed" />
            <div>
              <div className="font-headline-sm font-bold text-base text-primary">
                KISAN VOICE &amp; TELEMETRY ASSISTANT
              </div>
              <div className="font-label-micro text-xs text-outline">
                NATURAL LANGUAGE AGRI-CLEARING CO-PILOT
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language selector */}
        <div className="flex items-center justify-between gap-2 pt-3 pb-2">
          <div className="text-[10px] font-label-micro uppercase tracking-[0.18em] text-outline">
            Language
          </div>
          <div className="flex items-center rounded-full border border-outline-variant/30 bg-surface-container p-1">
            {(['en', 'hi', 'mr'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSelectedLanguage(option)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                  selectedLanguage === option
                    ? 'bg-secondary-fixed text-on-secondary-fixed'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {option === 'en' ? 'EN' : option === 'hi' ? 'हिं' : 'मर'}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1 text-xs">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-primary text-on-primary font-body-md rounded-br-none'
                    : 'bg-surface-container dark:bg-surface-container text-on-surface rounded-bl-none border border-outline-variant/20'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>

                {msg.stats && (
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-outline-variant/20 font-label-micro">
                    {msg.stats.map((st, sIdx) => (
                      <div key={sIdx} className="bg-surface-container-lowest p-2 rounded-lg text-center">
                        <div className="text-[10px] text-outline uppercase">{st.label}</div>
                        <div className="font-label-numeric font-bold text-secondary-fixed text-xs mt-0.5">{st.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 border-t border-outline-variant/15 text-[11px] font-label-micro">
          <button
            onClick={() => handleAsk('Check Nashik Red Onion clearing price')}
            className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface whitespace-nowrap transition-colors"
          >
            Nashik Onion Price
          </button>
          <button
            onClick={() => handleAsk('Status of Convoy MH-14-AZ-9904')}
            className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface whitespace-nowrap transition-colors"
          >
            Convoy MH-14 ETA
          </button>
          <button
            onClick={() => handleAsk('Solapur Pomegranate export specs')}
            className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface whitespace-nowrap transition-colors"
          >
            Solapur Anar Specs
          </button>
        </div>

        {/* Input Bar with Voice Button */}
        <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20">
          <button
            onClick={toggleMicListening}
            className={`p-3 rounded-xl transition-all ${
              isListening
                ? 'bg-error text-white animate-pulse'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
            title="Speak into Microphone"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder={isListening ? 'Listening to voice...' : 'Ask about mandi rates, transit, or lots...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
          />

          <button
            onClick={() => handleAsk()}
            className="p-3 rounded-xl bg-primary text-on-primary hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
