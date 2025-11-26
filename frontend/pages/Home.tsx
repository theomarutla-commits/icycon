import React from 'react';
import Hero from '../components/Hero';
import CoreServicesCarousel from '../components/CoreServicesCarousel';
import TargetMarkets from '../components/TargetMarkets';
import WhyChooseUs from '../components/WhyChooseUs';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import { useAuth } from '../lib/AuthContext';

const Home: React.FC = () => {
  const { authHeader, features } = useAuth();
  return (
    <>
      <div className="bg-icy-main/10 dark:bg-icy-deep/20 text-sm text-icy-dark dark:text-white py-3 px-4 text-center">
        {authHeader ? (
          <span>
            You are signed in. {features ? `Features available: ${features.length}` : 'Loading your features...'}
          </span>
        ) : (
          <span>
            New here? <a className="underline font-semibold" href="#/auth">Create an account or log in</a> to sync with the API.
          </span>
        )}
      </div>
      <Hero />
      <CoreServicesCarousel />
      <TargetMarkets />
      <WhyChooseUs />
      <About />
      <Testimonials />
      <CTA />
    </>
  );
};

export default Home;
