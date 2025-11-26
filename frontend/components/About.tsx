import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-4 bg-white dark:bg-icy-dark relative overflow-hidden">
      <div className="w-[90%] lg:w-[90%] mx-auto text-center relative z-10">
        <h2 className="text-sm font-bold tracking-widest text-icy-main uppercase mb-4">About Us</h2>
        <h3 className="text-3xl md:text-5xl font-bold mb-8">
          Architects of the <span className="text-icy-secondary">Digital Future</span>
        </h3>
        <p className="max-w-4xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-12">
          Icycon was born from a simple realization: the digital landscape isn't just changing; it's being completely rewritten by AI. We assembled a team of data scientists, creative directors, and growth hackers to build a new kind of agency—one that speaks fluent algorithm.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Clients", value: "200+" },
            { label: "ROI Generated", value: "$50M+" },
            { label: "Countries", value: "15" },
            { label: "Team Members", value: "45" },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <div className="text-3xl font-bold text-icy-main mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative large text */}
      <div className="absolute -bottom-20 left-0 right-0 text-center pointer-events-none select-none overflow-hidden">
        <span className="text-[15rem] md:text-[20rem] font-bold text-gray-100 dark:text-white/[0.02] leading-none">
          ICYCON
        </span>
      </div>
    </section>
  );
};

export default About;