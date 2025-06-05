import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Square,
  ArrowRight,
  Check,
  X
} from "lucide-react";

export default function BedroomMeasurements({ onContinue, onBack }) {
  // State for current step
  const [currentStep, setCurrentStep] = useState('dimensions');
  
  // State for dimensions
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: ''
  });

  const handleDimensionsSubmit = () => {
    // Validate dimensions
    if (!dimensions.length || !dimensions.width || !dimensions.height) {
      alert("Please fill in all dimensions");
      return;
    }
    
    // Move to next step
    setCurrentStep('next');
  };

  return (
    <AnimatePresence mode="wait">
      {currentStep === 'dimensions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          key="dimensions"
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  What are the dimensions of your bedroom?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="length">Length (feet)</Label>
                    <Input
                      id="length"
                      type="number"
                      placeholder="0"
                      value={dimensions.length}
                      onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="width">Width (feet)</Label>
                    <Input
                      id="width"
                      type="number"
                      placeholder="0"
                      value={dimensions.width}
                      onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Ceiling Height (feet)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="0"
                      value={dimensions.height}
                      onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleDimensionsSubmit}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
      )}

      {currentStep === 'next' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          key="waiting-for-next-instruction"
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Waiting for next instruction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <p>The dimensions have been collected. Ready for the next question.</p>
                
                <Button 
                  onClick={() => onContinue(dimensions)}
                  className="bg-blue-600 hover:bg-blue-700 mt-4"
                >
                  Temporarily Continue with Current Data
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep('dimensions')}
                >
                  Back to Dimensions
                </Button>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}