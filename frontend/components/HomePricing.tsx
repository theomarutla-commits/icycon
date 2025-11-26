import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    name: "Starter",
    price: "$499",
    period: "/mo",
    description: "Great for trying out Icycon and for tiny teams",
    color: "#22d3ee", // Cyan-400
    features: [
      "SEO Platform Access",
      "Social Media Scheduling",
      "5 Blog Posts / mo",
      "Directory Submissions",
      "Basic Security"
    ],
    cta: "Start for Free"
  },
  {
    name: "Growth",
    price: "$1,499",
    period: "/mo",
    description: "Best for growing startups and growth companies",
    color: "#4092ef", // Icy Main
    features: [
      "Everything in Starter",
      "Riona AI Agent Access",
      "AEO & LLM Optimization",
      "Unlimited Blog Engine",
      "Multilingual Support"
    ],
    cta: "Sign Up with Growth"
  },
  {
    name: "Enterprise",
    price: "$2,999",
    period: "/mo",
    description: "Best for large companies and teams requiring high security",
    color: "#818cf8", // Indigo-400
    features: [
      "Custom Riona Training",
      "Dedicated Account Manager",
      "White-label Reports",
      "API Access",
      "Integration with 3rd-Party"
    ],
    cta: "Sign Up with Enterprise"
  }
];

const CurveSelector = ({ activeIndex, onChange }: { activeIndex: number, onChange: (index: number) => void }) => {
  return (
    <div className="relative w-full max-w-lg mx-auto h-40 mb-8 select-none">
      <svg className="w-full h-full drop-shadow-xl" viewBox="0 0 600 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="glow-home" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>

        {/* Base Curve Path */}
        <path 
          d="M 60 50 Q 300 160 540 50" 
          className="stroke-gray-200 dark:stroke-white/10 stroke-[10px] fill-none"
          strokeLinecap="round"
        />
        
        {/* Active Path Progress */}
        <motion.path 
            d="M 60 50 Q 300 160 540 50"
            className="stroke-[10px] fill-none"
            stroke={plans[activeIndex].color}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ 
                pathLength: activeIndex === 0 ? 0.001 : activeIndex === 1 ? 0.5 : 1,
                stroke: plans[activeIndex].color
            }}
            transition={{ duration: 0.6, ease: "circOut" }}
            style={{ filter: "url(#glow-home)" }}
        />

        {/* Nodes */}
        {plans.map((plan, index) => {
            // Curve: P0(60,50), Control(300,160), P2(540,50)
            const positions = [
                { x: 60, y: 50 },
                { x: 300, y: 105 }, 
                { x: 540, y: 50 }
            ];
            const pos = positions[index];
            const isActive = activeIndex === index;
            const isPassed = activeIndex >= index;

            return (
                <g key={index} onClick={() => onChange(index)} className="cursor-pointer group">
                    {/* Larger Hit Area */}
                    <circle cx={pos.x} cy={pos.y} r={40} className="fill-transparent" />

                    {/* Outer Circle */}
                    <motion.circle 
                        cx={pos.x} 
                        cy={pos.y} 
                        r={isActive ? 22 : 14} 
                        className="stroke-[4px] transition-colors duration-300"
                        style={{ 
                            fill: isActive ? plan.color : '#ffffff', 
                            stroke: isPassed ? plan.color : '#e5e7eb'
                        }}
                        animate={{ r: isActive ? 22 : 14 }}
                    />
                    
                    {/* Inner Dot */}
                    <motion.circle 
                        cx={pos.x} 
                        cy={pos.y} 
                        r={isActive ? 12 : 0} 
                        className="fill-white"
                        animate={{ r: isActive ? 12 : 0 }}
                        initial={false}
                    />

                    {/* Label */}
                    <text 
                        x={pos.x} 
                        y={pos.y - 40} 
                        textAnchor="middle" 
                        className={`
                            text-sm font-extrabold tracking-widest uppercase font-sans
                            transition-all duration-300
                            ${isActive ? 'fill-gray-900 dark:fill-white' : 'fill-gray-400 dark:fill-gray-500'}
                        `}
                    >
                        {plan.name}
                    </text>
                </g>
            );
        })}
      </svg>
    </div>
  );
};

