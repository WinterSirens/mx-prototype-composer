import { motion } from 'motion/react';

interface Props {
  onNext: () => void;
}

export default function Screen1({ onNext }: Props) {
  return (
    <motion.div 
      className="min-h-screen w-full flex flex-col relative"
      style={{ background: 'linear-gradient(180deg, #e8f0ff 0%, #ffffff 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <header className="p-6 flex items-center gap-3">
        <div className="font-bold text-xl tracking-tight text-gray-900">
          MX Prototype Composer
        </div>
        <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
          Composer v0.6
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto pb-20">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 mb-6 leading-tight">
          Build your MX-powered experience in minutes.
        </h1>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
          Describe what you want your members to do. We'll assemble a branded, clickable prototype using MX's banking capabilities. You're 80% there before your first call with us.
        </p>
        
        <button 
          onClick={onNext}
          className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors shadow-lg shadow-gray-900/20"
        >
          Start a new prototype
        </button>
        
        <button className="mt-6 text-gray-500 hover:text-gray-800 font-medium transition-colors">
          Or browse example journeys
        </button>
      </main>
    </motion.div>
  );
}
