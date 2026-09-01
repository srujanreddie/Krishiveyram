import React, { useState, useRef, useEffect } from 'react';
import {
  PhoneCall,
  PhoneOff,
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  Paperclip,
  Volume2,
  CheckCheck,
  UserCheck,
  Award,
  Sparkles,
  Bot,
  RefreshCw,
  PhoneForwarded,
} from 'lucide-react';
import { AgronomyExpert, ChatMessage, PlantDiagnosisResult, UserProfile } from '../types';
import { SupportedLanguage, UI_TEXTS } from '../utils/translations';
import { AGRONOMY_EXPERTS } from '../data/agriculturalData';
import { speakText } from '../utils/audioSpeech';

interface ExpertHelplineProps {
  currentLang: SupportedLanguage;
  userProfile: UserProfile;
  attachedDiagnosis: PlantDiagnosisResult | null;
  onClearDiagnosisAttachment: () => void;
}

export const ExpertHelpline: React.FC<ExpertHelplineProps> = ({
  currentLang,
  userProfile,
  attachedDiagnosis,
  onClearDiagnosisAttachment,
}) => {
  const texts = UI_TEXTS[currentLang] || UI_TEXTS.en;

  const [selectedExpert, setSelectedExpert] = useState<AgronomyExpert>(AGRONOMY_EXPERTS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_initial',
      sender: 'expert',
      senderName: AGRONOMY_EXPERTS[0].name,
      text: `Namaste ${userProfile.fullName}! I am Dr. Ramesh Kumar from Krishi Vigyan Kendra. You can speak or write your crop problem in your language, or send a photo of your sick plant. How can I assist your ${userProfile.mainCrops.join(', ')} crops today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callDurationSecs, setCallDurationSecs] = useState(0);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingReply]);

  // Call timer simulation
  useEffect(() => {
    let timer: any;
    if (isCalling) {
      timer = setInterval(() => {
        setCallDurationSecs((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDurationSecs(0);
    }
    return () => clearInterval(timer);
  }, [isCalling]);

  // Send message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend && !attachedDiagnosis) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'farmer',
      senderName: userProfile.fullName,
      text: textToSend || `Dr. Saab, please check this photo of ${attachedDiagnosis?.cropName} with ${attachedDiagnosis?.diseaseOrPestName}. What should I spray?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: attachedDiagnosis?.imageUrl,
      diagnosisAttachment: attachedDiagnosis || undefined,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoadingReply(true);

    try {
      const response = await fetch('/api/chat-expert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          farmerProfile: userProfile,
          diagnosisContext: attachedDiagnosis,
          language: currentLang,
        }),
      });

      if (!response.ok) throw new Error('Expert service response failed');

      const data = await response.json();
      if (data.success && data.reply) {
        setMessages((prev) => [...prev, data.reply]);
      }
    } catch (err) {
      console.warn('Error fetching live expert response, using expert engine fallback:', err);
      // Fallback expert reply
      const fallbackReply: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: 'expert',
        senderName: selectedExpert.name,
        text: attachedDiagnosis
          ? `Namaste ${userProfile.fullName}! For ${attachedDiagnosis.cropName} affected with ${attachedDiagnosis.diseaseOrPestName}, mix ${attachedDiagnosis.primaryRemedy.name} at 2 spoons per 1 Liter water (35g in 15L backpack tank). Spray early morning tomorrow. Avoid spraying if rain occurs.`
          : `Namaste Kisan Bhai! Make sure to maintain clean drainage in your field. If you notice any yellowing or leaf spot, kindly send a picture right here so I can give you the exact chemical name and backpack tank dose.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoadingReply(false);
    }
  };

  // Voice recognition simulation
  const handleToggleVoice = () => {
    if (isRecordingAudio) {
      setIsRecordingAudio(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = currentLang === 'hi' ? 'hi-IN' : currentLang === 'pa' ? 'pa-IN' : 'en-IN';
        setIsRecordingAudio(true);
        recognition.start();

        recognition.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript;
          setInputText(transcript);
          setIsRecordingAudio(false);
        };
        recognition.onerror = () => setIsRecordingAudio(false);
        recognition.onend = () => setIsRecordingAudio(false);
      } catch (err) {
        setIsRecordingAudio(false);
      }
    } else {
      setIsRecordingAudio(true);
      setTimeout(() => {
        setInputText('Doctor Saab, my tomato leaves are drying from bottom. How much medicine per 15L tank?');
        setIsRecordingAudio(false);
      }, 1500);
    }
  };

  // Voice call simulator
  const handleStartCall = () => {
    setIsCalling(true);
    speakText(
      `Connecting call to Dr. Ramesh Kumar, Senior Agronomist at Krishi Vigyan Kendra. Line connected. Namaste Baldev Singh ji. Please describe your crop situation.`,
      currentLang
    );
  };

  const handleEndCall = () => {
    setIsCalling(false);
  };

  return (
    <div className="space-y-4 pb-24 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Active Call Overlay (Simulated direct voice helpline) */}
      {isCalling && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-between p-8 text-white text-center animate-in fade-in">
          <div className="pt-6 space-y-3">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/40 animate-pulse">
              ● Live Agronomy Voice Helpline
            </span>
            <h2 className="text-2xl font-black font-['Outfit']">{selectedExpert.name}</h2>
            <p className="text-sm text-slate-300">{selectedExpert.institution}</p>
            <div className="text-lg font-black text-amber-300 mt-2 font-mono">
              {Math.floor(callDurationSecs / 60)}:{(callDurationSecs % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="relative">
            <img
              src={selectedExpert.avatarUrl}
              alt={selectedExpert.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80';
              }}
              className="w-32 h-32 rounded-full border-4 border-emerald-400 shadow-2xl object-cover"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white border-2 border-slate-900">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="w-full max-w-xs space-y-3 pb-8">
            <p className="text-xs text-slate-300 font-medium">
              "Kisan helpline is active. You are speaking with Dr. Ramesh Kumar in {currentLang.toUpperCase()}."
            </p>
            <button
              onClick={handleEndCall}
              className="w-full py-4 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/40 transition text-base"
            >
              <PhoneOff className="w-6 h-6" />
              <span>END HELPLINE CALL</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Expert Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={selectedExpert.avatarUrl}
                alt={selectedExpert.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80';
                }}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit']">
                  {selectedExpert.name}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                  ★ {selectedExpert.rating}
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-800">{selectedExpert.title}</p>
              <p className="text-[11px] text-slate-500 font-medium">{selectedExpert.institution}</p>
            </div>
          </div>

          {/* Quick Voice Call Button */}
          <button
            onClick={handleStartCall}
            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 active:scale-95 text-white font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition"
          >
            <PhoneCall className="w-4 h-4 text-white" />
            <span>START VOICE CALL (मुफ्त कॉल)</span>
          </button>
        </div>

        {/* Toll Free Direct Phone Number */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-medium text-slate-700">
          <span>
            📞 <strong>Toll-Free Kisan Call Center:</strong> 1800-180-1551 (6 AM - 10 PM)
          </span>
          <span className="text-emerald-700 font-bold">Free Government Service</span>
        </div>
      </div>

      {/* Active Attached Diagnosis Card (if farmer navigated from scanner) */}
      {attachedDiagnosis && (
        <div className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <img
              src={attachedDiagnosis.imageUrl}
              alt={attachedDiagnosis.cropName}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-12 h-12 rounded-xl object-cover border border-emerald-400"
            />
            <div className="text-xs">
              <div className="font-extrabold text-emerald-950">
                Attached Scan: {attachedDiagnosis.cropName} ({attachedDiagnosis.diseaseOrPestName})
              </div>
              <div className="text-emerald-700 font-semibold">
                Prescription: {attachedDiagnosis.primaryRemedy.name}
              </div>
            </div>
          </div>

          <button
            onClick={onClearDiagnosisAttachment}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1 bg-white rounded-lg border border-slate-200"
          >
            Remove ✕
          </button>
        </div>
      )}

      {/* CHAT MESSAGES WINDOW */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col h-[420px]">
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.map((msg) => {
            const isUser = msg.sender === 'farmer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 px-1">
                  <span>{msg.senderName}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-emerald-700 text-white rounded-tr-xs'
                      : 'bg-slate-100 text-slate-900 rounded-tl-xs border border-slate-200/80'
                  }`}
                >
                  {/* If message has leaf photo attachment */}
                  {msg.imageUrl && (
                    <div className="mb-2 rounded-xl overflow-hidden border border-white/20">
                      <img
                        src={msg.imageUrl}
                        alt="Attached crop"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}

                  <div className="whitespace-pre-line font-medium">{msg.text}</div>

                  {!isUser && (
                    <button
                      onClick={() => speakText(msg.text, currentLang)}
                      className="mt-2 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg flex items-center gap-1 transition active:scale-95"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen to advice</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {isLoadingReply && (
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 w-fit text-xs text-slate-600 font-bold">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Dr. Ramesh Kumar is preparing crop solution...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips for Farmers */}
        <div className="pt-2 pb-1 border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
          {[
            'What is the exact 15L tank dose?',
            'Is it safe to spray before rain?',
            'Which organic remedy works fast?',
            'What fertilizer should I apply next?',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-2.5 py-1 rounded-xl whitespace-nowrap border border-slate-200 transition active:scale-95 shrink-0"
            >
              💬 {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar with Big Touch Targets */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={handleToggleVoice}
            className={`p-3 rounded-2xl transition active:scale-95 shrink-0 ${
              isRecordingAudio
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
            }`}
            title="Record voice message"
          >
            {isRecordingAudio ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type or speak your farming question..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() && !attachedDiagnosis}
            className={`p-3 rounded-2xl font-black text-white shrink-0 transition active:scale-95 ${
              !inputText.trim() && !attachedDiagnosis
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
