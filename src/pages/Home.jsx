import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState({ code: 'en', name: 'English', flag: '🇬🇧' });

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' }
  ];

  const handleRoleSelect = (role) => {
    if (role === 'project_owner') {
      navigate(createPageUrl('ProjectOwnerIntroduction'));
    } else {
      navigate(createPageUrl('Introduction'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Language selector in top-right corner */}
      <div className="absolute top-4 right-4 z-30">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
              <Globe className="w-4 h-4 mr-2" />
              <span className="mr-1">{currentLanguage.flag}</span>
              {currentLanguage.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => setCurrentLanguage(language)}
                className="flex items-center justify-between"
              >
                <span className="flex items-center">
                  <span className="mr-2">{language.flag}</span>
                  {language.name}
                </span>
                {currentLanguage.code === language.code && (
                  <Check className="w-4 h-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main content with background image */}
      <div className="flex-1 relative">
        {/* Background image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        
        {/* Subtle overlay pattern */}
        <div 
          className="absolute inset-0 z-10 opacity-10"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E')",
          }}
        />
        
        {/* Text content */}
        <div className="absolute inset-0 z-20 p-8 flex flex-col justify-center">
          <h1 className="text-[42px] font-bold leading-tight max-w-md">
            <span className="text-white">Welcome to</span>{" "}
            <span className="text-orange-500">Estimax</span>{" "}
            <span className="text-white">where</span>{" "}
            <span className="text-orange-500">Construction projects are done</span>{" "}
            <span className="text-white">right</span>
          </h1>
        </div>
      </div>

      {/* Bottom action buttons on orange background */}
      <div className="bg-orange-500 p-6">
        <div className="mb-4 text-white text-xl font-semibold text-center">
          Get Started As
        </div>
        
        <button 
          onClick={() => handleRoleSelect('project_owner')}
          className="w-full mb-3 py-4 bg-transparent border-2 border-white rounded-lg text-white text-lg font-medium hover:bg-orange-600 transition-colors"
        >
          Project Owner
        </button>
        
        <button 
          onClick={() => handleRoleSelect('contractor')}
          className="w-full py-4 bg-white rounded-lg text-orange-500 text-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Contractor
        </button>
      </div>
    </div>
  );
}