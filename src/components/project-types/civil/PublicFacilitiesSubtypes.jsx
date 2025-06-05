import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trees, Building, Bath, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function PublicFacilitiesSubtypes({ onSelectDetail, onBack }) {
  const details = [
    { value: 'parks_recreation', label: 'Public parks and recreation areas', icon: <Trees className="h-5 w-5 text-blue-600" /> },
    { value: 'public_cemeteries', label: 'Public cemeteries', icon: <Building className="h-5 w-5 text-blue-600" /> },
    { value: 'public_restrooms', label: 'Public restrooms and shelters', icon: <Bath className="h-5 w-5 text-blue-600" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 mb-2">Step 4 of 15 (Civil - Public Facilities)</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Specific Public Facilities Project?
          </h1>
          <p className="text-gray-600">
            Select the type of public facility project.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail) => (
            <Card 
              key={detail.value}
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => onSelectDetail(detail.value)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {detail.icon}
                </div>
                <span className="font-medium">{detail.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <Button variant="ghost" onClick={onBack} className="text-gray-600">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      </div>
    </motion.div>
  );
}