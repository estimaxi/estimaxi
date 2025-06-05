import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";

export default function ProjectOwnerIntroduction() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: (
        <>
          <span className="text-white">Just </span>
          <span className="text-orange-500">answer few questions</span>
          <span className="text-white"> about your construction needs and get a </span>
          <span className="text-orange-500">precise estimate to all costs.</span>
        </>
      ),
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80"
    },
    {
      title: (
        <>
          <span className="text-white"> Take </span>
          <span className="text-orange-500">control on your project's costs</span>
          <span className="text-white"> from the beginning. When You Know The Costs </span> 
          <span className="text-orange-500">You Are The Boss</span> 
        </>
      ),
      image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80"
    },
    {
      title: (
        <>
          <span className="text-orange-500">Compare offers, </span>
          <span className="text-white">chat with contractors and pick the one that </span>
          <span className="text-orange-500">best suits </span>
          <span className="text-white"> your needs</span>
        </>
      ),
      image: "https://images.unsplash.com/photo-1504615755583-2916b52192a3?auto=format&fit=crop&q=80"
    },
    {
      title: (
        <>
          <span className="text-white"> Manage all </span>
          <span className="text-orange-500">communication, payments</span>
          <span className="text-white"> and </span>
          <span className="text-orange-500">documents</span> 
          <span className="text-white"> in the app so nothing gets lost on the way </span>
        </>
      ),
      image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80"
    },
    {
      title: (
        <>
          <span className="text-orange-500">Let's get started</span>
          <span className="text-white"> on bringing your project to life </span> 
        </>
      ),
      image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80"
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      // Navigate to Authentication page instead of directly to signup
      navigate(createPageUrl('ProjectOwnerAuthentication'));
    }
  };

  const buttonText = currentSlide < slides.length - 1 ? "Next" : "Sign up";

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
          <div className="absolute inset-0 bg-black opacity-60" />
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
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}