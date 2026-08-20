import React, { ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, UploadCloud, Image as ImageIcon } from 'lucide-react';
import Sidebar from './Sidebar';
import { useUI } from '../UIContext';

interface Props {
  onNext: () => void;
  onTabChange: (tab: string) => void;
}

export default function Screen2({ onNext, onTabChange }: Props) {
  const { institutionName, setInstitutionName, logoUrl, setLogoUrl, themeColor, setThemeColor, accentColor, setAccentColor } = useUI();

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };
  return (
    <div className="flex h-screen w-full overflow-hidden bg-composer-light">
      <Sidebar activeItem="" onTabChange={onTabChange} />
      
      <motion.main 
        className="flex-1 flex items-center justify-center p-8 overflow-y-auto"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
      >
        <div 
          className="bg-white rounded-2xl p-10 w-full max-w-2xl"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tell us about your institution</h2>
            <p className="text-gray-500">These are the only inputs we need from you. We'll handle the rest.</p>
          </div>

          <div className="space-y-6">
            {/* Institution Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution name</label>
              <input 
                type="text" 
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                placeholder="e.g. Cascade Credit Union"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo upload</label>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors group overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {logoUrl ? (
                  <div className="flex flex-col items-center gap-3">
                    <img src={logoUrl} alt="Uploaded logo" className="h-12 object-contain" />
                    <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-700">
                      <UploadCloud size={16} />
                      <span>Click or drag to replace</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mb-1">
                      <ImageIcon size={24} />
                    </div>
                    <div className="font-semibold text-lg tracking-tight text-gray-900">
                      Upload your logo
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-700">
                      <UploadCloud size={16} />
                      <span>SVG, PNG, or JPG</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Brand Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand colors</label>
              <div className="flex gap-6">
                <div className="flex flex-col gap-2">
                  <div className="relative w-16 h-16 rounded-xl shadow-inner border border-gray-100 overflow-hidden">
                    <input 
                      type="color" 
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="absolute inset-[-10px] w-24 h-24 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-900">Primary</div>
                    <input 
                      type="text" 
                      value={themeColor.toUpperCase()}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="text-xs text-gray-500 uppercase w-16 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-gray-900 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="relative w-16 h-16 rounded-xl shadow-inner border border-gray-100 overflow-hidden">
                    <input 
                      type="color" 
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="absolute inset-[-10px] w-24 h-24 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-900">Accent</div>
                    <input 
                      type="text" 
                      value={accentColor.toUpperCase()}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="text-xs text-gray-500 uppercase w-16 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-gray-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Font Preference */}
            <div className="pt-2">
              <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                <span>Font preference (optional)</span>
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Actions */}
            <div className="pt-8 flex items-center justify-between border-t border-gray-100 mt-8">
              <button className="text-sm font-medium text-gray-500 hover:text-gray-800">
                Skip and use a generic brand
              </button>
              <button 
                onClick={onNext}
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
