import React, { useState } from 'react';
import { X, Mic, Volume2, Send, Bot, Sparkles } from 'lucide-react';
import { apiClient } from '../../api/client.ts';

interface KisanVoiceWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KisanVoiceWidget: React.FC<KisanVoiceWidgetProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<
    { role: 'user' | 'assistant'; text: string; stats?: { label: string; value: string }[] }[]
  >([
    {
      role: 'assistant',
      text: 'Namaste! I am your KrishiClear Voice Assistant. Ask me about APMC Mandi prices, Cold-Chain convoy telemetry, or FPO clearing settlement in English, Hindi, or Marathi.',
    },
  ]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
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

    const res = await apiClient.askKisanAssistant(q);

    setConversation((prev) => [
      ...prev,
      { role: 'assistant', text: res.answer, stats: res.quickStats },
    ]);

    speakText(res.answer);
  };

  const toggleMicListening = () => {
    setIsListening(true);
    // Simulate quick voice recognition query
    setTimeout(() => {
      setIsListening(false);
      handleAsk('Check Nashik Red Onion clearing price vs Lasalgaon APMC');
    }, 1500);
  };

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
