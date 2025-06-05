
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  HomeIcon, 
  Building, 
  ArrowLeft, 
  ArrowRight, 
  Bed, 
  Bath, 
  CookingPot, 
  Briefcase,
  ShoppingBag,
  Warehouse, 
  PackageOpen, 
  Tv, 
  Plus, 
  Minus,
  PlusCircle,
  Check,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Upload } from "lucide-react";
import { VideoIcon, UserIcon } from 'lucide-react';

export default function NewAdditionFlow({ onSelect, onBack }) {
  const [step, setStep] = useState('space_selection');
  const [currentFloor, setCurrentFloor] = useState(1);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [additionDetails, setAdditionDetails] = useState({
    spaceType: null,
    floorCount: 1,
    floorPlans: {
      1: {
        storage: 0,
        bedroom: 0,
        entertainmentRoom: 0,
        kitchen: 0,
        bathroom: 0,
        other: 0
      }
    },
    measurements: {
      length: '',
      width: '',
      height: ''
    },
    desiredMeasurements: {
      length: '',
      width: '',
      height: ''
    }
  });
  const [hasDesiredPlans, setHasDesiredPlans] = useState(null);
  const [hasExistingPlans, setHasExistingPlans] = useState(null);
  const [desiredPlansFile, setDesiredPlansFile] = useState(null);
  const [existingPlansFile, setExistingPlansFile] = useState(null);
  const [bedroomMeasurements, setBedroomMeasurements] = useState({
    length: '',
    width: '',
    height: ''
  });
  const [demolishWalls, setDemolishWalls] = useState(null);
  const [wallMeasurements, setWallMeasurements] = useState({
    length: '',
    height: ''
  });
  const [hasBedroomPlans, setHasBedroomPlans] = useState(null);
  const [bedroomPlansFile, setBedroomPlansFile] = useState(null);
  
  const handleSpaceSelect = (spaceType) => {
    setAdditionDetails(prev => ({ ...prev, spaceType }));
    
    if (spaceType === 'entire_floor') {
      setStep('floor_count');
    } else if (spaceType === 'bedroom') {
      setStep('bedroom_measurement_instructions');
    } else {
      // For other specific rooms, we'd move to their respective flows
      onSelect(spaceType);
    }
  };

  const handleFloorCountChange = (increment) => {
    setAdditionDetails(prev => ({
      ...prev,
      floorCount: Math.max(1, prev.floorCount + increment)
    }));
  };

  const handleFloorCountSubmit = () => {
    // Move to room selection
    setStep('room_selection');
  };

  const handleRoomCountChange = (roomType, increment) => {
    setAdditionDetails(prev => ({
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

  const handleFloorRoomsSubmit = () => {
    if (currentFloor < additionDetails.floorCount) {
      // Initialize next floor's room configuration
      setAdditionDetails(prev => ({
        ...prev,
        floorPlans: {
          ...prev.floorPlans,
          [currentFloor + 1]: {
            storage: 0,
            bedroom: 0,
            entertainmentRoom: 0,
            kitchen: 0,
            bathroom: 0,
            other: 0
          }
        }
      }));
      setCurrentFloor(prev => prev + 1);
    } else {
      // Move to measurement instructions
      setStep('measurement_instructions');
    }
  };

  const handleMeasurementSubmit = () => {
    // Move to desired measurements step
    setStep('desired_measurements');
  };

  const handleContinueToMeasurements = () => {
    setStep('measurements');
  };

  const handleMeasurementChange = (field, value) => {
    setAdditionDetails(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [field]: value
      }
    }));
  };

  const handleDesiredMeasurementChange = (field, value) => {
    setAdditionDetails(prev => ({
      ...prev,
      desiredMeasurements: {
        ...prev.desiredMeasurements,
        [field]: value
      }
    }));
  };

  const handleUseSameMeasurements = () => {
    setAdditionDetails(prev => ({
      ...prev,
      desiredMeasurements: {
        length: prev.measurements.length,
        width: prev.measurements.width,
        height: prev.measurements.height
      }
    }));
  };

  const handleFinalSubmit = () => {
    // Move to engineering plans question instead of completing
    setStep('engineering_plans');
  };

  const handleDesiredPlansFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDesiredPlansFile(file);
    }
  };

  const handleExistingPlansFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExistingPlansFile(file);
    }
  };

  const handleDesiredPlansContinue = () => {
    setStep('existing_plans');
  };

  const handleGetEstimate = () => {
    // Complete the flow with all gathered data
    onSelect('entire_floor_addition', {
      ...additionDetails,
      desiredPlans: desiredPlansFile,
      existingPlans: existingPlansFile,
      hasDesiredPlans,
      hasExistingPlans
    });
  };

  // New handlers for bedroom flow
  const handleBedroomMeasurementChange = (field, value) => {
    setBedroomMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleWallMeasurementChange = (field, value) => {
    setWallMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleBedroomPlansFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBedroomPlansFile(file);
    }
  };
  
  const handleBedroomMeasurementSubmit = () => {
    setStep('bedroom_demolish_walls');
  };
  
  const handleDemolishWallsAnswer = (answer) => {
    setDemolishWalls(answer);
    if (answer) {
      setStep('bedroom_wall_measurements');
    } else {
      setStep('bedroom_plans');
    }
  };
  
  const handleWallMeasurementsSubmit = () => {
    setStep('bedroom_plans');
  };
  
  const handleBedroomPlansAnswer = (answer) => {
    setHasBedroomPlans(answer);
    if (!answer) {
      // Complete flow without plans
      handleBedroomEstimate();
    }
  };
  
  const handleBedroomPlansSubmit = () => {
    handleBedroomEstimate();
  };
  
  const handleBedroomEstimate = () => {
    // Complete the flow with all gathered data for bedroom
    onSelect('bedroom_addition', {
      measurements: bedroomMeasurements,
      demolishWalls,
      wallMeasurements: demolishWalls ? wallMeasurements : null,
      hasPlans: hasBedroomPlans,
      plansFile: bedroomPlansFile
    });
  };

  // Space selection step
  if (step === 'space_selection') {
    const spaceOptions = [
      { value: 'entire_floor', label: 'Entire floor', icon: <Building className="h-5 w-5" /> },
      { value: 'bedroom', label: 'Bedroom', icon: <Bed className="h-5 w-5" /> },
      { value: 'bathroom', label: 'Bathroom', icon: <Bath className="h-5 w-5" /> },
      { value: 'kitchen', label: 'Kitchen', icon: <CookingPot className="h-5 w-5" /> },
      { value: 'home_office', label: 'Home office', icon: <Briefcase className="h-5 w-5" /> },
      { value: 'laundry', label: 'Laundry', icon: <ShoppingBag className="h-5 w-5" /> },
      { value: 'garage', label: 'Garage', icon: <Warehouse className="h-5 w-5" /> },
      { value: 'storage', label: 'Storage', icon: <PackageOpen className="h-5 w-5" /> },
      { value: 'entertainment', label: 'Entertainment', icon: <Tv className="h-5 w-5" /> },
      { value: 'other', label: 'Other', icon: <PlusCircle className="h-5 w-5" /> }
    ];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step 1 of 9</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              What space do you want to add?
            </h1>
            <p className="text-gray-600">
              Select the type of addition you're planning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spaceOptions.map(option => (
              <Card 
                key={option.value}
                className="cursor-pointer hover:border-blue-500 transition-all"
                onClick={() => handleSpaceSelect(option.value)}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {option.icon}
                  </div>
                  <span className="font-medium">{option.label}</span>
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

  // Floor count selection
  if (step === 'floor_count') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step 2 of 9</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How many floors do you want to add?
            </h1>
          </div>

          <Card className="mx-auto max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-6 my-8">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleFloorCountChange(-1)}
                  disabled={additionDetails.floorCount <= 1}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="text-5xl font-bold w-16 text-center">
                  {additionDetails.floorCount}
                </span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleFloorCountChange(1)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              
              <Button 
                onClick={handleFloorCountSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('space_selection')}
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

  // Room selection for each floor
  if (step === 'room_selection') {
    const roomOptions = [
      { value: 'storage', label: 'Storage', icon: <PackageOpen className="h-4 w-4" /> },
      { value: 'bedroom', label: 'Bedroom', icon: <Bed className="h-4 w-4" /> },
      { value: 'entertainmentRoom', label: 'Entertainment Room', icon: <Tv className="h-4 w-4" /> },
      { value: 'kitchen', label: 'Kitchen', icon: <CookingPot className="h-4 w-4" /> },
      { value: 'bathroom', label: 'Bathroom', icon: <Bath className="h-4 w-4" /> },
      { value: 'other', label: 'Other', icon: <PlusCircle className="h-4 w-4" /> }
    ];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step {2 + currentFloor} of {4 + additionDetails.floorCount}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              What rooms do you want to have in the {currentFloor === 1 ? 'first' : currentFloor === 2 ? 'second' : currentFloor === 3 ? 'third' : `${currentFloor}th`} floor?
            </h1>
            <p className="text-gray-600">
              Select the number of each room type
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {roomOptions.map(room => (
                  <div key={room.value} className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {room.icon}
                      </div>
                      <span className="font-medium">{room.label}</span>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRoomCountChange(room.value, -1)}
                        disabled={additionDetails.floorPlans[currentFloor][room.value] === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">
                        {additionDetails.floorPlans[currentFloor][room.value]}
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
                onClick={handleFloorRoomsSubmit}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700"
              >
                {currentFloor < additionDetails.floorCount ? 'Continue to Next Floor' : 'Continue'}
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
                  setStep('floor_count');
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

  // Measurement instructions step
  if (step === 'measurement_instructions') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step {3 + additionDetails.floorCount} of {7 + additionDetails.floorCount}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Measurements Needed
            </h1>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 text-lg text-gray-700">
                  <p className="mb-4">
                    Please prepare a measuring tape or a laser measure for the next question. You will need to do some measurements.
                  </p>
                  <p>
                    If you are struggling to do this, you can ask for assistance from one of our estimators either by a video call or by a face-to-face meeting.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setHelpDialogOpen(true)}
                  >
                    Click here for help
                  </Button>
                  
                  <Button
                    className="flex-1 bg-black hover:bg-gray-800"
                    onClick={handleContinueToMeasurements}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl mb-4">How would you like assistance?</DialogTitle>
                <DialogDescription>
                  Choose how you'd like one of our estimators to help you with measurements.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 gap-4 pt-4">
                <Button
                  variant="outline"
                  className="justify-start p-4 h-auto"
                  onClick={() => {
                    setHelpDialogOpen(false);
                    // Handle video call request
                    alert("A representative will contact you to schedule a video call.");
                  }}
                >
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-blue-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Make a video call</div>
                      <div className="text-sm text-gray-500">Schedule a virtual appointment with an estimator</div>
                    </div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="justify-start p-4 h-auto"
                  onClick={() => {
                    setHelpDialogOpen(false);
                    // Handle in-person visit request
                    alert("A representative will contact you to schedule an in-person visit.");
                  }}
                >
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-green-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Ask for a face-to-face visit</div>
                      <div className="text-sm text-gray-500">Schedule an in-person appointment at your location</div>
                    </div>
                  </div>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('room_selection')}
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

  // Measurements step
  if (step === 'measurements') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step {4 + additionDetails.floorCount} of {7 + additionDetails.floorCount}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Please provide your existing floor measurements
            </h1>
            <p className="text-gray-600">
              Enter the dimensions of the existing floor where the addition will connect
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                    Length (feet)
                  </Label>
                  <Input
                    id="length"
                    type="number"
                    placeholder="Enter length"
                    value={additionDetails.measurements.length}
                    onChange={(e) => handleMeasurementChange('length', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                    Width (feet)
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="Enter width"
                    value={additionDetails.measurements.width}
                    onChange={(e) => handleMeasurementChange('width', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height (feet)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter height"
                    value={additionDetails.measurements.height}
                    onChange={(e) => handleMeasurementChange('height', e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleMeasurementSubmit}
                className="mt-6 w-full bg-black hover:bg-gray-800"
                disabled={!additionDetails.measurements.length || !additionDetails.measurements.width || !additionDetails.measurements.height}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('measurement_instructions')}
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

  // Add new desired measurements step
  if (step === 'desired_measurements') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step {5 + additionDetails.floorCount} of {7 + additionDetails.floorCount}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Please provide your desired floor measurements
            </h1>
            <p className="text-gray-600">
              Enter the dimensions you want for your new addition
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <Button 
                variant="outline" 
                onClick={handleUseSameMeasurements}
                className="mb-6 w-full"
              >
                Same as existing floor
              </Button>
            
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="desired-length" className="block text-sm font-medium text-gray-700 mb-1">
                    Length (feet)
                  </Label>
                  <Input
                    id="desired-length"
                    type="number"
                    placeholder="Enter length"
                    value={additionDetails.desiredMeasurements.length}
                    onChange={(e) => handleDesiredMeasurementChange('length', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="desired-width" className="block text-sm font-medium text-gray-700 mb-1">
                    Width (feet)
                  </Label>
                  <Input
                    id="desired-width"
                    type="number"
                    placeholder="Enter width"
                    value={additionDetails.desiredMeasurements.width}
                    onChange={(e) => handleDesiredMeasurementChange('width', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="desired-height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height (feet)
                  </Label>
                  <Input
                    id="desired-height"
                    type="number"
                    placeholder="Enter height"
                    value={additionDetails.desiredMeasurements.height}
                    onChange={(e) => handleDesiredMeasurementChange('height', e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleFinalSubmit}
                className="mt-6 w-full bg-black hover:bg-gray-800"
                disabled={!additionDetails.desiredMeasurements.length || !additionDetails.desiredMeasurements.width || !additionDetails.desiredMeasurements.height}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('measurements')}
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

  // Engineering plans question
  if (step === 'engineering_plans') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step {6 + additionDetails.floorCount} of {7 + additionDetails.floorCount}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Do you have engineering plans of desired structure?
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => setHasDesiredPlans(true)}
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
                setHasDesiredPlans(false);
                setStep('existing_plans');
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

          {hasDesiredPlans === true && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Card>
                <CardContent className="p-6">
                  <Label className="text-lg font-medium mb-4 block">
                    Please upload engineering plans of desired structure
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleDesiredPlansFileChange}
                      className="flex-1"
                    />
                  </div>
                  <Button 
                    onClick={handleDesiredPlansContinue}
                    className="mt-6 w-full bg-black hover:bg-gray-800"
                    disabled={!desiredPlansFile}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('desired_measurements')}
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

  // Existing plans question
  if (step === 'existing_plans') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step {7 + additionDetails.floorCount} of {7 + additionDetails.floorCount}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Do you have engineering plans of existing structure?
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => setHasExistingPlans(true)}
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
                setHasExistingPlans(false);
                setStep('no_existing_plans');
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

          {hasExistingPlans === true && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Card>
                <CardContent className="p-6">
                  <Label className="text-lg font-medium mb-4 block">
                    Please upload engineering plans of existing structure
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleExistingPlansFileChange}
                      className="flex-1"
                    />
                  </div>
                  <Button 
                    onClick={handleGetEstimate}
                    className="mt-6 w-full bg-black hover:bg-gray-800"
                    disabled={!existingPlansFile}
                  >
                    Get Estimate
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

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

  // No existing plans message
  if (step === 'no_existing_plans') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h2 className="text-2xl font-bold mb-4">No Engineering Plans?</h2>
                <p className="text-gray-600 mb-6">
                  No worries, you could still get an Exactimate. The engineering plans of the existing structure will just help the engineers to decide if your Exactimate is sufficient for them. If you manage to get those plans (usually from the city) come back here and upload them.
                </p>
                <Button 
                  onClick={handleGetEstimate}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Get an Exactimate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('existing_plans')}
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

  // Bedroom measurement instructions
  if (step === 'bedroom_measurement_instructions') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step 2 of 5</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Measurements Needed
            </h1>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 text-lg text-gray-700">
                  <p className="mb-4">
                    Please prepare a measuring tape or a laser measure for the next question. You will need to do some measurements.
                  </p>
                  <p>
                    If you are struggling to do this, you can ask for assistance from one of our estimators either by a video call or by a face-to-face meeting.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setHelpDialogOpen(true)}
                  >
                    Click here for help
                  </Button>
                  
                  <Button
                    className="flex-1 bg-black hover:bg-gray-800"
                    onClick={() => setStep('bedroom_measurements')}
                  >
                    I can do it myself
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl mb-4">How would you like assistance?</DialogTitle>
                <DialogDescription>
                  Choose how you'd like one of our estimators to help you with measurements.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 gap-4 pt-4">
                <Button
                  variant="outline"
                  className="justify-start p-4 h-auto"
                  onClick={() => {
                    setHelpDialogOpen(false);
                    // Handle video call request
                    alert("A representative will contact you to schedule a video call.");
                  }}
                >
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-blue-100 rounded-full">
                      <VideoIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Make a video call</div>
                      <div className="text-sm text-gray-500">Get help remotely via video</div>
                    </div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="justify-start p-4 h-auto"
                  onClick={() => {
                    setHelpDialogOpen(false);
                    // Handle face-to-face visit request
                    alert("A representative will contact you to schedule an in-person visit.");
                  }}
                >
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-green-100 rounded-full">
                      <UserIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Face-to-face visit</div>
                      <div className="text-sm text-gray-500">Schedule an in-person measurement</div>
                    </div>
                  </div>
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('space_selection')}
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
  
  // Bedroom measurements
  if (step === 'bedroom_measurements') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step 3 of 5</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Please provide us with your desired bedroom measurements
            </h1>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="bedroom-length" className="block text-sm font-medium text-gray-700 mb-1">
                    Length (feet)
                  </Label>
                  <Input
                    id="bedroom-length"
                    type="number"
                    placeholder="Enter length"
                    value={bedroomMeasurements.length}
                    onChange={(e) => handleBedroomMeasurementChange('length', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="bedroom-width" className="block text-sm font-medium text-gray-700 mb-1">
                    Width (feet)
                  </Label>
                  <Input
                    id="bedroom-width"
                    type="number"
                    placeholder="Enter width"
                    value={bedroomMeasurements.width}
                    onChange={(e) => handleBedroomMeasurementChange('width', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="bedroom-height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height (feet)
                  </Label>
                  <Input
                    id="bedroom-height"
                    type="number"
                    placeholder="Enter height"
                    value={bedroomMeasurements.height}
                    onChange={(e) => handleBedroomMeasurementChange('height', e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleBedroomMeasurementSubmit}
                className="mt-6 w-full bg-black hover:bg-gray-800"
                disabled={!bedroomMeasurements.length || !bedroomMeasurements.width || !bedroomMeasurements.height}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('bedroom_measurement_instructions')}
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
  
  // Demolish walls question
  if (step === 'bedroom_demolish_walls') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step 4 of 5</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Do walls need to be demolished to add this bedroom?
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => handleDemolishWallsAnswer(true)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5 text-yellow-600" />
                </div>
                <span className="font-medium">Yes</span>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => handleDemolishWallsAnswer(false)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <X className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium">No</span>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('bedroom_measurements')}
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
  
  // Wall measurements
  if (step === 'bedroom_wall_measurements') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Additional Step</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Please provide the measurements of this wall
            </h1>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="wall-length" className="block text-sm font-medium text-gray-700 mb-1">
                    Length (feet)
                  </Label>
                  <Input
                    id="wall-length"
                    type="number"
                    placeholder="Enter wall length"
                    value={wallMeasurements.length}
                    onChange={(e) => handleWallMeasurementChange('length', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="wall-height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height (feet)
                  </Label>
                  <Input
                    id="wall-height"
                    type="number"
                    placeholder="Enter wall height"
                    value={wallMeasurements.height}
                    onChange={(e) => handleWallMeasurementChange('height', e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleWallMeasurementsSubmit}
                className="mt-6 w-full bg-black hover:bg-gray-800"
                disabled={!wallMeasurements.length || !wallMeasurements.height}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('bedroom_demolish_walls')}
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
  
  // Engineering plans for bedroom
  if (step === 'bedroom_plans') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step 5 of 5</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Do you have engineering plans for the bedroom?
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:border-blue-500 transition-all"
              onClick={() => handleBedroomPlansAnswer(true)}
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
              onClick={() => handleBedroomPlansAnswer(false)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                <span className="font-medium">No</span>
              </CardContent>
            </Card>
          </div>

          {hasBedroomPlans === true && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Card>
                <CardContent className="p-6">
                  <Label className="text-lg font-medium mb-4 block">
                    Please upload engineering plans
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleBedroomPlansFileChange}
                      className="flex-1"
                    />
                  </div>
                  <Button 
                    onClick={handleBedroomPlansSubmit}
                    className="mt-6 w-full bg-black hover:bg-gray-800"
                    disabled={!bedroomPlansFile}
                  >
                    Get Estimate
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => demolishWalls ? setStep('bedroom_wall_measurements') : setStep('bedroom_demolish_walls')}
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
  
  // ... keep the existing steps for entire floor flow ...
}
