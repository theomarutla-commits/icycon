import React from 'react';
import {
  SliderBtnGroup,
  ProgressSlider,
  SliderBtn,
  SliderContent,
  SliderWrapper,
} from './ui/progressive-carousel';

const carouselItems = [
  {
    sliderName: 'growth',
    title: 'Growth',
    desc: 'Social Media Management • Global Localization',
    img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop',
  },
  {
    sliderName: 'optimisation',
    title: 'Optimisation',
    desc: 'SEO Platform • GEO & AEO • App Store Optimization',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
  },
  {
    sliderName: 'reach',
    title: 'Reach',
    desc: 'Directories • Marketplaces • Blog Engine • Backlinks • Email & SMS',
    img: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=2070&auto=format&fit=crop',
  },
];

const CoreServicesCarousel: React.FC = () => {
  return (
    <section id="services" className="py-24 px-4 bg-white dark:bg-black/20">
      <div className="w-[90%] lg:w-[90%] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Core Services</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A holistic suite of digital performance tools designed for the modern algorithm.
            Organized to drive Growth, Optimisation, and Reach.
          </p>
        </div>

        <div className="w-full">
          <ProgressSlider vertical={false} activeSlider='growth' className="w-full">
            <SliderContent className="w-full">
              {carouselItems.map((item, index) => (
                <SliderWrapper key={index} value={item.sliderName} className="w-full">
                  <div className="relative h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl group">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={item.img}
                      alt={item.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  </div>
                </SliderWrapper>
              ))}
            </SliderContent>

            <SliderBtnGroup className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] h-fit dark:bg-black/60 bg-white/80 backdrop-blur-xl border border-white/20 overflow-hidden grid grid-cols-1 md:grid-cols-3 rounded-2xl shadow-lg">
              {carouselItems.map((item, index) => (
                <SliderBtn
                  key={index}
                  value={item.sliderName}
                  className="text-left cursor-pointer p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/10 last:border-0 hover:bg-white/5 transition-colors"
                  progressBarClass="dark:bg-icy-main bg-icy-deep h-1 bottom-0 md:top-auto absolute w-full"
                >
                  <h2 className="text-lg md:text-xl font-bold dark:text-white text-gray-900 mb-1">
                    {item.title}
                  </h2>
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300 line-clamp-2">
                    {item.desc}
                  </p>
                </SliderBtn>
              ))}
            </SliderBtnGroup>
          </ProgressSlider>
        </div>
      </div>
    </section>
  );
};

export default CoreServicesCarousel;