import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ArrowRight, ArrowLeft, Wand2, Check } from 'lucide-react';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import { buildUIConfiguration } from '../lib/anthropic';
import { useUI } from '../UIContext';

interface Props {
  onNext: () => void;
  onTabChange: (tab: string) => void;
}

const STRATEGIC_NEEDS = [
  "Identify and prioritize growth opportunities",
  "Drive Customer Conversion",
  "Deepen engagement & relationships",
  "Orchestrate Personalized growth journeys",
  "Reduce Friction and risk in growth flows"
];

const USE_CASES = [
  { title: "Opportunity identification", subtitle: "(consumer need to product matching)" },
  { title: "Digital consumer financial wellness", subtitle: "" },
  { title: "Personalized offers/targeting/marketing", subtitle: "" },
  { title: "Deposit account opening", subtitle: "Mortgage, HELOC, Auto, Card" },
  { title: "Loan origination", subtitle: "" },
  { title: "Account activation", subtitle: "Deposit account activation\nCard activation\nWealth Account Activation" }
];

const OUTCOMES = [
  "Grow Deposits",
  "Grow Loans",
  "Grow Cards",
  "Financial Wellness",
  "Reduce Costs"
];

const NEED_TO_USE_CASES: Record<string, string[]> = {
  "Identify and prioritize growth opportunities": ["Opportunity identification", "Personalized offers/targeting/marketing"],
  "Drive Customer Conversion": ["Digital consumer financial wellness", "Deposit account opening", "Loan origination"],
  "Deepen engagement & relationships": ["Opportunity identification", "Personalized offers/targeting/marketing", "Account activation"],
  "Orchestrate Personalized growth journeys": ["Digital consumer financial wellness", "Deposit account opening", "Account activation"],
  "Reduce Friction and risk in growth flows": ["Deposit account opening", "Loan origination", "Account activation"]
};

const USE_CASE_TO_OUTCOMES: Record<string, string[]> = {
  "Opportunity identification": ["Grow Deposits", "Grow Loans", "Financial Wellness"],
  "Digital consumer financial wellness": ["Grow Deposits", "Grow Loans", "Financial Wellness"],
  "Personalized offers/targeting/marketing": ["Grow Deposits", "Grow Loans", "Grow Cards", "Financial Wellness"],
  "Deposit account opening": ["Grow Deposits", "Grow Loans", "Grow Cards", "Reduce Costs"],
  "Loan origination": ["Grow Loans", "Reduce Costs"],
  "Account activation": ["Grow Deposits", "Financial Wellness", "Reduce Costs"]
};

