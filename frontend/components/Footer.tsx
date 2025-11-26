import React from 'react';
import { Logo } from './Logo';
import { Twitter, Instagram, Linkedin, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-10 px-4 border-t border-white/10">
      <div className="w-[90%] lg:w-[90%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <Logo className="h-8 w-10" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Icycon is a modern AI-first growth agency. We leverage data and creativity to engineer results that matter.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/services" className="hover:text-icy-main transition-colors">Services</Link></li>
              <li><Link to="/pricing" className="hover:text-icy-main transition-colors">Pricing</Link></li>
              <li><Link to="/#about" className="hover:text-icy-main transition-colors">About Us</Link></li>
              <li><Link to="/auth" className="hover:text-icy-main transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-icy-main transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-icy-main transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-icy-main transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-icy-main transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-icy-main" />
                <span>hello@icycon.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-icy-main" />
                <span>+1 (888) 555-0123</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-icy-main" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Giant Text Effect */}
        <div className="relative pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden">
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Globe size={20} /></a>
          </div>
          
          <div className="text-sm text-gray-500">
            © 2025 Icycon. All rights reserved.
          </div>

          {/* Background Text Effect */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 pointer-events-none select-none opacity-10">
            <span className="text-[10rem] md:text-[14rem] font-bold text-transparent stroke-text font-sans">ICYCON</span>
            <style>{`
              .stroke-text {
                -webkit-text-stroke: 2px #4092ef;
              }
            `}</style>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;