const HomePricing: React.FC = () => {
  const [activePlan, setActivePlan] = useState<number>(1); // Default to Growth (index 1)

  return (
    <section id="pricing" className="py-24 px-4 bg-slate-50 dark:bg-icy-dark transition-colors duration-300">
      <div className="w-[90%] lg:w-[90%] mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white"
          >
            Simple and Affordable <br />
            <span className="text-icy-main">Pricing Plans</span>
          </motion.h2>
          <motion.p
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
             Start tracking and improving your digital growth management today.
          </motion.p>
        </div>

        {/* Curve Selector */}
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
        >
            <CurveSelector activeIndex={activePlan} onChange={setActivePlan} />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-center">
            {plans.map((plan, index) => {
                const isActive = activePlan === index;
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setActivePlan(index)}
                        whileHover={!isActive ? { scale: 1.05, opacity: 1 } : {}}
                        animate={isActive ? { scale: 1.1, opacity: 1, zIndex: 20 } : { scale: 0.95, opacity: 0.7, zIndex: 10 }}
                        className={`
                            relative flex flex-col p-8 rounded-3xl transition-all duration-300 cursor-pointer
                            border group
                            ${isActive 
                                ? 'shadow-2xl' 
                                : 'hover:shadow-xl'
                            }
                            ${isActive 
                                ? 'bg-white dark:bg-[#002466]/90' 
                                : 'bg-white/80 dark:bg-black/40'
                            }
                            backdrop-blur-xl
                        `}
                        style={{
                            borderColor: isActive ? plan.color : 'transparent',
                            boxShadow: isActive ? `0 20px 50px -12px ${plan.color}40` : 'none'
                        }}
                    >
                        {isActive && (
                            <div className="absolute top-0 right-0 mt-4 mr-4">
                                <span 
                                    className="text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                                    style={{ backgroundColor: plan.color }}
                                >
                                    Selected
                                </span>
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-lg font-medium mb-2 transition-colors text-gray-800 dark:text-white" style={{ color: isActive ? plan.color : undefined }}>
                                {plan.name}
                            </h3>
                            <div className="flex items-baseline mb-4">
                                <span className={`text-4xl font-bold transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {plan.price}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">{plan.period}</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm h-10 leading-snug">{plan.description}</p>
                        </div>

                        <button 
                            className={`
                                w-full py-3 rounded-xl text-sm font-bold transition-all mb-8
                                ${isActive
                                    ? 'text-white shadow-lg hover:brightness-110'
                                    : 'bg-transparent border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                                }
                            `}
                            style={{
                                backgroundColor: isActive ? plan.color : 'transparent',
                                boxShadow: isActive ? `0 10px 20px -5px ${plan.color}60` : 'none'
                            }}
                        >
                            {plan.cta}
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px bg-gray-200 dark:bg-white/10 flex-grow" />
                            <span className="text-xs text-gray-400 font-bold tracking-widest uppercase">Features</span>
                            <div className="h-px bg-gray-200 dark:bg-white/10 flex-grow" />
                        </div>

                        <ul className="space-y-4 flex-grow">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div 
                                        className="p-1 rounded-full shrink-0 transition-colors"
                                        style={{ 
                                            backgroundColor: isActive ? plan.color : 'rgba(156, 163, 175, 0.2)', // Gray-400/20
                                            color: isActive ? 'white' : 'gray'
                                        }}
                                    >
                                        <Check size={10} />
                                    </div>
                                    <span className={`text-sm ${isActive ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                );
            })}
        </div>
      </div>
    </section>
  );
};

export default HomePricing;