import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Train, 
  Zap, 
  Trees, 
  Building2, 
  Landmark,
  ArrowLeft 
} from "lucide-react";
import { motion } from "framer-motion";

export default function CivilSubtypes({ onSelectSubtype, onBack }) {
  const subtypes = [
    { 
      value: 'transportation_infrastructure', 
      label: 'Transportation Infrastructure', 
      icon: <Train className="h-5 w-5 text-blue-600" />,
      description: 'Roads, bridges, railways, airports, and ports'
    },
    { 
      value: 'utilities_energy', 
      label: 'Utilities & Energy', 
      icon: <Zap className="h-5 w-5 text-blue-600" />,
      description: 'Power lines, water systems, telecommunications'
    },
    { 
      value: 'environmental_public_works', 
      label: 'Environmental & Public Works', 
      icon: <Trees className="h-5 w-5 text-blue-600" />,
      description: 'Parks, water treatment, flood control'
    },
    { 
      value: 'urban_infrastructure', 
      label: 'Urban Infrastructure', 
      icon: <Building2 className="h-5 w-5 text-blue-600" />,
      description: 'Street lighting, sidewalks, urban planning'
    },
    { 
      value: 'public_facilities', 
      label: 'Public Facilities', 
      icon: <Landmark className="h-5 w-5 text-blue-600" />,
      description: 'Community centers, public spaces'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 mb-2">Step 3 of 15 (Civil)</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What kind of Civil project are you looking for?
          </h1>
          <p className="text-gray-600">
            Select the type of civil infrastructure project you need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subtypes.map((subtype) => (
            <Card 
              key={subtype.value}
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => onSelectSubtype(subtype.value)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {subtype.icon}
                  </div>
                  <span className="font-medium">{subtype.label}</span>
                </div>
                <p className="text-sm text-gray-600 ml-14">
                  {subtype.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-gray-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
    </motion.div>
  );
}