
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  ArrowRight, 
  ArrowLeft, 
  Bath, 
  UtensilsCrossed, 
  Bed, 
  Sofa, 
  Warehouse, 
  Briefcase, 
  Trees, 
  Car, 
  RefreshCw 
} from "lucide-react";
import { motion } from "framer-motion";

export default function ResidentialSubtypes({ onSelectSubtype, onBack }) {
  const handleKitchenRemodel = () => {
    onSelectSubtype('kitchen_remodel');
  };

  const handleBedroomRenovation = () => {
    onSelectSubtype('bedroom_renovation');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 mb-2">Step 3 of 15</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What kind of project are you looking for?
          </h1>
          <p className="text-gray-600">
            Select the type of residential project you need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => onSelectSubtype('new_construction')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <PlusCircle className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium">New construction</span>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => onSelectSubtype('new_addition')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium">New Addition</span>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => onSelectSubtype('bathroom_remodel')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bath className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium">Bathroom remodeling</span>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all"
            onClick={handleKitchenRemodel}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium">Kitchen remodeling</span>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all"
            onClick={handleBedroomRenovation}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bed className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium">Bedroom Renovation</span>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => onSelectSubtype('living_room_renovation')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Sofa className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium">Living room Renovation</span>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => onSelectSubtype('basement_finishing')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Warehouse className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium">Basement Finishing</span>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => onSelectSubtype('home_office')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium">Home office construction</span>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => onSelectSubtype('landscaping')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Trees className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium">Landscaping</span>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => onSelectSubtype('garage_conversion')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Car className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium">Garage conversion</span>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => onSelectSubtype('room_conversion')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium">Room conversion/upgrade</span>
            </CardContent>
          </Card>
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
