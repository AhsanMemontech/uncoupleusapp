'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatbot } from './ChatbotContext';
import { MessageCircle, X, Mic, Phone, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const SUGGESTIONS = [
  "What if my ex won't let me see my kids?",
  "How do I file for divorce in NY?",
  "Can I get spousal support?",
  "What's the difference between legal separation and divorce?"
];

const AVAILABLE_LAWYERS = [
  {
    id: 1,
    name: "Ahsan Memon",
    title: "Divorce & Family Law Attorney",
    calendly: "https://calendly.com/ahsan-thebeacons/30min",
    rating: "4.9",
    experience: "10+ years"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "Family Law Specialist",
    calendly: "https://calendly.com/sarah-johnson-law/consultation",
    rating: "4.8",
    experience: "8+ years"
  },
  {
    id: 3,
    name: "Michael Chen",
    title: "Divorce Attorney",
    calendly: "https://calendly.com/michael-chen-law/30min",
    rating: "4.7",
    experience: "12+ years"
  }
];

export default function ChatbotWidget() {
  const { isChatbotOpen: open, setChatbotOpen: setOpen } = useChatbot();
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Hi, I'm Uncouple. I can help you understand your divorce rights in NY. You can talk or type. What's on your mind?",
      time: '02:43 PM'
    }
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_FREE_QUESTIONS = 3;
  const [questionCount, setQuestionCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [showLawyerDropdown, setShowLawyerDropdown] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showLawyerDropdown && !target.closest('.lawyer-dropdown')) {
        setShowLawyerDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLawyerDropdown]);

  const handleSend = () => {
    if (!input.trim() || locked) return;
    const newMessages = [
      ...messages,
      { from: 'user', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
    setMessages(newMessages);
    setInput('');
    const newCount = questionCount + 1;
    setQuestionCount(newCount);
    if (!user && newCount >= MAX_FREE_QUESTIONS) {
      setLocked(true);
      setTimeout(() => {
        setMessages(msgs => ([
          ...msgs,
          { from: 'bot', text: 'Sign up to continue and save your questions/answers.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]));
      }, 500);
    } else {
      setTimeout(() => {
        setMessages(msgs => ([
          ...msgs,
          { from: 'bot', text: 'Thanks for your question! (Demo bot: real answers coming soon.)', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]));
      }, 700);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none"
        onClick={() => setOpen(true)}
        aria-label="Open chat"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
      >
        <MessageCircle className="h-7 w-7" />
      </button>

      {/* Chatbot Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setOpen(false)} />
          {/* Chat Window */}
          <div className="relative w-full max-w-2xl h-[720px] rounded-t-2xl shadow-2xl flex flex-col mr-10 mb-10 animate-slideup" style={{ maxHeight: '90vh', minWidth: '480px', backgroundColor: 'rgb(10 15 28)', boxShadow: 'rgb(183 177 177 / 18%) 1px 2px 20px' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="bg-cyan-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-lg">U</div>
                <div>
                  <div className="font-semibold text-gray-100">Uncouple</div>
                  <div className="text-xs text-gray-400">NY Divorce Rights Assistant</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="relative"
                  onMouseEnter={() => {
                    if (user) {
                      setShowLawyerDropdown(true);
                    }
                  }}
                  onMouseLeave={() => setShowLawyerDropdown(false)}
                >
                  <button 
                    className="flex items-center gap-1 bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-800" 
                    onClick={async () => {
                      if (!user) {
                        window.location.href = '/signup';
                      } else {
                        // Check for basic info in profile
                        const { data: profile } = await supabase
                          .from('profiles')
                          .select('yourfullname, youremail, yourphone, youraddress')
                          .eq('id', user.id)
                          .single();
                        if (!profile || !profile.yourfullname || !profile.youremail || !profile.yourphone || !profile.youraddress) {
                          setShowBasicInfoModal(true);
                        } else {
                          setShowLawyerDropdown(!showLawyerDropdown);
                        }
                      }
                    }}
                  >
                    <Phone className="h-4 w-4 mr-1" /> Speak to a Lawyer
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                  
                  {showLawyerDropdown && (
                    <div className="absolute right-0 top-full w-80 bg-gray-900/80 backdrop-blur-md rounded-lg shadow-xl border border-gray-700 z-50 lawyer-dropdown">
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-100 mb-3">Available Lawyers</h3>
                        <div className="space-y-3">
                          {AVAILABLE_LAWYERS.map((lawyer) => (
                            <button
                              key={lawyer.id}
                              className="w-full text-left p-3 rounded-lg border border-gray-700 hover:border-cyan-500 hover:bg-gray-800/60 transition-colors"
                              onClick={() => {
                                window.open(lawyer.calendly, '_blank');
                                setShowLawyerDropdown(false);
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-semibold text-gray-100">{lawyer.name}</div>
                                  <div className="text-sm text-gray-300">{lawyer.title}</div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    ⭐ {lawyer.rating} • {lawyer.experience} experience
                                  </div>
                                </div>
                                <div className="text-xs text-cyan-400 font-medium">Schedule</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {showBasicInfoModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Add Basic Information</h3>
                      <p className="text-gray-700 mb-6">Please add your basic information before scheduling a call with a lawyer.</p>
                      <button
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors w-full mb-2"
                        onClick={() => {
                          setShowBasicInfoModal(false);
                          setOpen(false);
                          router.push('/information-collection');
                        }}
                      >
                        Add Basic Information
                      </button>
                      <button
                        className="text-gray-500 hover:text-gray-700 text-sm mt-2"
                        onClick={() => setShowBasicInfoModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                <button className="ml-2 p-1 rounded-full hover:bg-gray-100" onClick={() => setOpen(false)} aria-label="Close chat">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 chatbot-messages" style={{ backgroundColor: 'rgb(20 28 40)' }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-4 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-2xl px-4 py-3 max-w-[80%] ${msg.from === 'user' ? 'bg-cyan-600 text-gray-100 text-sm' : 'bg-gray-800 text-gray-300 text-sm'}`}>{msg.text}
                    <div className={`text-xs mt-1 text-right ${msg.from === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Input Area */}
            <div className="px-6 py-4 border-t border-gray-800" style={{ backgroundColor: 'rgb(10 15 28)' }}>
              {!locked && (
                <>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {SUGGESTIONS.map((s, i) => (
                      <button key={i} className="bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs px-3 py-1 rounded-full mr-2 mb-2" onClick={() => setInput(s)}>{s}</button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      className="bg-gray-900 text-gray-200 flex-1 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder="Ask about your divorce rights in NY..."
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                      disabled={locked}
                    />
                    {/* <button className="p-2 text-gray-500 hover:text-cyan-600" aria-label="Voice input" disabled={locked}>
                      <Mic className="h-5 w-5" />
                    </button> */}
                    <button className="p-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg" onClick={handleSend} aria-label="Send" disabled={locked}>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                  {/* <div className="text-xs text-gray-500 mt-2">Voice input and audio responses available</div> */}
                </>
              )}
              {locked && !user && (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="mb-4 text-gray-700 text-center font-semibold">Sign up to continue and save your questions/answers.</div>
                  <a href="/signup" className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">Sign Up</a>
                </div>
              )}
            </div>
            {/* Disclaimer */}
            {/* <div className="text-center text-xs text-gray-400 py-2 border-t border-gray-100 bg-gray-50">
              Uncouple provides legal information, not legal advice. For specific legal guidance, consult with a qualified attorney.
            </div> */}
          </div>
        </div>
      )}
    </>
  );
} 