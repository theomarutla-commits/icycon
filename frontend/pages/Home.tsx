import React from 'react';
import Hero from '../components/Hero';
import CoreServicesCarousel from '../components/CoreServicesCarousel';
import TargetMarkets from '../components/TargetMarkets';
import WhyChooseUs from '../components/WhyChooseUs';
import About from '../components/About';
import HomePricing from '../components/HomePricing';
import CTA from '../components/CTA';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <CoreServicesCarousel />
      <TargetMarkets />
      <WhyChooseUs />
      <About />
      <HomePricing />
      <CTA />
    </>
  );
};

export default Home;