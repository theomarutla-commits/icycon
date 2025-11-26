import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InteractiveNebulaShader } from './ui/InteractiveNebulaShader';
import RotatingEarth from './ui/RotatingEarth';

const Hero: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Detect dark mode from html class
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    // Check initially
    checkDarkMode();

    // Observer for class changes on html element
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-4 pt-24 overflow-hidden transition-colors duration-500 bg-white dark:bg-icy-dark">
      {/* 3D Liquid/Nebula Shader Background 
          NOTE: Shader has transparency enabled to show white background in light mode
      */}
      <InteractiveNebulaShader className="opacity-100" />
      
      {/* Overlay gradient to help blend bottom if needed */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-icy-dark to-transparent z-10 transition-colors duration-500" />

      <div className="relative z-10 w-[90%] lg:w-[90%] mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Text */}
        <div className="text-center lg:text-left space-y-8 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-lg transition-colors duration-300">
              Build a worldwide <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-icy-main to-cyan-400 dark:to-cyan-300">
                following.
              </span> 
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-black dark:text-gray-200 max-w-2xl mx-auto lg:mx-0 drop-shadow-sm transition-colors duration-300"
          >
            Icycon integrates every digital marketing channel into one seamless workflow. Designed for ambitious brands in local services, eCommerce, and SaaS to capture a global market.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-4"
          >
            <Link 
              to="/auth?mode=signup" 
              className="bg-icy-main text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-600 transition-colors shadow-lg shadow-icy-main/30 flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              Start Your Growth <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="px-8 py-4 text-slate-700 dark:text-white font-semibold hover:text-icy-main transition-colors backdrop-blur-sm bg-white/50 dark:bg-black/10 rounded-full border border-gray-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 w-full sm:w-auto">
              View Case Studies
            </button>
          </motion.div>
        </div>

        {/* Right Column: Globe */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="order-1 lg:order-2 flex justify-center items-center relative"
        >
            <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center">
                {/* Glow behind globe - keeping it icy blue in both modes */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-icy-main/20 blur-[100px] rounded-full" />
                <RotatingEarth width={600} height={600} className="w-full h-full" isDarkMode={isDarkMode} />
            </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;