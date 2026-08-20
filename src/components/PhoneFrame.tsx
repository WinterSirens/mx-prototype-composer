import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function PhoneFrame({ children }: Props) {
  return (
    <div className="relative w-[390px] h-[844px] bg-white rounded-[44px] shadow-2xl overflow-hidden border-[8px] border-gray-900 shrink-0">
      {/* Notch */}
      <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
        <div className="w-[120px] h-full bg-gray-900 rounded-b-3xl"></div>
      </div>
      
      {/* Status Bar */}
      <div className="absolute top-0 inset-x-0 h-12 flex items-center justify-between px-6 z-40 text-black font-medium text-sm pt-2">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          {/* Signal */}
          <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
            <path d="M1 12h2V8H1v4zm4 0h2V6H5v6zm4 0h2V4H9v8zm4 0h2V0h-2v12z" />
          </svg>
          {/* Wifi */}
          <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
            <path d="M8 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-3.5-2.5a5 5 0 017 0l1-1a6.5 6.5 0 00-9 0l1 1zm-3-3a9 9 0 0113 0l1-1a10.5 10.5 0 00-15 0l1 1z" />
          </svg>
          {/* Battery */}
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="1" width="20" height="10" rx="2" />
            <path d="M23 4v4" />
            <rect x="2" y="2" width="18" height="8" rx="1" fill="currentColor" stroke="none" />
          </svg>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full h-full pt-12 pb-8 overflow-y-auto bg-gray-50">
        {children}
      </div>
    </div>
  );
}
