import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowUpRight } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import OptimisationDashboard from '../components/dashboard/OptimisationDashboard';
import SEODashboard from '../components/dashboard/SEODashboard';
import AppStoreOptimizationDashboard from '../components/dashboard/ASODashboard';
import SocialMediaDashboard from '../components/dashboard/SocialMediaDashboard';
import MarketplaceDashboard from '../components/dashboard/MarketplaceDashboard';
import { services, stats } from '../lib/dashboard-data';

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>("Overview");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Handle category click (Expand/Collapse logic)
  const handleCategoryClick = (categoryName: string, hasChildren: boolean) => {
    if (hasChildren) {
        // If category is already expanded, collapse it
        if (expandedCategory === categoryName) {
            setExpandedCategory(null);
        } else {
            // Expand it and navigate
            setExpandedCategory(categoryName);
            setCurrentView(categoryName);
            setSelectedService(null);
        }
    } else {
        // For overview or items without children
        setCurrentView(categoryName);
        setSelectedService(null);
        setExpandedCategory(null);
    }
  };

  // Handle service card click (loads specific dashboard)
  const handleServiceClick = (serviceId: string) => {
    setSelectedService(serviceId);
    // Auto expand parent category if likely navigated from card
    const service = services.find(s => s.id === serviceId);
    if (service) {
        setExpandedCategory(service.category);
        setCurrentView(service.category);
    }
  };

  const displayedServices = currentView === "Overview" 
    ? services 
    : services.filter(s => s.category === currentView);

  return (
    <div className="pt-24 pb-12 px-4 min-h-screen bg-slate-50 dark:bg-icy-dark">
      <div className="w-[95%] lg:w-[90%] mx-auto">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, <span className="text-icy-main">John</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage your growth engine from one central command center.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/20 transition-colors shadow-sm"
          >
            Download Report
          </motion.button>
        </div>

        {/* Overview Stats (Visible in Overview only) */}
        {currentView === "Overview" && !selectedService && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
                <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white dark:bg-[#002466]/40 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm"
                >
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg bg-gray-100 dark:bg-white/5 ${stat.color}`}>
                    <stat.icon size={24} />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400`}>
                    {stat.trend}
                    </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </motion.div>
            ))}
            </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 relative">
          
          <Sidebar 
            currentView={currentView}
            selectedService={selectedService}
            expandedCategory={expandedCategory}
            onCategoryClick={handleCategoryClick}
            onServiceClick={handleServiceClick}
          />

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
                {selectedService ? (
                    <button 
                        onClick={() => setSelectedService(null)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                ) : null}
                
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {selectedService 
                            ? services.find(s => s.id === selectedService)?.title 
                            : currentView
                        }
                    </h2>
                    {selectedService && (
                        <span className="text-xs text-gray-500">Analytics & Performance</span>
                    )}
                </div>

                {!selectedService && currentView !== "Overview" && (
                    <span className="ml-auto px-3 py-1 rounded-full bg-icy-main/10 text-icy-main text-xs font-bold">
                        {services.filter(s => s.category === currentView).length} Services Active
                    </span>
                )}
            </div>

            {/* View Routing */}
            {selectedService === 'aso' ? (
                <AppStoreOptimizationDashboard />
            ) : selectedService === 'seo' ? (
                <SEODashboard />
            ) : selectedService === 'social' ? (
                <SocialMediaDashboard />
            ) : selectedService === 'marketplaces' ? (
                <MarketplaceDashboard />
            ) : (
                <>
                    {/* Optimisation Analytics (Category Level) */}
                    {currentView === "Optimisation" && !selectedService && (
                    <div className="mb-12">
                        <OptimisationDashboard />
                        <div className="my-12 border-t border-gray-200 dark:border-white/10" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Active Optimisation Services</h3>
                    </div>
                    )}

                    {/* Service Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {displayedServices.map((service, index) => (
                            <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleServiceClick(service.id)}
                            className="group bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl p-6 hover:border-icy-main hover:ring-1 hover:ring-icy-main/50 transition-all hover:shadow-lg cursor-pointer relative overflow-hidden"
                            >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="text-icy-main w-5 h-5" />
                            </div>
                            
                            <div className="w-12 h-12 bg-icy-main/10 text-icy-main rounded-xl flex items-center justify-center mb-4 group-hover:bg-icy-main group-hover:text-white transition-colors duration-300">
                                <service.icon size={24} />
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-icy-main transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                Category: {service.category}
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                                Active
                                </span>
                                <span className="text-xs text-icy-main font-semibold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                Launch
                                </span>
                            </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty States */}
                    {currentView !== "Overview" && currentView !== "Optimisation" && displayedServices.length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            <p>Select a category to view details.</p>
                        </div>
                    )}
                </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;