export default function Screen3({ onNext, onTabChange }: Props) {
  const {
    setShowSpendingInsights,
    setShowRecentTransactions,
    setShowBalanceCard,
    setShowQuickActions,
    setShowBottomNav,
    setGreetingText,
    setBalanceLabel,
    setThemeColor,
    setPrototypeTemplate
  } = useUI();

  const [step, setStep] = useState(1);
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectNeed = (need: string) => {
    setSelectedNeed(need);
    setSelectedUseCase(null);
    setSelectedOutcome(null);
  };

  const handleSelectUseCase = (useCase: string) => {
    setSelectedUseCase(useCase);
    setSelectedOutcome(null);
  };

  const handleBuild = async () => {
    if (!selectedNeed || !selectedUseCase || !selectedOutcome) {
      setError("Please select one option from each category.");
      return;
    }

    setIsBuilding(true);
    setError(null);

    const uc = USE_CASES.find(u => u.title === selectedUseCase);
    const useCaseText = uc?.subtitle ? `${selectedUseCase} (${uc.subtitle.replace(/\n/g, ', ')})` : selectedUseCase;

    const prompt = `I want to build a financial app prototype.
Strategic Need: ${selectedNeed}.
Use Case: ${useCaseText}.
Desired Outcome: ${selectedOutcome}.
Please configure the UI appropriately based on these goals.`;

    const history = [
      { role: 'user' as const, parts: [{ text: prompt }] }
    ];

    try {
      const config = await buildUIConfiguration(history);
      
      if (config) {
        if (config.showSpendingInsights !== undefined) setShowSpendingInsights(config.showSpendingInsights);
        if (config.showRecentTransactions !== undefined) setShowRecentTransactions(config.showRecentTransactions);
        if (config.showBalanceCard !== undefined) setShowBalanceCard(config.showBalanceCard);
        if (config.showQuickActions !== undefined) setShowQuickActions(config.showQuickActions);
        if (config.showBottomNav !== undefined) setShowBottomNav(config.showBottomNav);
        if (config.greetingText !== undefined) setGreetingText(config.greetingText);
        if (config.balanceLabel !== undefined) setBalanceLabel(config.balanceLabel);
        if (config.themeColor !== undefined) setThemeColor(config.themeColor);
        if (config.prototypeTemplate !== undefined) setPrototypeTemplate(config.prototypeTemplate);
      }

      onNext();
    } catch (err: any) {
      console.error("Gemini API Error during build:", err);
      // Fallback: just proceed to the next screen if it fails
      onNext();
    } finally {
      setIsBuilding(false);
    }
  };

  const currentSelectionEmpty = 
    (step === 1 && !selectedNeed) ||
    (step === 2 && !selectedUseCase) ||
    (step === 3 && !selectedOutcome);

  const availableUseCases = USE_CASES.filter(u => selectedNeed && NEED_TO_USE_CASES[selectedNeed]?.includes(u.title));
  const availableOutcomes = OUTCOMES.filter(o => selectedUseCase && USE_CASE_TO_OUTCOMES[selectedUseCase]?.includes(o));

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen w-full lg:overflow-hidden bg-composer-light">
      <Sidebar activeItem="Workspace" onTabChange={onTabChange} />
      
      <div className="flex-1 min-h-0 flex flex-col xl:flex-row">
      <main className="flex-1 min-h-0 flex flex-col relative overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full pt-8 sm:pt-16 px-4 sm:px-8 pb-16 sm:pb-32">
          
          <div className="mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">Define Your Strategy</h1>
            <p className="text-gray-600 text-base sm:text-lg">Select your strategic needs, use cases, and desired outcomes to generate a customized prototype.</p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3 mb-8 sm:mb-12">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-2 flex-1 rounded-full transition-colors duration-300 ${s <= step ? 'bg-[#2d5f3f]' : 'bg-gray-200'}`} />
            ))}
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 w-fit">Strategic Needs</h2>
                  <p className="text-gray-500 mt-1">What are the primary business goals for this experience?</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {STRATEGIC_NEEDS.map(item => {
                    const isSelected = selectedNeed === item;
                    return (
                      <button 
                        key={item} 
                        onClick={() => handleSelectNeed(item)} 
                        className={`p-6 text-left rounded-2xl border-2 transition-all ${isSelected ? 'border-[#2d5f3f] bg-white shadow-lg ring-1 ring-[#2d5f3f]/20' : 'border-gray-200 bg-white shadow-sm hover:border-gray-300 hover:shadow-md'}`}
                      >
                        <div className="flex justify-between items-center sm:items-start">
                          <span className="font-semibold text-gray-900 text-lg">{item}</span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-4 transition-colors ${isSelected ? 'bg-[#2d5f3f] text-white' : 'border-2 border-gray-300'}`}>
                            {isSelected && <Check size={14} strokeWidth={3} />}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500 w-fit">Use Cases</h2>
                  <p className="text-gray-500 mt-1">Which features will best support your strategic needs?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableUseCases.map(item => {
                    const isSelected = selectedUseCase === item.title;
                    return (
                      <button 
                        key={item.title} 
                        onClick={() => handleSelectUseCase(item.title)} 
                        className={`p-6 text-left rounded-2xl border-2 transition-all h-full ${isSelected ? 'border-[#2d5f3f] bg-white shadow-lg ring-1 ring-[#2d5f3f]/20' : 'border-gray-200 bg-white shadow-sm hover:border-gray-300 hover:shadow-md'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-semibold text-gray-900 text-lg block mb-1">{item.title}</span>
                            {item.subtitle && (
                              <span className="text-sm text-gray-500 whitespace-pre-line">{item.subtitle}</span>
                            )}
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-4 transition-colors ${isSelected ? 'bg-[#2d5f3f] text-white' : 'border-2 border-gray-300'}`}>
                            {isSelected && <Check size={14} strokeWidth={3} />}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-600 w-fit">Outcomes</h2>
                  <p className="text-gray-500 mt-1">What are the measurable results you expect to achieve?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableOutcomes.map(item => {
                    const isSelected = selectedOutcome === item;
                    return (
                      <button 
                        key={item} 
                        onClick={() => setSelectedOutcome(item)} 
                        className={`p-6 text-left rounded-2xl border-2 transition-all ${isSelected ? 'border-[#2d5f3f] bg-white shadow-lg ring-1 ring-[#2d5f3f]/20' : 'border-gray-200 bg-white shadow-sm hover:border-gray-300 hover:shadow-md'}`}
                      >
                        <div className="flex justify-between items-center sm:items-start">
                          <span className="font-semibold text-gray-900 text-lg">{item}</span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-4 transition-colors ${isSelected ? 'bg-[#2d5f3f] text-white' : 'border-2 border-gray-300'}`}>
                            {isSelected && <Check size={14} strokeWidth={3} />}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200">
            {step > 1 ? (
              <button 
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isBuilding}
              >
                <ArrowLeft size={18} />
                Back
              </button>
            ) : <div />}

            <button 
              onClick={() => {
                if (step < 3) setStep(s => s + 1);
                else handleBuild();
              }}
              disabled={currentSelectionEmpty || isBuilding}
              className="flex items-center gap-2 bg-[#2d5f3f] hover:bg-[#234a31] disabled:bg-gray-300 disabled:text-gray-500 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm"
            >
              {step < 3 ? (
                <>Next Step <ArrowRight size={18} /></>
              ) : (
                <>
                  {isBuilding ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                  {isBuilding ? 'Building Prototype...' : 'Build Prototype'}
                </>
              )}
            </button>
          </div>

        </div>
      </main>

      <RightPanel journeyState="pending" />
      </div>
    </div>
  );
}
