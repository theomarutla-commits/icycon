
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Minus } from 'lucide-react';
import { LampContainer } from '../components/ui/lamp';

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

const faqs = [
  {
    question: "What is Answer Engine Optimization (AEO)?",
    answer: "AEO focuses on optimizing your content for AI-driven answer engines like ChatGPT, Claude, and Perplexity. Unlike traditional SEO which targets 10 blue links, AEO aims to be the single cited source in an AI-generated answer."
  },
  {
    question: "Do you support multilingual websites?",
    answer: "Yes, our Growth and Enterprise plans include full multilingual SEO support. We handle hreflang tags, automated translation with cultural adaptation, and dedicated URL structures for international markets."
  },
  {
    question: "Can I switch plans later?",
    answer: "Absolutely. You can upgrade or downgrade your plan at any time from your dashboard. Changes will take effect at the start of the next billing cycle."
  },
  {
    question: "How does the Riona AI agent work?",
    answer: "Riona is a policy-compliant AI agent that helps manage your social community. She can draft responses, schedule posts based on audience activity, and even engage with comments, all while adhering to strict brand safety guidelines."
  },
  {
    question: "Is there a contract or commitment?",
    answer: "Our Starter and Growth plans are month-to-month with no long-term commitment. The Enterprise plan typically involves an annual agreement to cover the setup of dedicated infrastructure."
  }
];

const CurveSelector = ({ activeIndex, onChange }: { activeIndex: number, onChange: (index: number) => void }) => {
  return (
    <div className="relative w-full max-w-lg mx-auto h-40 mb-8 select-none">
      <svg className="w-full h-full drop-shadow-xl" viewBox="0 0 600 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
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
            {...({
                initial: { pathLength: 0 },
                animate: { 
                    pathLength: activeIndex === 0 ? 0.001 : activeIndex === 1 ? 0.5 : 1,
                    stroke: plans[activeIndex].color
                },
                transition: { duration: 0.6, ease: "circOut" }
            } as any)}
            style={{ filter: "url(#glow)" }}
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
                        {...({ animate: { r: isActive ? 22 : 14 } } as any)}
                    />
                    
                    {/* Inner Dot */}
                    <motion.circle 
                        cx={pos.x} 
                        cy={pos.y} 
                        r={isActive ? 12 : 0} 
                        className="fill-white"
                        {...({ 
                            animate: { r: isActive ? 12 : 0 },
                            initial: false 
                        } as any)}
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

const PricingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [activePlan, setActivePlan] = useState<number>(1); // Default to Growth (index 1)

  return (
    <div className="bg-slate-50 dark:bg-icy-dark min-h-screen transition-colors duration-300">
      {/* 
          LAYOUT FIX: 
          1. pt-64 (Increased) pushes the lamp down significantly to clear navbar.
      */}
      <LampContainer className="pt-64" glowColor={plans[activePlan].color}>
        <motion.h1
          {...({
              initial: { opacity: 0.5, y: 100 },
              whileInView: { opacity: 1, y: 0 },
              transition: {
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }
          } as any)}
          className="mt-8 bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Simple and Affordable <br /> Pricing Plans
        </motion.h1>
        <motion.p
           {...({
               initial: { opacity: 0, y: 20 },
               whileInView: { opacity: 1, y: 0 },
               transition: { delay: 0.5, duration: 0.8 }
           } as any)}
           className="text-slate-600 dark:text-slate-400 mt-4 max-w-lg text-center mx-auto"
        >
            Start tracking and improving your digital growth management today.
        </motion.p>
      </LampContainer>
      
      {/* 
          LAYOUT FIX:
          2. -mt-20 reduces the overlap, keeping the cards visible but connected.
      */}
      <div className="relative z-10 -mt-20 pb-24 px-4">
         <div className="w-[90%] lg:w-[90%] mx-auto">
            
            {/* Curve Selector */}
            <motion.div
                {...({
                    initial: { opacity: 0 },
                    whileInView: { opacity: 1 },
                    transition: { delay: 0.6 }
                } as any)}
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
                            {...({
                                initial: { opacity: 0, y: 50 },
                                whileInView: { opacity: 1, y: 0 },
                                viewport: { once: true },
                                transition: { delay: index * 0.1 },
                                onClick: () => setActivePlan(index),
                                whileHover: !isActive ? { scale: 1.02, opacity: 1 } : {},
                                animate: isActive ? { scale: 1.05, opacity: 1, zIndex: 20 } : { scale: 0.98, opacity: 0.7, zIndex: 10 }
                            } as any)}
                            className={`
                                relative flex flex-col p-8 rounded-3xl transition-all duration-300 cursor-pointer
                                border group
                                ${isActive 
                                    ? 'shadow-2xl' 
                                    : 'hover:shadow-xl'
                                }
                                ${isActive 
                                    ? 'bg-white/90 dark:bg-[#002466]/90' 
                                    : 'bg-white/60 dark:bg-white/5'
                                }
                                backdrop-blur-xl
                            `}
                            style={{
                                borderColor: isActive ? plan.color : 'rgba(255,255,255,0.1)',
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
                                        : 'bg-transparent border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-white/50 dark:hover:bg-white/10'
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
      </div>

      {/* FAQ Section */}
      <div className="py-24 px-4 bg-white dark:bg-icy-dark relative border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="w-[90%] lg:w-[90%] max-w-3xl mx-auto">
            <motion.div 
                {...({
                    initial: { opacity: 0 },
                    whileInView: { opacity: 1 }
                } as any)}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    Frequently Asked Questions
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Everything you need to know about Icycon services and billing.</p>
            </motion.div>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <motion.div
                        key={index}
                        {...({
                            initial: { opacity: 0, y: 20 },
                            whileInView: { opacity: 1, y: 0 },
                            transition: { delay: index * 0.1 }
                        } as any)}
                        className="border border-gray-200 dark:border-white/10 rounded-2xl bg-gray-50 dark:bg-white/5 overflow-hidden transition-colors duration-300"
                    >
                        <button
                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        >
                            <span className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</span>
                            {openFaq === index ? (
                                <Minus className="text-icy-main shrink-0" />
                            ) : (
                                <Plus className="text-gray-400 shrink-0" />
                            )}
                        </button>
                        <div 
                            className={`px-6 text-gray-600 dark:text-gray-300 overflow-hidden transition-all duration-300 ease-in-out ${
                                openFaq === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            {faq.answer}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>

    </div>
  );
};

export default PricingPage;
