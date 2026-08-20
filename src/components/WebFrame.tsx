import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function WebFrame({ children }: Props) {
  return (
    <div className="relative w-[1024px] h-[768px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 shrink-0 flex flex-col">
      {/* Browser Chrome */}
      <div className="h-12 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-4 shrink-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-1/2 h-7 bg-white rounded-md border border-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium shadow-sm">
            cascadecu.com/dashboard
          </div>
        </div>
        <div className="w-12"></div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 relative">
        {children}
      </div>
    </div>
  );
}
