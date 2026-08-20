import { LayoutDashboard, LayoutTemplate, Variable, Image as ImageIcon, FileText, Book, LifeBuoy } from 'lucide-react';

interface Props {
  activeItem?: string;
  onTabChange?: (tab: string) => void;
}

export default function Sidebar({ activeItem = 'Workspace', onTabChange }: Props) {
  const navItems = [
    { name: 'Workspace', icon: LayoutDashboard, id: 'workspace' },
    { name: 'Templates', icon: LayoutTemplate, id: 'templates' },
    { name: 'Variables', icon: Variable, id: 'variables' },
    { name: 'Assets', icon: ImageIcon, id: 'assets' },
    { name: 'Logs', icon: FileText, id: 'logs' },
    { name: 'Documentation', icon: Book, id: 'documentation' },
    { name: 'Support', icon: LifeBuoy, id: 'support' },
  ];

  return (
    <div className="w-full lg:w-64 bg-[#1a1d24] text-gray-400 flex flex-col lg:h-screen shrink-0">
      <div className="px-4 pt-4 pb-2 lg:p-6 flex flex-wrap items-center gap-x-3 gap-y-1">
        <div className="font-bold text-white text-lg tracking-tight">
          MX Composer
        </div>
        {/* Persistent reminder that this is a demo, not a shipping MX product */}
        <div className="rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[10px] font-medium px-2 py-0.5">
          Prototype demo · not a real MX product
        </div>
        {/* Attribution — desktop shows this in the sidebar footer instead */}
        <div className="lg:hidden text-[10px] text-gray-500">
          Built by <span className="text-gray-300 font-medium">Mitchell Dyer</span> with AI coding agents
        </div>
      </div>
      
      <nav className="flex lg:flex-col lg:flex-1 gap-1 lg:gap-0 px-3 pb-3 lg:pb-0 lg:space-y-1 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = item.name === activeItem;
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => onTabChange && onTabChange(item.id)}
              className={`shrink-0 lg:w-full flex items-center gap-2 lg:gap-3 px-3 py-2 lg:py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive 
                  ? 'bg-white/10 text-white' 
                  : 'hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
              {item.name}
            </button>
          );
        })}
      </nav>
      
      <div className="hidden lg:block p-4 border-t border-white/10">
        {/* Fictional persona used inside the demo walkthrough */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-medium">
            JM
          </div>
          <div className="text-sm">
            <div className="text-white font-medium">Jen Marcus</div>
            <div className="text-gray-500 text-xs">Cascade CU · demo persona</div>
          </div>
        </div>

        {/* Real-world attribution */}
        <div className="mt-4 pt-3 border-t border-white/10 text-[11px] leading-relaxed text-gray-500">
          Built by <span className="text-gray-300 font-medium">Mitchell Dyer</span>
          <br />
          with AI coding agents
        </div>
      </div>
    </div>
  );
}
