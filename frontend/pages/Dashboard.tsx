
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowUpRight } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import OverviewDashboard from '../components/dashboard/OverviewDashboard';
import OptimisationDashboard from '../components/dashboard/OptimisationDashboard';
import SEODashboard from '../components/dashboard/SEODashboard';
import AppStoreOptimizationDashboard from '../components/dashboard/ASODashboard';
import AEODashboard from '../components/dashboard/AEODashboard';
import SocialMediaDashboard from '../components/dashboard/SocialMediaDashboard';
import MarketplaceDashboard from '../components/dashboard/MarketplaceDashboard';
import EmailDashboard from '../components/dashboard/EmailDashboard';
import BlogDashboard from '../components/dashboard/BlogDashboard';
import BacklinksDashboard from '../components/dashboard/BacklinksDashboard';
import { services, stats as staticStats } from '../lib/dashboard-data';
import { fetchDashboard, UserProfile, DashboardResponse, downloadDashboardReport } from '../lib/api';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>("Overview");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [multiSeoEnabled, setMultiSeoEnabled] = useState(true); // Toggle state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [liveStats, setLiveStats] = useState(staticStats);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [rangePreset, setRangePreset] = useState<"today" | "7d" | "30d" | "90d" | "custom">("30d");
  const [sliderDays, setSliderDays] = useState(30);

  useEffect(() => {
    let mounted = true;

    const load = () => {
      fetchDashboard()
        .then((data: DashboardResponse) => {
          if (!mounted) return;
          setUser(data.user);
          const dynamic = [
            {
              label: "ASO Apps",
              value: String(data.aso_apps_count ?? 0),
              trend: "+live",
              color: "text-icy-main",
              icon: () => <ChevronLeft className="hidden" />, // placeholder; icon unused in rendering below
            },
            {
              label: "Marketplace Products",
              value: String(data.marketplace_products_count ?? 0),
              trend: "+live",
              color: "text-purple-500",
              icon: () => <ChevronLeft className="hidden" />,
            },
            {
              label: "Features",
              value: String((data as any).features?.length ?? staticStats.length),
              trend: "+live",
              color: "text-green-500",
              icon: () => <ChevronLeft className="hidden" />,
            },
          ];
          // Preserve icon definitions from static stats for display
          setLiveStats([
            { ...staticStats[0], value: dynamic[0].value, label: "ASO Apps", trend: dynamic[0].trend },
            { ...staticStats[1], value: dynamic[1].value, label: "Marketplace Products", trend: dynamic[1].trend },
            { ...staticStats[2], value: dynamic[2].value, label: "Features", trend: dynamic[2].trend },
          ]);
        })
        .catch((err: any) => {
          if (mounted) setUserError(err?.message || "Unable to load profile");
        })
        .finally(() => {
          if (mounted) setLoadingUser(false);
        });
    };

    load();
    const id = window.setInterval(load, 30000); // refresh every 30s to keep dashboard live
    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, []);

  const userInitials = user
    ? `${(user.first_name || user.username || user.email || "?").charAt(0)}${(user.last_name || user.username || "").charAt(0)}`.toUpperCase()
    : "";

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
    if (serviceId === 'multi-seo') return; // Do not navigate for toggle card
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

  const handleDownload = async () => {
    setDownloadError(null);
    setDownloading(true);
    try {
      const now = new Date();
      const start = new Date();
      if (rangePreset === "today") {
        start.setHours(0, 0, 0, 0);
      } else if (rangePreset === "7d") {
        start.setDate(now.getDate() - 7);
      } else if (rangePreset === "30d") {
        start.setDate(now.getDate() - 30);
      } else if (rangePreset === "90d") {
        start.setDate(now.getDate() - 90);
      } else {
        start.setDate(now.getDate() - sliderDays);
      }
      const blob = await downloadDashboardReport({
        range: rangePreset === "custom" ? "custom" : rangePreset,
        start_date: start.toISOString(),
        end_date: now.toISOString(),
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dashboard-report.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setDownloadError(err?.message || "Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 min-h-screen bg-slate-50 dark:bg-icy-dark relative overflow-hidden transition-colors duration-300">
      {/* Ambient Background Blobs for Glass Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(64,146,239,0.15),transparent_50%)]" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-icy-main/10 rounded-full blur-[120px] opacity-50 dark:opacity-20" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-icy-deep/20 rounded-full blur-[100px] opacity-50 dark:opacity-20" />
      </div>

      <div className="w-[95%] lg:w-[90%] mx-auto relative z-10">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <motion.div
            {...({
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0 }
            } as any)}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-icy-main/10 border border-icy-main/20 flex items-center justify-center text-icy-main font-bold text-lg">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username || user.email} className="w-full h-full object-cover" />
                ) : (
                  (userInitials || "U")
                )}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  Welcome back,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-icy-main to-cyan-400">
                    {user?.first_name || user?.username || user?.email || "User"}
                  </span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  Manage your growth engine from one central command center.
                </p>
                {userError && (
                  <p className="text-xs text-red-500 mt-1">Profile error: {userError}</p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            {...({
                initial: { opacity: 0 },
                animate: { opacity: 1 }
            } as any)}
            className="flex items-center gap-3"
          >
            <Link
              to="/data-entry"
              className="px-6 py-3 bg-icy-main text-white rounded-xl font-semibold text-sm hover:bg-blue-600 transition-colors shadow-sm hover:shadow-lg"
            >
              Add Data
            </Link>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-6 py-3 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-xl font-medium text-sm hover:bg-white/80 dark:hover:bg-white/20 transition-all shadow-sm hover:shadow-lg text-gray-800 dark:text-white disabled:opacity-60"
            >
              {downloading ? "Preparing..." : "Download Report"}
            </button>
          </motion.div>
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-xs text-gray-600 dark:text-gray-300">Range:</span>
          {["today", "7d", "30d", "90d", "custom"].map((opt) => (
            <button
              key={opt}
              onClick={() => setRangePreset(opt as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                rangePreset === opt
                  ? "bg-icy-main text-white border-icy-main"
                  : "bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-white/10"
              }`}
            >
              {opt === "7d" ? "7d" : opt === "30d" ? "30d" : opt === "90d" ? "90d" : opt === "today" ? "Today" : "Custom"}
            </button>
          ))}
          {rangePreset === "custom" && (
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
              <input
                type="range"
                min={1}
                max={180}
                value={sliderDays}
                onChange={(e) => setSliderDays(parseInt(e.target.value, 10))}
              />
              <span>{sliderDays}d</span>
            </div>
          )}
        </div>
        {downloadError && (
          <p className="text-xs text-red-500 mb-4">Report error: {downloadError}</p>
        )}

        {/* Overview Stats (Visible in Overview only) */}
        {currentView === "Overview" && !selectedService && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {liveStats.map((stat, index) => (
                <motion.div
                key={index}
                {...({
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: index * 0.1 }
                } as any)}
                className="p-6 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-lg dark:shadow-black/20 hover:scale-[1.02] transition-transform duration-300"
                >
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-white/50 dark:bg-white/10 ${stat.color} shadow-sm`}>
                    <stat.icon size={24} />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full bg-green-100/80 dark:bg-green-500/20 text-green-600 dark:text-green-400 backdrop-blur-sm`}>
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
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200/50 dark:border-white/5 pb-4">
                {selectedService ? (
                    <button 
                        onClick={() => setSelectedService(null)}
                        className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-xl transition-colors backdrop-blur-sm"
                    >
                        <ChevronLeft size={20} className="text-gray-700 dark:text-gray-200" />
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
                    <span className="ml-auto px-4 py-1.5 rounded-full bg-icy-main/10 text-icy-main text-xs font-bold backdrop-blur-sm border border-icy-main/10">
                        {services.filter(s => s.category === currentView).length} Services Active
                    </span>
                )}
            </div>

            {/* View Routing */}
            <div className="min-w-0">
            {selectedService === 'aso' ? (
                <AppStoreOptimizationDashboard />
            ) : selectedService === 'seo' ? (
                <SEODashboard />
            ) : selectedService === 'aeo' ? (
                <AEODashboard />
            ) : selectedService === 'social' ? (
                <SocialMediaDashboard />
            ) : selectedService === 'marketplaces' ? (
                <MarketplaceDashboard />
            ) : selectedService === 'email' ? (
                <EmailDashboard />
            ) : selectedService === 'blog' ? (
                <BlogDashboard />
            ) : selectedService === 'backlinks' ? (
                <BacklinksDashboard />
            ) : (
                <>
                    {/* Overview Dashboard (Replacing Service Cards) */}
                    {currentView === "Overview" && !selectedService && (
                        <OverviewDashboard />
                    )}

                    {/* Optimisation Analytics (Category Level) */}
                    {currentView === "Optimisation" && !selectedService && (
                    <div className="mb-12">
                        <OptimisationDashboard />
                        <div className="my-12 border-t border-gray-200/50 dark:border-white/5" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Active Optimisation Services</h3>
                    </div>
                    )}

                    {/* Service Cards Grid (Only visible in categories, NOT Overview) */}
                    {currentView !== "Overview" && !selectedService && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {displayedServices.map((service, index) => {
                                if (service.id === 'multi-seo') {
                                    // RENDER TOGGLE CARD
                                    return (
                                        <motion.div
                                            key={service.title}
                                            {...({
                                                initial: { opacity: 0, y: 10 },
                                                animate: { opacity: 1, y: 0 },
                                                transition: { delay: index * 0.05 }
                                            } as any)}
                                            className="group bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-6 hover:shadow-xl dark:hover:shadow-black/30 hover:border-icy-main/50 transition-all duration-300 relative overflow-hidden flex flex-col"
                                        >
                                            <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-100 dark:from-white/10 dark:to-white/5 text-icy-main rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-white/20 dark:border-white/5">
                                                <service.icon size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                {service.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex-grow">
                                                {multiSeoEnabled ? "System Active. Translating..." : "System Paused."}
                                            </p>
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full backdrop-blur-md ${multiSeoEnabled ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-white/10 text-gray-500'}`}>
                                                    {multiSeoEnabled ? 'Active' : 'Inactive'}
                                                </span>
                                                {/* Toggle Switch */}
                                                <button 
                                                    onClick={() => setMultiSeoEnabled(!multiSeoEnabled)}
                                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${multiSeoEnabled ? 'bg-icy-main' : 'bg-gray-300 dark:bg-gray-600'}`}
                                                >
                                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${multiSeoEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                }

                                // STANDARD CARD
                                return (
                                    <motion.div
                                        key={service.title}
                                        {...({
                                            initial: { opacity: 0, y: 10 },
                                            animate: { opacity: 1, y: 0 },
                                            transition: { delay: index * 0.05 }
                                        } as any)}
                                        onClick={() => handleServiceClick(service.id)}
                                        className="group bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-6 hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-black/30 hover:border-icy-main/50 transition-all duration-300 cursor-pointer relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowUpRight className="text-icy-main w-5 h-5" />
                                        </div>
                                        
                                        <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-100 dark:from-white/10 dark:to-white/5 text-icy-main rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-white/20 dark:border-white/5 group-hover:bg-icy-main group-hover:text-white transition-colors duration-300">
                                            <service.icon size={24} />
                                        </div>
                                        
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-icy-main transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                            Category: {service.category}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/50 dark:bg-white/10 text-gray-500 dark:text-gray-400 backdrop-blur-md">
                                            Active
                                            </span>
                                            <span className="text-xs text-icy-main font-semibold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                            Launch
                                            </span>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}

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
    </div>
  );
};

export default Dashboard;
