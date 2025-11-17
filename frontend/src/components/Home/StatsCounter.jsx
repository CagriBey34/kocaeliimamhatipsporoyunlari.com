import React, { useState, useEffect, useRef } from 'react';

const StatsCounter = () => {
  const [counts, setCounts] = useState({
    cups: 0,
    branches: 0,
    athletes: 0,
    schools: 0
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  
  const targets = {
    cups: 40,
    branches: 17,
    athletes: 4000,
    schools: 400
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.5 } 
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let interval;
    
    if (isVisible) {
      interval = setInterval(() => {
        setCounts(prevCounts => ({
          cups: prevCounts.cups < targets.cups ? prevCounts.cups + 1 : targets.cups,
          branches: prevCounts.branches < targets.branches ? prevCounts.branches + 1 : targets.branches,
          athletes: prevCounts.athletes < targets.athletes ? prevCounts.athletes + 10 : targets.athletes,
          schools: prevCounts.schools < targets.schools ? prevCounts.schools + 5 : targets.schools
        }));
      }, 50);
    }
    
    return () => clearInterval(interval);
  }, [isVisible]);

  const statsData = [
    { 
      label: 'Kupa', 
      value: counts.cups, 
      suffix: '+',
      bgColor: '#E84049',
      textColor: 'white'
    },
    { 
      label: 'Branş', 
      value: counts.branches, 
      suffix: '+',
      bgColor: '#2563EB',
      textColor: 'white'
    },
    { 
      label: 'Sporcu', 
      value: counts.athletes, 
      suffix: '+',
      bgColor: '#10B981',
      textColor: 'white'
    },
    { 
      label: 'Okul', 
      value: counts.schools, 
      suffix: '+',
      bgColor: '#F59E0B',
      textColor: 'white'
    }
  ];

  return (
    <div 
      ref={containerRef} 
      className="flex flex-wrap w-full"
    >
      {statsData.map((stat, index) => (
        <div 
          key={index} 
          className="w-1/2 md:w-1/4 aspect-square transition-all duration-300"
          style={{
            backgroundColor: stat.bgColor,
            color: stat.textColor
          }}
        >
          <div className="flex flex-col items-center justify-center h-full w-full p-4">
            <div className="mb-2 text-center">
              <span className="text-4xl md:text-5xl lg:text-6xl font-bold">
                {stat.value}
              </span>
              <span className="text-2xl md:text-3xl align-super ml-1">
                {stat.suffix}
              </span>
            </div>
            <div className="text-base md:text-lg lg:text-xl uppercase font-medium mt-2">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCounter;