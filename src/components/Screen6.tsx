import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Home, PieChart, Target, User, Plus, ArrowRightLeft, MessageSquare, Check, CheckCircle2, ZoomIn, ZoomOut, Smartphone, Monitor, Send, X, Download, CreditCard, Loader2, Landmark, Search, Lock } from 'lucide-react';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import PhoneFrame from './PhoneFrame';
import WebFrame from './WebFrame';
import { ScreenId } from '../App';
import { useUI } from '../UIContext';
import { refineUI } from '../lib/anthropic';

interface Props {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onTabChange: (tab: string) => void;
}

export default function Screen6({ currentScreen, onNavigate, onTabChange }: Props) {
  const isDetail = currentScreen === '6a';
  const [zoom, setZoom] = useState(1);
  const [device, setDevice] = useState<'mobile' | 'web'>('mobile');
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [refinementMessage, setRefinementMessage] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectStep, setConnectStep] = useState(0);
  const [syncStep, setSyncStep] = useState(0);
  const [showSpendingInsights, setShowSpendingInsights] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsData, setInsightsData] = useState<any[]>([]);

  const {
    showSpendingInsights: ctxShowSpendingInsights, setShowSpendingInsights: ctxSetShowSpendingInsights,
    showRecentTransactions, setShowRecentTransactions,
    showBalanceCard, setShowBalanceCard, showQuickActions, setShowQuickActions, showBottomNav, setShowBottomNav,
    greetingText, setGreetingText, balanceLabel, setBalanceLabel,
    themeColor, setThemeColor,
    accentColor, setAccentColor,
    institutionName, logoUrl,
    fontFamily, setFontFamily,
    borderRadius, setBorderRadius,
    cardStyle, setCardStyle,
    headerStyle, setHeaderStyle,
    layoutStyle, setLayoutStyle,
    prototypeTemplate, setPrototypeTemplate
  } = useUI();

  // Sync local state with context for spending insights
  useEffect(() => {
    setShowSpendingInsights(ctxShowSpendingInsights);
  }, [ctxShowSpendingInsights]);

  const [activeTab, setActiveTab] = useState<'home' | 'insights' | 'goals' | 'profile'>('home');

  useEffect(() => {
    if (activeTab === 'insights' && insightsData.length === 0) {
      setInsightsLoading(true);
      // Simulate GET /users/{user_guid}/insights
      setTimeout(() => {
        setInsightsData([
          {
            guid: "INS-123",
            title: "Paycheck Deposited",
            description: "Your paycheck of $3,240.00 from Pacific Health Systems has been deposited.",
            template: "PaycheckDeposit",
            active_at: "2026-04-09T08:00:00Z",
            micro_call_to_action: "View Deposit"
          },
          {
            guid: "INS-456",
            title: "Subscription Price Increase",
            description: "Your Spotify subscription increased from $10.99 to $11.99 this month.",
            template: "SubscriptionPriceIncrease",
            active_at: "2026-04-08T10:00:00Z",
            micro_call_to_action: "Review Subscription"
          }
        ]);
        setInsightsLoading(false);
      }, 1500);
    }
  }, [activeTab]);

  useEffect(() => {
    if (connectStep === 3) {
      const t1 = setTimeout(() => setSyncStep(1), 500);
      const t2 = setTimeout(() => setSyncStep(2), 1000);
      const t3 = setTimeout(() => setSyncStep(3), 1500);
      const t4 = setTimeout(() => setConnectStep(4), 2000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
    if (connectStep === 5) {
      const t = setTimeout(() => {
        setConnectStep(0);
        setIsConnected(true);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [connectStep]);

  const handleOpenConnect = () => {
    // SCAFFOLDED: Real implementation calls POST /users/{user_guid}/widget_urls
    // with { widget_url: { widget_type: "connect_widget", use_cases: ["PFM"] } }
    // and embeds the returned URL. Widget URL expires after 10 min or first use.
    // Docs: https://docs.mx.com/api-reference/platform-api/reference/request-widget-url
    setConnectStep(1);
    setSyncStep(0);
  };

  const spendingWidgetHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 16px; background: white; }
        .bar-container { margin-bottom: 12px; }
        .bar { height: 8px; background: ${themeColor}; border-radius: 4px; margin-top: 4px; }
        .label { font-size: 12px; color: #6b7280; display: flex; justify-content: space-between; font-weight: 500; }
        .val { color: #111827; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="bar-container">
        <div class="label"><span>Groceries</span><span class="val">$840</span></div>
        <div class="bar" style="width: 100%;"></div>
      </div>
      <div class="bar-container">
        <div class="label"><span>Dining</span><span class="val">$420</span></div>
        <div class="bar" style="width: 50%;"></div>
      </div>
      <div class="bar-container">
        <div class="label"><span>Transport</span><span class="val">$210</span></div>
        <div class="bar" style="width: 25%;"></div>
      </div>
    </body>
    </html>
  `;
  const spendingWidgetUrl = `data:text/html;charset=utf-8,${encodeURIComponent(spendingWidgetHtml)}`;

  const FrameComponent = device === 'mobile' ? PhoneFrame : WebFrame;

  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    {
      role: 'model',
      text: "Done. Your prototype is ready. Tap any screen in the preview to explore it, or refine it in chat."
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatExpanded) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatExpanded, isRefining]);

  const handleRefine = async () => {
    if (!chatInput.trim() || isRefining) return;
    setIsRefining(true);
    
    const input = chatInput;
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: input }]);

    try {
      const currentState = {
        showSpendingInsights: ctxShowSpendingInsights,
        showRecentTransactions,
        showBalanceCard,
        showQuickActions,
        showBottomNav,
        greetingText,
        balanceLabel,
        themeColor,
        accentColor,
        fontFamily,
        borderRadius,
        cardStyle,
        headerStyle,
        layoutStyle,
        prototypeTemplate
      };

      const result = await refineUI(input, currentState);

      if (result.success && result.updates) {
        if (result.updates.showSpendingInsights !== undefined) ctxSetShowSpendingInsights(result.updates.showSpendingInsights);
        if (result.updates.showRecentTransactions !== undefined) setShowRecentTransactions(result.updates.showRecentTransactions);
        if (result.updates.showBalanceCard !== undefined) setShowBalanceCard(result.updates.showBalanceCard);
        if (result.updates.showQuickActions !== undefined) setShowQuickActions(result.updates.showQuickActions);
        if (result.updates.showBottomNav !== undefined) setShowBottomNav(result.updates.showBottomNav);
        if (result.updates.greetingText !== undefined) setGreetingText(result.updates.greetingText);
        if (result.updates.balanceLabel !== undefined) setBalanceLabel(result.updates.balanceLabel);
        if (result.updates.themeColor !== undefined) setThemeColor(result.updates.themeColor);
        if (result.updates.accentColor !== undefined) setAccentColor(result.updates.accentColor);
        if (result.updates.fontFamily !== undefined) setFontFamily(result.updates.fontFamily);
        if (result.updates.borderRadius !== undefined) setBorderRadius(result.updates.borderRadius);
        if (result.updates.cardStyle !== undefined) setCardStyle(result.updates.cardStyle);
        if (result.updates.headerStyle !== undefined) setHeaderStyle(result.updates.headerStyle);
        if (result.updates.layoutStyle !== undefined) setLayoutStyle(result.updates.layoutStyle);
        if (result.updates.prototypeTemplate !== undefined) setPrototypeTemplate(result.updates.prototypeTemplate);
      }

      setMessages(prev => [...prev, { role: 'model', text: result.message }]);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to my AI brain right now." }]);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-composer-light">
      <Sidebar activeItem="Workspace" onTabChange={onTabChange} />
      
      {/* Collapsed Chat Panel */}
      <div className={`${isChatExpanded ? 'w-80' : 'w-64'} bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Vision Chat</span>
          </div>
          {isChatExpanded && (
            <button onClick={() => setIsChatExpanded(false)} className="text-gray-400 hover:text-gray-600 text-xs font-medium">
              Close
            </button>
          )}
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-xl p-3 text-sm max-w-[90%] ${
                msg.role === 'user' 
                  ? 'bg-gray-900 text-white rounded-tr-sm' 
                  : 'bg-gray-50 text-gray-700 border border-gray-100 rounded-tl-sm'
              }`}>
                {msg.role === 'model' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold" style={{ fontSize: '9px' }}>
                      MX
                    </div>
                    <span className="font-medium text-gray-900">System</span>
                  </div>
                )}
                <div className="leading-relaxed">{msg.text}</div>
              </div>
            </div>
          ))}
          {isRefining && (
            <div className="flex flex-col items-start">
              <div className="bg-gray-50 text-gray-700 border border-gray-100 rounded-xl rounded-tl-sm p-3 text-sm max-w-[90%]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold" style={{ fontSize: '9px' }}>
                    MX
                  </div>
                  <span className="font-medium text-gray-900">System</span>
                </div>
                <div className="flex items-center gap-1.5 h-5">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t border-gray-100">
          {isChatExpanded ? (
            <div className="relative">
              <textarea 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleRefine();
                  }
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 resize-none"
                rows={2}
                placeholder="Type your refinement..."
                autoFocus
                disabled={isRefining}
              />
              <button 
                onClick={handleRefine}
                disabled={isRefining || !chatInput.trim()}
                className="absolute bottom-2 right-2 p-1.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 transition-colors text-white rounded-lg"
              >
                <Send size={14} />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsChatExpanded(true)} className="w-full py-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 rounded-lg text-sm font-medium">
              Refine in chat...
            </button>
          )}
        </div>
      </div>

      {/* Center Panel - Phone Preview */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Top Controls */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 z-20">
          <div className="flex items-center gap-1 border-r border-gray-200 pr-4">
            <button onClick={() => setDevice('mobile')} className={`p-1.5 rounded-md transition-colors ${device === 'mobile' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              <Smartphone size={18} />
            </button>
            <button onClick={() => setDevice('web')} className={`p-1.5 rounded-md transition-colors ${device === 'web' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              <Monitor size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50 transition-colors">
              <ZoomOut size={18} />
            </button>
            <span className="text-xs font-medium text-gray-600 w-9 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50 transition-colors">
              <ZoomIn size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 w-full h-full flex items-center justify-center overflow-auto pt-16 pb-20">
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}>
            <FrameComponent>
              <div className={`h-full ${device === 'web' ? 'max-w-3xl mx-auto w-full relative' : ''}`}>
                <AnimatePresence mode="wait">
                  {!isDetail ? (
                    <motion.div 
                      key="home"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full flex flex-col"
                    >
                {/* App Header */}
                <div className="px-6 pt-4 pb-2 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 font-medium">{greetingText}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {logoUrl && (
                        <img src={logoUrl} alt="Institution Logo" className="h-5 object-contain" />
                      )}
                      <div className="font-bold text-lg tracking-tight" style={{ color: themeColor }}>
                        {institutionName || 'Cascade'}
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium shrink-0 ml-4">
                    JM
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-24">
                  {activeTab === 'home' ? (
                    <>
                      {prototypeTemplate === 'standard' && (
                        <>
                          {/* Balance Card */}
                          {showBalanceCard && (
                            <div className="rounded-3xl p-6 text-white mt-4 shadow-lg" style={{ backgroundColor: themeColor, boxShadow: `0 10px 15px -3px ${themeColor}40` }}>
                              <div className="text-white/80 text-sm font-medium mb-1">{balanceLabel}</div>
                              <div className="text-4xl font-semibold tracking-tight mb-3">
                                {isConnected ? '$26,852.18' : '$18,432.18'}
                              </div>
                              <div className="text-white/70 text-xs">
                                {isConnected ? 'Across 6 accounts, including 4 linked' : 'Across 4 accounts, including 2 linked'}
                              </div>
                            </div>
                          )}

                          {/* Quick Actions */}
                          {showQuickActions && (
                            <div className="flex justify-between mt-6 px-2">
                              <div className="flex flex-col items-center gap-2">
                                <button onClick={handleOpenConnect} className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer" style={{ color: themeColor }}>
                                  <Plus size={20} />
                                </button>
                                <span className="text-[10px] font-medium text-gray-600 text-center leading-tight whitespace-pre-line">
                                  {'Link\nAccount'}
                                </span>
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                  <PieChart size={20} />
                                </div>
                                <span className="text-[10px] font-medium text-gray-600 text-center leading-tight whitespace-pre-line">
                                  {'Insights'}
                                </span>
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                  <Target size={20} />
                                </div>
                                <span className="text-[10px] font-medium text-gray-600 text-center leading-tight whitespace-pre-line">
                                  {'Goals'}
                                </span>
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                  <ArrowRightLeft size={20} />
                                </div>
                                <span className="text-[10px] font-medium text-gray-600 text-center leading-tight whitespace-pre-line">
                                  {'Transfer'}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Spending Insights Widget */}
                          {showSpendingInsights && (
                            <div className="mt-8">
                              <h3 className="text-sm font-semibold text-gray-900 mb-3">Spending Insights</h3>
                              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ minWidth: '320px', height: '200px' }}>
                                <iframe 
                                  src={spendingWidgetUrl} 
                                  width="100%" 
                                  height="100%" 
                                  style={{ border: 'none' }}
                                  title="MX Spending Widget"
                                />
                              </div>
                            </div>
                          )}

                          {/* Recent Transactions */}
                          {showRecentTransactions && (
                            <div className="mt-8">
                              <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Transactions</h3>
                              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <button 
                                  onClick={() => onNavigate('6a')}
                                  className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors text-left"
                                >
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">Direct Deposit</div>
                                    <div className="text-xs text-gray-500 mt-0.5">Today</div>
                                  </div>
                                  <div className="text-sm font-semibold text-green-600">+$3,240.00</div>
                                </button>
                                <div className="w-full flex items-center justify-between p-4 border-b border-gray-50 text-left">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">Trader Joe's</div>
                                    <div className="text-xs text-gray-500 mt-0.5">Yesterday</div>
                                  </div>
                                  <div className="text-sm font-medium text-gray-900">-$67.89</div>
                                </div>
                                <div className="w-full flex items-center justify-between p-4 text-left">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">Spotify</div>
                                    <div className="text-xs text-gray-500 mt-0.5">Apr 6</div>
                                  </div>
                                  <div className="text-sm font-medium text-gray-900">-$11.99</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {prototypeTemplate === 'loan-origination' && (
                        <div className="mt-4 space-y-6">
                          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Your Application Status</h3>
                            <p className="text-sm text-gray-500 mb-4">Auto Loan - 2024 Honda Civic</p>
                            
                            <div className="relative pt-1">
                              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-100">
                                <div style={{ width: "60%", backgroundColor: themeColor }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"></div>
                              </div>
                              <div className="flex justify-between text-xs font-medium text-gray-500">
                                <span className="text-gray-900">Pre-approved</span>
                                <span>Underwriting</span>
                                <span>Closing</span>
                              </div>
                            </div>
                            
                            <button className="w-full mt-6 py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90 shadow-sm" style={{ backgroundColor: themeColor }}>
                              Continue Application
                            </button>
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Pre-approved Offers</h3>
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-100">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                  <Target size={20} />
                                </div>
                                <span className="font-semibold text-indigo-900">Personal Loan</span>
                              </div>
                              <p className="text-sm text-indigo-700/80 mb-4">You're pre-approved for up to $15,000 to consolidate debt.</p>
                              <div className="text-2xl font-bold text-indigo-900 mb-4">6.99% <span className="text-sm font-medium text-indigo-700/60">APR</span></div>
                              <button className="text-sm font-semibold bg-white text-indigo-600 px-4 py-2 rounded-lg shadow-sm w-full">View Offer</button>
                            </div>
                          </div>
                        </div>
                      )}

                      {prototypeTemplate === 'account-opening' && (
                        <div className="mt-4 space-y-6">
                          <div className="rounded-3xl p-6 text-white shadow-lg relative overflow-hidden" style={{ backgroundColor: themeColor }}>
                            <div className="relative z-10">
                              <h2 className="text-2xl font-bold mb-2">Welcome to {institutionName}!</h2>
                              <p className="text-white/80 text-sm mb-6 max-w-[200px]">Let's get your new checking account set up in 3 easy steps.</p>
                              <button className="bg-white text-gray-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm">
                                Start Setup
                              </button>
                            </div>
                            <div className="absolute right-0 bottom-0 opacity-10">
                              <PieChart size={160} className="-mr-8 -mb-8" />
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Onboarding Checklist</h3>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                              <div className="flex items-center gap-4 p-4 border-b border-gray-50">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-100 text-green-600 shrink-0">
                                  <Check size={14} strokeWidth={3} />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">Verify Identity</div>
                                  <div className="text-xs text-gray-500">Completed</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 p-4 border-b border-gray-50 bg-gray-50/50">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 border-gray-300" style={{ borderColor: themeColor }}>
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">Fund Account</div>
                                  <div className="text-xs text-gray-500">Transfer from an external account</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 p-4 opacity-50">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-gray-200 shrink-0">
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">Setup Direct Deposit</div>
                                  <div className="text-xs text-gray-500">Get paid up to 2 days early</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {prototypeTemplate === 'financial-wellness' && (
                        <div className="mt-4 space-y-6">
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-3xl p-6">
                            <div className="flex items-center gap-2 mb-4 text-green-800">
                              <Target size={20} />
                              <span className="font-bold">Financial Health Score</span>
                            </div>
                            <div className="flex items-end gap-3 mb-2">
                              <span className="text-5xl font-black tracking-tight text-green-900">84</span>
                              <span className="text-sm font-medium text-green-700/80 mb-1">/ 100</span>
                            </div>
                            <p className="text-sm text-green-800/80">You're doing great! Your credit utilization has dropped by 12% this month.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Savings Goal: House Downpayment</h3>
                            <div className="flex justify-between text-sm font-medium mb-2">
                              <span className="text-gray-900">$12,000</span>
                              <span className="text-gray-400">Target: $40,000</span>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-100">
                              <div style={{ width: "30%", backgroundColor: themeColor }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"></div>
                            </div>
                            <p className="text-xs text-gray-500">Estimated completion: Oct 2027</p>
                          </div>

                          {showSpendingInsights && (
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 mb-3">Where your money went</h3>
                              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ minWidth: '320px', height: '200px' }}>
                                <iframe 
                                  src={spendingWidgetUrl} 
                                  width="100%" 
                                  height="100%" 
                                  style={{ border: 'none' }}
                                  title="MX Spending Widget"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : activeTab === 'insights' ? (
                    <div className="py-4">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Financial Insights</h2>
                      {insightsLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="animate-spin mb-4" size={32} style={{ color: themeColor }} />
                          <p className="text-gray-500 font-medium">Analyzing your finances...</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {insightsData.map(insight => (
                            <div key={insight.guid} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
                              <h3 className="text-base font-semibold text-gray-900 mb-2">{insight.title}</h3>
                              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{insight.description}</p>
                              <button className="self-start text-xs font-bold uppercase tracking-wider transition-colors opacity-90 hover:opacity-100" style={{ color: themeColor }}>
                                {insight.micro_call_to_action}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                      <p>Coming soon</p>
                    </div>
                  )}
                </div>

                {/* Bottom Tab Bar */}
                {showBottomNav && (
                  <div className="absolute bottom-0 inset-x-0 h-20 bg-white border-t border-gray-100 flex items-center justify-around px-6 pb-4">
                    <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? '' : 'text-gray-400 hover:text-gray-600'}`} style={{ color: activeTab === 'home' ? themeColor : undefined }}>
                      <Home size={24} />
                      <span className="text-[10px] font-medium">Home</span>
                    </button>
                    <button onClick={() => setActiveTab('insights')} className={`flex flex-col items-center gap-1 ${activeTab === 'insights' ? '' : 'text-gray-400 hover:text-gray-600'}`} style={{ color: activeTab === 'insights' ? themeColor : undefined }}>
                      <PieChart size={24} />
                      <span className="text-[10px] font-medium">Insights</span>
                    </button>
                    <button onClick={() => setActiveTab('goals')} className={`flex flex-col items-center gap-1 ${activeTab === 'goals' ? '' : 'text-gray-400 hover:text-gray-600'}`} style={{ color: activeTab === 'goals' ? themeColor : undefined }}>
                      <Target size={24} />
                      <span className="text-[10px] font-medium">Goals</span>
                    </button>
                    <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? '' : 'text-gray-400 hover:text-gray-600'}`} style={{ color: activeTab === 'profile' ? themeColor : undefined }}>
                      <User size={24} />
                      <span className="text-[10px] font-medium">Profile</span>
                    </button>
                  </div>
                )}

                {/* Connect Modal Overlay */}
                <AnimatePresence>
                  {connectStep > 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 sm:p-4"
                    >
                      <motion.div 
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="bg-white w-full sm:max-w-md overflow-hidden flex flex-col relative rounded-t-2xl sm:rounded-2xl shadow-xl"
                        style={{ height: '90%', minHeight: '550px', minWidth: '320px' }}
                      >
                        {connectStep !== 5 && (
                          <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <div className="font-bold text-gray-900 text-lg tracking-tight">MX</div>
                            <button onClick={() => setConnectStep(0)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50">
                              <X size={20} />
                            </button>
                          </div>
                        )}

                        <div className="flex-1 overflow-y-auto p-6">
                          {connectStep === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                              <h2 className="text-xl font-bold text-gray-900 mb-1">Connect an account</h2>
                              <p className="text-sm text-gray-500 mb-6">Search for your bank or credit union</p>
                              
                              <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                  type="text" 
                                  placeholder="Search institutions" 
                                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                                />
                              </div>

                              <div className="space-y-2">
                                <button onClick={() => setConnectStep(2)} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left border border-transparent hover:border-gray-100">
                                  <div className="w-10 h-10 rounded-full border border-gray-100 bg-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden p-1">
                                    <img src="https://www.google.com/s2/favicons?domain=chase.com&sz=128" alt="Chase Bank" className="w-full h-full object-contain rounded-full" referrerPolicy="no-referrer" />
                                  </div>
                                  <span className="font-medium text-gray-900">Chase Bank</span>
                                </button>
                                <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left border border-transparent hover:border-gray-100">
                                  <div className="w-10 h-10 rounded-full border border-gray-100 bg-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden p-1">
                                    <img src="https://www.google.com/s2/favicons?domain=schwab.com&sz=128" alt="Charles Schwab" className="w-full h-full object-contain rounded-full" referrerPolicy="no-referrer" />
                                  </div>
                                  <span className="font-medium text-gray-900">Charles Schwab</span>
                                </button>
                                <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left border border-transparent hover:border-gray-100">
                                  <div className="w-10 h-10 rounded-full border border-gray-100 bg-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden p-1">
                                    <img src="https://www.google.com/s2/favicons?domain=chime.com&sz=128" alt="Chime" className="w-full h-full object-contain rounded-full" referrerPolicy="no-referrer" />
                                  </div>
                                  <span className="font-medium text-gray-900">Chime</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {connectStep === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                              <div className="w-12 h-12 rounded-full border border-gray-100 bg-white shadow-sm flex items-center justify-center mb-4 overflow-hidden p-1.5">
                                <img src="https://www.google.com/s2/favicons?domain=chase.com&sz=128" alt="Chase Bank" className="w-full h-full object-contain rounded-full" referrerPolicy="no-referrer" />
                              </div>
                              <h2 className="text-xl font-bold text-gray-900 mb-1">Chase Bank</h2>
                              <p className="text-sm text-gray-500 mb-8">Sign in with your Chase username and password</p>
                              
                              <div className="space-y-4 mb-8">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
                                  <input type="text" value="jen.marcus" readOnly className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900" />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                                  <input type="password" value="••••••••" readOnly className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900" />
                                </div>
                              </div>

                              <button onClick={() => setConnectStep(3)} className="w-full py-3 rounded-xl text-white font-medium mb-4 transition-colors" style={{ backgroundColor: '#2d5f3f' }}>
                                Sign in
                              </button>
                              
                              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                <Lock size={12} />
                                <span>256-bit encryption. MX never stores your credentials.</span>
                              </div>
                            </div>
                          )}

                          {connectStep === 3 && (
                            <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-300">
                              <Loader2 className="animate-spin text-gray-900 mb-6" size={40} />
                              <h2 className="text-xl font-bold text-gray-900 mb-8">Connecting to Chase...</h2>
                              
                              <div className="w-full max-w-xs space-y-4">
                                <div className="flex items-center gap-3">
                                  {syncStep >= 1 ? <CheckCircle2 className="text-green-500" size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-gray-200" />}
                                  <span className={`text-sm font-medium ${syncStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Credentials verified</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  {syncStep >= 2 ? <CheckCircle2 className="text-green-500" size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-gray-200" />}
                                  <span className={`text-sm font-medium ${syncStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Accounts located</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  {syncStep >= 3 ? <CheckCircle2 className="text-green-500" size={20} /> : syncStep === 2 ? <Loader2 className="animate-spin text-gray-400" size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-gray-200" />}
                                  <span className={`text-sm font-medium ${syncStep >= 3 ? 'text-gray-900' : syncStep === 2 ? 'text-gray-600' : 'text-gray-400'}`}>Syncing transactions</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {connectStep === 4 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col items-center text-center pt-4">
                              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                                <CheckCircle2 size={32} />
                              </div>
                              <h2 className="text-2xl font-bold text-gray-900 mb-1">Connected!</h2>
                              <p className="text-sm text-gray-500 mb-8">We found 2 Chase accounts:</p>
                              
                              <div className="w-full space-y-3 mb-8">
                                <div className="p-4 rounded-xl border border-gray-200 flex items-center justify-between bg-gray-50">
                                  <div className="text-left">
                                    <div className="font-medium text-gray-900 text-sm">Chase Checking</div>
                                    <div className="text-xs text-gray-500">••4892</div>
                                  </div>
                                  <div className="font-semibold text-gray-900">$6,240.00</div>
                                </div>
                                <div className="p-4 rounded-xl border border-gray-200 flex items-center justify-between bg-gray-50">
                                  <div className="text-left">
                                    <div className="font-medium text-gray-900 text-sm">Chase Savings</div>
                                    <div className="text-xs text-gray-500">••1103</div>
                                  </div>
                                  <div className="font-semibold text-gray-900">$2,180.00</div>
                                </div>
                              </div>

                              <button onClick={() => setConnectStep(5)} className="w-full py-3 rounded-xl text-white font-medium mb-4 transition-colors" style={{ backgroundColor: '#2d5f3f' }}>
                                Add accounts
                              </button>
                              <p className="text-xs text-gray-500">Don't see an account?</p>
                            </div>
                          )}

                          {connectStep === 5 && (
                            <div className="h-full flex flex-col items-center justify-center animate-in zoom-in duration-300">
                              <div className="w-24 h-24 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-6">
                                <CheckCircle2 size={48} />
                              </div>
                              <h2 className="text-2xl font-bold text-gray-900 mb-2">Chase Bank connected</h2>
                              <p className="text-gray-500">2 accounts added</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full flex flex-col bg-gray-50"
              >
                {/* Header */}
                <div className="px-4 pt-4 pb-2 flex items-center relative">
                  <button onClick={() => onNavigate('6')} className="p-2 text-gray-900 absolute left-4 z-10 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
                    <ChevronLeft size={24} />
                  </button>
                  <div className="flex-1 text-center font-semibold text-gray-900 text-sm">
                    Transaction Detail
                  </div>
                </div>

                <div className="flex-1 px-6 pt-8">
                  <div className="text-center mb-8">
                    <div className="text-4xl font-semibold text-green-600 tracking-tight mb-2">+$3,240.00</div>
                    <div className="text-gray-900 font-medium">Direct Deposit · Pacific Health Systems</div>
                    <div className="text-gray-500 text-sm mt-1">April 9, 2026</div>
                  </div>

                  <div className="flex justify-center mb-8">
                    <div className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase" style={{ color: themeColor, backgroundColor: `${themeColor}1A` }}>
                      Income · Payroll
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
                    <div className="text-xs text-gray-500 mb-1">Account</div>
                    <div className="text-sm font-medium text-gray-900">Cascade Checking · ••4421</div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="text-sm font-semibold text-gray-900 mb-4">Auto-saved to your goals</div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ color: accentColor, backgroundColor: `${accentColor}33` }}>
                            <Target size={16} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">Emergency Fund</div>
                            <div className="text-xs text-gray-500">10% allocation</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-green-600">+$324</span>
                          <CheckCircle2 size={16} className="text-green-600" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ color: accentColor, backgroundColor: `${accentColor}33` }}>
                            <Target size={16} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">Vacation Fund</div>
                            <div className="text-xs text-gray-500">5% allocation</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-green-600">+$162</span>
                          <CheckCircle2 size={16} className="text-green-600" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-50 text-center">
                      <button className="text-sm font-medium" style={{ color: themeColor }}>
                        Manage auto-save rules
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FrameComponent>
    </div>
  </div>

  {/* Bottom Actions */}
  <div className="absolute bottom-8 flex gap-4 z-20">
    <button onClick={() => setIsChatExpanded(true)} className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
      Refine in chat
    </button>
    <button onClick={() => onTabChange('documentation')} className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-800 transition-colors">
      Submit for SA review
    </button>
  </div>
</main>

      <RightPanel journeyState="complete" />
    </div>
  );
}
