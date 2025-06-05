import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footprints, Bus, Brush, Lightbulb, Gauge, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function UrbanInfrastructureSubtypes({ onSelectDetail, onBack }) {
  const details = [
    { value: 'sidewalks_paths', label: 'Sidewalks and pedestrian pathways', icon: <Footprints className="h-5 w-5 text-blue-600" /> },
    { value: 'public_transit', label: 'Public transit systems (bus lanes, BRT systems)', icon: <Bus className="h-5 w-5 text-blue-600" /> },
    { value: 'streetscaping', label: 'Streetscaping and urban beautification', icon: <Brush className="h-5 w-5 text-blue-600" /> },
    { value: 'lighting_systems', label: 'Lighting systems', icon: <Lightbulb className="h-5 w-5 text-blue-600" /> },
    { value: 'traffic_signals', label: 'Traffic signal systems', icon: <Gauge className="h-5 w-5 text-blue-600" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 mb-2">Step 4 of 15 (Civil - Urban)</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Specific Urban Infrastructure Project?
          </h1>
          <p className="text-gray-600">
            Select the type of urban infrastructure project.
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