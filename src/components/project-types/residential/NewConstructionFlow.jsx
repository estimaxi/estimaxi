
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HomeIcon, Building, PlusCircle, ArrowLeft, Castle, Home, TowerControl, Upload, FileText, Check, X, ChevronUp, ChevronDown, Plus, Minus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewConstructionFlow({ onSelect, onBack }) {
  const [step, setStep] = useState('initial');
  const [currentFloor, setCurrentFloor] = useState(1);
  const [constructionType, setConstructionType] = useState(null);
  const [hasPlans, setHasPlans] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [engineeringDetails, setEngineeringDetails] = useState({
    floors: null,
    squareFootage: '',
    hasBasement: null,
    basementPurpose: null,
    otherBasementPurpose: '',
    foundation: null,
    otherFoundation: '',
    floorPlans: {
      1: {
        kitchen: 0,
        livingRoom: 0,
        diningRoom: 0,
        masterBedroom: 0,
        secondaryBedroom: 0,
        guestBathroom: 0,
        office: 0,
        sportsRoom: 0,
        spa: 0
      }
    }
  });

  const handleInitialSelect = (type) => {
    if (type === 'single_family') {
      setConstructionType(type);
      setStep('single_family_type');
    } else {
      onSelect(type);
    }
  };

  const handleSingleFamilySelect = (subtype) => {
    if (subtype === 'detached') {
      setConstructionType('detached');
      setStep('engineering_plans');
    } else {
      onSelect(`single_family_${subtype}`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleContinue = () => {
    // Here you would typically handle the file upload and continue with the estimate
    onSelect('detached_with_plans', selectedFile);
  };

  const handleGetEstimate = () => {
    // Move to floor count question
    setStep('floor_count');
  };

  const handleFloorCountSelect = (count) => {
    setEngineeringDetails(prev => ({ ...prev, floors: count }));
    setStep('square_footage');
  };

  const handleSquareFootageSubmit = () => {
    setStep('has_basement');
  };

  const handleBasementSelect = (hasBasement) => {
    setEngineeringDetails(prev => ({ ...prev, hasBasement }));
    
    if (hasBasement) {
      setStep('basement_purpose');
    } else {
      // Complete the flow, send all gathered data
      setStep('foundation_selection');
    }
  };

  const handleBasementPurposeSelect = (purpose) => {
    setEngineeringDetails(prev => ({ ...prev, basementPurpose: purpose }));
    
    if (purpose === 'other') {
      setStep('other_basement_purpose');
    } else {
      // Continue to foundation selection
      setStep('foundation_selection');
    }
  };

  const handleOtherBasementPurposeSubmit = () => {
    // Continue to foundation selection
    setStep('foundation_selection');
  };

  const handleFoundationSelect = (foundation) => {
    setEngineeringDetails(prev => ({ ...prev, foundation }));
    
    if (foundation === 'other') {
      setStep('other_foundation');
    } else {
      // Continue to rooms selection
      setStep('rooms_selection');
    }
  };

  const handleOtherFoundationSubmit = () => {
    // Continue to rooms selection
    setStep('rooms_selection');
  };
  
  const handleRoomCountChange = (roomType, increment) => {
    setEngineeringDetails(prev => ({
      ...prev,
      floorPlans: {
        ...prev.floorPlans,
        [currentFloor]: {
          ...prev.floorPlans[currentFloor],
          [roomType]: Math.max(0, prev.floorPlans[currentFloor][roomType] + increment)
        }
      }
    }));
  };

  const handleFloorSubmit = () => {
    if (currentFloor < engineeringDetails.floors) {
      // Initialize next floor's room configuration
      setEngineeringDetails(prev => ({
        ...prev,
        floorPlans: {
          ...prev.floorPlans,
          [currentFloor + 1]: {
            kitchen: 0,
            livingRoom: 0,
            diningRoom: 0,
            masterBedroom: 0,
            secondaryBedroom: 0,
            guestBathroom: 0,
            office: 0,
            sportsRoom: 0,
            spa: 0
          }
        }
      }));
      setCurrentFloor(prev => prev + 1);
    } else {
      // Show summary page
      setStep('summary');
    }
  };
  
  const handleSummarySubmit = () => {
    // Complete the flow with all gathered data
    onSelect('detached_engineering_only', engineeringDetails);
  };
  
  // Get room count total across all floors
  const getTotalRoomCount = (roomType) => {
    return Object.values(engineeringDetails.floorPlans).reduce(
      (total, floor) => total + floor[roomType], 0
    );
  };
  
  // Format room name for display
  const formatRoomName = (roomType) => {
    const formattedName = roomType.replace(/([A-Z])/g, ' $1').trim();
    return formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
  };
  
  // Get foundation display name
  const getFoundationName = () => {
    if (engineeringDetails.foundation === 'pier_and_beam') return 'Pier and beam';
    if (engineeringDetails.foundation === 'concrete_slab') return 'Concrete slab';
    return engineeringDetails.otherFoundation;
  };
  
  // Get basement purpose display name
  const getBasementPurpose = () => {
    if (!engineeringDetails.hasBasement) return 'No basement';
    if (engineeringDetails.basementPurpose === 'other') return engineeringDetails.otherBasementPurpose;
    return engineeringDetails.basementPurpose.charAt(0).toUpperCase() + engineeringDetails.basementPurpose.slice(1);
  };

  // New foundation selection step
  if (step === 'foundation_selection') {
    const foundationOptions = [
      { value: 'pier_and_beam', label: 'Pier and beam' },
      { value: 'concrete_slab', label: 'Concrete slab' },
      { value: 'other', label: 'Other' }
    ];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step 11 of 15</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              What kind of foundation would you like?
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {foundationOptions.map(option => (
              <Card 
                key={option.value}
                className="cursor-pointer hover:border-blue-500 transition-all"
                onClick={() => handleFoundationSelect(option.value)}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <span className="font-medium">{option.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => engineeringDetails.hasBasement ? setStep('basement_purpose') : setStep('has_basement')}
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

  // Other foundation input step
  if (step === 'other_foundation') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step 12 of 15</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              What kind of foundation is it?
            </h1>
            <p className="text-gray-600">
              Please describe the foundation type
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <Textarea
                placeholder="Describe the type of foundation you want..."
                value={engineeringDetails.otherFoundation}
                onChange={(e) => setEngineeringDetails(prev => ({ 
                  ...prev, 
                  otherFoundation: e.target.value 
                }))}
                className="h-32 mb-6"
              />
              <Button 
                onClick={handleOtherFoundationSubmit}
                className="w-full bg-black hover:bg-gray-800"
              >
                Continue
                <ArrowLeft className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('foundation_selection')}
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

  // Updated rooms selection step
  if (step === 'rooms_selection') {
    const roomOptions = [
      { value: 'kitchen', label: 'Kitchen' },
      { value: 'livingRoom', label: 'Living Room' },
      { value: 'diningRoom', label: 'Dining Room' },
      { value: 'masterBedroom', label: 'Master Bedroom' },
      { value: 'secondaryBedroom', label: 'Secondary Bedroom' },
      { value: 'guestBathroom', label: 'Guest Bathroom' },
      { value: 'office', label: 'Office' },
      { value: 'sportsRoom', label: 'Sports Room' },
      { value: 'spa', label: 'Spa' }
    ];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step {12 + currentFloor} of {14 + Number(engineeringDetails.floors)}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              What rooms do you want to have on the {currentFloor === 1 ? 'first' : currentFloor === 2 ? 'second' : currentFloor === 3 ? 'third' : `${currentFloor}th`} floor?
            </h1>
            <p className="text-gray-600">
              Select the number of each room type
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {roomOptions.map(room => (
                  <div key={room.value} className="flex items-center justify-between py-2 border-b">
                    <span className="font-medium">{room.label}</span>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRoomCountChange(room.value, -1)}
                        disabled={engineeringDetails.floorPlans[currentFloor][room.value] === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">
                        {engineeringDetails.floorPlans[currentFloor][room.value]}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRoomCountChange(room.value, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={handleFloorSubmit}
                className="mt-6 w-full bg-black hover:bg-gray-800"
              >
                {currentFloor < engineeringDetails.floors ? 'Continue to Next Floor' : 'Complete Floor Plans'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => {
                if (currentFloor > 1) {
                  setCurrentFloor(prev => prev - 1);
                } else {
                  setStep(engineeringDetails.foundation === 'other' ? 'other_foundation' : 'foundation_selection');
                }
              }}
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

  if (step === 'floor_count') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step 7 of 15</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How many floors do you want to have in your new house?
            </h1>
            <p className="text-gray-600">
              Not including basement
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, '5+'].map((count) => (
              <Card 
                key={count}
                className="cursor-pointer hover:border-blue-500 transition-all"
                onClick={() => handleFloorCountSelect(count)}
              >
                <CardContent className="p-6 flex items-center justify-center">
                  <span className="font-medium text-xl">{count}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('engineering_plans')}
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

  if (step === 'square_footage') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step 8 of 15</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              What is the square footage of your desired house?
            </h1>
            <p className="text-gray-600">
              One floor only
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <Label className="text-lg font-medium mb-4 block">
                Square Footage
              </Label>
              <Input
                type="number"
                placeholder="e.g., 1500"
                value={engineeringDetails.squareFootage}
                onChange={(e) => setEngineeringDetails(prev => ({ 
                  ...prev, 
                  squareFootage: e.target.value 
                }))}
                className="mb-6"
              />
              <Button 
                onClick={handleSquareFootageSubmit}
                className="w-full bg-black hover:bg-gray-800"
                disabled={!engineeringDetails.squareFootage}
              >
                Continue
                <ArrowLeft className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('floor_count')}
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

  if (step === 'has_basement') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step 9 of 15</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Would you like to have a basement?
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => handleBasementSelect(true)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium">Yes</span>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => {
                setEngineeringDetails(prev => ({ ...prev, hasBasement: false }));
                setStep('foundation_selection');
              }}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                <span className="font-medium">No</span>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('square_footage')}
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

  if (step === 'basement_purpose') {
    const basementOptions = [
      { value: 'storage', label: 'Storage' },
      { value: 'bedroom', label: 'Bedroom' },
      { value: 'entertainment', label: 'Entertainment room' },
      { value: 'kitchen', label: 'Kitchen' },
      { value: 'bathroom', label: 'Bathroom' },
      { value: 'other', label: 'Other' }
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step 10 of 15</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              What do you want the basement to serve as?
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {basementOptions.map(option => (
              <Card 
                key={option.value}
                className="cursor-pointer hover:border-blue-500 transition-all"
                onClick={() => handleBasementPurposeSelect(option.value)}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <span className="font-medium">{option.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('has_basement')}
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

  if (step === 'other_basement_purpose') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step 11 of 15</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              What room is it?
            </h1>
            <p className="text-gray-600">
              Please describe the basement purpose
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <Textarea
                placeholder="Describe the intended purpose of your basement..."
                value={engineeringDetails.otherBasementPurpose}
                onChange={(e) => setEngineeringDetails(prev => ({ 
                  ...prev, 
                  otherBasementPurpose: e.target.value 
                }))}
                className="h-32 mb-6"
              />
              <Button 
                onClick={handleOtherBasementPurposeSubmit}
                className="w-full bg-black hover:bg-gray-800"
                disabled={!engineeringDetails.otherBasementPurpose}
              >
                Continue
                <ArrowLeft className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('basement_purpose')}
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

  if (step === 'engineering_plans') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step 6 of 15</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Do you have engineering plans of the desired structure?
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => setHasPlans(true)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium">Yes</span>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => setHasPlans(false)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                <span className="font-medium">No</span>
              </CardContent>
            </Card>
          </div>

          {hasPlans === true && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Card>
                <CardContent className="p-6">
                  <Label className="text-lg font-medium mb-4 block">
                    Please upload engineering plans of the desired structure
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                  </div>
                  <Button 
                    onClick={handleContinue}
                    className="mt-6 w-full bg-black hover:bg-gray-800"
                    disabled={!selectedFile}
                  >
                    Continue Estimate
                    <ArrowLeft className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {hasPlans === false && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="text-gray-700 mb-6 leading-relaxed">
                    Great, we have all the information we need to give you an Estimax. Your Estimax will be only for engineering plans for the Detached home and once you get the engineering plans you could upload them here and continue with finding a contractor to execute these plans.
                    <br /><br />
                    For the construction phase you will get a new Estimax. The engineer that will win your project will design the new structure and withdraw the necessary permits for your home.
                    <br /><br />
                    Some engineers don't include permits withdrawing and if they don't, you will have to do it yourself by contacting the relevant personnel in your area. In the engineer's profile you can see if they provide permits.
                  </div>
                  <Button 
                    onClick={handleGetEstimate}
                    className="w-full bg-black hover:bg-gray-800"
                  >
                    Get Estimate for Engineering plans
                    <ArrowLeft className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => {
                setHasPlans(null);
                setStep('single_family_type');
              }}
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

  if (step === 'single_family_type') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step 5 of 15</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              What type of single-family home?
            </h1>
            <p className="text-gray-600">
              Select the style of home you want to build
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => handleSingleFamilySelect('detached')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">Detached home</span>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => handleSingleFamilySelect('luxury')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Castle className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">Luxury home</span>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => handleSingleFamilySelect('townhouse')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <TowerControl className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">Townhouse</span>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => handleSingleFamilySelect('other')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <PlusCircle className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">Other</span>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('initial')}
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

    // Summary page
    if (step === 'summary') {
      const roomTypes = ['kitchen', 'livingRoom', 'diningRoom', 'masterBedroom', 'secondaryBedroom', 'guestBathroom', 'office', 'sportsRoom', 'spa'];
      
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-sm text-gray-500 mb-2">Final Step</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Project Summary
              </h1>
              <p className="text-gray-600">
                Review the details of your new construction project
              </p>
            </div>
  
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>House Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Number of Floors</h3>
                      <p className="mt-1 text-lg">{engineeringDetails.floors}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Square Footage</h3>
                      <p className="mt-1 text-lg">{engineeringDetails.squareFootage} sq ft</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Foundation Type</h3>
                      <p className="mt-1 text-lg">{getFoundationName()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Basement</h3>
                      <p className="mt-1 text-lg">{getBasementPurpose()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
  
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Room Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Room totals across all floors */}
                  <div>
                    <h3 className="font-semibold mb-3">Total Rooms</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {roomTypes.map(roomType => 
                        getTotalRoomCount(roomType) > 0 && (
                          <div key={roomType} className="bg-gray-50 p-3 rounded">
                            <span className="font-medium">{formatRoomName(roomType)}</span>
                            <span className="ml-2 text-blue-600 font-semibold">{getTotalRoomCount(roomType)}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  
                  {/* Floor by floor breakdown */}
                  {Object.keys(engineeringDetails.floorPlans).map(floorNum => (
                    <div key={floorNum}>
                      <h3 className="font-semibold mb-2">
                        {floorNum === '1' ? 'First' : floorNum === '2' ? 'Second' : floorNum === '3' ? 'Third' : `${floorNum}th`} Floor
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {roomTypes.map(roomType => 
                          engineeringDetails.floorPlans[floorNum][roomType] > 0 && (
                            <div key={roomType} className="bg-gray-50 p-2 rounded text-sm">
                              <span>{formatRoomName(roomType)}</span>
                              <span className="ml-2 text-blue-600 font-semibold">{engineeringDetails.floorPlans[floorNum][roomType]}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
  
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <Button 
                variant="outline"
                onClick={() => {
                  setCurrentFloor(engineeringDetails.floors);
                  setStep('rooms_selection');
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              
              <Button 
                onClick={handleSummarySubmit}
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Get Estimate for Engineering Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      );
    }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 mb-2">Step 4 of 15</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What do you want to build?
          </h1>
          <p className="text-gray-600">
            Select the type of new construction project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => handleInitialSelect('single_family')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <HomeIcon className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium">Single-family home</span>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => handleInitialSelect('multi_family')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium">Multi-family homes</span>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => handleInitialSelect('other')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <PlusCircle className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium">Other</span>
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
