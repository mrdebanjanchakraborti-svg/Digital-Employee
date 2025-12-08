
import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, PhoneOff, User, Building, MapPin, ArrowRight, AlertCircle, Rocket, RotateCcw, Briefcase, Phone, Mail, Globe } from 'lucide-react';
import { useConfig } from '../services/configContext';
import { ImageWithFallback, NeonButton } from './Shared';
import { GoogleGenAI } from "@google/genai";

const FILLERS = [ "Let me check that...", "Hmm, one moment...", "Thinking...", "Just a second...", "Right...", "Okay, checking..." ];
const LANGUAGE_CODES: Record<string, string> = { 
  'English': 'en-IN', 
  'Hindi': 'hi-IN', 
  'Bengali': 'bn-IN', 
  'Tamil': 'ta-IN', 
  'Telugu': 'te-IN', 
  'Marathi': 'mr-IN', 
  'Kannada': 'kn-IN', 
  'Gujarati': 'gu-IN', 
  'Urdu': 'ur-IN' 
};

export const VoiceAgentOverlay = ({ isOpen, onClose }: any) => {
  const { config } = useConfig();
  const agent = config.voiceAgent;
  
  const [stage, setStage] = useState<'form' | 'agent'>('form');
  const [status, setStatus] = useState<'connecting' | 'listening' | 'speaking' | 'processing' | 'idle'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [clientData, setClientData] = useState({ name: '', business_name: '', city: '', industry: '', phone: '', email: '', language_preference: 'English' });
  const [transcript, setTranscript] = useState("");
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(window.speechSynthesis);
  const statusRef = useRef(status);
  const isListeningRef = useRef(false); 

  useEffect(() => { statusRef.current = status; }, [status]);

  useEffect(() => {
    if (isOpen) {
      setStage('form');
      setStatus('idle');
      setError(null);
    } else {
        stopListening();
        if (synthRef.current) synthRef.current.cancel();
    }
  }, [isOpen]);

  const speak = (text: string, nextState: 'listen' | 'idle' = 'listen', langCode = 'en-IN') => {
    if (!synthRef.current) return;
    
    // Strip emotion tags for TTS
    const cleanText = text.replace(/\[.*?\]/g, '').trim();
    if (!cleanText) {
        if (nextState === 'listen') startListening();
        else setStatus('idle');
        return;
    }

    setStatus('speaking');
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode;
    utterance.rate = agent.speechRate || 1.0;
    
    // Try to find a good voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('IN')) || voices.find(v => v.lang === langCode) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
        if (nextState === 'listen') {
            startListening();
        } else {
            setStatus('idle');
        }
    };

    utterance.onerror = () => {
         setStatus('idle');
    };

    synthRef.current.speak(utterance);
  };

  const startListening = () => {
     if (!('webkitSpeechRecognition' in window)) {
         setError("Speech recognition not supported in this browser.");
         return;
     }

     if (isListeningRef.current) return;
     
     try {
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = LANGUAGE_CODES[clientData.language_preference] || 'en-IN';

        recognitionRef.current.onstart = () => {
            isListeningRef.current = true;
            setStatus('listening');
        };

        recognitionRef.current.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            handleUserResponse(text);
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error("Speech error", event.error);
            isListeningRef.current = false;
            if (event.error === 'no-speech') {
                 // Silent retry or prompt
                 setStatus('idle');
            } else {
                 setStatus('idle');
            }
        };

        recognitionRef.current.onend = () => {
            isListeningRef.current = false;
            // If we just finished listening and status is still listening (no result), go to idle
            if (statusRef.current === 'listening') {
                setStatus('idle');
            }
        };

        recognitionRef.current.start();
     } catch (e) {
         console.error(e);
         setStatus('idle');
     }
  };

  const stopListening = () => {
      if (recognitionRef.current) {
          recognitionRef.current.stop();
          isListeningRef.current = false;
      }
  };

  const handleUserResponse = async (text: string) => {
    isListeningRef.current = false; 
    setStatus('processing');
    
    // Random filler for realism
    const showFiller = Math.random() > 0.3;
    let fillerTimeout: any;

    if (showFiller) {
        fillerTimeout = setTimeout(() => {
            if (statusRef.current === 'processing') {
                // Just visual filler or short audio can be added here
            }
        }, 1500);
    }
    
    // BUILD KNOWLEDGE BASE CONTEXT
    const kbContent = agent.knowledgeBase?.map((d:any) => {
       if (d.content) return `[SOURCE: ${d.name}]\n${d.content}\n`;
       return `[FILE: ${d.name}] (Content not available)`;
    }).join('\n\n') || "No specific knowledge base loaded.";
    
    const contextPrompt = `
    [CLIENT CONTEXT]
    Name: ${clientData.name}
    Business: ${clientData.business_name}
    City: ${clientData.city}
    Language: ${clientData.language_preference}
    
    [KNOWLEDGE BASE]
    ${kbContent}
    
    [INSTRUCTIONS]
    1. You are ${agent.name}, ${agent.role}.
    2. Use the KNOWLEDGE BASE to answer.
    3. If answer not found, use googleSearch.
    4. Speak in ${clientData.language_preference}.
    5. Keep it short (1-2 sentences).
    
    [USER INPUT]
    "${text}"
    `;
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const modelId = 'gemini-2.5-flash';
      // Only add googleSearch if enabled
      const tools = agent.googleSearchEnabled ? [{googleSearch: {}}] : [];

      const response = await ai.models.generateContent({
        model: modelId,
        contents: contextPrompt,
        config: {
          systemInstruction: agent.systemPrompt,
          tools: tools,
        }
      });
      
      if (fillerTimeout) clearTimeout(fillerTimeout);

      if (response.text) {
         const langCode = LANGUAGE_CODES[clientData.language_preference] || 'en-IN';
         speak(response.text, 'listen', langCode);
      } else {
         speak("I didn't catch that. Could you repeat?", 'listen');
      }

    } catch (e) {
      if (fillerTimeout) clearTimeout(fillerTimeout);
      console.error("AI Error", e);
      speak("I'm having trouble connecting to the server.", 'idle');
    }
  };

  const handleStartDemo = () => {
    if (!clientData.name || !clientData.phone) {
        setError("Please fill in Name and Phone to start.");
        return;
    }
    setStage('agent');
    setStatus('connecting');
    
    // Simulate connection delay then greet
    setTimeout(() => {
        const greeting = `Namaste ${clientData.name}. I am ${agent.name}. How can I help your business in ${clientData.city || 'India'} today?`;
        speak(greeting, 'listen');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white">
        <X size={32} />
      </button>

      {stage === 'form' ? (
        <div className="w-full max-w-md bg-brand-dark border border-white/10 rounded-2xl p-8 shadow-2xl">
           <div className="text-center mb-8">
             <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-brand-cyan mb-4">
               <ImageWithFallback src={agent.avatar} className="w-full h-full object-cover" />
             </div>
             <h2 className="text-2xl font-bold">Talk to {agent.name}</h2>
             <p className="text-gray-400">Experience our AI Voice Agent live.</p>
           </div>
           
           <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">Your Name</label>
                <div className="flex items-center bg-white/5 rounded-lg border border-white/10 px-3 py-2 mt-1">
                   <User size={16} className="text-gray-400 mr-2"/>
                   <input 
                     value={clientData.name} 
                     onChange={e => setClientData({...clientData, name: e.target.value})} 
                     className="bg-transparent border-none outline-none text-white w-full"
                     placeholder="John Doe"
                   />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase font-bold">Phone</label>
                    <div className="flex items-center bg-white/5 rounded-lg border border-white/10 px-3 py-2 mt-1">
                       <Phone size={16} className="text-gray-400 mr-2"/>
                       <input 
                         value={clientData.phone} 
                         onChange={e => setClientData({...clientData, phone: e.target.value})} 
                         className="bg-transparent border-none outline-none text-white w-full"
                         placeholder="98765..."
                       />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase font-bold">Language</label>
                    <select 
                      value={clientData.language_preference}
                      onChange={e => setClientData({...clientData, language_preference: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 mt-1 text-white outline-none"
                    >
                      {Object.keys(LANGUAGE_CODES).map(l => <option key={l} value={l} className="bg-brand-dark">{l}</option>)}
                    </select>
                  </div>
              </div>

               <div>
                <label className="text-xs text-gray-400 uppercase font-bold">City (Optional)</label>
                <div className="flex items-center bg-white/5 rounded-lg border border-white/10 px-3 py-2 mt-1">
                   <MapPin size={16} className="text-gray-400 mr-2"/>
                   <input 
                     value={clientData.city} 
                     onChange={e => setClientData({...clientData, city: e.target.value})} 
                     className="bg-transparent border-none outline-none text-white w-full"
                     placeholder="Mumbai"
                   />
                </div>
              </div>
              
              {error && <div className="text-red-400 text-sm flex items-center"><AlertCircle size={14} className="mr-1"/> {error}</div>}

              <NeonButton fullWidth onClick={handleStartDemo} className="mt-4">
                 Start Conversation <ArrowRight size={18} />
              </NeonButton>
           </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl h-full max-h-[80vh]">
            <div className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center transition-all duration-500 ${status === 'speaking' ? 'shadow-[0_0_100px_rgba(6,228,218,0.4)] scale-110' : 'shadow-[0_0_50px_rgba(108,40,255,0.2)]'}`}>
               <div className={`absolute inset-0 rounded-full border-4 border-brand-cyan/30 ${status === 'speaking' ? 'animate-ping opacity-20' : 'opacity-0'}`} />
               <div className={`absolute inset-0 rounded-full border-4 border-brand-violet/30 ${status === 'listening' ? 'animate-pulse opacity-40' : 'opacity-0'}`} />
               <ImageWithFallback src={agent.avatar} className="w-full h-full rounded-full object-cover z-10 border-4 border-white/10" />
               
               {/* Status Badge */}
               <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur border border-white/20 px-4 py-1 rounded-full text-sm font-mono text-brand-cyan uppercase tracking-widest flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${status === 'speaking' ? 'bg-green-400 animate-bounce' : status === 'listening' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                 {status}
               </div>
            </div>
            
            <div className="mt-20 w-full max-w-2xl text-center space-y-6">
                <div className="h-24 flex items-center justify-center p-4">
                  {transcript && (
                    <p className="text-xl md:text-2xl text-white font-light italic">
                      "{transcript}"
                    </p>
                  )}
                  {status === 'listening' && !transcript && (
                    <p className="text-gray-500 animate-pulse">Listening...</p>
                  )}
                </div>
                
                <div className="flex justify-center gap-6">
                   <button 
                     onClick={() => status === 'listening' ? stopListening() : startListening()}
                     className={`p-6 rounded-full transition-all ${status === 'listening' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
                   >
                     {status === 'listening' ? <MicOff size={32} /> : <Mic size={32} />}
                   </button>
                   <button 
                     onClick={onClose}
                     className="p-6 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-transform hover:scale-105"
                   >
                     <PhoneOff size={32} />
                   </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
