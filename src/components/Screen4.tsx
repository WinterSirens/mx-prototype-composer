import { useState } from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';

interface Props {
  onNext: () => void;
  onTabChange: (tab: string) => void;
}

export default function Screen4({ onNext, onTabChange }: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setTimeout(() => {
      onNext();
    }, 1500);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-composer-light">
      <Sidebar activeItem="Workspace" onTabChange={onTabChange} />
      
      <main className="flex-1 flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-8 pb-32">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Initial System Message */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shrink-0 text-white font-bold text-xs">
                MX
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm text-gray-800 leading-relaxed max-w-2xl">
                Hi Jen. I've got Cascade Credit Union's brand kit loaded. Now tell me about your members. What do you want them to be able to do in your app? Describe it the way you'd describe it to your board, not in technical terms.
              </div>
            </div>

            {/* User Message */}
            <div className="flex gap-4 justify-end">
              <div className="bg-[#2d5f3f] text-white rounded-2xl rounded-tr-none px-5 py-4 shadow-sm leading-relaxed max-w-2xl">
                Our members keep telling us they want to see all their accounts in one place, including the ones they have at other banks. They want to understand where their money is going each month, and start saving toward goals like an emergency fund or a vacation. Right now our app just shows balances and transactions. That's not enough anymore.
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 text-white font-medium text-xs">
                JM
              </div>
            </div>

            {/* System Response */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shrink-0 text-white font-bold text-xs">
                MX
              </div>
              <div className="max-w-2xl">
                <div className="bg-[#f0f2f5] border border-gray-200 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm text-gray-800 leading-relaxed">
                  <p className="mb-3">Got it. Based on what you described, I can assemble this using:</p>
                  <ul className="list-disc pl-5 mb-3 space-y-1">
                    <li>MX Connect for linking external accounts</li>
                    <li>Spending Insights for the monthly category breakdown</li>
                    <li>Savings Goals for emergency fund and vacation goals</li>
                  </ul>
                  <p>One question before I build it: for the savings goals, do you want to start members with pre-set goal templates (Emergency Fund, Vacation, Home Down Payment) or let them create fully custom goals from scratch?</p>
                </div>
                
                {/* Option Chips */}
                {!selectedOption && (
                  <div className="flex gap-3 mt-4 ml-2">
                    <button 
                      onClick={() => handleOptionClick('Pre-set templates')}
                      className="bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-colors"
                    >
                      Pre-set templates
                    </button>
                    <button 
                      onClick={() => handleOptionClick('Fully custom')}
                      className="bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-colors"
                    >
                      Fully custom
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Selected Option as User Message */}
            {selectedOption && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 justify-end"
              >
                <div className="bg-[#2d5f3f] text-white rounded-2xl rounded-tr-none px-5 py-3 shadow-sm">
                  {selectedOption}
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 text-white font-medium text-xs">
                  JM
                </div>
              </motion.div>
            )}

            {/* Final System Message before transition */}
            {selectedOption && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shrink-0 text-white font-bold text-xs">
                  MX
                </div>
                <div className="bg-[#f0f2f5] border border-gray-200 rounded-2xl rounded-tl-none px-5 py-3 shadow-sm text-gray-800">
                  Building your prototype now...
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-composer-light via-composer-light to-transparent">
          <div className="max-w-3xl mx-auto relative">
            <textarea 
              readOnly
              className="w-full bg-white border border-gray-200 rounded-2xl pl-5 pr-14 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 resize-none text-gray-800"
              rows={1}
              placeholder="Type a message..."
            />
            <button 
              disabled
              className="absolute bottom-3 right-4 w-10 h-10 bg-gray-200 text-gray-400 rounded-xl flex items-center justify-center"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </div>
        </div>
      </main>

      <RightPanel journeyState="pending" />
    </div>
  );
}
