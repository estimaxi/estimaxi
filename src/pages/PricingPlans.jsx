import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function PricingPlans() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const handleContinue = () => {
    // Here you would handle the subscription process
    // For now, just navigate back to the dashboard
    navigate(createPageUrl('ContractorDashboard'));
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-center flex-1 mr-10">Pricing Plan</h1>
        </div>

        {/* Main Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Pricing Plan</h2>
          <p className="text-gray-600">
            Choose a subscription plan to unlock all the functionality of the application
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="space-y-4 mb-8">
          {/* Yearly Plan with Badge */}
          <div 
            className={`border rounded-xl p-4 relative ${
              selectedPlan === 'yearly' ? 'border-orange-500 border-2' : 'border-gray-200'
            }`}
            onClick={() => setSelectedPlan('yearly')}
          >
            <div className="absolute -top-3 right-4 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              Save 50%
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Unlimited Plan</h3>
                <p className="text-sm text-gray-600">$124 billed unlimited plan</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold">$8</span>
                <span className="text-gray-600">/mo</span>
              </div>
            </div>
          </div>

          {/* 1 Year Plan */}
          <div 
            className={`border rounded-xl p-4 ${
              selectedPlan === 'annual' ? 'border-orange-500 border-2' : 'border-gray-200'
            }`}
            onClick={() => setSelectedPlan('annual')}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">1 Year Plan</h3>
                <p className="text-sm text-gray-600">$224 billed every year</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold">$12</span>
                <span className="text-gray-600">/mo</span>
              </div>
            </div>
          </div>

          {/* Monthly Plan */}
          <div 
            className={`border rounded-xl p-4 ${
              selectedPlan === 'monthly' ? 'border-orange-500 border-2' : 'border-gray-200'
            }`}
            onClick={() => setSelectedPlan('monthly')}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Unlimited Plan</h3>
                <p className="text-sm text-gray-600">$19 billed every month</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold">$19</span>
                <span className="text-gray-600">/mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          className="w-full bg-orange-500 hover:bg-orange-600 py-6 text-lg"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}