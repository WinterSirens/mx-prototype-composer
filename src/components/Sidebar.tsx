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
    <div className="w-64 bg-[#1a1d24] text-gray-400 flex flex-col h-screen shrink-0">
      <div className="p-6">
        <div className="font-bold text-white text-lg tracking-tight">
          MX Composer
        </div>
      </div>
      
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.name === activeItem;
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => onTabChange && onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-medium">
            JM
          </div>
          <div className="text-sm">
            <div className="text-white font-medium">Jen Marcus</div>
            <div className="text-gray-500 text-xs">Cascade CU</div>
          </div>
        </div>
      </div>
    </div>
  );
}
