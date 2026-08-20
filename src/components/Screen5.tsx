import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Loader2, Circle } from 'lucide-react';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';

interface Props {
  onNext: () => void;
  onTabChange: (tab: string) => void;
}

export default function Screen5({ onNext, onTabChange }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // 0ms: Applying is checked off, Generating is checked off, Wiring up is active
    setStep(2); 
    
    const timer1 = setTimeout(() => setStep(3), 800); // 800ms: Wiring up checked off, Building active
    const timer2 = setTimeout(() => setStep(4), 1600); // 1600ms: Building checked off, Configuring active
    const timer3 = setTimeout(() => onNext(), 3000); // 3000ms: Auto-advance

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onNext]);

  const steps = [
    "Applying Cascade Credit Union brand",
    "Generating app shell and navigation",
    "Wiring up MX Connect for account aggregation",
    "Building Spending Insights dashboard",
    "Configuring Savings Goals with templates"
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen w-full lg:overflow-hidden bg-composer-light">
      <Sidebar activeItem="Workspace" onTabChange={onTabChange} />
      
      <div className="flex-1 min-h-0 flex flex-col xl:flex-row">
      <main className="flex-1 min-h-[70vh] xl:min-h-0 flex flex-col relative items-center justify-center p-4 sm:p-8 overflow-y-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center max-w-4xl w-full">
          {/* Phone Frame Outline */}
          <div className="hidden sm:flex w-[320px] h-[240px] lg:h-[680px] border-2 border-dashed border-[#d0d5dd] rounded-[40px] items-center justify-center bg-gray-50/50 shrink-0">
            <Loader2 size={32} className="text-gray-400 animate-spin" />
          </div>

          {/* Checklist */}
          <div className="flex-1 w-full">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">Assembling prototype...</h2>
            <div className="space-y-4 sm:space-y-5">
              {steps.map((text, index) => {
                let status = 'pending';
                if (index < step) status = 'complete';
                if (index === step) status = 'active';

                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 ${status === 'pending' ? 'opacity-40' : 'opacity-100'}`}
                  >
                    <div className="shrink-0">
                      {status === 'complete' && <Check size={20} className="text-green-600" />}
                      {status === 'active' && <Loader2 size={20} className="text-[#2d5f3f] animate-spin" />}
                      {status === 'pending' && <Circle size={20} className="text-gray-300" />}
                    </div>
                    <span className={`text-base sm:text-lg ${status === 'active' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {text}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <motion.div 
            className="h-full bg-[#2d5f3f]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: "linear" }}
          />
        </div>
      </main>

      <RightPanel journeyState="generating" generatingStep={step} />
      </div>
    </div>
  );
}
