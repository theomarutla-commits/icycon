
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Users, TrendingUp } from 'lucide-react';
import CTA from '../components/CTA';
import QuickCreateCard from '../components/QuickCreateCard';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Revenue Engine Flows",
    desc: "Automated high-converting email flows (Welcome, Abandoned Cart, Post-Purchase) that print revenue while you sleep."
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "SMS Marketing",
    desc: "Direct-to-consumer SMS campaigns with 98% open rates. Perfect for flash sales and urgent updates."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "B2B Cold Outreach",
    desc: "Lawful, high-volume cold email infrastructure that warms up domains and lands in the primary inbox."
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "List Growth & Hygiene",
    desc: "Strategies to capture more leads and keep your list clean, ensuring high deliverability and engagement."
  }
];

const EmailPage: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-4 bg-slate-50 dark:bg-icy-dark min-h-screen">
      <div className="w-[90%] lg:w-[90%] mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            {...({
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
            } as any)}
            className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white"
          >
            The <span className="text-icy-main">Revenue Engine</span>
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Turn subscribers into superfans. We build compliant, high-performance Email & SMS systems that maximize Lifetime Value (LTV) and automate your growth.
          </p>
          <div className="mt-6">
            <Link
              to="/data-entry"
              className="inline-flex px-5 py-3 bg-icy-main text-white rounded-full font-semibold text-sm hover:bg-blue-600 transition-colors"
            >
              Open Data Entry
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              {...({
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  transition: { delay: i * 0.1 }
              } as any)}
              className="bg-white dark:bg-[#002466]/40 p-8 rounded-3xl border border-gray-200 dark:border-white/10 hover:border-icy-main transition-colors"
            >
              <div className="w-12 h-12 bg-icy-main/10 text-icy-main rounded-xl flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <QuickCreateCard
            title="Create Email List"
            description="POST /api/email/lists/"
            endpoint="/api/email/lists/"
            fields={[
              { name: 'name', label: 'List name', placeholder: 'Newsletter' },
              {
                name: 'lawful_basis',
                label: 'Lawful basis',
                type: 'select',
                options: [
                  { label: 'Consent', value: 'consent' },
                  { label: 'Contract', value: 'contract' },
                  { label: 'Legitimate Interest', value: 'legitimate_interest' },
                ],
                defaultValue: 'consent',
              },
            ]}
          />
          <QuickCreateCard
            title="Add Email Template"
            description="POST /api/email/templates/"
            endpoint="/api/email/templates/"
            fields={[
              { name: 'name', label: 'Template name', placeholder: 'Welcome' },
              { name: 'subject', label: 'Subject', placeholder: 'Welcome aboard!' },
              { name: 'body_html', label: 'HTML body', placeholder: '<p>Welcome!</p>', type: 'textarea', defaultValue: '<p>Welcome!</p>' },
            ]}
          />
          <QuickCreateCard
            title="Create Email Flow"
            description="POST /api/email/flows/"
            endpoint="/api/email/flows/"
            fields={[
              { name: 'name', label: 'Flow name', placeholder: 'Onboarding flow' },
              { name: 'description', label: 'Description', placeholder: 'Email automation flow', type: 'textarea', defaultValue: 'Email automation flow' },
            ]}
          />
          <QuickCreateCard
            title="Add Contact"
            description="POST /api/email/contacts/"
            endpoint="/api/email/contacts/"
            fields={[
              { name: 'email', label: 'Email', placeholder: 'user@example.com' },
              { name: 'name', label: 'Name', placeholder: 'Jane Doe' },
            ]}
          />
        </div>

        <div className="bg-white dark:bg-[#002466]/40 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <CTA />
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
