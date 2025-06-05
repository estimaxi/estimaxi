import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { 
  ArrowRight,
  HardHat, 
  User as UserIcon 
} from "lucide-react";
import {
  Card,
  CardContent
} from "@/components/ui/card";

export default function Welcome() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    if (role === 'project_owner') {
      navigate(createPageUrl('ProjectOwnerSignup'));
    } else {
      navigate(createPageUrl('ContractorSignup'));
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto text-center py-12 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Estimax</h1>
        <p className="text-xl text-gray-600 mb-12">
          The platform that connects project owners with contractors through accurate, fixed-price estimates
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-500"
            onClick={() => handleRoleSelect('project_owner')}
          >
            <CardContent className="p-8">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <UserIcon className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">I'm a Project Owner</h2>
                <p className="text-gray-600 mb-6">
                  Get accurate estimates for your construction project and find qualified contractors
                </p>
                <Button className="w-full">
                  Continue as Project Owner
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-green-500"
            onClick={() => handleRoleSelect('contractor')}
          >
            <CardContent className="p-8">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <HardHat className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">I'm a Contractor</h2>
                <p className="text-gray-600 mb-6">
                  Find new projects, verify estimates, and connect with potential clients
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Continue as Contractor
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-gray-500 text-sm italic">
          “I got 3 contractor offers in 48 hours with clear prices. Estimax made it easy.” – Sarah, TX
        </div>
      </div>
    </div>
  );
}
