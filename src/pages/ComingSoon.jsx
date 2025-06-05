import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function ComingSoon() {
  const navigate = useNavigate();

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
        <h1 className="text-xl font-medium flex-1 text-center mr-8">Coming Soon</h1>
      </div>

      <div className="flex flex-col items-center justify-center p-8 text-center mt-20">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl">🚧</span>
        </div>
        <h2 className="text-2xl font-bold mb-3">Coming Soon</h2>
        <p className="text-gray-600 mb-8">
          This language is not yet available. Please check back later or select English to continue.
        </p>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}