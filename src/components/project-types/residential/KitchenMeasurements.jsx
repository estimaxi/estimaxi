
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Ruler, 
  Video, 
  MessageSquare, 
  PersonStanding,
  ChevronDown,
  ArrowRight,
  Check,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckIcon } from "lucide-react";
import { Minus, Plus } from "lucide-react";
import { calculateProjectEstimate } from '../../estimation/EstimationFlow'; // Assuming path
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils'; // Assuming path

export default function KitchenMeasurements({ onContinue, onBack, zipCode: zipCodeProp, address }) {
  const navigate = useNavigate();
  const [isGeneratingEstimate, setIsGeneratingEstimate] = useState(false);

  const [step, setStep] = useState('questions');
  const [zipCode, setZipCode] = useState('');
  useEffect(() => {
    if (zipCodeProp) {
      setZipCode(zipCodeProp);
    }
  }, [zipCodeProp]);
  const latestCooktopLocation = useRef('');
  const [summaryData, setSummaryData] = useState({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [showDimensionsForm, setShowDimensionsForm] = useState(false);
  const [showLayoutQuestion, setShowLayoutQuestion] = useState(false);
  const [showLayoutExplanation, setShowLayoutExplanation] = useState(false);
  const [showRelocationOptions, setShowRelocationOptions] = useState(false);
  const [showDesignQuestion, setShowDesignQuestion] = useState(false);
  const [showDistanceMeasurement, setShowDistanceMeasurement] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: ''
  });
  const [relocations, setRelocations] = useState({
    sink: false,
    stove: false,
    oven: false,
    dishwasher: false,
    refrigerator: false,
    other: false
  });
  const [distances, setDistances] = useState({});
  const [showDesignUpload, setShowDesignUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showNoDesignConfirmation, setShowNoDesignConfirmation] = useState(false);
  const [showElectricalDetails, setShowElectricalDetails] = useState(false);
  const [currentOutlets, setCurrentOutlets] = useState(0);
  const [additionalOutlets, setAdditionalOutlets] = useState(0);
  const [showLightingDetails, setShowLightingDetails] = useState(false);
  const [currentFixtures, setCurrentFixtures] = useState(0);
  const [additionalFixtures, setAdditionalFixtures] = useState(0);
  const [showCabinetStyle, setShowCabinetStyle] = useState(false);
  const [cabinetStyle, setCabinetStyle] = useState('');
  const [showOtherCabinetInput, setShowOtherCabinetInput] = useState(false);
  const [otherCabinetStyle, setOtherCabinetStyle] = useState('');
  const [showBaseCabinetMeasurement, setShowBaseCabinetMeasurement] = useState(false);
  const [baseCabinetLength, setBaseCabinetLength] = useState('');
  const [showWallCabinetMeasurement, setShowWallCabinetMeasurement] = useState(false);
  const [wallCabinetLength, setWallCabinetLength] = useState('');
  const [showIslandQuestion, setShowIslandQuestion] = useState(false);
  const [hasIsland, setHasIsland] = useState(null);
  const [islandDimensions, setIslandDimensions] = useState({
    frontSide: { length: '', hasCabinets: false },
    backSide: { length: '', hasCabinets: false },
    leftSide: { length: '', hasCabinets: false },
    rightSide: { length: '', hasCabinets: false }
  });
  const [showPrefabDetails, setShowPrefabDetails] = useState(false);
  const [showSpecialCabinets, setShowSpecialCabinets] = useState(false);
  const [showCabinetLayout, setShowCabinetLayout] = useState(false);
  const [baseCabinetInches, setBaseCabinetInches] = useState('');
  const [wallCabinetInches, setWallCabinetInches] = useState('');
  const [selectedSpecialCabinets, setSelectedSpecialCabinets] = useState([]);
  const [showLayoutSuggestion, setShowLayoutSuggestion] = useState(false);

  // Add new state variables for countertop selection
  const [showCountertopQuestion, setShowCountertopQuestion] = useState(false);
  const [countertopType, setCountertopType] = useState('');
  const [showOtherCountertopInput, setShowOtherCountertopInput] = useState(false);
  const [otherCountertopType, setOtherCountertopType] = useState('');

  // Add new state for waterfall selection
  const [showWaterfallQuestion, setShowWaterfallQuestion] = useState(false);
  const [wantsWaterfall, setWantsWaterfall] = useState(null);

  // Add new state for backsplash selection
  const [showBacksplashQuestion, setShowBacksplashQuestion] = useState(false);
  const [backsplashType, setBacksplashType] = useState('');
  const [showOtherBacksplashInput, setShowOtherBacksplashInput] = useState(false);
  const [otherBacksplashType, setOtherBacksplashType] = useState('');

  // Add new state for backsplash height (for standard types)
  const [showBacksplashHeight, setShowBacksplashHeight] = useState(false);
  const [backsplashHeight, setBacksplashHeight] = useState('');

  // Add new state for backsplash height (for 'Other' type specifically, as per outline)
  const [showBacksplashHeightInput, setShowBacksplashHeightInput] = useState(false);

  // Add new state for pot filler
  const [showPotFillerQuestion, setShowPotFillerQuestion] = useState(false);
  const [wantsPotFiller, setWantsPotFiller] = useState(null);

  // Add new state for sink selection
  const [showSinkQuestion, setShowSinkQuestion] = useState(false);
  const [sinkType, setSinkType] = useState('');
  const [showOtherSinkInput, setShowOtherSinkInput] = useState(false);
  const [otherSinkType, setOtherSinkType] = useState('');

  // Add new state for faucet selection
  const [showFaucetQuestion, setShowFaucetQuestion] = useState(false);
  const [faucetType, setFaucetType] = useState('');
  const [showOtherFaucetInput, setShowOtherFaucetInput] = useState(false);
  const [otherFaucetType, setOtherFaucetType] = useState('');

  // Add new state for ventilation selection
  const [showVentilationQuestion, setShowVentilationQuestion] = useState(false);
  const [ventilationType, setVentilationType] = useState('');

  // Add new state for new ventilation preference
  const [showNewVentilationPreference, setShowNewVentilationPreference] = useState(false);
  const [newVentilationType, setNewVentilationType] = useState('');

  // Update state for showing messages
  const [showVentilationMessage, setShowVentilationMessage] = useState(false);
  const [ventilationMessage, setVentilationMessage] = useState('');

  // Add new state for cooktop location
  const [showCooktopLocationQuestion, setShowCooktopLocationQuestion] = useState(false);
  const [cooktopLocation, setCooktopLocation] = useState('');

  // Add new state for attic access
  const [showAtticQuestion, setShowAtticQuestion] = useState(false);
  const [hasAtticAccess, setHasAtticAccess] = useState(null);

  // Add new state for basement access
  const [showBasementQuestion, setShowBasementQuestion] = useState(false);
  const [hasBasementAccess, setHasBasementAccess] = useState(null);


  const SPECIAL_CABINET_SIZES = {
    'lazy susan': {
      type: 'base',
      size: 36, // Corner cabinet, typically 36" x 36"
      description: 'Corner Lazy Susan'
    },
    'pull-out pantry': {
      type: 'tall',
      size: 24, // Standard pull-out pantry width
      description: 'Pull-out Pantry Cabinet'
    },
    'trash & recycling pull-out': {
      type: 'base',
      size: 18, // Standard width for double bin pull-out
      description: 'Trash & Recycling Pull-out'
    },
    'spice rack pull-out': {
      type: 'base',
      size: 9, // Typical spice pull-out width
      description: 'Spice Rack Pull-out'
    },
    'appliance garage': {
      type: 'wall',
      size: 24, // Standard appliance garage width
      description: 'Appliance Garage'
    },
    'wine rack or beverage center': {
      type: 'base',
      size: 24, // Standard wine rack cabinet width
      description: 'Wine Rack/Beverage Center'
    },
    'glass-front display': {
      type: 'wall',
      size: 30, // Standard display cabinet width
      description: 'Glass-Front Display Cabinet'
    }
  };

  const handleDimensionChange = (dimension, value) => {
    const sanitizedValue = value.replace(/[^\d.]/g, '');
    setDimensions(prev => ({
      ...prev,
      [dimension]: sanitizedValue
    }));
  };

  const handleDimensionsContinue = () => {
    if (dimensions.length && dimensions.width && dimensions.height) {
      setShowLayoutQuestion(true);
    } else {
      alert('Please fill in all dimensions');
    }
  };

  const handleLayoutChoice = (changeLayout) => {
    if (!changeLayout) {
      setShowDesignQuestion(true);
    } else {
      setShowLayoutExplanation(true);
    }
  };

  const handleLayoutYes = () => {
    setShowLayoutExplanation(true);
  };

  const handleLayoutConfirm = () => {
    setShowLayoutExplanation(false);
    setShowRelocationOptions(true);
  };

  const handleRelocationToggle = (item) => {
    setRelocations(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  // Function to get selected items that need measurements
  const getSelectedItems = () => {
    return Object.entries(relocations)
      .filter(([_, isSelected]) => isSelected)
      .map(([item]) => item);
  };

  const handleRelocationContinue = () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length > 0) {
      setShowDistanceMeasurement(true);
    } else {
      alert('Please select at least one item to relocate');
    }
  };

  const handleDistanceChange = (value) => {
    // Only allow numbers
    const sanitizedValue = value.replace(/[^\d]/g, '');
    const selectedItems = getSelectedItems();
    const currentItem = selectedItems[currentItemIndex];
    
    setDistances(prev => ({
      ...prev,
      [currentItem]: sanitizedValue
    }));
  };

  const handleDistanceContinue = () => {
    const selectedItems = getSelectedItems();
    if (currentItemIndex < selectedItems.length - 1) {
      // Move to next item
      setCurrentItemIndex(prev => prev + 1);
    } else {
      // All measurements collected, show design question next
      setShowDistanceMeasurement(false);
      setShowDesignQuestion(true);
    }
  };

  const handleDesignChoice = (hasDesign) => {
    if (hasDesign) {
      setShowDesignUpload(true);
    } else {
      setShowNoDesignConfirmation(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadContinue = () => {
    // Collect all data including the design file
    if (showDistanceMeasurement || currentItemIndex > 0) {
      // User came from relocation path
      onContinue({
        ...dimensions,
        changeLayout: true,
        relocations,
        distances,
        hasDesign: true,
        designFile: selectedFile
      });
    } else {
      // User came from "No layout change" path
      onContinue({
        ...dimensions,
        changeLayout: false,
        hasDesign: true,
        designFile: selectedFile
      });
    }
  };

  const renderDistanceMeasurement = () => {
    const selectedItems = getSelectedItems();
    const currentItem = selectedItems[currentItemIndex];
    
    return (
      <motion.div
        key={`distance-${currentItem}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                Please measure the distance between the existing {currentItem} to desired location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-xs mx-auto">
                <Label htmlFor="distance">Distance (inches)</Label>
                <div className="mt-2">
                  <Input
                    id="distance"
                    placeholder="0"
                    value={distances[currentItem] || ''}
                    onChange={(e) => handleDistanceChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Button 
                  variant="ghost"
                  onClick={() => {
                    if (currentItemIndex === 0) {
                      setShowDistanceMeasurement(false);
                      setCurrentItemIndex(0);
                    } else {
                      setCurrentItemIndex(prev => prev - 1);
                    }
                  }}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleDistanceContinue}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!distances[currentItem]}
                >
                  {currentItemIndex < selectedItems.length - 1 ? 'Next' : 'Continue'}
                </Button>
              </div>

              <div className="flex justify-center gap-2 pt-4">
                {selectedItems.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentItemIndex ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  };

  const handleNoDesignContinue = () => {
    setShowNoDesignConfirmation(false);
    setShowElectricalDetails(true);
  };

  const handleDesignUploadContinue = () => {
    setShowDesignUpload(false);
    setShowElectricalDetails(true);
  };

  const incrementCounter = (setter) => {
    setter(prev => prev + 1);
  };

  const decrementCounter = (setter, value) => {
    if (value > 0) {
      setter(prev => prev - 1);
    }
  };

  const handleElectricalContinue = () => {
    setShowElectricalDetails(false);
    setShowLightingDetails(true);
  };

  const handleLightingContinue = () => {
    setShowLightingDetails(false);
    setShowCabinetStyle(true);
  };

  const handleCabinetStyleSelect = (style) => {
    setCabinetStyle(style); // Highlight the selected button
    setShowOtherCabinetInput(false); // Always hide 'other' input first

    if (style === 'other') {
      setShowOtherCabinetInput(true); // Show the specific input for 'other'
      // Keep showCabinetStyle = true, as the input is part of this section
    } else if (style === 'custom') {
      setShowCabinetStyle(false); // Hide this entire section
      setShowBaseCabinetMeasurement(true); // Move to custom measurement flow
    } else { // This covers 'shaker', 'flat (euro)', and any future standard styles
      setShowCabinetStyle(false); // Hide this entire section
      setShowPrefabDetails(true); // Move to prefab details flow
    }
  };

  const handleOtherCabinetContinue = () => {
    // Set the cabinetStyle state with the value from the 'otherCabinetStyle' input
    setCabinetStyle(otherCabinetStyle); 
    setShowOtherCabinetInput(false); // Hide the input field for 'Other'
    setShowCabinetStyle(false); // Hide the entire cabinet style selection section
    setShowPrefabDetails(true); // Proceed to prefab details page
  };

  const handleCabinetStyleContinue = (finalStyle) => {
    // This function seems to be a fallback, as other paths handle transitions.
    // Given the new flow, this might not be reached directly to finalize.
    // It should transition to the next step after cabinet style.
    // Assuming this means non-custom, non-prefab.
    // If it's a specific named style, it should go to prefab details, then special cabinets, then layout suggestion, then island.
    // This function's role might need re-evaluation if it's meant to skip steps.
    // For now, let's assume it should lead to the next logical step for a standard selection.
    setShowCabinetStyle(false);
    setShowPrefabDetails(true); // Assuming even standard styles imply prefab details for sizing info
  };

  const handleBaseCabinetContinue = () => {
    setShowBaseCabinetMeasurement(false);
    setShowWallCabinetMeasurement(true);
  };

  const handleWallCabinetContinue = () => {
    setShowWallCabinetMeasurement(false);
    setShowIslandQuestion(true); // Changed flow to go to island question after wall cabinets
  };

  const handleIslandChoice = (choice) => {
    setHasIsland(choice);
  };

  const handleIslandDimensionChange = (side, value) => {
    setIslandDimensions(prev => ({
      ...prev,
      [side]: { ...prev[side], length: value }
    }));
  };

  const handleIslandCabinetToggle = (side) => {
    setIslandDimensions(prev => ({
      ...prev,
      [side]: { ...prev[side], hasCabinets: !prev[side].hasCabinets }
    }));
  };

  const handleIslandContinue = () => {
    // This function is now called after island questions for ANY cabinet path.
    // It should transition to the countertop question.
    // The main onContinue prop with all data will be called at the very end of the kitchen flow.
    setShowIslandQuestion(false);
    setShowCountertopQuestion(true);
  };

  const handlePrefabContinue = () => {
    setShowPrefabDetails(false);
    setShowSpecialCabinets(true);
  };

  const handleSpecialCabinetsContinue = () => {
    setShowSpecialCabinets(false);
    setShowCabinetLayout(true);
  };

  const handleSpecialCabinetToggle = (cabinetType) => {
    setSelectedSpecialCabinets(prevSelected => {
      if (prevSelected.includes(cabinetType)) {
        return prevSelected.filter(item => item !== cabinetType);
      } else {
        return [...prevSelected, cabinetType];
      }
    });
  };

  const calculateCabinetLayout = (totalLength, cabinetType = 'base') => {
    const standardSizes = [48, 36, 30, 24, 18, 15, 12, 9]; // Standard widths
    let remainingLength = totalLength;
    const suggestedCabinets = [];
    const specialCabinetsUsed = [];

    // First, allocate space for special cabinets
    selectedSpecialCabinets.forEach(specialCabinet => {
      const cabinetInfo = SPECIAL_CABINET_SIZES[specialCabinet.toLowerCase()];
      
      // Only include if it matches the current cabinet type (base or wall)
      if (cabinetInfo && cabinetInfo.type === cabinetType) {
        remainingLength -= cabinetInfo.size;
        specialCabinetsUsed.push({
          type: specialCabinet,
          size: cabinetInfo.size,
          description: cabinetInfo.description
        });
      }
    });

    // Helper function to get random size that fits
    const getRandomFittingSize = (maxSize) => {
      const fittingSizes = standardSizes.filter(size => size <= maxSize);
      if (fittingSizes.length === 0) return null;
      
      // Avoid using very small cabinets unless necessary
      if (maxSize > 24 && Math.random() > 0.3) {
        const preferredSizes = fittingSizes.filter(size => size >= 24);
        if (preferredSizes.length > 0) {
          return preferredSizes[Math.floor(Math.random() * preferredSizes.length)];
        }
      }
      
      return fittingSizes[Math.floor(Math.random() * fittingSizes.length)];
    };

    // Generate layout for remaining space
    const generateLayout = () => {
      let length = remainingLength;
      const cabinets = [];
      let attempts = 0;
      const maxAttempts = 20;
      
      while (length > 0 && attempts < maxAttempts) {
        const size = getRandomFittingSize(length);
        if (!size) break;
        
        cabinets.push(size);
        length -= size;
        attempts++;
      }
      
      return {
        cabinets,
        filler: Math.max(0, length),
        variance: calculateVariance(cabinets)
      };
    };

    // Calculate variance to measure size distribution
    const calculateVariance = (cabinets) => {
      if (cabinets.length <= 1) return 0;
      const mean = cabinets.reduce((a, b) => a + b, 0) / cabinets.length;
      return cabinets.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / cabinets.length;
    };

    // Generate multiple layouts and pick the best one
    let bestLayout = null;
    const numAttempts = 10;
    
    for (let i = 0; i < numAttempts; i++) {
      const layout = generateLayout();
      
      // Score the layout based on:
      // 1. Minimal filler space needed
      // 2. Good size distribution
      // 3. Reasonable number of cabinets
      const fillerScore = 1 - (layout.filler / remainingLength);
      const varianceScore = Math.min(1, layout.variance / 100);
      const cabinetCountScore = 1 - (Math.abs(layout.cabinets.length - 4) / 8);
      
      const totalScore = fillerScore * 0.5 + varianceScore * 0.3 + cabinetCountScore * 0.2;
      
      if (!bestLayout || totalScore > bestLayout.score) {
        bestLayout = {
          ...layout,
          score: totalScore
        };
      }
    }

    // Combine special cabinets with regular cabinets in the result
    return {
      specialCabinets: specialCabinetsUsed,
      standardCabinets: bestLayout.cabinets.sort((a, b) => b - a),
      filler: bestLayout.filler,
      totalLength: totalLength,
      remainingLength: remainingLength
    };
  };

  const handleCabinetLayoutContinue = () => {
    setShowCabinetLayout(false);
    setShowLayoutSuggestion(true);
  };

  const handleCabinetLayoutContinueBeforeSuggestion = () => {
    // This function is no longer called in the flow.
    // It was probably an interim step before layout suggestions were fully integrated.
    // The data aggregation now happens at the very end in project_summary.
  };

  const handleLayoutSuggestionContinue = () => {
    setShowLayoutSuggestion(false);
    setShowIslandQuestion(true); // Changed flow to go to island question
  };

  const handleCountertopSelect = (type) => {
    setCountertopType(type);
    if (type === 'other') {
      setShowOtherCountertopInput(true);
    } else {
      // Continue with the selected standard countertop type
      handleCountertopContinue(type);
    }
  };

  const handleOtherCountertopContinue = () => {
    // Set the countertop type to the custom input
    handleCountertopContinue(otherCountertopType);
  };

  const handleCountertopContinue = (type) => {
    setCountertopType(type);
    setShowCountertopQuestion(false);
    setShowWaterfallQuestion(true);
  };

  const handleWaterfallSelection = (hasWaterfall) => {
    setWantsWaterfall(hasWaterfall);
    setShowWaterfallQuestion(false);
    setShowBacksplashQuestion(true);
  };

  const handleBacksplashSelect = (type) => {
    setBacksplashType(type);
    if (type === 'other') {
      setShowBacksplashQuestion(false);
      setShowOtherBacksplashInput(true);
    } else {
      // Show height input field instead of continuing
      setShowBacksplashHeight(true);
    }
  };

  const handleBacksplashComplete = () => {
    // Instead of completing the flow, show pot filler question
    setShowBacksplashQuestion(false);
    setShowPotFillerQuestion(true);
  };

  const handleOtherBacksplashContinue = () => {
    setBacksplashType('other'); // Set the backsplashType to 'other'
    setShowOtherBacksplashInput(false);
    setShowBacksplashHeightInput(true); // Show height input instead of going directly to pot filler
  };

  const handlePotFillerSelection = (wantsFiller) => {
    setWantsPotFiller(wantsFiller);
    setShowPotFillerQuestion(false);
    setShowSinkQuestion(true);
  };

  const handleSinkSelect = (type) => {
    setSinkType(type);
    if (type === 'other') {
      setShowSinkQuestion(false);
      setShowOtherSinkInput(true);
    } else {
      setShowSinkQuestion(false);
      setShowFaucetQuestion(true);
    }
  };

  const handleOtherSinkContinue = () => {
    setShowOtherSinkInput(false);
    setShowFaucetQuestion(true);
  };

  const handleFaucetSelect = (type) => {
    setFaucetType(type);
    if (type === 'other') {
      setShowFaucetQuestion(false);
      setShowOtherFaucetInput(true);
    } else {
      setShowFaucetQuestion(false);
      setShowVentilationQuestion(true);
    }
  };

  const handleOtherFaucetContinue = () => {
    setShowOtherFaucetInput(false);
    setShowVentilationQuestion(true);
  };

  const handleVentilationSelect = (type) => {
    setVentilationType(type);
    // Show question about desired new ventilation
    setShowNewVentilationPreference(true);
  };

  const handleNewVentilationSelect = (type) => {
    setNewVentilationType(type);
    
    // Show appropriate message based on ventilation change
    if (ventilationType === 'downdraft' && type.toLowerCase() === 'range hood') {
      setVentilationMessage('Switching from a downdraft to an overhead range hood usually involves adding a vent through the ceiling or wall, updating ductwork, and potentially running new electrical lines. It improves ventilation but may require significant changes depending on your kitchen layout.');
      setShowVentilationMessage(true);
    } else if (ventilationType === 'range hood' && type.toLowerCase() === 'downdraft') {
      setVentilationMessage('Replacing a traditional range hood with a downdraft system requires installing venting through the floor or base cabinets, which may include cutting into the subfloor and rerouting ducts. It\'s ideal for island cooktops but has less powerful airflow.');
      setShowVentilationMessage(true);
    } else if (
      (ventilationType === 'downdraft' && type.toLowerCase() === 'downdraft') ||
      (ventilationType === 'range hood' && type.toLowerCase() === 'range hood')
    ) {
      setVentilationMessage(
        `You've chosen to stay with your current ventilation system (${type}). We still need to confirm your cooktop location for proper planning.`
      );
      setShowVentilationMessage(true);
    } else {
      // No message needed, directly to summary if no cooktop question.
      // This function handles the finalization for paths not requiring cooktop/attic/basement questions.
      handleVentilationComplete(type);
    }
  };


  const handleVentilationMessageContinue = () => {
    setShowVentilationMessage(false);

    // Show cooktop location question for all combinations that displayed a message
    // Removed the 'else' block as it implies direct summary from message, which contradicts flow.
    if (
      (ventilationType === 'downdraft' && newVentilationType.toLowerCase() === 'range hood') ||
      (ventilationType === 'range hood' && newVentilationType.toLowerCase() === 'downdraft') ||
      (ventilationType === 'downdraft' && newVentilationType.toLowerCase() === 'downdraft') ||
      (ventilationType === 'range hood' && newVentilationType.toLowerCase() === 'range hood')
    ) {
      setShowCooktopLocationQuestion(true);
    }
  };


  const handleVentilationComplete = (type) => {
    // This function is called when ventilation questions are answered and no further specific questions (cooktop/attic/basement) are triggered.
    // It aggregates data and transitions to the summary step.
    setShowVentilationQuestion(false);
    setShowNewVentilationPreference(false);
    setShowVentilationMessage(false);

    const data = {
      dimensions,
      changeLayout: Object.values(relocations).some(value => value === true), // Check if any relocation was selected
      relocations,
      distances,
      hasDesign: showDesignUpload,
      designFile: selectedFile,
      needsDesign: showNoDesignConfirmation,
      electrical: {
        currentOutlets,
        additionalOutlets
      },
      lighting: {
        currentFixtures,
        additionalFixtures
      },
      cabinetStyle,
      baseCabinetInches: parseFloat(baseCabinetInches) || 0,
      wallCabinetInches: parseFloat(wallCabinetInches) || 0,
      specialCabinets: selectedSpecialCabinets,
      layoutSuggestions: {
        base: calculateCabinetLayout(parseFloat(baseCabinetInches) || 0, 'base'),
        wall: calculateCabinetLayout(parseFloat(wallCabinetInches) || 0, 'wall')
      },
      island: {
        hasIsland,
        dimensions: hasIsland ? islandDimensions : null
      },
      countertop: {
        type: countertopType,
        hasWaterfall: wantsWaterfall
      },
      backsplash: {
        type: backsplashType === 'other' ? otherBacksplashType : backsplashType,
        height: parseFloat(backsplashHeight) || 0
      },
      hasPotFiller: wantsPotFiller,
      sink: {
        type: sinkType === 'other' ? otherSinkType : sinkType
      },
      faucet: {
        type: faucetType === 'other' ? otherFaucetType : faucetType
      },
      ventilation: {
        current: ventilationType,
        preferred: type
      },
      // Cooktop/Attic/Basement are not set here as this path implies they are not asked.
      cooktopLocation: null,
      hasAtticAccess: null,
      hasBasementAccess: null,
      zipCode,
    };

    setSummaryData(data);
    setGeneratedPrompt(generateKitchenPrompt(data));
    setStep('project_summary');
  };


  const handleCooktopLocationSelect = (location) => {
    setCooktopLocation(location);
    latestCooktopLocation.current = location;

    const newType = newVentilationType?.toLowerCase();
    
    if (newType === 'range hood') {
      setShowAtticQuestion(true);
    } else if (newType === 'downdraft') {
      setShowBasementQuestion(true);
    } else {
      // This case should ideally not be hit if the cooktop question is always asked after a message.
      // If it is hit, it means current/new ventilation types are not 'range hood' or 'downdraft' (e.g., 'none').
      // In this specific scenario, we proceed to summary directly.
      const data = {
        dimensions,
        ventilationType,
        newVentilationType,
        cooktopLocation: latestCooktopLocation.current,
        hasAtticAccess: null, // No attic access question asked for this path
        hasBasementAccess: null, // No basement access question asked for this path
        specialCabinets: selectedSpecialCabinets,
        baseCabinetInches: parseFloat(baseCabinetInches) || 0,
        wallCabinetInches: parseFloat(wallCabinetInches) || 0,
        sinkType: sinkType === 'other' ? otherSinkType : sinkType,
        faucetType: faucetType === 'other' ? otherFaucetType : faucetType,
        countertopType,
        wantsWaterfall,
        backsplashType: backsplashType === 'other' ? otherBacksplashType : backsplashType,
        backsplashHeight,
        hasPotFiller: wantsPotFiller,
        zipCode,
        relocations,
        distances,
        hasIsland,
        islandDimensions,
        changeLayout: Object.values(relocations || {}).some(value => value === true),
        hasDesign: showDesignUpload,
        electrical: {
          currentOutlets,
          additionalOutlets
        },
        lighting: {
          currentFixtures,
          additionalFixtures
        },
        cabinetStyle,
        layoutSuggestions: {
          base: calculateCabinetLayout(parseFloat(baseCabinetInches) || 0, 'base'),
          wall: calculateCabinetLayout(parseFloat(wallCabinetInches) || 0, 'wall')
        },
        island: {
          hasIsland,
          dimensions: hasIsland ? islandDimensions : null
        },
      };

      setSummaryData(data);
      setGeneratedPrompt(generateKitchenPrompt(data));
      setStep('project_summary');
    }
  };


 const handleAtticAccessSelect = (hasAccess) => {
  setHasAtticAccess(hasAccess);

  const data = {
  dimensions,
  ventilationType,
  newVentilationType,
  cooktopLocation: latestCooktopLocation.current,
  hasAtticAccess: hasAccess, // Correct: uses the parameter for the specific question
  hasBasementAccess: hasBasementAccess, // Correct: uses the existing state for the other access type
  specialCabinets: selectedSpecialCabinets,
  baseCabinetInches: parseFloat(baseCabinetInches) || 0,
  wallCabinetInches: parseFloat(wallCabinetInches) || 0,
  sinkType: sinkType === 'other' ? otherSinkType : sinkType,
  faucetType: faucetType === 'other' ? otherFaucetType : faucetType,
  countertopType,
  wantsWaterfall,
  relocations,
  distances,
  hasIsland,
  islandDimensions,
  backsplashType: backsplashType === 'other' ? otherBacksplashType : backsplashType,
  backsplashHeight,
  hasPotFiller: wantsPotFiller,
  zipCode,
  changeLayout: Object.values(relocations || {}).some(value => value === true),
  hasDesign: showDesignUpload,
  electrical: {
    currentOutlets,
    additionalOutlets
  },
  lighting: {
    currentFixtures,
    additionalFixtures
  },
  cabinetStyle,
  layoutSuggestions: {
    base: calculateCabinetLayout(parseFloat(baseCabinetInches) || 0, 'base'),
    wall: calculateCabinetLayout(parseFloat(wallCabinetInches) || 0, 'wall')
  },
  island: {
    hasIsland,
    dimensions: hasIsland ? islandDimensions : null
  },
};

  setSummaryData(data);
  setGeneratedPrompt(generateKitchenPrompt(data));

  setShowAtticQuestion(false);
  setShowCooktopLocationQuestion(false);
  setShowVentilationQuestion(false);
  setShowNewVentilationPreference(false);
  setShowVentilationMessage(false);
  setStep('project_summary');
};


 const handleBasementAccessSelect = (hasAccess) => {
  setHasBasementAccess(hasAccess);

  const data = {
  dimensions,
  ventilationType,
  newVentilationType,
  cooktopLocation: latestCooktopLocation.current,
  hasAtticAccess: hasAtticAccess, // Correct: uses the existing state for the other access type
  hasBasementAccess: hasAccess, // Correct: uses the parameter for the specific question
  sinkType: sinkType === 'other' ? otherSinkType : sinkType,
  specialCabinets: selectedSpecialCabinets,
  baseCabinetInches: parseFloat(baseCabinetInches) || 0,
  wallCabinetInches: parseFloat(wallCabinetInches) || 0,
  faucetType: faucetType === 'other' ? otherFaucetType : faucetType,
  countertopType,
  wantsWaterfall,
  relocations,
  distances,
  hasIsland,
  islandDimensions,
  backsplashType: backsplashType === 'other' ? otherBacksplashType : backsplashType,
  backsplashHeight,
  hasPotFiller: wantsPotFiller,
  zipCode,
  changeLayout: Object.values(relocations || {}).some(value => value === true),
  hasDesign: showDesignUpload,
  electrical: {
    currentOutlets,
    additionalOutlets
  },
  lighting: {
    currentFixtures,
    additionalFixtures
  },
  cabinetStyle,
  layoutSuggestions: {
    base: calculateCabinetLayout(parseFloat(baseCabinetInches) || 0, 'base'),
    wall: calculateCabinetLayout(parseFloat(wallCabinetInches) || 0, 'wall')
  },
  island: {
    hasIsland,
    dimensions: hasIsland ? islandDimensions : null
  },
};

  setSummaryData(data); 
  setGeneratedPrompt(generateKitchenPrompt(data));
  setStep('project_summary');
};

const handleCompleteAndGetEstimate = async () => {
  setIsGeneratingEstimate(true);
  
  try {
    // Prepare project details for the estimation engine from the current state/summaryData
    // We will use summaryData as the source of truth for the final project state.
    const finalSummaryData = summaryData; 

    // Map existing state to the required structure for calculateProjectEstimate
    const projectDetails = {
      type: 'residential',
      subtype: 'kitchen_remodel',
      address: address || { // Use address prop if available, otherwise default
        street_number: '',
        street_name: '',
        city: '',
        state: '',
        zip_code: zipCode || ''
      },
      questionnaire_answers: {
        layout: finalSummaryData.changeLayout ? 'changed' : 'original',
        dimensions: {
          length: parseFloat(finalSummaryData.dimensions?.length) || 0,
          width: parseFloat(finalSummaryData.dimensions?.width) || 0,
          height: parseFloat(finalSummaryData.dimensions?.height) || 0
        },
        cabinets: {
          style: finalSummaryData.cabinetStyle || 'Not specified',
          material: 'Not specified', // Not collected in current questionnaire
          linearFeet: (parseFloat(finalSummaryData.baseCabinetInches || 0) / 12) + (parseFloat(finalSummaryData.wallCabinetInches || 0) / 12) // Convert inches to feet
        },
        countertops: {
          material: finalSummaryData.countertop?.type || 'Not specified',
          squareFeet: 0 // Not explicitly collected
        },
        appliances: {
          refrigerator: finalSummaryData.relocations?.refrigerator ? 'new' : 'existing', // Assumed new if relocated
          stove: finalSummaryData.relocations?.stove ? 'new' : 'existing',
          dishwasher: finalSummaryData.relocations?.dishwasher ? 'new' : 'existing',
          microwave: 'Not specified', // Not collected
          rangeHood: finalSummaryData.newVentilationType === 'range hood' ? 'new' : 'existing' // Based on preferred ventilation
        },
        flooring: {
          material: 'Not specified', // Not collected
          squareFeet: 0 // Not collected
        },
        backsplash: {
          material: finalSummaryData.backsplash?.type || 'Not specified',
          squareFeet: (parseFloat(finalSummaryData.baseCabinetInches || 0) / 12) * (parseFloat(finalSummaryData.backsplash?.height || 0) / 12) // Linear feet * height (converted to feet)
        },
        lighting: {
          type: 'standard', // Not collected
          fixtures: (finalSummaryData.electrical?.currentFixtures || 0) + (finalSummaryData.electrical?.additionalFixtures || 0)
        },
        plumbing: {
          sink: finalSummaryData.sink?.type || 'Not specified',
          faucet: finalSummaryData.faucet?.type || 'Not specified',
          hasGarbageDisposal: false // Not collected
        },
        electrical: {
          outlets: (finalSummaryData.electrical?.currentOutlets || 0) + (finalSummaryData.electrical?.additionalOutlets || 0),
          hasNewCircuits: finalSummaryData.relocations && Object.values(finalSummaryData.relocations).some(val => val === true) // Assume new circuits if relocation is involved
        },
        specialFeatures: finalSummaryData.specialCabinets || [], // Map special cabinets
        island: finalSummaryData.island?.hasIsland ? {
          dimensions: finalSummaryData.island.dimensions,
          hasCabinets: Object.values(finalSummaryData.island.dimensions || {}).some(side => side.hasCabinets),
          hasWaterfall: finalSummaryData.countertop?.hasWaterfall
        } : null
      }
    };

    // Generate the estimate
    const estimate = await calculateProjectEstimate(projectDetails);
    
    if (estimate) {
      // Navigate to the EstimateResults page with the estimate data
      navigate(createPageUrl('EstimateResults'), { 
        state: { estimate } 
      });
    } else {
      console.error('Failed to generate estimate');
      alert('Failed to generate estimate. Please try again.');
    }
  } catch (error) {
    console.error('Error generating estimate:', error);
    alert('An error occurred while generating the estimate. Please try again.');
  } finally {
    setIsGeneratingEstimate(false);
  }
};


if (step === 'project_summary') {
    let summary = {};
    if (summaryData) {
      summary = summaryData;

      if (!generatedPrompt) {
        setGeneratedPrompt(generateKitchenPrompt(summaryData));
      }
    }

    const {
      dimensions,
      ventilationType,
      newVentilationType,
      cooktopLocation,
      hasAtticAccess,
      hasBasementAccess,
      sinkType,
      faucetType,
      countertopType,
      wantsWaterfall,
      backsplashType,
      backsplashHeight,
      hasPotFiller,
      zipCode,
      changeLayout,
      hasDesign,
      electrical,
      lighting,
      cabinetStyle,
      layoutSuggestions,
      specialCabinets: selectedSpecialCabinets,
      island,
      baseCabinetInches, // Ensure these are available for prompt generation if needed
      wallCabinetInches, // Ensure these are available for prompt generation if needed
      relocations, // Ensure relocations are available for prompt generation
      distances, // Ensure distances are available for prompt generation
    } = summary;
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '100%' }} />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Final Step
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Your Kitchen Remodel Summary
            </h1>

            <div className="w-full max-w-3xl">
              <p className="text-gray-700 mb-8 text-center">
                Here's a summary of your kitchen remodel project. Please review the details below.
              </p>

              {/* Display basic summary (dimensions, ventilation, etc.) */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <strong>Kitchen Dimensions:</strong><br />
                  {dimensions?.length && dimensions?.width && dimensions?.height
                    ? `${dimensions.length} x ${dimensions.width} x ${dimensions.height} feet`
                    : 'Not specified'}
                </div>
                <div>
                  <strong>Ventilation:</strong><br />
                  Current: {ventilationType || 'Not specified'}, Preferred: {newVentilationType || 'Not specified'}
                </div>

                <div>
                  <strong>Cooktop Location:</strong><br />
                  {cooktopLocation || 'Not specified'}
                </div>

                <div>
                  <strong>Has Attic Access:</strong><br />
                  {hasAtticAccess === true ? 'Yes' : hasAtticAccess === false ? 'No' : 'Not specified'}
                </div>

                <div>
                  <strong>Has Basement Access:</strong><br />
                  {hasBasementAccess === true ? 'Yes' : hasBasementAccess === false ? 'No' : 'Not specified'}
                </div>

                <div>
                  <strong>Sink Type:</strong><br />
                  {sinkType || 'Not specified'}
                </div>

                <div>
                  <strong>Faucet Type:</strong><br />
                  {faucetType || 'Not specified'}
                </div>

                <div>
                  <strong>Countertop:</strong><br />
                  {countertopType || 'Not specified'}, Waterfall: {wantsWaterfall === true ? 'Yes' : wantsWaterfall === false ? 'No' : 'Not specified'}
                </div>

                <div>
                  <strong>Backsplash:</strong><br />
                  {backsplashType || 'Not specified'}, Height: {backsplashHeight || 'Not specified'}" 
                </div>
                <div>
                  <strong>Pot Filler:</strong><br />
                  {hasPotFiller === true ? 'Yes' : hasPotFiller === false ? 'No' : 'Not specified'}
                </div>
                <div>
                  <strong>Zip Code:</strong><br />
                  {zipCode || 'Not specified'}
                </div>
                <div>
                <strong>Change Layout:</strong><br />
                  {changeLayout ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Has Design:</strong><br />
                  {hasDesign ? 'Yes' : 'No'}
                </div>
                {changeLayout && relocations && distances && Object.keys(relocations).length > 0 && (
                  <div>
                    <strong>Relocation Distances:</strong><br />
                    {Object.entries(relocations)
                      .filter(([item, selected]) => selected && distances[item])
                      .map(([item]) => `${item.charAt(0).toUpperCase() + item.slice(1)}: ${distances[item]}"`)
                      .join(', ') || 'Not specified'}
                  </div>
                )}
                <div>
                  <strong>Electrical:</strong><br />
                  {electrical?.currentOutlets ?? '0'} existing, {electrical?.additionalOutlets ?? '0'} to add
                </div>
                <div>
                  <strong>Lighting:</strong><br />
                  {lighting?.currentFixtures ?? '0'} existing, {lighting?.additionalFixtures ?? '0'} to add
                </div>
                <div>
                  <strong>Cabinet Style:</strong><br />
                  {cabinetStyle || 'Not specified'}
                </div>
                <div>
                  <strong>Kitchen Island:</strong><br />
                  {hasIsland ? (
                    <>
                      Yes<br />
                      <div className="pl-4">
                        Front side: {islandDimensions.frontSide.length || '0'} feet {islandDimensions.frontSide.hasCabinets ? 'with cabinets' : 'without cabinets'}<br />
                        Back side: {islandDimensions.backSide.length || '0'} feet {islandDimensions.backSide.hasCabinets ? 'with cabinets' : 'without cabinets'}<br />
                        Left side: {islandDimensions.leftSide.length || '0'} feet {islandDimensions.leftSide.hasCabinets ? 'with cabinets' : 'without cabinets'}<br />
                        Right side: {islandDimensions.rightSide.length || '0'} feet {islandDimensions.rightSide.hasCabinets ? 'with cabinets' : 'without cabinets'}
                      </div>
                    </>
                  ) : 'No'}
                </div>
              {(layoutSuggestions?.base || layoutSuggestions?.wall || selectedSpecialCabinets?.length > 0) && (
                <>
                  <div className="col-span-2">
                    <strong>Cabinet Layout:</strong>
                  </div>

                  {selectedSpecialCabinets?.length > 0 && (
                    <div className="col-span-2">
                      <strong>Special Cabinets:</strong><br />
                      {selectedSpecialCabinets
                        .map(name => {
                          const cabinet = SPECIAL_CABINET_SIZES?.[name.toLowerCase()];
                          return `${cabinet?.description || name} ${cabinet?.size ? `(${cabinet.size}")` : ''}`;
                        })
                        .join(', ') || 'None selected'}
                    </div>
                  )}
                  {layoutSuggestions?.base?.standardCabinets?.length > 0 && (
                    <>
                      <div className="col-span-2">
                        <strong>Base Cabinets:</strong><br />
                        {Object.entries(
                          layoutSuggestions.base.standardCabinets.reduce((acc, size) => {
                            acc[size] = (acc[size] || 0) + 1;
                            return acc;
                          }, {})
                        )
                          .map(([size, count]) => `${count} Cabinet${count > 1 ? 's' : ''} of ${size}"`)
                          .join(', ') || 'None'}
                      </div>
                      <div className="col-span-2">
                        <em>Base Fillers:</em> {layoutSuggestions.base.filler || 0}"
                      </div>
                    </>
                  )}
                  {layoutSuggestions?.wall?.standardCabinets?.length > 0 && (
                    <>
                      <div className="col-span-2">
                        <strong>Wall Cabinets:</strong><br />
                        {Object.entries(
                          layoutSuggestions.wall.standardCabinets.reduce((acc, size) => {
                            acc[size] = (acc[size] || 0) + 1;
                            return acc;
                          }, {})
                        )
                          .map(([size, count]) => `${count} Cabinet${count > 1 ? 's' : ''} of ${size}"`)
                          .join(', ') || 'None'}
                      </div>
                      <div className="col-span-2">
                        <em>Wall Fillers:</em> {layoutSuggestions.wall.filler || 0}"
                      </div>
                    </>
                  )}
                </>
              )}
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mt-4 text-sm text-gray-700">
                  <h4 className="font-semibold mb-2">Generated AI Prompt</h4>
                  <p className="whitespace-pre-wrap">{generatedPrompt}</p>
              </div>
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={handleCompleteAndGetEstimate}
                disabled={isGeneratingEstimate}
              >
                {isGeneratingEstimate ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Estimate...
                  </>
                ) : (
                  'Complete and Get Estimate'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  function generateKitchenPrompt(data) {
  const {
    dimensions,
    ventilationType,
    newVentilationType,
    cooktopLocation,
    hasAtticAccess,
    hasBasementAccess,
    sinkType,
    faucetType,
    countertopType,
    wantsWaterfall,
    backsplashType,
    backsplashHeight,
    hasPotFiller,
    zipCode,
    changeLayout,
    hasDesign,
    electrical,
    lighting,
    cabinetStyle,
    layoutSuggestions,
    relocations,
    distances,
    specialCabinets = [],
    island,
  } = data;
  const prompt = [];
  prompt.push("Client is planning a full kitchen remodel.");
  if (zipCode) {
    prompt.push(`Project zip code is: ${zipCode}.`);
  }
  if (dimensions?.length && dimensions?.width && dimensions?.height) {
    prompt.push(`The kitchen dimensions are ${dimensions.length}' x ${dimensions.width}' and ${dimensions.height}' high.`);
  }
  if (changeLayout) {
    prompt.push(`Client wants to change the layout`);

    if (relocations && distances) {
      const relocationDescriptions = Object.entries(relocations)
        .filter(([appliance, selected]) => selected && distances[appliance])
        .map(([appliance]) => {
          const label = appliance.charAt(0).toUpperCase() + appliance.slice(1);
          const distance = distances[appliance];
          return `by relocating the ${label} by ${distance}"`;
        });

      if (relocationDescriptions.length > 0) {
        const last = relocationDescriptions.pop();
        const sentence = relocationDescriptions.length
          ? relocationDescriptions.join(', ') + ', and ' + last
          : last;
        prompt.push(sentence + '.');
      }
    }
  } else {
    prompt.push('Client does not want to change the layout');
  }
  prompt.push(`Client ${hasDesign ? 'has a design for their new kitchen' : 'does not have a design for their new kitchen'}.`);
  if (electrical?.currentOutlets !== undefined && electrical?.additionalOutlets !== undefined) {
    prompt.push(`Electrical: Kitchen has ${electrical.currentOutlets} current outlets, client wants to add ${electrical.additionalOutlets} more.`);
  }
  if (lighting?.currentFixtures !== undefined && lighting?.additionalFixtures !== undefined) {
    prompt.push(`Lighting: Kitchen has ${lighting.currentFixtures} current fixtures, client wants to add ${lighting.additionalFixtures} more.`);
  }
  if (cabinetStyle) {
    prompt.push(`Cabinet style is ${cabinetStyle}.`);
  }
  if (hasIsland && island?.dimensions) {
    const sides = ['frontSide', 'backSide', 'leftSide', 'rightSide'];
    const labels = {
      frontSide: 'Front side',
      backSide: 'Back side',
      leftSide: 'Left side',
      rightSide: 'Right side'
    };
    const details = sides.map(side => {
      const { length, hasCabinets } = island.dimensions[side] || {};
      return `${labels[side]}: ${length || '0'} feet ${hasCabinets ? 'with cabinets' : 'without cabinets'}`;
    }).join(', ');

    prompt.push(`The client wants a kitchen island with these dimensions: ${details}.`);
  }
  if (layoutSuggestions?.base || layoutSuggestions?.wall || specialCabinets?.length) {
    prompt.push('Cabinet Layout:');

    if (specialCabinets?.length > 0) {
      const specials = specialCabinets.map(name => {
        const cabinet = SPECIAL_CABINET_SIZES?.[name.toLowerCase()];
        return `${cabinet?.description || name} ${cabinet?.size ? `(${cabinet.size}")` : ''}`;
      }).join(', ');
      prompt.push(`Special Cabinets: ${specials}`);
    }
    if (layoutSuggestions?.base?.standardCabinets?.length) {
      const baseGrouped = layoutSuggestions.base.standardCabinets.reduce((acc, size) => {
        acc[size] = (acc[size] || 0) + 1;
        return acc;
      }, {});
      const baseSummary = Object.entries(baseGrouped).map(
        ([size, count]) => `${count} Cabinet${count > 1 ? 's' : ''} of ${size}"`
      ).join(', ');
      prompt.push(`Base Cabinets: ${baseSummary}`);
      prompt.push(`Fillers: ${layoutSuggestions.base.filler || 0}"`);
    }
    if (layoutSuggestions?.wall?.standardCabinets?.length) {
      const wallGrouped = layoutSuggestions.wall.standardCabinets.reduce((acc, size) => {
        acc[size] = (acc[size] || 0) + 1;
        return acc;
      }, {});
      const wallSummary = Object.entries(wallGrouped).map(
        ([size, count]) => `${count} Cabinet${count > 1 ? 's' : ''} of ${size}"`
      ).join(', ');
      prompt.push(`Wall Cabinets: ${wallSummary}`);
      prompt.push(`Fillers: ${layoutSuggestions.wall.filler || 0}"`);
    }
  }
  if (sinkType) {
    prompt.push(`Sink type: ${sinkType}.`);
  }
  if (faucetType) {
    prompt.push(`Faucet type: ${faucetType}.`);
  }
  if (hasPotFiller !== null) {
    prompt.push(`Pot filler: ${hasPotFiller ? 'Yes' : 'No'}.`);
  }
  if (countertopType) {
    prompt.push(`Countertop type is: ${countertopType}. Waterfall: ${wantsWaterfall === true ? 'Yes' : wantsWaterfall === false ? 'No' : 'Not specified'}.`);
  }
  if (backsplashType && backsplashHeight) {
    prompt.push(`Backsplash is: ${backsplashType} with ${backsplashHeight}" height.`);
  }
  if (ventilationType && newVentilationType) {
    prompt.push(`They currently use ${ventilationType} ventilation and want to switch to ${newVentilationType}.`);
  }
  if (cooktopLocation) {
    prompt.push(`The cooktop is located on the ${cooktopLocation}.`);
  }
  if (hasAtticAccess !== null) {
    prompt.push(`Attic access above cooktop: ${hasAtticAccess ? 'Yes' : 'No'}.`);
  }
  if (hasBasementAccess !== null) {
    prompt.push(`Basement/crawl space access: ${hasBasementAccess ? 'Yes' : 'No'}.`);
  }
  prompt.push("Please create an estimate based on this input, including materials, labor, and a 3D design suggestion.");
  return prompt.join(' ');
}
  return (
    <AnimatePresence mode="wait">
      {showVentilationQuestion ? (
        <motion.div
          key="ventilation-question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  What do you currently have as a ventilation system in your kitchen?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {["Downdraft", "Range Hood"].map((type) => (
                    <Button
                      key={type}
                      className={`h-24 ${
                        ventilationType === type.toLowerCase() 
                          ? 'bg-blue-100 border-2 border-blue-500 text-blue-700' 
                          : 'bg-white hover:bg-gray-50 text-gray-800'
                      }`}
                      variant="outline"
                      onClick={() => handleVentilationSelect(type.toLowerCase())}
                    >
                      {type}
                    </Button>
                  ))}
                </div>

                {/* New ventilation preference question */}
                {showNewVentilationPreference && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-10 pt-8 border-t"
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                      What would you like to have in your new kitchen?
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {["Downdraft", "Range Hood"].map((type) => (
                        <Button
                          key={type}
                          className={`h-24 ${
                            newVentilationType === type.toLowerCase() 
                              ? 'bg-blue-100 border-2 border-blue-500 text-blue-700' 
                              : 'bg-white hover:bg-gray-50 text-gray-800'
                          }`}
                          variant="outline"
                          onClick={() => handleNewVentilationSelect(type.toLowerCase())}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>

                    {/* Ventilation change message */}
                    {showVentilationMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-8"
                      >
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                          <p className="text-amber-800 leading-relaxed">
                            {ventilationMessage}
                          </p>
                          <div className="mt-6 flex justify-center">
                            <Button
                              onClick={handleVentilationMessageContinue}
                              className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                              I Understand, Continue
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Cooktop Location Question */}
                    {showCooktopLocationQuestion && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-10 pt-8 border-t"
                      >
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                          Where is your cooktop located?
                        </h3>
                        
                        <div className="grid grid-cols-3 gap-4">
                          {["Island", "Peninsula", "Against the wall"].map((location) => (
                            <Button
                              key={location}
                              className={`h-24 ${
                                cooktopLocation === location.toLowerCase() 
                                  ? 'bg-blue-100 border-2 border-blue-500 text-blue-700' 
                                  : 'bg-white hover:bg-gray-50 text-gray-800'
                              }`}
                              variant="outline"
                              onClick={() => handleCooktopLocationSelect(location.toLowerCase())}
                            >
                              {location}
                            </Button>
                          ))}
                        </div>

                        {/* Attic Access Question */}
                        {showAtticQuestion && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-10 pt-8 border-t"
                          >
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                              Is there attic access above the cooktop?
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                              <Button
                                className={`h-24 ${
                                  hasAtticAccess === true 
                                    ? 'bg-blue-100 border-2 border-blue-500 text-blue-700' 
                                    : 'bg-white hover:bg-gray-50 text-gray-800'
                                }`}
                                variant="outline"
                                onClick={() => handleAtticAccessSelect(true)}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <Check className="w-5 h-5" />
                                  Yes
                                </div>
                              </Button>
                              
                              <Button
                                className={`h-24 ${
                                  hasAtticAccess === false 
                                    ? 'bg-blue-100 border-2 border-blue-500 text-blue-700' 
                                    : 'bg-white hover:bg-gray-50 text-gray-800'
                                }`}
                                variant="outline"
                                onClick={() => handleAtticAccessSelect(false)}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <X className="w-5 h-5" />
                                  No
                                </div>
                              </Button>
                            </div>
                          </motion.div>
                        )}

                        {/* Basement Access Question */}
                        {showBasementQuestion && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-10 pt-8 border-t"
                          >
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                              Do you have access underneath your kitchen (like a basement or crawl space)?
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                              <Button
                                className={`h-24 ${
                                  hasBasementAccess === true 
                                    ? 'bg-blue-100 border-2 border-blue-500 text-blue-700' 
                                    : 'bg-white hover:bg-gray-50 text-gray-800'
                                }`}
                                variant="outline"
                                onClick={() => handleBasementAccessSelect(true)}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <Check className="w-5 h-5" />
                                  Yes
                                </div>
                              </Button>
                              
                              <Button
                                className={`h-24 ${
                                  hasBasementAccess === false 
                                    ? 'bg-blue-100 border-2 border-blue-500 text-blue-700' 
                                    : 'bg-white hover:bg-gray-50 text-gray-800'
                                }`}
                                variant="outline"
                                onClick={() => handleBasementAccessSelect(false)}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <X className="w-5 h-5" />
                                  No
                                </div>
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showAtticQuestion ? (
        <motion.div
          key="attic-question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Is there attic access above the cooktop?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button
                    className={`h-24 ${
                      hasAtticAccess === true
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                        : 'bg-white hover:bg-gray-50 text-gray-800'
                    }`}
                    variant="outline"
                    onClick={() => handleAtticAccessSelect(true)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" />
                      Yes
                    </div>
                  </Button>

                  <Button
                    className={`h-24 ${
                      hasAtticAccess === false
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                        : 'bg-white hover:bg-gray-50 text-gray-800'
                    }`}
                    variant="outline"
                    onClick={() => handleAtticAccessSelect(false)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <X className="w-5 h-5" />
                      No
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showBasementQuestion ? (
        <motion.div
          key="basement-question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Do you have access underneath your kitchen (like a basement or crawl space)?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button
                    className={`h-24 ${
                      hasBasementAccess === true
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                        : 'bg-white hover:bg-gray-50 text-gray-800'
                    }`}
                    variant="outline"
                    onClick={() => handleBasementAccessSelect(true)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" />
                      Yes
                    </div>
                  </Button>

                  <Button
                    className={`h-24 ${
                      hasBasementAccess === false
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                        : 'bg-white hover:bg-gray-50 text-gray-800'
                    }`}
                    variant="outline"
                    onClick={() => handleBasementAccessSelect(false)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <X className="w-5 h-5" />
                      No
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showCooktopLocationQuestion ? (
        <motion.div
          key="cooktop-location-question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Where is your cooktop located?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {["Island", "Peninsula", "Against the wall"].map((location) => (
                    <Button
                      key={location}
                      className={`h-24 ${
                        cooktopLocation === location.toLowerCase()
                          ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                          : 'bg-white hover:bg-gray-50 text-gray-800'
                      }`}
                      variant="outline"
                      onClick={() => handleCooktopLocationSelect(location.toLowerCase())}
                    >
                      {location}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showNewVentilationPreference ? (
        <motion.div
          key="new-ventilation-preference"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  What would you like to have in your new kitchen?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {["Downdraft", "Range Hood"].map((type) => (
                    <Button
                      key={type}
                      className={`h-24 ${
                        newVentilationType === type.toLowerCase()
                          ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                          : 'bg-white hover:bg-gray-50 text-gray-800'
                      }`}
                      variant="outline"
                      onClick={() => handleNewVentilationSelect(type.toLowerCase())}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showFaucetQuestion ? (
        <motion.div
          key="faucet-question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  What kind of faucet would you like?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Single-handle",
                    "Double-handle",
                    "Touchless",
                    "Touch-activated",
                    "Pull-down",
                    "Pull-out",
                    "Other"
                  ].map((type) => (
                    <Button
                      key={type}
                      className={`h-24 ${
                        faucetType === type.toLowerCase()
                          ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                          : 'bg-white hover:bg-gray-50 text-gray-800'
                      }`}
                      variant="outline"
                      onClick={() => handleFaucetSelect(type.toLowerCase())}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showOtherFaucetInput ? (
        <motion.div
          key="other-faucet-input"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Please specify the faucet type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="max-w-xs mx-auto">
                  <Label htmlFor="other-faucet-type">Faucet Type</Label>
                  <Input
                    id="other-faucet-type"
                    value={otherFaucetType}
                    onChange={(e) => setOtherFaucetType(e.target.value)}
                    placeholder="e.g., Bridge Faucet, Wall-mounted"
                  />
                </div>
                <div className="flex justify-between pt-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowOtherFaucetInput(false);
                      setShowFaucetQuestion(true);
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleOtherFaucetContinue}
                    className="bg-black hover:bg-gray-800 text-white"
                    disabled={!otherFaucetType.trim()}
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showSinkQuestion ? (
        <motion.div
          key="sink-question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  What kind of sink would you like?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {["Under-mount", "Drop-in", "Farmhouse", "Flush Mount", "Other"].map((type) => (
                    <Button
                      key={type}
                      className={`h-24 ${
                        sinkType === type.toLowerCase()
                          ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                          : 'bg-white hover:bg-gray-50 text-gray-800'
                      }`}
                      variant="outline"
                      onClick={() => handleSinkSelect(type.toLowerCase())}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showOtherSinkInput ? (
        <motion.div
          key="other-sink-input"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Please specify the sink type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="max-w-xs mx-auto">
                  <Label htmlFor="other-sink-type">Sink Type</Label>
                  <Input
                    id="other-sink-type"
                    value={otherSinkType}
                    onChange={(e) => setOtherSinkType(e.target.value)}
                    placeholder="e.g., Apron Sink, Integrated Sink"
                  />
                </div>
                <div className="flex justify-between pt-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowOtherSinkInput(false);
                      setShowSinkQuestion(true);
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleOtherSinkContinue}
                    className="bg-black hover:bg-gray-800 text-white"
                    disabled={!otherSinkType.trim()}
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showPotFillerQuestion ? (
        <motion.div
          key="pot-filler-question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Do you want a Pot filler?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Explanation of pot filler */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-gray-700">
                    A pot filler is a specialized kitchen faucet installed near your stove
                    or cooktop. It allows you to fill pots with water directly on the stove,
                    eliminating the need to carry heavy water-filled pots from the sink.
                  </p>
                </div>

                {/* Yes/No Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className={`h-16 ${
                      wantsPotFiller === true
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                        : 'bg-white hover:bg-gray-50 text-gray-800'
                    }`}
                    variant="outline"
                    onClick={() => handlePotFillerSelection(true)}
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      Yes
                    </div>
                  </Button>

                  <Button
                    className={`h-16 ${
                      wantsPotFiller === false
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                        : 'bg-white hover:bg-gray-50 text-gray-800'
                    }`}
                    variant="outline"
                    onClick={() => handlePotFillerSelection(false)}
                  >
                    <div className="flex items-center gap-2">
                      <X className="w-5 h-5" />
                      No
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showBacksplashQuestion ? (
        <motion.div
          key="backsplash-question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  What kind of Backsplash would you like?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {["Same as countertop", "Tiles", "Glass", "Other"].map((type) => (
                    <Button
                      key={type}
                      className={`h-24 ${
                        backsplashType === type.toLowerCase()
                          ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                          : 'bg-white hover:bg-gray-50 text-gray-800'
                      }`}
                      variant="outline"
                      onClick={() => handleBacksplashSelect(type.toLowerCase())}
                    >
                      {type}
                    </Button>
                  ))}
                </div>

                {/* Backsplash Height Input - Shows only after type selection */}
                {showBacksplashHeight && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8 space-y-6"
                  >
                    <div className="border-t pt-6">
                      <Label
                        htmlFor="backsplash-height"
                        className="text-xl font-semibold block mb-4 text-center"
                      >
                        Please measure the height in inches between your base and wall cabinets
                        <span className="block text-sm font-normal text-gray-600 mt-1">
                          (This is your Backsplash height)
                        </span>
                      </Label>
                      <div className="max-w-xs mx-auto">
                        <div className="relative">
                          <Input
                            id="backsplash-height"
                            type="number"
                            min="0"
                            value={backsplashHeight}
                            onChange={(e) => setBacksplashHeight(e.target.value)}
                            placeholder="0"
                            className="pr-16 text-center text-lg"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            inches
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={handleBacksplashComplete}
                        className="bg-black hover:bg-gray-800 text-white"
                        disabled={!backsplashHeight.trim()}
                      >
                        Continue
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showOtherBacksplashInput ? (
        <motion.div
          key="other-backsplash-input"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Please specify the backsplash type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="max-w-xs mx-auto">
                  <Label htmlFor="other-backsplash-type">Backsplash Type</Label>
                  <Input
                    id="other-backsplash-type"
                    value={otherBacksplashType}
                    onChange={(e) => setOtherBacksplashType(e.target.value)}
                    placeholder="e.g., Stainless Steel, Custom Art"
                  />
                </div>
                <div className="flex justify-between pt-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowOtherBacksplashInput(false);
                      setShowBacksplashQuestion(true);
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleOtherBacksplashContinue}
                    className="bg-black hover:bg-gray-800 text-white"
                    disabled={!otherBacksplashType.trim()}
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showBacksplashHeightInput ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          key="backsplash-height-input"
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  What is the height of your backsplash?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="max-w-xs mx-auto">
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Enter height"
                      value={backsplashHeight}
                      onChange={(e) => setBacksplashHeight(e.target.value)}
                      className="pr-16 text-center text-lg"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      inches
                    </span>
                  </div>
                </div>
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={() => {
                      setShowBacksplashHeightInput(false);
                      setShowPotFillerQuestion(true);
                    }}
                    disabled={!backsplashHeight}
                    className="w-full bg-black hover:bg-gray-800 text-white"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showWaterfallQuestion ? (
        <motion.div
          key="waterfall-question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Do you want a waterfall?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Waterfall Explanation */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    A waterfall kitchen countertop is a design style where the countertop material
                    doesn't stop at the edge of the cabinets — instead, it continues vertically
                    down the sides, all the way to the floor, like a "waterfall." It's most often
                    used on kitchen islands or peninsulas, and it creates a dramatic, modern, and
                    seamless look.
                  </p>
                </div>

                {/* Image Example */}
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&q=80"
                    alt="Waterfall Countertop Example"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Yes/No Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className={`h-16 ${
                      wantsWaterfall === true
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                        : 'bg-white hover:bg-gray-50 text-gray-800'
                    }`}
                    variant="outline"
                    onClick={() => handleWaterfallSelection(true)}
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      Yes
                    </div>
                  </Button>

                  <Button
                    className={`h-16 ${
                      wantsWaterfall === false
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                        : 'bg-white hover:bg-gray-50 text-gray-800'
                    }`}
                    variant="outline"
                    onClick={() => handleWaterfallSelection(false)}
                  >
                    <div className="flex items-center gap-2">
                      <X className="w-5 h-5" />
                      No
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showCountertopQuestion ? (
        <motion.div
          key="countertop-question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  What kind of countertop would you like?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {["Quartz", "Granite", "Marble", "Quartzite",
                    "Butcher Block", "Laminate", "Stainless Steel", "Other"].map((type) => (
                    <Button
                      key={type}
                      className={`h-24 ${
                        countertopType === type.toLowerCase()
                          ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                          : 'bg-white hover:bg-gray-50 text-gray-800'
                      }`}
                      variant="outline"
                      onClick={() => handleCountertopSelect(type.toLowerCase())}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showOtherCountertopInput ? (
        <motion.div
          key="other-countertop-input"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Please specify the countertop type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="max-w-xs mx-auto">
                  <Label htmlFor="other-countertop-type">Countertop Type</Label>
                  <Input
                    id="other-countertop-type"
                    value={otherCountertopType}
                    onChange={(e) => setOtherCountertopType(e.target.value)}
                    placeholder="e.g., Recycled Glass, Concrete"
                  />
                </div>
                <div className="flex justify-between pt-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowOtherCountertopInput(false);
                      setShowCountertopQuestion(true);
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleOtherCountertopContinue}
                    className="bg-black hover:bg-gray-800 text-white"
                    disabled={!otherCountertopType.trim()}
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showLayoutSuggestion ? (
        <motion.div
          key="layout-suggestion"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Suggested Cabinet Layout
                </CardTitle>
                <CardDescription>
                  Based on your measurements and selected special cabinets, here's our suggested configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Base Cabinets Suggestion */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Base Cabinets</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-600 mb-4">
                      Total Length: {baseCabinetInches} inches
                    </p>
                    <div className="space-y-6">
                      {/* Special Base Cabinets */}
                      {calculateCabinetLayout(parseFloat(baseCabinetInches), 'base').specialCabinets.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Special Cabinets:</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {calculateCabinetLayout(parseFloat(baseCabinetInches), 'base').specialCabinets.map((cabinet, index) => (
                              <li key={`special-base-${index}`}>
                                {cabinet.description} ({cabinet.size}")
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Standard Base Cabinets */}
                      <div>
                        <h4 className="font-medium mb-2">Standard Cabinets:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {calculateCabinetLayout(parseFloat(baseCabinetInches), 'base').standardCabinets.map((size, index) => (
                            <li key={`standard-base-${index}`}>
                              1 cabinet of {size}" width
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2">
                        <p className="text-gray-600">
                          Filler needed: {calculateCabinetLayout(parseFloat(baseCabinetInches), 'base').filler}" total
                          {calculateCabinetLayout(parseFloat(baseCabinetInches), 'base').filler > 0 &&
                            " (can be distributed between cabinets)"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wall Cabinets Suggestion */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Wall Cabinets</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-600 mb-4">
                      Total Length: {wallCabinetInches} inches
                    </p>
                    <div className="space-y-6">
                      {/* Special Wall Cabinets */}
                      {calculateCabinetLayout(parseFloat(wallCabinetInches), 'wall').specialCabinets.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Special Cabinets:</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {calculateCabinetLayout(parseFloat(wallCabinetInches), 'wall').specialCabinets.map((cabinet, index) => (
                              <li key={`special-wall-${index}`}>
                                {cabinet.description} ({cabinet.size}")
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Standard Wall Cabinets */}
                      <div>
                        <h4 className="font-medium mb-2">Standard Cabinets:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {calculateCabinetLayout(parseFloat(wallCabinetInches), 'wall').standardCabinets.map((size, index) => (
                            <li key={`standard-wall-${index}`}>
                              1 cabinet of {size}" width
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2">
                        <p className="text-gray-600">
                          Filler needed: {calculateCabinetLayout(parseFloat(wallCabinetInches), 'wall').filler}" total
                          {calculateCabinetLayout(parseFloat(wallCabinetInches), 'wall').filler > 0 &&
                            " (can be distributed between cabinets)"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowLayoutSuggestion(false);
                      setShowCabinetLayout(true);
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleLayoutSuggestionContinue}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showCabinetLayout ? (
        <motion.div
          key="cabinet-layout"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Let's customize your cabinets layout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  {/* Base Cabinet Length */}
                  <div className="space-y-2">
                    <Label htmlFor="base-cabinet-inches">
                      What is the total length (in inches) of your existing Base cabinets?
                    </Label>
                    <div className="relative">
                      <Input
                        id="base-cabinet-inches"
                        type="number"
                        min="0"
                        value={baseCabinetInches}
                        onChange={(e) => setBaseCabinetInches(e.target.value)}
                        placeholder="0"
                        className="pr-10"
                      />
                      <span className="absolute right-3 top-3 text-gray-500">inches</span>
                    </div>
                  </div>

                  {/* Wall Cabinet Length */}
                  <div className="space-y-2">
                    <Label htmlFor="wall-cabinet-inches">
                      What is the total length (in inches) of your existing Wall cabinets?
                    </Label>
                    <div className="relative">
                      <Input
                        id="wall-cabinet-inches"
                        type="number"
                        min="0"
                        value={wallCabinetInches}
                        onChange={(e) => setWallCabinetInches(e.target.value)}
                        placeholder="0"
                        className="pr-10"
                      />
                      <span className="absolute right-3 top-3 text-gray-500">inches</span>
                    </div>
                  </div>

                  {/* Special Cabinet Selection */}
                  <div className="space-y-3 pt-4">
                    <Label className="text-base">
                      What special stock cabinets would you like to have in your new kitchen?
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {[
                        "Lazy Susan",
                        "Pull-out pantry",
                        "Trash & Recycling Pull-out",
                        "Spice Rack Pull-Out",
                        "Appliance Garage",
                        "Wine Rack or Beverage Center",
                        "Glass-Front Display"
                      ].map((cabinet) => (
                        <div key={cabinet} className="flex items-center space-x-2">
                          <Checkbox
                            id={cabinet.replace(/\s+/g, '-').toLowerCase()}
                            checked={selectedSpecialCabinets.includes(cabinet)}
                            onCheckedChange={() => handleSpecialCabinetToggle(cabinet)}
                          />
                          <label
                            htmlFor={cabinet.replace(/\s+/g, '-').toLowerCase()}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {cabinet}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowCabinetLayout(false);
                      setShowSpecialCabinets(true);
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    onClick={handleCabinetLayoutContinue}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showSpecialCabinets ? (
        <motion.div
          key="special-cabinets"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Special Stock Cabinets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    title: "Lazy Susan Cabinet",
                    description: "A corner base cabinet with a rotating circular shelf inside.",
                    features: [
                      "Makes use of otherwise hard-to-reach corner space",
                      "Great for storing pots, pans, and dry goods",
                      "Comes in full-round or half-moon versions"
                    ],
                    sizes: "Standard Size: 36\" x 36\" corner cabinet"
                  },
                  {
                    title: "Pull-Out Pantry Cabinet",
                    description: "A tall, narrow cabinet with sliding shelves.",
                    features: [
                      "Keeps pantry items organized and easily accessible",
                      "Fits in tight spaces next to refrigerators or ovens"
                    ],
                    sizes: "Standard Sizes: 12\", 15\", or 24\" width, 84\"-96\" height"
                  },
                  {
                    title: "Trash & Recycling Pull-Out Cabinet",
                    description: "A base cabinet with a slide-out drawer that hides bins.",
                    features: [
                      "Keeps trash and recycling out of sight",
                      "Usually fits 1–2 standard bins"
                    ],
                    sizes: "Standard Sizes: 15\" or 18\" width for a double bin system"
                  },
                  {
                    title: "Spice Rack Pull-Out",
                    description: "A slim, vertical pull-out cabinet for storing spices and condiments.",
                    features: [
                      "Typically placed near the stove for convenience",
                      "Keeps small items neatly arranged"
                    ],
                    sizes: "Standard Sizes: 6\", 9\", or 12\" width"
                  },
                  {
                    title: "Appliance Garage",
                    description: "A wall or countertop cabinet with a lift-up or roll-up door.",
                    features: [
                      "Hides small appliances like toasters and blenders",
                      "Keeps countertops looking clean and organized"
                    ],
                    sizes: "Standard Sizes: 24\" or 30\" width, typically 15\"-18\" height"
                  },
                  {
                    title: "Wine Rack or Beverage Center",
                    description: "Cabinets designed to store wine bottles or beverage fridges.",
                    features: [
                      "Can be integrated into the island or a tall cabinet section"
                    ],
                    sizes: "Standard Sizes: 15\", 18\", or 24\" width"
                  },
                  {
                    title: "Glass-Front Display Cabinets",
                    description: "Wall cabinets with glass doors to showcase dishes or décor.",
                    features: [
                      "Adds visual interest and a custom look"
                    ],
                    sizes: "Standard Sizes: 24\", 30\", or 36\" width"
                  }
                ].map((cabinet, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">
                      {cabinet.title}
                    </h3>
                    <p className="text-gray-700 mb-2">
                      {cabinet.description}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 pl-4 mb-3">
                      {cabinet.features.map((feature, i) => (
                        <li key={i}>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <p className="text-blue-600 font-medium text-sm mt-2">
                      {cabinet.sizes}
                    </p>
                  </div>
                ))}

                <div className="flex justify-between pt-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowSpecialCabinets(false);
                      setShowPrefabDetails(true);
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    onClick={handleSpecialCabinetsContinue}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showPrefabDetails ? (
        <motion.div
          key="prefab-details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  About Pre-fabricated (Stock) Cabinets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  {/* Base Cabinets */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">
                      1) Base Cabinets
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex gap-2">
                        <span className="font-medium min-w-32">Standard Height:</span>
                        <span>34.5"</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium min-w-32">Standard Depth:</span>
                        <span>24"</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium min-w-32">Standard Width:</span>
                        <span>Comes in 3-inch increments, from 9" to 48"</span>
                      </li>
                    </ul>
                  </div>

                  {/* Wall Cabinets */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">
                      2) Wall Cabinets (mounted on the wall above counters or appliances)
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex gap-2">
                        <span className="font-medium min-w-32">Standard Height:</span>
                        <span>12", 15", 18", 24", 30", 36", and 42"</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium min-w-32">Standard Depth:</span>
                        <span>12"</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium min-w-32">Standard Width:</span>
                        <span>Comes in 3-inch increments, from 9" to 48"</span>
                      </li>
                    </ul>
                  </div>

                  {/* Tall Cabinets */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">
                      3) Tall Cabinets/Pantry Units
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex gap-2">
                        <span className="font-medium min-w-32">Standard Height:</span>
                        <span>84", 90", or 96"</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium min-w-32">Standard Depth:</span>
                        <span>Typically 24", sometimes 12" for slim versions</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium min-w-32">Standard Width:</span>
                        <span>18", 24", or 30"</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowPrefabDetails(false);
                      setShowCabinetStyle(true);
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    onClick={handlePrefabContinue}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showIslandQuestion ? (
        <motion.div
          key="island-question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Would you like a kitchen island?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleIslandChoice(true)}
                    variant="outline"
                    className={`h-24 text-lg hover:scale-105 transition-transform ${
                      hasIsland ? 'border-2 border-black' : ''
                    }`}
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={() => handleIslandChoice(false)}
                    variant="outline"
                    className={`h-24 text-lg hover:scale-105 transition-transform ${
                      hasIsland === false ? 'border-2 border-black' : ''
                    }`}
                  >
                    No
                  </Button>
                </div>

                {hasIsland && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-6"
                  >
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-6 text-center">
                        Kitchen Island Dimensions
                      </h3>
                      <div className="space-y-6">
                        {Object.entries({
                          frontSide: 'Front side',
                          backSide: 'Back side',
                          leftSide: 'Left side',
                          rightSide: 'Right side'
                        }).map(([key, label]) => (
                          <div key={key} className="flex items-center gap-4">
                            <div className="flex-1">
                              <Label htmlFor={key}>{label}</Label>
                              <div className="relative mt-1">
                                <Input
                                  id={key}
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  value={islandDimensions[key].length}
                                  onChange={(e) => handleIslandDimensionChange(key, e.target.value)}
                                  placeholder="0"
                                  className="pr-12"
                                />
                                <span className="absolute right-3 top-3 text-gray-500">
                                  ft
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                              <Checkbox
                                id={`${key}-cabinets`}
                                checked={islandDimensions[key].hasCabinets}
                                onCheckedChange={() => handleIslandCabinetToggle(key)}
                              />
                              <Label htmlFor={`${key}-cabinets`}>
                                Add cabinets
                              </Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between pt-8">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowIslandQuestion(false);
                      // Go back to previous step based on cabinet path
                      if (cabinetStyle === 'custom') { // If custom path, go to wall cabinet measurement
                        setShowWallCabinetMeasurement(true);
                      } else { // If prefab path, go to layout suggestion
                        setShowLayoutSuggestion(true);
                      }
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    onClick={handleIslandContinue}
                    className="bg-black hover:bg-gray-800 text-white"
                    disabled={hasIsland && Object.values(islandDimensions).some(
                      side => side.length === ''
                    )}
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showWallCabinetMeasurement ? (
        <motion.div
          key="wall-cabinet-measurement"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Please measure the length of your wall cabinets
                </CardTitle>
                <CardDescription className="text-lg">
                  in Linear Feet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-4">
                <div className="max-w-sm mx-auto">
                  <div className="space-y-2">
                    <Label htmlFor="wall-cabinet-length">Length in Linear Feet</Label>
                    <div className="relative">
                      <Input
                        id="wall-cabinet-length"
                        type="number"
                        min="0"
                        step="0.1"
                        value={wallCabinetLength}
                        onChange={(e) => setWallCabinetLength(e.target.value)}
                        placeholder="0"
                        className="text-center text-xl"
                      />
                      <span className="absolute right-3 top-3 text-gray-500">ft</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowWallCabinetMeasurement(false);
                      setShowBaseCabinetMeasurement(true);
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    onClick={handleWallCabinetContinue}
                    className="bg-black hover:bg-gray-800 text-white"
                    disabled={!wallCabinetLength}
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showBaseCabinetMeasurement ? (
        <motion.div
          key="base-cabinet-measurement"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Please measure the length of your Base cabinets
                </CardTitle>
                <CardDescription className="text-lg">
                  (Cabinets on the bottom) in Linear Feet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-4">
                <div className="max-w-sm mx-auto">
                  <div className="space-y-2">
                    <Label htmlFor="base-cabinet-length">Length in Linear Feet</Label>
                    <div className="relative">
                      <Input
                        id="base-cabinet-length"
                        type="number"
                        min="0"
                        step="0.1"
                        value={baseCabinetLength}
                        onChange={(e) => setBaseCabinetLength(e.target.value)}
                        placeholder="0"
                        className="text-center text-xl"
                      />
                      <span className="absolute right-3 top-3 text-gray-500">ft</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowBaseCabinetMeasurement(false);
                      setShowCabinetStyle(true);
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    onClick={handleBaseCabinetContinue}
                    className="bg-black hover:bg-gray-800 text-white"
                    disabled={!baseCabinetLength}
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showCabinetStyle ? (
        <motion.div
          key="cabinet-style"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  What style would you like for your kitchen cabinets?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Shaker', 'Flat (Euro)', 'Custom', 'Other'].map((style) => (
                    <Button
                      key={style}
                      onClick={() => handleCabinetStyleSelect(style.toLowerCase())}
                      variant="outline"
                      className={`h-24 text-lg hover:scale-105 transition-transform ${
                        cabinetStyle === style.toLowerCase() ? 'border-2 border-black' : ''
                      }`}
                    >
                      {style}
                    </Button>
                  ))}
                </div>

                {showOtherCabinetInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-4" // Ensure this is correctly positioned by CardContent's space-y
                  >
                    <Label htmlFor="other-cabinet-style">Specify Cabinet Style</Label>
                    <Input
                      id="other-cabinet-style"
                      value={otherCabinetStyle}
                      onChange={(e) => setOtherCabinetStyle(e.target.value)}
                      placeholder="e.g., Traditional, Modern Farmhouse"
                    />
                    <Button
                      onClick={handleOtherCabinetContinue}
                      className="w-full bg-black hover:bg-gray-800 text-white" // Full width for clarity
                      disabled={!otherCabinetStyle.trim()}
                    >
                      Continue with this style
                    </Button>
                  </motion.div>
                )}

                <div className="flex justify-start pt-8"> {/* Changed justify-between to justify-start */}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (showOtherCabinetInput) {
                        setShowOtherCabinetInput(false);
                        setCabinetStyle(''); // Unselect 'Other' button
                      } else {
                        setShowCabinetStyle(false);
                        setShowLightingDetails(true);
                      }
                    }}
                  >
                    Back
                  </Button>
                  {/* No general "Continue" button here, as specific actions handle navigation */}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showLightingDetails ? (
        <motion.div
          key="lighting"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Lighting Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-12 pt-4">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-6">
                      How many light fixtures do you currently have?
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-10 rounded-full p-0"
                        onClick={() => decrementCounter(setCurrentFixtures, currentFixtures)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="text-center text-3xl font-semibold w-16">
                        {currentFixtures}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-10 rounded-full p-0"
                        onClick={() => incrementCounter(setCurrentFixtures)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-6">
                      How many additional light fixtures would you like?
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-10 rounded-full p-0"
                        onClick={() => decrementCounter(setAdditionalFixtures, additionalFixtures)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="text-center text-3xl font-semibold w-16">
                        {additionalFixtures}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-10 rounded-full p-0"
                        onClick={() => incrementCounter(setAdditionalFixtures)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowLightingDetails(false);
                      setShowElectricalDetails(true);
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    onClick={handleLightingContinue}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showElectricalDetails ? (
        <motion.div
          key="electrical"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Electrical Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-12 pt-4">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-6">
                      How many electrical outlets do you currently have?
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-10 rounded-full p-0"
                        onClick={() => decrementCounter(setCurrentOutlets, currentOutlets)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="text-center text-3xl font-semibold w-16">
                        {currentOutlets}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-10 rounded-full p-0"
                        onClick={() => incrementCounter(setCurrentOutlets)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-6">
                      How many additional outlets would you like?
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-10 rounded-full p-0"
                        onClick={() => decrementCounter(setAdditionalOutlets, additionalOutlets)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="text-center text-3xl font-semibold w-16">
                        {additionalOutlets}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-10 rounded-full p-0"
                        onClick={() => incrementCounter(setAdditionalOutlets)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowElectricalDetails(false);
                      if (showNoDesignConfirmation) {
                        setShowNoDesignConfirmation(true);
                      } else if (showDesignUpload) {
                        setShowDesignUpload(true);
                      } else { // Fallback if somehow neither design path was taken
                        // This might indicate a missing state to go back to previous design question
                        // For now, if no design was chosen, go back to design question
                        setShowDesignQuestion(true);
                      }
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    onClick={handleElectricalContinue}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showDesignUpload ? (
        <motion.div
          key="design-upload"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Upload Your Kitchen Design
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center gap-4 pt-4">
                  <div className="w-full max-w-md">
                    <Label htmlFor="design-file" className="block mb-2">
                      Please upload your kitchen design file
                    </Label>
                    <Input
                      id="design-file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.dwg"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Accepted formats: PDF, JPG, PNG, DWG
                    </p>
                  </div>
                  
                  {selectedFile && (
                    <div className="w-full max-w-md bg-green-50 p-3 rounded-md border border-green-200">
                      <p className="text-green-700 flex items-center">
                        <CheckIcon className="h-5 w-5 mr-2" />
                        File selected: {selectedFile.name}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowDesignUpload(false);
                      setShowDesignQuestion(true);
                    }}
                  >
                    Back
                  </Button>
                  
                  <Button
                    onClick={handleDesignUploadContinue}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedFile}
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showNoDesignConfirmation ? (
        <motion.div
          key="no-design"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  No worries, we will create a design for you
                </h2>
                
                <p className="text-gray-600 mb-8">
                  Our team will help you create a beautiful kitchen design based on your requirements.
                </p>

                <div className="flex flex-col gap-4 items-center">
                  <Button
                    onClick={handleNoDesignContinue}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowNoDesignConfirmation(false);
                      setShowDesignQuestion(true);
                    }}
                    className="text-gray-600"
                  >
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showDesignQuestion ? (
        <motion.div
          key="design"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Do you have a design for your new kitchen?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <Button
                    onClick={() => handleDesignChoice(true)}
                    className="h-24 text-lg hover:scale-105 transition-transform"
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={() => handleDesignChoice(false)}
                    variant="outline"
                    className="h-24 text-lg hover:scale-105 transition-transform"
                  >
                    No
                  </Button>
                </div>

                <div className="flex justify-start pt-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowDesignQuestion(false);
                      // Go back to Layout Question or Distance Measurement based on flow
                      if (Object.values(relocations).some(value => value === true)) { // If relocation was chosen
                        setShowDistanceMeasurement(true);
                        setCurrentItemIndex(getSelectedItems().length - 1); // Go back to the last item in distance measurement
                      } else { // If no layout change, go back to initial layout question
                        setShowLayoutQuestion(true);
                      }
                    }}
                  >
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : showLayoutQuestion ? (
        !showDistanceMeasurement ? (
          <motion.div
            key="layout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white shadow-lg">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {showRelocationOptions
                      ? "Which of the following would you like to relocate?"
                      : "Would you like to change your existing kitchen layout?"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!showRelocationOptions ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <Button
                          onClick={handleLayoutYes}
                          className="h-24 text-lg hover:scale-105 transition-transform"
                        >
                          Yes
                        </Button>
                        <Button
                          onClick={() => handleLayoutChoice(false)}
                          variant="outline"
                          className="h-24 text-lg hover:scale-105 transition-transform"
                        >
                          No
                        </Button>
                      </div>

                      {showLayoutExplanation && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6"
                        >
                          <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-6">
                              <p className="text-gray-700 leading-relaxed mb-4">
                                This question refers to changing the location of your Sink, Stove, Oven, Dishwasher, Refrigerator, or any other major appliance. Relocating these items usually requires plumbing, gas, and/or electrical modifications, which will affect your Estimax. Changing your existing lighting layout will also require electrical rewiring.
                              </p>
                              <Button
                                onClick={handleLayoutConfirm}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                              >
                                Ok
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(relocations).map((item) => (
                          <div key={item} className="flex items-center space-x-2 p-4 border rounded-md hover:bg-gray-50">
                            <Checkbox
                              id={`relocation-${item}`}
                              checked={relocations[item]}
                              onCheckedChange={() => handleRelocationToggle(item)}
                            />
                            <label
                              htmlFor={`relocation-${item}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-grow"
                            >
                              {item.charAt(0).toUpperCase() + item.slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-end pt-6 gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowRelocationOptions(false);
                            setShowLayoutExplanation(false);
                            // Go back to initial layout question
                            setShowLayoutQuestion(true);
                          }}
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleRelocationContinue}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Continue
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {!showRelocationOptions && !showLayoutExplanation && (
                    <div className="flex justify-start pt-6">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowLayoutQuestion(false);
                          setShowDimensionsForm(true); // Go back to dimensions form
                        }}
                      >
                        Back
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : (
          renderDistanceMeasurement()
        )
      ) : showDimensionsForm ? (
        <motion.div
          key="dimensions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Please provide your kitchen dimensions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="length">Length (feet)</Label>
                    <Input
                      id="length"
                      placeholder="0"
                      value={dimensions.length}
                      onChange={(e) => handleDimensionChange('length', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (feet)</Label>
                    <Input
                      id="width"
                      placeholder="0"
                      value={dimensions.width}
                      onChange={(e) => handleDimensionChange('width', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (feet)</Label>
                    <Input
                      id="height"
                      placeholder="0"
                      value={dimensions.height}
                      onChange={(e) => handleDimensionChange('height', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowDimensionsForm(false);
                      onBack(); // Assuming onBack handles previous component state
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleDimensionsContinue}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : (
        // Fallback initial view for KitchenMeasurements
        <motion.div
          key="initial"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Kitchen Measurements Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <Ruler className="h-16 w-16 text-blue-500" />
                </div>
                
                <p className="text-center text-gray-600 text-lg leading-relaxed px-4">
                  Please prepare a measuring tape or a laser measure for the next question.
                  You will need to measure the dimensions of your kitchen.
                  If you need help, you can request assistance from one of our estimators.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    onClick={() => setShowDimensionsForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full"
                  >
                    <Ruler className="w-5 h-5 mr-2" />
                    I can measure myself
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="px-8 py-3 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        Click here for help
                        <ChevronDown className="w-5 h-5 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuItem className="py-3 cursor-pointer">
                        <Video className="mr-2 h-4 w-4" />
                        <span>Video call</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="py-3 cursor-pointer">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Send a message</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="py-3 cursor-pointer">
                        <PersonStanding className="mr-2 h-4 w-4" />
                        <span>Request a face-to-face visit</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    
  );
}
