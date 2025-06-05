import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";

export default function Introduction() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: (
        <>
          <span className="text-orange-500">Review client's demands</span> and{' '}
          <span className="text-white">choose to work with them if the price and the</span>{' '}
          <span className="text-orange-500">project suit you</span>
        </>
      ),
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80"
    },
    {
      title: (
        <>
          <span className="text-white">Manage all </span>
          <span className="text-orange-500">communication, payments </span>{' '}
          <span className="text-white">and </span>
          <span className="text-orange-500">Documents </span>{' '}
          <span className="text-white">in the app so nothing gets lost on the way </span>
        </>
      ),
      image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80"
    },
    {
      title: (
        <>
          <span className="text-orange-500">Let's get started </span>
          <span className="text-white">on getting more qualified, easy to</span>{' '}
          <span className="text-orange-500">manage projects</span>
        </>
      ),
      image: "https://images.unsplash.com/photo-1504615755583-2916b52192a3?auto=format&fit=crop&q=80"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      // Navigate to authentication page instead of directly to signup
      navigate(createPageUrl('Authentication'), { state: { userType: 'contractor' } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <div className="flex-1 relative">
        {/* Background image */}
        <div 
          className="absolute inset-0 z-0 transition-opacity duration-500"
          style={{
            backgroundImage: `url('${slides[currentSlide].image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black opacity-50" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Text content */}
          <div className="flex-1 flex items-center p-8">
            <h1 className="text-[42px] font-bold leading-tight">
              {slides[currentSlide].title}
            </h1>
          </div>

          {/* Dots and button */}
          <div className="p-8">
            {/* Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-orange-500 w-4' 
                      : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>

            {/* Button */}
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 py-6 text-lg"
              onClick={handleNext}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}