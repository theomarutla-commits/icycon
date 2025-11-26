import React from 'react';
import { BackgroundPaths } from './ui/background-paths';

const CTA: React.FC = () => {
  return (
    <section className="relative">
      <BackgroundPaths 
        title="Ready to Rewire Your Growth?" 
        buttonText="Start Your Growth" 
      />
    </section>
  );
};

export default CTA;
