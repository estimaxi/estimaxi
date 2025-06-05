import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Sun, BatteryCharging, Network, ArrowLeft } from "lucide-react"; // Replaced Nuclear with Zap for general power
import { motion } from "framer-motion";

export default function PowerEnergySubtypes({ onSelectSubtype, onBack }) {
  const subtypes = [
    { value: 'power_plants', label: 'Power plants (gas, coal, nuclear)', icon: <Zap className="h-5 w-5 text-blue-600" /> },
    { value: 'renewable_energy', label: 'Renewable energy plants (solar farms, wind farms, hydroelectric)', icon: <Sun className="h-5 w-5 text-blue-600" /> },
    { value: 'battery_storage', label: 'Battery storage stations', icon: <BatteryCharging className="h-5 w-5 text-blue-600" /> },
    { value: 'substations', label: 'Substations & transformer stations', icon: <Network className="h-5 w-5 text-blue-600" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 mb-2">Step 4 of 15 (Industrial)</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Type of Power & Energy Facility?
          </h1>
          <p className="text-gray-600">
            Select the specific type of power and energy facility.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subtypes.map((subtype) => (
            <Card 
              key={subtype.value}
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => onSelectSubtype(subtype.value)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {subtype.icon}
                </div>
                <span className="font-medium">{subtype.label}</span>
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