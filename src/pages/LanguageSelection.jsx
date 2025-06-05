
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronLeft, Search } from "lucide-react";

export default function LanguageSelection() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' }
  ];

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode);
  };

  const handleDone = () => {
    // If English is selected, go to Business Information page (step 2)
    if (selectedLanguage === 'en') {
      // Using both state and URL parameter to ensure step 2 is shown
      navigate(createPageUrl('ContractorSignup'), { 
        state: { step: 2 } 
      });
    } else {
      // For other languages, go to a blank coming soon page
      navigate(createPageUrl('ComingSoon'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-500 text-white px-4 py-3 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-medium flex-1 text-center mr-8">Login</h1>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Choose Your Language</h2>
        <p className="text-gray-600 text-sm mb-4">
          Please search and then choose your personal language.
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Language List */}
        <div className="space-y-2">
          {filteredLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`w-full flex items-center justify-between p-4 rounded-lg ${
                selectedLanguage === language.code 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">{language.flag}</span>
                <span>{language.name}</span>
              </div>
              {selectedLanguage === language.code && (
                <Check className="h-5 w-5" />
              )}
            </button>
          ))}
        </div>

        {/* Done Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={handleDone}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
