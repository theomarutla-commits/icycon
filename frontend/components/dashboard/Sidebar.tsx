
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { categories, services } from '../../lib/dashboard-data';

interface SidebarProps {
  currentView: string;
  selectedService: string | null;
  expandedCategory: string | null;
  onCategoryClick: (categoryName: string, hasChildren: boolean) => void;
  onServiceClick: (serviceId: string) => void;
}

const SidebarItem = ({ name, icon: Icon, isActive, onClick, hasChildren, isExpanded }: { name: string, icon: any, isActive: boolean, onClick: () => void, hasChildren?: boolean, isExpanded?: boolean }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
      isActive 
        ? 'bg-gradient-to-r from-icy-main to-icy-secondary text-white shadow-lg shadow-icy-main/25' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10'
    }`}
  >
    {isActive && <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />}
    <div className="flex items-center gap-3 relative z-10">
        <div className={`${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-400 group-hover:text-icy-main'}`}>
          <Icon size={18} />
        </div>
        <span className="font-medium text-sm">{name}</span>
    </div>
    {hasChildren && (
        <div className={`transition-transform duration-300 relative z-10 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown size={14} className={isActive ? 'text-white' : 'text-gray-400'} />
        </div>
    )}
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  selectedService, 
  expandedCategory, 
  onCategoryClick, 
  onServiceClick 
}) => {
  return (
    <div className="lg:w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-1 bg-white/60 dark:bg-white/5 p-4 rounded-3xl border border-white/40 dark:border-white/10 backdrop-blur-2xl shadow-xl dark:shadow-black/20">
        <div className="px-4 py-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          Dashboard
        </div>
        {categories.map((cat) => {
          const catServices = services.filter(s => s.category === cat.name);
          const hasSubs = catServices.length > 0;
          
          // Category is active if it's the current view OR if a child service is selected
          const isCatActive = currentView === cat.name || (selectedService && services.find(s => s.id === selectedService)?.category === cat.name);
          const isExpanded = expandedCategory === cat.name;

          return (
              <div key={cat.name}>
                  <SidebarItem 
                      name={cat.name} 
                      icon={cat.icon} 
                      isActive={!!isCatActive}
                      hasChildren={hasSubs}
                      isExpanded={isExpanded}
                      onClick={() => onCategoryClick(cat.name, hasSubs)}
                  />
                  <AnimatePresence>
                      {isExpanded && hasSubs && (
                          <motion.div 
                              {...({
                                  initial: { height: 0, opacity: 0 },
                                  animate: { height: 'auto', opacity: 1 },
                                  exit: { height: 0, opacity: 0 }
                              } as any)}
                              className="overflow-hidden ml-4 border-l border-gray-200 dark:border-white/10 pl-2 mt-1 space-y-1"
                          >
                              {catServices.map(sub => (
                                  <button
                                      key={sub.id}
                                      onClick={() => onServiceClick(sub.id)}
                                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                                          selectedService === sub.id 
                                          ? 'bg-icy-main/10 text-icy-main font-bold' 
                                          : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'
                                      }`}
                                  >
                                      {sub.title}
                                      {selectedService === sub.id && <div className="w-1.5 h-1.5 rounded-full bg-icy-main shadow-[0_0_8px_rgba(64,146,239,0.8)]" />}
                                  </button>
                              ))}
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>
          );
        })}
        
        <div className="my-4 border-t border-gray-200/50 dark:border-white/10 mx-4" />
        
        <div className="p-4 rounded-2xl bg-gradient-to-br from-icy-deep to-icy-main text-white shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <h4 className="font-bold text-sm mb-1 relative z-10">Riona AI</h4>
          <p className="text-xs text-white/80 mb-3 relative z-10">Your campaigns need attention.</p>
          <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors relative z-10 backdrop-blur-sm border border-white/10">
            Ask AI Agent
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
