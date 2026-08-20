import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useUI } from '../UIContext';

export type JourneyState = 'empty' | 'pending' | 'generating' | 'complete';

interface Props {
  journeyState: JourneyState;
  generatingStep?: number;
}

export default function RightPanel({ journeyState, generatingStep = 0 }: Props) {
  const { institutionName, themeColor, accentColor, prototypeTemplate } = useUI();

  const getJourneyItems = () => {
    switch (prototypeTemplate) {
      case 'loan-origination':
        return [
          {
            title: 'Account Aggregation',
            api: 'MX Connect',
            desc: 'Members link external accounts for verification'
          },
          {
            title: 'Income Verification',
            api: 'Account Owner API',
            desc: 'Verify user identity and income streams'
          },
          {
            title: 'Transaction History',
            api: 'Transactions API',
            desc: 'Underwrite based on aggregated transaction data'
          }
        ];
      case 'account-opening':
        return [
          {
            title: 'Account Verification',
            api: 'MX Connect',
            desc: 'Link external funding accounts instantly'
          },
          {
            title: 'Identity Verification',
            api: 'Account Owner API',
            desc: 'Extract KYC data from linked accounts'
          },
          {
            title: 'Microdeposits',
            api: 'Verification API',
            desc: 'Fallback verification for non-credentialed accounts'
          }
        ];
      case 'financial-wellness':
        return [
          {
            title: 'Account Aggregation',
            api: 'MX Connect',
            desc: 'Members link external accounts via Connect'
          },
          {
            title: 'Spending Insights',
            api: 'Insights API',
            desc: 'Monthly category breakdown and trends'
          },
          {
            title: 'Goals & Advice',
            api: 'PFM API',
            desc: 'Targeted savings goals and actionable insights'
          }
        ];
      case 'standard':
      default:
        return [
          {
            title: 'Account Aggregation',
            api: 'MX Connect',
            desc: 'Members link external accounts via Connect widget'
          },
          {
            title: 'Spending Insights',
            api: 'Insights API',
            desc: 'Monthly category breakdown and trends'
          },
          {
            title: 'Savings Goals',
            api: 'Goals API',
            desc: 'Pre-set templates: Emergency Fund, Vacation, Home Down Payment'
          }
        ];
    }
  };

  const journeyItems = getJourneyItems();

  return (
    <div className="w-full xl:w-80 xl:min-h-0 bg-white border-t xl:border-t-0 xl:border-l border-gray-200 flex flex-col shrink-0 overflow-y-auto">
      {/* Brand Kit Section */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Brand Kit</h3>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="font-semibold text-lg tracking-tight mb-4" style={{ color: themeColor }}>
            {institutionName || 'Cascade Credit Union'}
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md shadow-inner" style={{ backgroundColor: themeColor }}></div>
              <span className="text-xs text-gray-500">Primary</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md shadow-inner" style={{ backgroundColor: accentColor }}></div>
              <span className="text-xs text-gray-500">Accent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Map Section */}
      <div className="p-6 flex-1">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          {journeyState === 'complete' ? `Journey Map · ${journeyItems.length} capabilities` : 'Journey Map'}
        </h3>
        
        {journeyState !== 'complete' && (
          <div className="text-sm text-gray-400 italic bg-gray-50 rounded-xl p-4 border border-gray-100 border-dashed">
            Your journey will appear here automatically when your prototype is deployed.
          </div>
        )}

        {journeyState === 'complete' && (
          <div className="space-y-3">
            {journeyItems.map((item, index) => {
              return (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5 font-mono">{item.api}</div>
                      <div className="text-xs text-gray-600 mt-2 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {journeyState === 'complete' && (
          <div className="mt-8">
            <button className="w-full flex items-center justify-between py-3 border-t border-gray-100 text-sm font-medium text-gray-700 hover:text-gray-900">
              <span>Known Gaps & Assumptions (2)</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
