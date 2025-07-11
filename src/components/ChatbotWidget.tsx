'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatbot } from './ChatbotContext';
import { MessageCircle, X, Mic, Phone, ChevronDown, Loader2, ChevronUp, History } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { ChatSessionManager, ChatMessage } from '@/lib/chatSession';

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showOlderMessages, setShowOlderMessages] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const MAX_FREE_QUESTIONS = 3;
  const [questionCount, setQuestionCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [showLawyerDropdown, setShowLawyerDropdown] = useState(false);
  const [hasBasicInfo, setHasBasicInfo] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  // Reset basic info cache when user changes
  useEffect(() => {
    setHasBasicInfo(null);
  }, [user?.id]);

  // Clear chat history when user logs out
  useEffect(() => {
    if (!user && messages.length > 0) {
      // Clear messages and reset to welcome message
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: "Hi, I'm Uncouple AI assistant. I can help you understand your divorce rights in NY. What's on your mind?",
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      setQuestionCount(0);
      setLocked(false);
      setShowOlderMessages(false);
      setIsTyping(false);
    }
  }, [user]);

  // Load chat history when user logs in
  useEffect(() => {
    if (user && open) {
      loadChatHistory();
    }
  }, [user, open]);

  const loadChatHistory = async () => {
    if (!user) return;
    
    setIsLoadingHistory(true);
    try {
      const history = await ChatSessionManager.getChatSession(user.id);
      if (history.length > 0) {
        setMessages(history);
        //console.log('DEBUG: Loaded chat history:', history.length, 'messages');
      } else {
        // Initialize with welcome message if no history
        const welcomeMessage: ChatMessage = {
          role: 'assistant',
          content: "Hi, I'm Uncouple AI assistant. I can help you understand your divorce rights in NY. What's on your mind?",
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Fallback to welcome message
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: "Hi, I'm Uncouple AI assistant. I can help you understand your divorce rights in NY. What's on your mind?",
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll to bottom when typing indicator appears/disappears
  useEffect(() => {
    scrollToBottom();
  }, [isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const generateAIResponse = async (userQuestion: string) => {
    // For testing - use fallback response instead of API call
    //console.log('TESTING: Using fallback response instead of API call');
    //return getFallbackResponse(userQuestion);
    
     
    // Main API call - commented out for testing
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userQuestion,
          userId: user?.id || null,
          conversationHistory: messages, // Send full conversation context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      console.log('DEBUG: AI Response received:', data.response);
      return data.response;
    } catch (error) {
      console.error('AI response error:', error);
      return getFallbackResponse(userQuestion);
    }
    
  };

  const getFallbackResponse = (question: string) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('custody') || lowerQuestion.includes('kids') || lowerQuestion.includes('children')) {
      return "In NY, custody decisions are based on the child's best interests. Factors include the child's relationship with each parent, stability, and the child's wishes (if they're old enough). Joint custody is preferred when possible. Would you like to know more about filing for custody?";
    }
    
    if (lowerQuestion.includes('support') || lowerQuestion.includes('alimony') || lowerQuestion.includes('maintenance')) {
      return "NY has guidelines for child support and spousal maintenance. Child support is calculated using both parents' incomes and the number of children. Spousal maintenance depends on income disparity and marriage length. I can help you estimate potential amounts.";
    }
    
    if (lowerQuestion.includes('property') || lowerQuestion.includes('assets') || lowerQuestion.includes('division')) {
      return "NY is an equitable distribution state, meaning marital property is divided fairly (not necessarily 50/50). Marital property includes assets acquired during marriage. Separate property (owned before marriage) usually stays with the original owner.";
    }
    
    if (lowerQuestion.includes('file') || lowerQuestion.includes('process') || lowerQuestion.includes('how to')) {
      return "To file for divorce in NY, you need to: 1) Meet residency requirements (live in NY for 1 year), 2) File a Summons with Notice or Summons and Complaint, 3) Serve your spouse, 4) Complete financial disclosure, 5) Attend court if uncontested, or go through discovery if contested.";
    }
    
    if (lowerQuestion.includes('grounds') || lowerQuestion.includes('reason') || lowerQuestion.includes('why')) {
      return "NY allows both fault and no-fault divorces. No-fault is most common - you can cite 'irretrievable breakdown' of the marriage for 6+ months. Fault grounds include adultery, abandonment, cruel treatment, or imprisonment. No-fault is usually faster and less expensive.";
    }
    
    if (lowerQuestion.includes('separation') || lowerQuestion.includes('legal separation')) {
      return "Legal separation in NY is different from divorce. It's a court order that addresses custody, support, and property division while keeping you legally married. Some people choose this for religious reasons or to maintain health insurance benefits.";
    }
    
    if (lowerQuestion.includes('ex') || lowerQuestion.includes('spouse') || lowerQuestion.includes('partner')) {
      return "I understand you're dealing with relationship issues. In NY, you have legal options whether you're married or not. For specific guidance about your situation, I'd recommend speaking with one of our attorneys who can provide personalized advice.";
    }
    
    return "I understand you're asking about divorce in NY. While I can provide general information, for specific legal advice tailored to your situation, I recommend consulting with an attorney. Would you like to schedule a consultation with one of our lawyers?";
  };

  const saveMessageToSession = async (message: ChatMessage) => {
    if (!user) return;
    
    try {
      await ChatSessionManager.addMessage(user.id, message);
      //console.log('DEBUG: Saved message to session');
    } catch (error) {
      //console.error('Error saving message to session:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || locked || isTyping) return;
    
    const userMessage = input.trim();
    //console.log('DEBUG: Sending message:', userMessage);
    
    const userChatMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    
    const newMessages = [...messages, userChatMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    
    // Save user message to session
    await saveMessageToSession(userChatMessage);
    
    const newCount = questionCount + 1;
    setQuestionCount(newCount);
    
    if (!user && newCount >= MAX_FREE_QUESTIONS) {
      setLocked(true);
      setTimeout(() => {
        const botMessage: ChatMessage = {
          role: 'assistant',
          content: 'Sign up to continue and save your questions/answers.',
          timestamp: new Date().toISOString()
        };
        setMessages(msgs => [...msgs, botMessage]);
        setIsTyping(false);
      }, 500);
    } else {
      // Generate AI response
      const aiResponse = await generateAIResponse(userMessage);
      
      setTimeout(() => {
        const botMessage: ChatMessage = {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString()
        };
        setMessages(msgs => [...msgs, botMessage]);
        
        // Save bot message to session
        saveMessageToSession(botMessage);
        
        setIsTyping(false);
      }, 1000);
    }
  };

  const checkBasicInfo = async (forceRefresh = false): Promise<boolean> => {
    if (!user) return false;
    
    //console.log('Checking basic info for user:', user.id);
    try {
      // First check if profile exists
      const { data: profileExists, error: existsError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      //console.log('Profile exists check:', { profileExists, existsError });
      
      if (!profileExists) {
        //console.log('No profile found for user, showing modal');
        setHasBasicInfo(false);
        return false;
      }
      
      // Now get the full profile data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('yourfullname, youremail, yourphone, youraddress, spousefullname, spouselastknownaddress')
        .eq('id', user.id)
        .single();
      
      //console.log('Profile query result:', { profile, error });
      
      if (error) {
        console.log('Profile data error, treating as incomplete info');
        setHasBasicInfo(false);
        return false;
      }
      
      const requiredFields = [
        'yourfullname', 'youremail', 'yourphone', 'youraddress',
        'spousefullname', 'spouselastknownaddress'
      ] as const;
      
      const missingFields = requiredFields.filter(field => 
        !profile || !profile[field] || String(profile[field]).trim() === ''
      );
      
      const hasInfo = missingFields.length === 0;
      //console.log('Basic info check result:', hasInfo, 'Missing fields:', missingFields);
      setHasBasicInfo(hasInfo);
      return hasInfo;
    } catch (error) {
      console.error('Error checking basic info:', error);
      setHasBasicInfo(false);
      return false;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating AI Assistant Button */}
      <button
        className="fixed bottom-6 right-6 z-50 group"
        onClick={() => setOpen(true)}
        aria-label="Open AI assistant"
      >
        {/* Main Button */}
        <div className="relative animate-float">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
          
          {/* Button Container */}
          <div className="relative bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-full shadow-2xl p-4 flex items-center justify-center transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-cyan-500/25 animate-glow">
            {/* AI Icon */}
            <div className="relative">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              
              {/* Animated Dots */}
              <div className="absolute -top-1 -right-1 flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
          
          {/* Pulse Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping"></div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            AI Assistant
          </div>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </button>

      {/* Chatbot Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          
          {/* Chat Window */}
          <div className="relative w-full max-w-2xl h-[720px] rounded-t-2xl shadow-2xl flex flex-col mr-10 mb-10 animate-slideup" style={{ maxHeight: '90vh', minWidth: '480px', backgroundColor: 'rgb(10 15 28)', boxShadow: 'rgb(183 177 177 / 18%) 1px 2px 20px' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <div className="font-semibold text-gray-100 flex items-center gap-2">
                    Uncouple AI
                  </div>
                  <div className="text-xs text-gray-400">NY Divorce Rights Assistant</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="relative lawyer-dropdown-container"
                  onMouseEnter={async () => {
                    //console.log('Hover handler called');
                    if (user) {
                      const hasInfo = await checkBasicInfo();
                      //console.log('Hover basic info result:', hasInfo);
                      if (hasInfo) {
                        setShowLawyerDropdown(true);
                      }
                    }
                  }}
                  onMouseLeave={() => setShowLawyerDropdown(false)}
                >
                  <button 
                    className="flex items-center gap-1 bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors" 
                    onClick={() => {
                      //console.log('Click handler called. Dropdown open:', showLawyerDropdown, 'Has basic info:', hasBasicInfo);
                      if (!user) {
                        window.location.href = '/signup';
                      } else {
                        // Simple toggle - if dropdown is open, close it
                        if (showLawyerDropdown) {
                          //console.log('Closing dropdown');
                          setShowLawyerDropdown(false);
                        } else {
                          // Always force a fresh check when clicking
                          //console.log('Force refreshing basic info check on click');
                          checkBasicInfo(true).then(hasInfo => {
                            //console.log('Basic info check completed:', hasInfo);
                            if (hasInfo) {
                              setShowLawyerDropdown(true);
                            } else {
                              setShowBasicInfoModal(true);
                            }
                          });
                        }
                      }
                    }}
                  >
                    <Phone className="h-4 w-4 mr-1" /> Speak to a Lawyer
                    <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showLawyerDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showLawyerDropdown && (
                    <div className="absolute right-0 top-full w-80 bg-gray-900/80 backdrop-blur-md rounded-lg shadow-xl border border-gray-700 z-50 lawyer-dropdown lawyer-dropdown-container">
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
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Complete Basic Information</h3>
                      <p className="text-gray-700 mb-4">To schedule a call with a lawyer, you need to complete all basic information including:</p>
                      <ul className="text-sm text-gray-600 mb-6 text-left space-y-1">
                        <li>• Your full name and contact details</li>
                        <li>• Your address</li>
                        <li>• Spouse&apos;s full name and address</li>
                      </ul>
                      <button
                        className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors w-full mb-2"
                        onClick={() => {
                          setShowBasicInfoModal(false);
                          setOpen(false);
                          router.push('/information-collection');
                        }}
                      >
                        Complete Information
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
            
            {/* Older Messages Button */}
            {messages.length > 5 && (
              <div className="px-6 py-2 border-b border-gray-800">
                <button
                  onClick={() => setShowOlderMessages(!showOlderMessages)}
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <History className="h-3 w-3" />
                  {showOlderMessages ? 'Hide' : 'Show'} older messages ({messages.length - 5} more)
                </button>
              </div>
            )}
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 chatbot-messages" style={{ backgroundColor: 'rgb(20 28 40)' }}>
              {isLoadingHistory && (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-400 text-sm">Loading chat history...</span>
                </div>
              )}
              
              {messages.map((msg, idx) => {
                // Show only recent messages unless showOlderMessages is true
                if (!showOlderMessages && idx < messages.length - 5) {
                  return null;
                }
                
                return (
                  <div key={idx} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-2xl px-4 py-3 max-w-[80%] ${msg.role === 'user' ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-gray-100 text-sm' : 'bg-gray-800 text-gray-300 text-sm'}`}>
                      {msg.content}
                      <div className={`text-xs mt-1 text-right ${msg.role === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                <div className="mb-4 flex justify-start">
                  <div className="rounded-2xl px-4 py-3 bg-gray-800 text-gray-300 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span>AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              {/* Invisible div for auto-scroll */}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="px-6 py-4 border-t border-gray-800" style={{ backgroundColor: 'rgb(10 15 28)' }}>
              {!locked && (
                <>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {SUGGESTIONS.map((s, i) => (
                      <button key={i} className="bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs px-3 py-1 rounded-full mr-2 mb-2 transition-colors" onClick={() => setInput(s)}>{s}</button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      className="bg-gray-900 text-gray-200 flex-1 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Ask about your divorce rights in NY..."
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                      disabled={locked}
                    />
                    <button className="p-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-lg transition-all duration-200 transform hover:scale-105" onClick={handleSend} aria-label="Send" disabled={locked}>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </>
              )}
              {locked && !user && (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="mb-4 text-gray-700 text-center font-semibold">Sign up to continue and save your questions/answers.</div>
                                     <a href="/signup" className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors">Sign Up</a>
                </div>
              )}
            </div>
            {/* Disclaimer */}
            {/* <div className="text-center text-xs text-gray-400 py-2 border-t border-gray-800" style={{ backgroundColor: 'rgb(10 15 28)' }}>
              Uncouple provides legal information, not legal advice. For specific legal guidance, consult with a qualified attorney.
            </div> */}
          </div>
        </div>
      )}
    </>
  );
} 