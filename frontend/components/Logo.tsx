import React from 'react';

export const Logo = ({ className = "h-8 w-auto" }: { className?: string }) => (
  <div className="flex items-center gap-2 select-none">
    {/* Abstract Star Shape based on reference */}
    <svg 
      viewBox="0 0 100 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M50 60C50 45 60 30 100 30C60 30 50 15 50 0C50 15 40 30 0 30C40 30 50 45 50 60Z" 
        className="fill-icy-main"
      />
    </svg>
    <span className="font-sans font-bold text-2xl tracking-tighter uppercase">
      Icycon
    </span>
  </div>
);