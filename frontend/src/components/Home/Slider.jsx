import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);

  const slides = [
    {
      web_image: '/assets/banner.jpeg',
      mobile_image: '/assets/banner.jpeg',
      title: 'İmam Hatip Spor Oyunları',
      link: 'https://imamhatipsporoyunlari.com/ogrenci-kayit'
    }
  ];


  return (
    <div 
      className="relative w-[100%] h-[50vh] sm:h-[50vh] md:h-[60vh] lg:h-[85vh] md:w-[85%] mx-auto overflow-hidden z-10 mt-0 md:mt-[15px] rounded-t-0 sm:rounded-t-[20px] md:rounded-t-[80px]"
      style={{ backgroundColor: '#E84049' }}
    >
      <a href={slides[currentSlide].link} className="block w-full h-full absolute top-0 left-0 z-30 cursor-pointer">
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet={slides[currentSlide].mobile_image}
          />
          <img
            src={slides[currentSlide].web_image}
            alt={slides[currentSlide].title || 'Slider içeriği'}
            className={`w-full h-full object-cover object-center absolute top-0 left-0 transition-opacity duration-500  sm:rounded-t-[40px] ${
              isAnimating ? 'opacity-0 invisible' : 'opacity-100 visible'
            }`}
          />
        </picture>
      </a>
    </div>
  );
};

export default Slider;