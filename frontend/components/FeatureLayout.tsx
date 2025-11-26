import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type FeatureLayoutProps = {
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

const FeatureLayout: React.FC<FeatureLayoutProps> = ({
  title,
  subtitle,
  description,
  bullets,
  primaryCta,
  secondaryCta,
}) => {
  return (
    <div className="pt-24 pb-16 px-4 bg-slate-50 dark:bg-icy-dark min-h-screen">
      <div className="w-[90%] lg:w-[80%] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-icy-main font-semibold mb-4">{subtitle}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-icy-dark dark:text-white mb-4">{title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{description}</p>
            <div className="flex flex-wrap gap-3 mb-8">
              {primaryCta && (
                <Link
                  to={primaryCta.href}
                  className="inline-flex items-center gap-2 bg-icy-main text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-icy-main/25 hover:bg-blue-600 transition-colors"
                >
                  {primaryCta.label} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {secondaryCta && (
                <Link
                  to={secondaryCta.href}
                  className="inline-flex items-center gap-2 border border-icy-main/40 text-icy-main px-5 py-3 rounded-xl font-semibold hover:bg-icy-main/10 transition-colors"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          </div>
          <div className="bg-white dark:bg-[#002466]/40 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-icy-dark dark:text-white mb-4">What you get</h2>
            <ul className="space-y-3">
              {bullets.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-200">
                  <span className="w-2 h-2 mt-2 bg-icy-main rounded-full" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureLayout;
