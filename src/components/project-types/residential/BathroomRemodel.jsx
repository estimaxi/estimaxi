
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  VideoIcon,
  User as UserIcon,
  Plus,
  Minus,
  Upload,
  Ruler,
  Wand2,
  AlertTriangle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, Video, MessageSquare, PersonStanding } from "lucide-react";

// NEW IMPORTS
import { calculateProjectEstimate } from '../../estimation/EstimationFlow';
import { Loader2 } from 'lucide-react'; // Corrected typo: lucide-leac to lucide-react
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function BathroomRemodel({ onSelect, onBack, address }) {
  const [step, setStep] = useState('measurement_instructions');
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [bathroomMeasurements, setBathroomMeasurements] = useState({
    length: '',
    width: '',
    height: ''
  });
  const [hasBathroomMeasurements, setHasBathroomMeasurements] = useState(false);
  const [bathroomDimensions, setBathroomDimensions] = useState({
      width: '',
      length: '',
      height: ''
  });
  const [hasDesign, setHasDesign] = useState(null);
  const [designFile, setDesignFile] = useState(null);
  const [electricalDetails, setElectricalDetails] = useState({
    currentOutlets: 0,
    additionalOutlets: 0
  });
  const [lightingDetails, setLightingDetails] = useState({
    currentLights: 0,
    additionalLights: 0
  });
  const [wantsNewVanity, setWantsNewVanity] = useState(null);
  const [vanityType, setVanityType] = useState(null);
  const [vanitySize, setVanitySize] = useState(null);
  const [customVanitySize, setCustomVanitySize] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [vanityCountertop, setVanityCountertop] = useState(null);
  const [otherCountertopMaterial, setOtherCountertopMaterial] = useState('');
  const [vanityFaucet, setVanityFaucet] = useState(null);
  const [otherFaucetType, setOtherFaucetType] = useState('');
  const [sinkType, setSinkType] = useState(null);
  const [otherSinkType, setOtherSinkType] = useState('');
  const [backsplashHeight, setBacksplashHeight] = useState(4); // Default to 4 inches
  const [otherVanityType, setOtherVanityType] = useState('');
  const [showOtherVanityInput, setShowOtherVanityInput] = useState(false);
  const [bathingSetup, setBathingSetup] = useState(null);
  const [showerType, setShowerType] = useState(null);
  const [otherShowerType, setOtherShowerType] = useState('');
  const [showerDimensions, setShowerDimensions] = useState({
    width: '',
    length: '',
    height: ''
  });
  const [changeLayout, setChangeLayout] = useState(null);
  const [showLayoutInfo, setShowLayoutInfo] = useState(false);
  const [relocateItems, setRelocateItems] = useState({
    showerDrainage: false,
    showerHead: false,
    tubFiller: false,
    toilet: false,
    vanity: false
  });
  const [relocationDistances, setRelocationDistances] = useState({
    showerDrainage: '',
    showerHead: '',
    tubFiller: '',
    toilet: '',
    vanity: ''
  });
  const [currentRelocateItem, setCurrentRelocateItem] = useState(null);
  const [mirrorType, setMirrorType] = useState(null);
  const [otherMirrorType, setOtherMirrorType] = useState('');
  const [toiletType, setToiletType] = useState(null);
  const [otherToiletType, setOtherToiletType] = useState('');
  const [wantsShowerBench, setWantsShowerBench] = useState(null);
  const [benchType, setBenchType] = useState(null); // This seems unused, replaced by wantsShowerBench for boolean choice
  const [otherBenchType, setOtherBenchType] = useState(''); // This seems unused
  const [wantsShampooNiche, setWantsShampooNiche] = useState(null);
  const [showerHeadType, setShowerHeadType] = useState(null);
  const [otherShowerHeadType, setOtherShowerHeadType] = useState('');
  const [showShowerHeadMessage, setShowShowerHeadMessage] = useState(false);
  const [showerEnclosureType, setShowerEnclosureType] = useState(null);
  const [otherShowerEnclosureType, setOtherShowerEnclosureType] = useState('');
  const [glassDoorType, setGlassDoorType] = useState(null);
  const [otherGlassDoorType, setOtherGlassDoorType] = useState('');
  const [renovationType, setRenovationType] = useState('Full');
  const [isSubmitting, setIsSubmitting] = useState(false); // This seems unused, replaced by isGeneratingEstimate
  const [tubType, setTubType] = useState(null);
  const [otherTubType, setOtherTubType] = useState('');
  const [tubDimensions, setTubDimensions] = useState({
    width: '',
    length: '',
    height: ''
  });
  const [tubFillerType, setTubFillerType] = useState(null);
  const [otherTubFillerType, setOtherTubFillerType] = useState('');
  const [wantsTubShowerHead, setWantsTubShowerHead] = useState(null);
  const [tubShowerHeadType, setTubShowerHeadType] = useState(null);
  const [otherTubShowerHeadType, setOtherTubShowerHeadType] = useState('');
  const [currentStep, setCurrentStep] = useState('measurement_instructions'); // Duplicate of 'step'
  const [showerEnclosure, setShowerEnclosure] = useState(''); // Seems unused or duplicate of showerEnclosureType
  const [wetRoomEnclosureType, setWetRoomEnclosureType] = useState(''); // Not explicitly used, but in prompt
  const [otherShowerEnclosure, setOtherShowerEnclosure] = useState(''); // Not explicitly used, but in prompt
  const [showOtherShowerInput, setShowOtherShowerInput] = useState(false); // Seems unused
  const [customBathingSetup, setCustomBathingSetup] = useState('');
  const [bothSetupChoices, setBothSetupChoices] = useState({
    shower: '',
    tub: '',
    otherShower: '',
    otherTub: '',
    showerDimensions: {
      width: '',
      length: '',
      height: ''
    },
    tubDimensions: {
      width: '',
      length: '',
      height: ''
    }
  });

  const [bothShowerHead, setBothShowerHead] = useState('');
  const [otherBothShowerHead, setOtherBothShowerHead] = useState('');
  const [hasBench, setHasBench] = useState(null); // seems unused, replaced by wantsShowerBench or bothHasBench
  const [hasNiche, setHasNiche] = useState(null); // seems unused, replaced by wantsShampooNiche or bothHasNiche

    // Add specific state for the Both flow
    const [bothHasBench, setBothHasBench] = useState(null);

    // Add state for Both flow
    const [bothHasNiche, setBothHasNiche] = useState(null);
    const [showerTubArrangement, setShowerTubArrangement] = useState('');

  const [wetRoomGlassDoor, setWetRoomGlassDoor] = useState(null);
  const [separateShowerGlassDoor, setSeparateShowerGlassDoor] = useState(null);

  // Add new state for wet room glass door type
  const [wetRoomGlassDoorType, setWetRoomGlassDoorType] = useState('');

  // NEW STATE
  const navigate = useNavigate();
  const [isGeneratingEstimate, setIsGeneratingEstimate] = useState(false);


  // Helper function to calculate progress percentage based on current step
  const calculateProgress = (currentStep) => {
    const steps = getStepsForSetup();
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex === -1) return 0;
    return Math.round(((currentIndex + 1) / steps.length) * 100);
  };

  // Also make sure there's a function that returns the step number
  // If it doesn't exist, add it:
  const getStepNumber = (currentStep) => {
    const steps = getStepsForSetup();
    return steps.indexOf(currentStep) + 1;
  };

  // Add a helper function to get total steps if it doesn't exist
  const getTotalSteps = () => {
    return getStepsForSetup().length;
  };

  // Add a helper function to get steps for the current setup
  const getStepsForSetup = () => {
    if (bathingSetup === 'Shower') {
      return [
        'measurement_instructions', 'measurements', 'layout_change', 'relocate_items', 'measure_distance', 'has_design', 'electrical_questions', 'lighting_questions', 'vanity_question', 'vanity_selection', 'existing_vanity', 'countertop_selection', 'other_countertop', 'faucet_selection', 'other_faucet', 'sink_selection', 'other_sink', 'mirror_selection', 'other_mirror', 'toilet_selection', 'other_toilet', 'bathing_setup', 'shower_type', 'other_shower_type',
        'shower_dimensions', 'shower_bench', 'shampoo_niche', 'shower_head', 'other_shower_head',
        'shower_enclosure', 'other_shower_enclosure', 'glass_door_type', 'other_glass_door_type', 'project_summary'
      ];
    } else if (bathingSetup === 'Tub') {
      return [
        'measurement_instructions', 'measurements', 'layout_change', 'relocate_items', 'measure_distance', 'has_design', 'electrical_questions', 'lighting_questions', 'vanity_question', 'vanity_selection', 'existing_vanity', 'countertop_selection', 'other_countertop', 'faucet_selection', 'other_faucet', 'sink_selection', 'other_sink', 'mirror_selection', 'other_mirror', 'toilet_selection', 'other_toilet', 'bathing_setup', 'tub_type', 'other_tub_type',
        'tub_dimensions', 'tub_shampoo_niche', 'tub_filler', 'other_tub_filler', 'wants_tub_shower_head', 'tub_shower_head_type', 'other_tub_shower_head', 'project_summary'
      ];
    } else if (bathingSetup === 'Both') {
      const baseSteps = [
        'measurement_instructions', 'measurements', 'layout_change', 'relocate_items', 'measure_distance', 'has_design', 'electrical_questions', 'lighting_questions', 'vanity_question', 'vanity_selection', 'existing_vanity', 'countertop_selection', 'other_countertop', 'faucet_selection', 'other_faucet', 'sink_selection', 'other_sink', 'mirror_selection', 'other_mirror', 'toilet_selection', 'other_toilet', 'bathing_setup',
        'both_setup_details',
        'shower_dimensions', // This handles both shower and tub dims for 'Both'
        'both_shower_head',
        'both_shower_bench',
        'both_shampoo_niche',
        'both_arrangement',
      ];

      if (showerTubArrangement === 'combo') {
          baseSteps.push('wetroom_glass_door');
          if (wetRoomGlassDoor) {
              baseSteps.push('wetroom_glass_door_type');
          }
      } else if (showerTubArrangement === 'separated') {
          baseSteps.push('separate_glass_door');
      }

      baseSteps.push('project_summary');
      return baseSteps;
    } else if (bathingSetup === 'Other') {
        return [
          'measurement_instructions', 'measurements', 'layout_change', 'relocate_items', 'measure_distance', 'has_design', 'electrical_questions', 'lighting_questions', 'vanity_question', 'vanity_selection', 'existing_vanity', 'countertop_selection', 'other_countertop', 'faucet_selection', 'other_faucet', 'sink_selection', 'other_sink', 'mirror_selection', 'other_mirror', 'toilet_selection', 'other_toilet', 'bathing_setup',
          'custom_bathing_setup',
          'project_summary'
        ];
      }

     else {
      // Default path if bathingSetup is not yet selected or is invalid for specific path
      return [
        'measurement_instructions', 'measurements', 'layout_change', 'relocate_items', 'measure_distance', 'has_design', 'electrical_questions', 'lighting_questions', 'vanity_question', 'vanity_selection', 'existing_vanity', 'countertop_selection', 'other_countertop', 'faucet_selection', 'other_faucet', 'sink_selection', 'other_sink', 'mirror_selection', 'other_mirror', 'toilet_selection', 'other_toilet', 'bathing_setup'
      ];
    }
  };

  const handleMeasurementChange = (field, value) => {
    setBathroomMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMeasurementSubmit = () => {
    setStep('layout_change');
  };

  const handleDesignAnswer = (answer) => {
    setHasDesign(answer);
    if (answer) {
      setStep('upload_design');
    } else {
      setStep('no_design_message');
    }
  };

  const handleDesignFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDesignFile(file);
    }
  };

  const handleDesignUploadSubmit = () => {
    setStep('electrical_questions');
  };

  const handleNoDesignContinue = () => {
    setStep('electrical_questions');
  };

  const handleElectricalChange = (field, value) => {
    setElectricalDetails(prev => ({
      ...prev,
      [field]: Math.max(0, value)
    }));
  };

  const handleElectricalSubmit = () => {
    setStep('lighting_questions');
  };

  const handleLightingChange = (field, value) => {
    setLightingDetails(prev => ({
      ...prev,
      [field]: Math.max(0, value)
    }));
  };

  const handleLightingSubmit = () => {
    setStep('vanity_question');
  };

  const handleVanityAnswer = (answer) => {
    setWantsNewVanity(answer);
    if (answer) {
      setStep('vanity_selection');
    } else {
      setStep('existing_vanity');
    }
  };

  const handleVanityTypeSelect = (type) => {
    setVanityType(type);
    if (type === 'Other') {
      setShowOtherVanityInput(true);
    } else {
      setShowOtherVanityInput(false);
    }
  };

  const handleOtherVanitySubmit = () => {
    if (otherVanityType) {
      setVanityType(`Other: ${otherVanityType}`);
    }
  };

  const handleVanitySize = (size) => {
    setVanitySize(size);
    if (size === 'Custom-made vanity size') {
      setShowCustomInput(true);
    } else {
      setStep('countertop_selection');
    }
  };

  const handleCustomSizeSubmit = () => {
    if (customVanitySize) {
      setVanitySize(`Custom: ${customVanitySize}"`);
      setStep('countertop_selection');
    }
  };

  const handleCountertopSelect = (material) => {
    setVanityCountertop(material);
    // If 'Other' is selected, proceed to 'other_countertop' step, otherwise to 'faucet_selection'
    if (material === 'Other') {
      setStep('other_countertop');
    } else {
      setStep('faucet_selection');
    }
  };

  const handleOtherCountertopSubmit = () => {
    if (otherCountertopMaterial) {
      setVanityCountertop(`Other: ${otherCountertopMaterial}`);
      setStep('faucet_selection');
    }
  };

  const handleFaucetSelect = (faucet) => {
    setVanityFaucet(faucet);
    if (faucet === 'Other') {
      setStep('other_faucet');
    } else if (faucet === 'Keep existing faucet') {
      setStep('sink_selection');
    } else {
      setStep('sink_selection');
    }
  };

  const handleOtherFaucetSubmit = () => {
    if (otherFaucetType) {
      setVanityFaucet(`Other: ${otherFaucetType}`);
      setStep('sink_selection');
    }
  };

  const handleSinkSelect = (sink) => {
    setSinkType(sink);
    if (sink === 'Other') {
      setStep('other_sink');
    } else {
      setStep('mirror_selection'); // Go to mirror selection instead of next_question
    }
  };

  const handleMirrorTypeSelect = (type) => {
    setMirrorType(type);
    if (type === 'Other') {
      setStep('other_mirror');
    } else {
      setStep('toilet_selection');
    }
  };

  const handleOtherMirrorSubmit = () => {
    if (otherMirrorType) {
      setMirrorType(`Other: ${otherMirrorType}`);
      setStep('toilet_selection');
    }
  };

  const handleToiletTypeSelect = (type) => {
    setToiletType(type);
    if (type === 'Other') {
      setStep('other_toilet');
    } else {
      setStep('bathing_setup');
    }
  };

  const handleOtherSinkSubmit = () => {
    if (otherSinkType) {
      setSinkType(`Other: ${otherSinkType}`);
      // This path used to call `completeRemodel()`, which is now removed.
      // It should probably go to mirror_selection or the next relevant step.
      setStep('mirror_selection');
    }
  };

  // This function was originally called on 'existing_vanity' step, but now it's integrated with 'countertop_selection' logic path
  const handleBacksplashHeightSubmit = () => {
    if (wantsNewVanity) {
      setStep('faucet_selection');
    } else {
      // For existing vanity flow
      setStep('faucet_selection');
    }
  };

  const handleBathingSetupSelect = (type) => {
    setBathingSetup(type);

    if (type === 'Both') {
      setStep('both_setup_details');
    } else if (type === 'Other') {
      setStep('custom_bathing_setup');
    } else {
      // Keep existing logic for Shower and Tub
      if (type === 'Shower') {
        setStep('shower_type');
      } else if (type === 'Tub') {
        setStep('tub_type');
      }
    }
  };

  const handleShowerTypeSelect = (type) => {
    setShowerType(type);
    if (type === 'Other') {
      setStep('other_shower_type');
    } else {
      setStep('shower_dimensions');
    }
  };

  const handleOtherShowerTypeSubmit = () => {
    if (otherShowerType) {
      setShowerType(`Other: ${otherShowerType}`);
      setStep('shower_dimensions');
    }
  };

  const handleDimensionsSubmit = () => {
    if (showerDimensions.width && showerDimensions.length && showerDimensions.height) {
      setStep('shower_bench');
    }
  };

  const handleBenchTypeSelect = (type) => {
    setBenchType(type); // This state is not directly used for the "Yes/No" questions, but `wantsShowerBench` is.
    if (type === 'Other') {
      setStep('other_bench_type'); // This step does not exist in the file.
    } else {
      setStep('shampoo_niche');
    }
  };

  // Removed completeRemodel as per outline for new estimation flow

  const CounterInput = ({ label, value, onChange }) => {
    return (
      <div className="flex flex-col space-y-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <div className="flex items-center">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-10 w-10"
            onClick={() => onChange(value - 1)}
            disabled={value <= 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="w-16 mx-2 text-center">
            <Input
              type="number"
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value) || 0)}
              className="text-center"
              min="0"
            />
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-10 w-10"
            onClick={() => onChange(value + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const handleLayoutChange = (answer) => {
    setChangeLayout(answer);
    if (answer) {
      setShowLayoutInfo(true);
    } else {
      setStep('has_design'); // Skip to design question if no layout changes
    }
  };

  const handleRelocateItemToggle = (item) => {
    setRelocateItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleLayoutInfoContinue = () => {
    setShowLayoutInfo(false);
    setStep('relocate_items');
  };

  const handleRelocateItemsSubmit = () => {
    const itemsToRelocate = Object.entries(relocateItems)
      .filter(([_, isSelected]) => isSelected)
      .map(([item]) => item);

    if (itemsToRelocate.length > 0) {
      setCurrentRelocateItem(itemsToRelocate[0]);
      setStep('measure_distance');
    } else {
      setStep('has_design');
    }
  };

  const handleDistanceSubmit = () => {
    const itemsToRelocate = Object.entries(relocateItems)
      .filter(([_, isSelected]) => isSelected)
      .map(([item]) => item);

    const currentIndex = itemsToRelocate.indexOf(currentRelocateItem);
    const nextItem = itemsToRelocate[currentIndex + 1];

    if (nextItem) {
      setCurrentRelocateItem(nextItem);
    } else {
      setStep('has_design');
    }
  };

  const handleGlassDoorTypeSelect = (type) => {
    setGlassDoorType(type);
    if (type === 'Other') {
      setStep('other_glass_door_type');
    } else {
      setStep('project_summary');
    }
  };

  const handleShowerEnclosureSelect = (type) => {
    setShowerEnclosureType(type);

    if (type === 'Other') {
      setStep('other_shower_enclosure');
    } else if (type === 'Glass Door') {
      setStep('glass_door_type');
    } else {
      // For Curtain and None options
      setStep('project_summary');
    }
  };

  const handleOtherShowerEnclosureSubmit = () => {
    if (!otherShowerEnclosureType) {
      alert("Please describe the shower enclosure");
      return;
    }
    setShowerEnclosureType(`Other: ${otherShowerEnclosureType}`);
    setStep('project_summary');
  };

  // NEW: handleCompleteAndGetEstimate function
  const handleCompleteAndGetEstimate = async () => {
    setIsGeneratingEstimate(true);

    try {
      // Determine Vanity Sinks count
      let vanitySinkCount = 1; // Default
      if (wantsNewVanity) {
        if (vanityType && vanityType.toLowerCase().includes('double sink')) {
          vanitySinkCount = 2;
        } else if (vanityType && vanityType.toLowerCase().includes('single sink')) {
          vanitySinkCount = 1;
        }
      }

      // Determine plumbing fixture relocations
      const relocatedPlumbingFixtures = Object.keys(relocateItems).filter(item => relocateItems[item]);

      // Prepare project details for the estimation engine
      const projectDetails = {
        type: 'residential',
        subtype: 'bathroom_remodel',
        address: address || {
          street_number: '',
          street_name: '',
          city: '',
          state: '',
          zip_code: ''
        },
        questionnaire_answers: {
          dimensions: {
            length: parseFloat(bathroomDimensions.length) || 0,
            width: parseFloat(bathroomDimensions.width) || 0,
            height: parseFloat(bathroomDimensions.height) || 0
          },
          bathing: {
            setup: bathingSetup === 'Other' ? customBathingSetup : bathingSetup,
            tubType: tubType, // Use tubType if single tub
            tubDimensions: tubDimensions, // Use tubDimensions if single tub
            tubFillerType: tubFillerType, // Use tubFillerType if single tub
            wantsTubShowerHead: wantsTubShowerHead,
            tubShowerHeadType: tubShowerHeadType,
            showerType: showerType, // Use showerType if single shower
            showerDimensions: showerDimensions, // Use showerDimensions if single shower
            wantsShowerBench: wantsShowerBench, // Use wantsShowerBench if single shower
            wantsShampooNiche: wantsShampooNiche, // Use wantsShampooNiche if single shower
            showerHeadType: showerHeadType, // Use showerHeadType if single shower
            showerEnclosureType: showerEnclosureType, // Use showerEnclosureType if single shower
            glassDoorType: glassDoorType, // Use glassDoorType if single shower
            // Both-specific fields
            bothSetupChoices: bathingSetup === 'Both' ? bothSetupChoices : undefined,
            bothShowerHead: bathingSetup === 'Both' ? bothShowerHead : undefined,
            bothHasBench: bathingSetup === 'Both' ? bothHasBench : undefined,
            bothHasNiche: bathingSetup === 'Both' ? bothHasNiche : undefined,
            showerTubArrangement: bathingSetup === 'Both' ? showerTubArrangement : undefined,
            wetRoomGlassDoor: bathingSetup === 'Both' ? wetRoomGlassDoor : undefined, // For wet room, if they want a door
            wetRoomGlassDoorType: bathingSetup === 'Both' && wetRoomGlassDoor ? wetRoomGlassDoorType : undefined, // Type of door for wet room
            separateShowerGlassDoor: bathingSetup === 'Both' ? separateShowerGlassDoor : undefined, // For separated, if they want a door
          },
          vanity: {
            wantsNewVanity: wantsNewVanity,
            type: wantsNewVanity ? vanityType : 'Existing',
            size: wantsNewVanity ? (vanitySize === 'Custom-made vanity size' ? customVanitySize : vanitySize) : null,
            sinks: wantsNewVanity ? vanitySinkCount : 0, // 0 if existing
            countertopMaterial: wantsNewVanity ? vanityCountertop : null,
            backsplashHeight: wantsNewVanity ? backsplashHeight : null,
            faucetType: wantsNewVanity ? vanityFaucet : null,
            sinkType: wantsNewVanity ? sinkType : null,
          },
          toilet: {
            type: toiletType,
          },
          mirror: {
            type: mirrorType,
          },
          electrical: {
            currentOutlets: electricalDetails.currentOutlets,
            additionalOutlets: electricalDetails.additionalOutlets,
            currentLights: lightingDetails.currentLights,
            additionalLights: lightingDetails.additionalLights,
          },
          layoutChange: {
            changeLayout: changeLayout,
            relocatedItems: relocatedPlumbingFixtures,
            relocationDistances: relocatedPlumbingFixtures.length > 0 ? relocationDistances : null,
          },
          design: {
            hasDesign: hasDesign,
            designFile: designFile ? designFile.name : null, // Just filename for prompt, not actual file
          },
          // Fields from outline that are NOT collected in current component, setting to null or removing
          // These are commented out as they are not collected by this specific questionnaire flow.
          // flooring: { material: null, squareFeet: 0 },
          // tilework: { wallTile: null, wallTileSquareFeet: 0, accentTile: null, accentTileSquareFeet: 0 },
          // ventilation: { type: null, cfm: 0 },
          // plumbing: { fixtures: relocatedPlumbingFixtures, hasWaterLines: null, hasDrainLines: null }, // Plumbing fixtures based on relocation
          // electrical: { outlets: (electricalDetails.currentOutlets + electricalDetails.additionalOutlets), hasGFCI: null, hasNewCircuits: null }, // Re-map outlets
          // specialFeatures: [],
          // accessibility: { features: [] }
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
        console.error('Failed to generate estimate: No estimate returned.');
        alert('Failed to generate estimate. Please try again.');
      }
    } catch (error) {
      console.error('Error generating estimate:', error);
      alert('An error occurred while generating the estimate. Please try again.');
    } finally {
      setIsGeneratingEstimate(false);
    }
  };


    // Add a new step specifically for the Both flow

    // Add new state variables for the different arrangement flows
    // Update the arrangement step to lead to the appropriate next step
    if (step === 'both_shower_head') {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${calculateProgress(step)}%` }}
            />
          </div>

          <div className="text-center text-sm text-gray-500 mb-8">
            Step {getStepNumber(step)} of {getTotalSteps()}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">
                What kind of shower-head would you like?
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl">
                {['Fixed', 'Rainfall', 'Handheld', 'Dual', 'Ceiling-Mounted', 'Other'].map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    className={`p-6 h-auto ${
                      bothShowerHead === type ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'
                    }`}
                    onClick={() => {
                      setBothShowerHead(type);

                      if (type !== 'Other') {
                        setOtherBothShowerHead('');
                        setStep('both_shower_bench'); // <-- auto-advance
                      }
                    }}
                  >
                    <span className="text-lg font-medium">{type}</span>
                  </Button>
                ))}
              </div>

              {bothShowerHead === 'Other' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 w-full max-w-xl"
                >
                  <Input
                    value={otherBothShowerHead}
                    onChange={(e) => setOtherBothShowerHead(e.target.value)}
                    placeholder="What kind of shower-head is it?"
                    className="mb-4"
                  />
                </motion.div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="ghost"
              onClick={() => setStep('shower_dimensions')}
              className="text-gray-600"
            >
              Back
            </Button>
          </div>
        </div>
      );
    }

  // Update the shower dimensions step to lead to the Both-specific shower head question
  if (step === 'shower_dimensions' && bathingSetup === 'Both') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="space-y-12">
              {/* Shower Dimensions */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Please insert your desired shower dimensions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="shower-width">Width (feet)</Label>
                    <Input
                      id="shower-width"
                      type="number"
                      placeholder="0"
                      value={bothSetupChoices.showerDimensions.width}
                      onChange={(e) => setBothSetupChoices(prev => ({
                        ...prev,
                        showerDimensions: {
                          ...prev.showerDimensions,
                          width: e.target.value
                        }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shower-length">Length (feet)</Label>
                    <Input
                      id="shower-length"
                      type="number"
                      placeholder="0"
                      value={bothSetupChoices.showerDimensions.length}
                      onChange={(e) => setBothSetupChoices(prev => ({
                        ...prev,
                        showerDimensions: {
                          ...prev.showerDimensions,
                          length: e.target.value
                        }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shower-height">Height (feet)</Label>
                    <Input
                      id="shower-height"
                      type="number"
                      placeholder="0"
                      value={bothSetupChoices.showerDimensions.height}
                      onChange={(e) => setBothSetupChoices(prev => ({
                        ...prev,
                        showerDimensions: {
                          ...prev.showerDimensions,
                          height: e.target.value
                        }
                      }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Tub Dimensions */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Please insert your desired tub dimensions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="tub-width">Width (feet)</Label>
                    <Input
                      id="tub-width"
                      type="number"
                      placeholder="0"
                      value={bothSetupChoices.tubDimensions.width}
                      onChange={(e) => setBothSetupChoices(prev => ({
                        ...prev,
                        tubDimensions: {
                          ...prev.tubDimensions,
                          width: e.target.value
                        }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tub-length">Length (feet)</Label>
                    <Input
                      id="tub-length"
                      type="number"
                      placeholder="0"
                      value={bothSetupChoices.tubDimensions.length}
                      onChange={(e) => setBothSetupChoices(prev => ({
                        ...prev,
                        tubDimensions: {
                          ...prev.tubDimensions,
                          length: e.target.value
                        }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tub-height">Height (feet)</Label>
                    <Input
                      id="tub-height"
                      type="number"
                      placeholder="0"
                      value={bothSetupChoices.tubDimensions.height}
                      onChange={(e) => setBothSetupChoices(prev => ({
                        ...prev,
                        tubDimensions: {
                          ...prev.tubDimensions,
                          height: e.target.value
                        }
                      }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  const { showerDimensions, tubDimensions } = bothSetupChoices;
                  if (!showerDimensions.width || !showerDimensions.length || !showerDimensions.height ||
                      !tubDimensions.width || !tubDimensions.length || !tubDimensions.height) {
                    alert("Please fill in all dimensions for both shower and tub");
                    return;
                  }
                  setStep('both_shower_head');
                }}
                className="w-full bg-black hover:bg-gray-800"
              >
                Continue
              </Button>
            </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('both_setup_details')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

    // Add a new step for bench question in the Both flow
    if (step === 'both_shower_bench') {
      return (
          <div className="max-w-4xl mx-auto p-6">
              <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
                  <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${calculateProgress(step)}%` }}
                  />
              </div>

              <div className="text-center text-sm text-gray-500 mb-8">
                  Step {getStepNumber(step)} of {getTotalSteps()}
              </div>

              <div className="bg-white rounded-lg shadow-sm p-8">
                  <div className="flex flex-col items-center">
                      <h1 className="text-2xl font-bold text-gray-900 mb-8">
                          Would you like a bench in your shower?
                      </h1>

                      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                          <Button
                              variant="outline"
                              className={`p-6 h-auto ${bothHasBench === true ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                              onClick={() => {
                                  setBothHasBench(true);
                                  setStep('both_shampoo_niche');
                              }}
                          >
                              Yes
                          </Button>
                          <Button
                              variant="outline"
                              className={`p-6 h-auto ${bothHasBench === false ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                              onClick={() => {
                                  setBothHasBench(false);
                                  setStep('both_shampoo_niche');
                              }}
                          >
                              No
                          </Button>
                      </div>
                  </div>
              </div>

              <div className="mt-6">
                  <Button
                      variant="ghost"
                      onClick={() => setStep('both_shower_head')}
                      className="text-gray-600"
                  >
                      Back
                  </Button>
              </div>
          </div>
      );
  }

  // Measurement instructions step
  if (step === 'measurement_instructions') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center justify-center">
            <Ruler className="w-12 h-12 text-indigo-600 mb-6" />

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Bathroom Measurements Required
            </h1>

            <p className="text-gray-600 text-center max-w-xl mb-8">
              Please prepare a measuring tape or a laser measure for the next question. You will need
              to measure the dimensions of your bathroom. If you need help, you can request
              assistance from one of our estimators.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setStep('measurements')}
              >
                <Ruler className="mr-2 h-4 w-4" />
                I can measure myself
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                  >
                    Click here for help
                    <ChevronDown className="w-5 h-5 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
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
          </div>
        </div>
      </div>
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
          <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${calculateProgress(step)}%` }}
            />
          </div>

          <div className="text-center text-sm text-gray-500 mb-8">
            Step {getStepNumber(step)} of {getTotalSteps()}
          </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Please provide your bathroom dimensions
            </h1>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="bathroom-length" className="block text-sm font-medium text-gray-700 mb-1">
                    Length (feet)
                  </Label>
                  <Input
                    id="bathroom-length"
                    type="number"
                    placeholder="Enter length"
                    value={bathroomMeasurements.length}
                    onChange={(e) => handleMeasurementChange('length', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="bathroom-width" className="block text-sm font-medium text-gray-700 mb-1">
                    Width (feet)
                  </Label>
                  <Input
                    id="bathroom-width"
                    type="number"
                    placeholder="Enter width"
                    value={bathroomMeasurements.width}
                    onChange={(e) => handleMeasurementChange('width', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="bathroom-height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height (feet)
                  </Label>
                  <Input
                    id="bathroom-height"
                    type="number"
                    placeholder="Enter height"
                    value={bathroomMeasurements.height}
                    onChange={(e) => handleMeasurementChange('height', e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={() => {
                    setBathroomDimensions({
                        width: bathroomMeasurements.width,
                        length: bathroomMeasurements.length,
                        height: bathroomMeasurements.height
                    });
                    setHasBathroomMeasurements(true);
                    handleMeasurementSubmit();
                }}
                className="mt-6 w-full bg-black hover:bg-gray-800"
                disabled={!bathroomMeasurements.length || !bathroomMeasurements.width || !bathroomMeasurements.height}
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

  // Layout change question
  if (step === 'layout_change') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Would you like to change your existing bathroom layout?
            </h1>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
              <Button
                variant="outline"
                className={`p-6 h-auto ${changeLayout === true ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => handleLayoutChange(true)}
              >
                <span className="text-lg font-medium">Yes</span>
              </Button>
              <Button
                variant="outline"
                className={`p-6 h-auto ${changeLayout === false ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => handleLayoutChange(false)}
              >
                <span className="text-lg font-medium">No</span>
              </Button>
            </div>

            {showLayoutInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="text-gray-600 mb-6">
                  This question refers to changing the location of Shower Drainage/Shower Head/Tub Filler/toilet/Vanity.
                  Changing the location of each one of them requires repiping which will affect your Exactimate.
                  Changing the location of your existing lights layout will require electricity rewiring which will also affect your Exactimate.
                  Click "Ok" to continue.
                </p>
                <Button
                  onClick={handleLayoutInfoContinue}
                  className="bg-black hover:bg-gray-800"
                >
                  Ok
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('measurements')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Relocate items selection
  if (step === 'relocate_items') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Which of the following would you like to relocate?
            </h1>

            <div className="space-y-4 w-full max-w-md mb-8">
              {[
                { id: 'showerDrainage', label: 'Shower Drainage' },
                { id: 'showerHead', label: 'Shower Head' },
                { id: 'tubFiller', label: 'Tub Filler' },
                { id: 'toilet', label: 'Toilet' },
                { id: 'vanity', label: 'Vanity' }
              ].map(item => (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    relocateItems[item.id] ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'
                  }`}
                  onClick={() => handleRelocateItemToggle(item.id)}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      relocateItems[item.id] ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400'
                    }`}>
                      {relocateItems[item.id] && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-lg font-medium">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleRelocateItemsSubmit}
              className="bg-black hover:bg-gray-800"
              disabled={!Object.values(relocateItems).some(Boolean)}
            >
              Continue
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('layout_change')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Distance measurement for each selected item
  if (step === 'measure_distance') {
    const itemLabel = {
      showerDrainage: 'Shower Drainage',
      showerHead: 'Shower Head',
      tubFiller: 'Tub Filler',
      toilet: 'Toilet',
      vanity: 'Vanity'
    }[currentRelocateItem];

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Please measure the distance between the existing {itemLabel} to desired location (in inches)
            </h1>

            <div className="w-full max-w-md">
              <Input
                type="number"
                value={relocationDistances[currentRelocateItem]}
                onChange={(e) => setRelocationDistances(prev => ({
                  ...prev,
                  [currentRelocateItem]: e.target.value
                }))}
                placeholder="Distance in inches"
                className="mb-6"
              />

              <Button
                onClick={handleDistanceSubmit}
                className="w-full bg-black hover:bg-gray-800"
                disabled={!relocationDistances[currentRelocateItem]}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('relocate_items')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Design question step
  if (step === 'has_design') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Do you have a design for your new bathroom?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div
            className="border border-gray-200 rounded-lg p-4 flex items-center cursor-pointer hover:border-indigo-600 transition-colors"
            onClick={() => handleDesignAnswer(true)}
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-lg">Yes</div>
              <div className="text-gray-600">I have a bathroom design</div>
            </div>
          </div>

          <div
            className="border border-gray-200 rounded-lg p-4 flex items-center cursor-pointer hover:border-indigo-600 transition-colors"
            onClick={() => handleDesignAnswer(false)}
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="font-semibold text-lg">No</div>
              <div className="text-gray-600">I don't have a bathroom design</div>
            </div>
          </div>
        </div>

        <div>
          <Button
            variant="ghost"
            onClick={() => {
                if (changeLayout) {
                    const itemsToRelocate = Object.entries(relocateItems)
                        .filter(([_, isSelected]) => isSelected)
                        .map(([item]) => item);
                    if (itemsToRelocate.length > 0) {
                        setStep('measure_distance'); // Go back to distance if items were selected
                    } else {
                        setStep('relocate_items'); // Go back to relocate selection if no items were selected
                    }
                } else {
                    setStep('layout_change'); // Go back to layout change decision
                }
            }}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Upload design step
  if (step === 'upload_design') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
          <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${calculateProgress(step)}%` }}
            />
          </div>

          <div className="text-center text-sm text-gray-500 mb-8">
            Step {getStepNumber(step)} of {getTotalSteps()}
          </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Upload Your Bathroom Design
            </h1>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>

                <p className="text-center mb-6">
                  Please upload your bathroom design files. We accept PDF, JPG, PNG, or CAD files.
                </p>

                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.dwg,.dxf"
                  onChange={handleDesignFileChange}
                  className="max-w-md mb-6"
                />

                <Button
                  onClick={handleDesignUploadSubmit}
                  className="w-full max-w-md bg-black hover:bg-gray-800"
                  disabled={!designFile}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Button
              variant="ghost"
              onClick={() => setStep('has_design')}
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

  // No design message step
  if (step === 'no_design_message') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center justify-center">
            <Wand2 className="w-12 h-12 text-indigo-600 mb-6" />

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              No worries, we will create a design for you
            </h1>

            <p className="text-gray-600 text-center max-w-xl mb-8">
              Our team will help you create a beautiful bathroom design based on your requirements.
            </p>

            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleNoDesignContinue}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('has_design')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Electrical questions step
  if (step === 'electrical_questions') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-12">
              Electrical Details
            </h1>

            <div className="space-y-8 w-full max-w-md">
              <div className="flex flex-col items-center">
                <Label className="text-lg font-medium text-gray-900 mb-4">
                  How many electrical outlets do you currently have?
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleElectricalChange('currentOutlets', electricalDetails.currentOutlets - 1)}
                    disabled={electricalDetails.currentOutlets <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-semibold w-12 text-center">
                    {electricalDetails.currentOutlets}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleElectricalChange('currentOutlets', electricalDetails.currentOutlets + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <Label className="text-lg font-medium text-gray-900 mb-4">
                  How many additional outlets would you like?
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleElectricalChange('additionalOutlets', electricalDetails.additionalOutlets - 1)}
                    disabled={electricalDetails.additionalOutlets <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-semibold w-12 text-center">
                    {electricalDetails.additionalOutlets}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleElectricalChange('additionalOutlets', electricalDetails.additionalOutlets + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button
              onClick={handleElectricalSubmit}
              className="mt-12 bg-black hover:bg-gray-800"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep(hasDesign ? 'upload_design' : 'no_design_message')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Lighting questions step
  if (step === 'lighting_questions') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-12">
              Lighting Details
            </h1>

            <div className="space-y-8 w-full max-w-md">
              <div className="flex flex-col items-center">
                <Label className="text-lg font-medium text-gray-900 mb-4">
                  How many light fixtures do you currently have?
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleLightingChange('currentLights', lightingDetails.currentLights - 1)}
                    disabled={lightingDetails.currentLights <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-semibold w-12 text-center">
                    {lightingDetails.currentLights}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleLightingChange('currentLights', lightingDetails.currentLights + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <Label className="text-lg font-medium text-gray-900 mb-4">
                  How many additional light fixtures would you like?
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleLightingChange('additionalLights', lightingDetails.additionalLights - 1)}
                    disabled={lightingDetails.additionalLights <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-semibold w-12 text-center">
                    {lightingDetails.additionalLights}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleLightingChange('additionalLights', lightingDetails.additionalLights + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button
              onClick={handleLightingSubmit}
              className="mt-12 bg-black hover:bg-gray-800"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('electrical_questions')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Vanity Question Step
  if (step === 'vanity_question') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Would you like to choose a new vanity?
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
              <Button
                variant="outline"
                className="p-8 h-auto flex flex-col items-center hover:border-indigo-600"
                onClick={() => handleVanityAnswer(true)}
              >
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-lg font-medium">Yes</span>
              </Button>

              <Button
                variant="outline"
                className="p-8 h-auto flex flex-col items-center hover:border-indigo-600"
                onClick={() => handleVanityAnswer(false)}
              >
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <span className="text-lg font-medium">No</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('lighting_questions')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Existing Vanity Step
  if (step === 'existing_vanity') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              About Your Existing Vanity
            </h1>

            <p className="text-gray-600 mb-8 max-w-xl">
              No problem, we will use your existing vanity. Just note that when we demo the bathroom, the vanity's backsplash might break and we will need to replace it.
            </p>

            <div className="w-full max-w-md">
              <Label className="text-center block mb-4 text-lg font-medium">
                What is the height of your existing/desired backsplash? (in inches)
              </Label>
              <div className="flex items-center justify-center gap-4 mb-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setBacksplashHeight(Math.max(0, backsplashHeight - 1))}
                  disabled={backsplashHeight <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-2xl font-semibold w-12 text-center">
                  {backsplashHeight}"
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setBacksplashHeight(backsplashHeight + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={() => setStep('faucet_selection')} // Continue to faucet selection for existing vanity
                className="w-full bg-gray-500 hover:bg-gray-600"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('vanity_question')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Vanity Selection Step
  if (step === 'vanity_selection') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              What vanity would you like to install?
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {["Single sink vanity", "Double sink vanity", "Other"].map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  className={`p-6 h-auto ${vanityType === type ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                  onClick={() => handleVanityTypeSelect(type)}
                >
                  <span className="text-lg font-medium">{type}</span>
                </Button>
              ))}
            </div>

            {showOtherVanityInput && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md mt-6"
              >
                <Label className="text-gray-700 mb-2 block">
                  What kind of vanity?
                </Label>
                <div className="flex gap-3">
                  <Input
                    value={otherVanityType}
                    onChange={(e) => setOtherVanityType(e.target.value)}
                    placeholder="Enter vanity type"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleOtherVanitySubmit}
                    disabled={!otherVanityType}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Approve
                  </Button>
                </div>
              </motion.div>
            )}

            {vanityType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mt-8"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                  Please choose desired vanity's size
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                  {["24\"", "30\"", "36\"", "42\"", "48\"", "54\"", "60\"", "66\"", "72\"", "78\"", "84\"", "92\"", "96\""].map((size) => (
                    <Button
                      key={size}
                      variant="outline"
                      className={`${vanitySize === size ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                      onClick={() => handleVanitySize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    className={`${showCustomInput ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                    onClick={() => handleVanitySize('Custom-made vanity size')}
                  >
                    Custom-made vanity size
                  </Button>
                </div>

                {showCustomInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex items-center justify-center gap-3"
                  >
                    <div className="relative flex items-center">
                      <Input
                        type="number"
                        value={customVanitySize}
                        onChange={(e) => setCustomVanitySize(e.target.value)}
                        className="pr-8 w-32"
                        placeholder="Size"
                      />
                      <span className="absolute right-3 text-gray-500">"</span>
                    </div>
                    <Button
                      onClick={handleCustomSizeSubmit}
                      className="bg-indigo-600 hover:bg-indigo-700"
                      disabled={!customVanitySize}
                    >
                      Approve
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('vanity_question')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Countertop Selection Step
  if (step === 'countertop_selection') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              What kind of vanity countertop would you like?
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl mb-8">
              {[
                'Quartz', 'Quartzite', 'Granite', 'Marble',
                'Laminate', 'Porcelain', 'Wood', 'Concrete',
                'Other'
              ].map((material) => (
                <Button
                  key={material}
                  variant="outline"
                  className={`p-6 h-auto ${vanityCountertop === material ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                  onClick={() => handleCountertopSelect(material)}
                >
                  <span className="text-lg font-medium">{material}</span>
                </Button>
              ))}
            </div>

          {vanityCountertop && vanityCountertop !== 'Other' && ( // Only show backsplash if a material is selected and not 'Other'
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-xl mt-12 text-center"
            >
              <Label className="text-lg font-medium text-gray-900 mb-4 block">
                What is the height of your existing/desired backsplash? (in inches)
              </Label>
              <div className="flex items-center justify-center gap-4 mb-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setBacksplashHeight(Math.max(0, backsplashHeight - 1))}
                  disabled={backsplashHeight <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-2xl font-semibold w-12 text-center">
                  {backsplashHeight}"
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setBacksplashHeight(backsplashHeight + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={() => setStep('faucet_selection')}
                className="bg-black hover:bg-gray-800"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('vanity_selection')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

  // Other Countertop Material Step
  if (step === 'other_countertop') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              What kind of countertop material is it?
            </h1>

            <div className="w-full max-w-md">
              <Input
                value={otherCountertopMaterial}
                onChange={(e) => setOtherCountertopMaterial(e.target.value)}
                placeholder="Enter countertop material"
                className="mb-6"
              />

              <Button
                onClick={handleOtherCountertopSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={!otherCountertopMaterial}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('countertop_selection')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Faucet Selection Step
  if (step === 'faucet_selection') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              What kind of vanity faucets would you like?
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl mb-8">
              {[
                'Single-handle', 'Double handle', 'Wall mounted',
                'Waterfall', 'Touchless', 'Other'
              ].map((faucet) => (
                <Button
                  key={faucet}
                  variant="outline"
                  className={`p-6 h-auto ${vanityFaucet === faucet ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                  onClick={() => handleFaucetSelect(faucet)}
                >
                  <span className="text-lg font-medium">{faucet}</span>
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              className={`p-4 w-full max-w-xl ${vanityFaucet === 'Keep existing faucet' ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
              onClick={() => handleFaucetSelect('Keep existing faucet')}
            >
              <span className="text-lg font-medium">Keep existing faucet</span>
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('countertop_selection')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Other Faucet Type Step
  if (step === 'other_faucet') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              What kind of faucet is it?
            </h1>

            <div className="w-full max-w-md">
              <Input
                value={otherFaucetType}
                onChange={(e) => setOtherFaucetType(e.target.value)}
                placeholder="Enter faucet type"
                className="mb-6"
              />

              <Button
                onClick={handleOtherFaucetSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={!otherFaucetType}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('faucet_selection')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Sink Selection Step
  if (step === 'sink_selection') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              What kind of sink would you like?
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl mb-8">
              {['Under-mount', 'Drop-in', 'Pedestal', 'Wall-mounted', 'Vessel', 'Other'].map((sink) => (
                <Button
                  key={sink}
                  variant="outline"
                  className={`p-6 h-auto ${sinkType === sink ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                  onClick={() => handleSinkSelect(sink)}
                >
                  <span className="text-lg font-medium">{sink}</span>
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              className={`p-4 w-full max-w-xl ${sinkType === 'Keep existing sink' ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
              onClick={() => handleSinkSelect('Keep existing sink')}
            >
              <span className="text-lg font-medium">Keep existing sink</span>
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('faucet_selection')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

    // Other Mirror Type Step
    if (step === 'other_mirror') {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${calculateProgress(step)}%` }}
            />
          </div>

          <div className="text-center text-sm text-gray-500 mb-8">
            Step {getStepNumber(step)} of {getTotalSteps()}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">
                What kind of mirror is it?
              </h1>

              <div className="w-full max-w-md">
                <Input
                  value={otherMirrorType}
                  onChange={(e) => setOtherMirrorType(e.target.value)}
                  placeholder="Describe the mirror type"
                  className="mb-6"
                />
                <Button
                  onClick={handleOtherMirrorSubmit}
                  className="w-full bg-black hover:bg-gray-800"
                  disabled={!otherMirrorType}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="ghost"
              onClick={() => setStep('mirror_selection')}
              className="text-gray-600"
            >
              Back
            </Button>
          </div>
        </div>
      );
    }

    // Toilet selection step
    if (step === 'toilet_selection') {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${calculateProgress(step)}%` }}
            />
          </div>

          <div className="text-center text-sm text-gray-500 mb-8">
            Step {getStepNumber(step)} of {getTotalSteps()}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">
                What kind of toilet would you like?
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl mb-8">
                {['One-Piece', 'Two-Piece', 'Wall-Mounted', 'Bidet', 'Smart', 'Other'].map((toilet) => (
                  <Button
                    key={toilet}
                    variant="outline"
                    className={`p-6 h-auto ${toiletType === toilet ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                    onClick={() => handleToiletTypeSelect(toilet)}
                  >
                    <span className="text-lg font-medium">{toilet}</span>
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                className={`p-4 w-full max-w-xl ${toiletType === 'Keep Existing toilet' ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => handleToiletTypeSelect('Keep Existing toilet')}
              >
                <span className="text-lg font-medium">Keep Existing toilet</span>
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="ghost"
              onClick={() => setStep('mirror_selection')}
              className="text-gray-600"
            >
              Back
            </Button>
          </div>
        </div>
      );
    }

    // Add other toilet type step if needed
    if (step === 'other_toilet') {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${calculateProgress(step)}%` }}
            />
          </div>

          <div className="text-center text-sm text-gray-500 mb-8">
            Step {getStepNumber(step)} of {getTotalSteps()}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">
                What kind of toilet is it?
              </h1>

              <div className="w-full max-w-md">
                <Input
                  value={otherToiletType}
                  onChange={(e) => setOtherToiletType(e.target.value)}
                  placeholder="Describe the toilet type"
                  className="mb-6"
                />
                <Button
                  onClick={() => {
                    setToiletType(`Other: ${otherToiletType}`);
                    setStep('bathing_setup');
                  }}
                  className="w-full bg-black hover:bg-gray-800"
                  disabled={!otherToiletType}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="ghost"
              onClick={() => setStep('toilet_selection')}
              className="text-gray-600"
            >
              Back
            </Button>
          </div>
        </div>
      );
    }

    // Mirror Selection Step
    if (step === 'mirror_selection') {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${calculateProgress(step)}%` }}
            />
          </div>

          <div className="text-center text-sm text-gray-500 mb-8">
            Step {getStepNumber(step)} of {getTotalSteps()}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">
                What kind of mirror would you like?
              </h1>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 w-full max-w-xl mb-8">
              {['Wall-Mounted', 'Medicine Cabinet', 'Smart', 'Other'].map((mirror) => (
                <Button
                  key={mirror}
                  variant="outline"
                  className={`p-6 h-auto ${mirrorType === mirror ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                  onClick={() => handleMirrorTypeSelect(mirror)}
                >
                  <span className="text-lg font-medium">{mirror}</span>
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              className={`p-4 w-full max-w-xl ${mirrorType === 'Keep Existing mirror' ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
              onClick={() => handleMirrorTypeSelect('Keep Existing mirror')}
            >
              <span className="text-lg font-medium">Keep Existing mirror</span>
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('sink_selection')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Other Sink Type Step
  if (step === 'other_sink') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              What kind of sink is it?
            </h1>

            <div className="w-full max-w-md">
              <Input
                value={otherSinkType}
                onChange={(e) => setOtherSinkType(e.target.value)}
                placeholder="Enter sink type"
                className="mb-6"
              />

              <Button
                onClick={() => {
                  setSinkType(`Other: ${otherSinkType}`);
                  setStep('mirror_selection');
                }}
                className="w-full bg-black hover:bg-gray-800"
                disabled={!otherSinkType}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('sink_selection')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Bathing Setup Step
  if (step === 'bathing_setup') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              What kind of bathing setup would you prefer?
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-xl">
              {['Shower', 'Tub', 'Both', 'Other'].map((setup) => (
                <Button
                  key={setup}
                  variant="outline"
                  className={`p-6 h-auto ${bathingSetup === setup ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                  onClick={() => handleBathingSetupSelect(setup)}
                >
                  <span className="text-lg font-medium">{setup}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('toilet_selection')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Add new step for both setup details
  if (step === 'both_setup_details') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-12">
            {/* Shower Type Selection */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                What kind of shower?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Walk-in', 'Pre-fab', 'Other'].map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    className={`p-6 h-auto ${
                      bothSetupChoices.shower === type ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'
                    }`}
                    onClick={() => setBothSetupChoices(prev => ({
                      ...prev,
                      shower: type,
                      otherShower: type === 'Other' ? prev.otherShower : ''
                    }))}
                  >
                    <span className="text-lg font-medium">{type}</span>
                  </Button>
                ))}
              </div>

              {/* Other Shower Input */}
              {bothSetupChoices.shower === 'Other' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <div className="flex gap-2">
                    <Input
                      value={bothSetupChoices.otherShower}
                      onChange={(e) => setBothSetupChoices(prev => ({
                        ...prev,
                        otherShower: e.target.value
                      }))}
                      placeholder="What kind of shower is it?"
                      className="flex-1"
                    />
                    <Button
                      onClick={() => {
                        if (!bothSetupChoices.otherShower) return;
                        setBothSetupChoices(prev => ({
                          ...prev,
                          shower: `Other: ${prev.otherShower}`
                        }));
                      }}
                      disabled={!bothSetupChoices.otherShower}
                    >
                      Approve
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Tub Type Selection */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                What kind of tub?
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Alcove', 'Freestanding', 'Soaking', 'Walk-in', 'Jacuzzi', 'Other'].map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    className={`p-6 h-auto ${
                      bothSetupChoices.tub === type ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'
                    }`}
                    onClick={() => setBothSetupChoices(prev => ({
                      ...prev,
                      tub: type,
                      otherTub: type === 'Other' ? prev.otherTub : ''
                    }))}
                  >
                    <span className="text-lg font-medium">{type}</span>
                  </Button>
                ))}
              </div>

              {/* Other Tub Input */}
              {bothSetupChoices.tub === 'Other' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <div className="flex gap-2">
                    <Input
                      value={bothSetupChoices.otherTub}
                      onChange={(e) => setBothSetupChoices(prev => ({
                        ...prev,
                        otherTub: e.target.value
                      }))}
                      placeholder="What kind of tub is it?"
                      className="flex-1"
                    />
                    <Button
                      onClick={() => {
                        if (!bothSetupChoices.otherTub) return;
                        setBothSetupChoices(prev => ({
                          ...prev,
                          tub: `Other: ${prev.otherTub}`
                        }));
                      }}
                      disabled={!bothSetupChoices.otherTub}
                    >
                      Approve
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <Button
              onClick={() => {
                // Check if both selections are made and "Other" inputs are approved
                const isShowerValid = bothSetupChoices.shower &&
                  (bothSetupChoices.shower !== 'Other' || bothSetupChoices.shower.startsWith('Other:'));
                const isTubValid = bothSetupChoices.tub &&
                  (bothSetupChoices.tub !== 'Other' || bothSetupChoices.tub.startsWith('Other:'));

                if (!isShowerValid || !isTubValid) {
                  alert("Please complete both shower and tub selections");
                  return;
                }
                setStep('shower_dimensions');
              }}
              className="w-full bg-black hover:bg-gray-800"
            >
              Continue
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('bathing_setup')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

    // Add new step for shampoo niche in the Both flow
    if (step === 'both_shampoo_niche') {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
                    <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${calculateProgress(step)}%` }}
                    />
                </div>

                <div className="text-center text-sm text-gray-500 mb-8">
                    Step {getStepNumber(step)} of {getTotalSteps()}
                </div>

                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-8">
                            Would you like a shampoo niche in your shower?
                        </h1>

                        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                            <Button
                                variant="outline"
                               className={`p-6 h-auto ${bothHasNiche === true ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                                onClick={() => {
                                    setBothHasNiche(true);
                                    setStep('both_arrangement');
                                }}
                            >
                                Yes
                            </Button>
                            <Button
                                variant="outline"
                                className={`p-6 h-auto ${bothHasNiche === false ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                                onClick={() => {
                                    setBothHasNiche(false);
                                    setStep('both_arrangement');
                                }}
                            >
                                No
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <Button
                        variant="ghost"
                        onClick={() => setStep('both_shower_bench')}
                        className="text-gray-600"
                    >
                        Back
                    </Button>
                </div>
            </div>
        );
    }

  // Update the arrangement step to lead to the appropriate next step
  if (step === 'both_arrangement') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              How would you like your shower and tub arranged?
            </h1>

            <div className="grid grid-cols-1 gap-4 w-full max-w-md">
              <Button
                variant="outline"
                className={`p-6 h-auto ${showerTubArrangement === 'combo' ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => {
                  setShowerTubArrangement('combo');
                  setStep('wetroom_glass_door');
                }}
              >
                Shower-tub combo (wet room)
              </Button>
              <Button
                variant="outline"
                className={`p-6 h-auto ${showerTubArrangement === 'separated' ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => {
                  setShowerTubArrangement('separated');
                  setStep('separate_glass_door');
                }}
              >
                Shower and tub separated
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('both_shampoo_niche')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Update wetroom_glass_door step to lead to summary page for "No" option
  if (step === 'wetroom_glass_door') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Would you like a glass door to enclose your wet room?
            </h1>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <Button
                variant="outline"
                className={`p-6 h-auto ${wetRoomGlassDoor === true ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => {
                  setWetRoomGlassDoor(true);
                  setStep('wetroom_glass_door_type');
                }}
              >
                Yes
              </Button>
              <Button
                variant="outline"
                className={`p-6 h-auto ${wetRoomGlassDoor === false ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => {
                  setWetRoomGlassDoor(false);
                  setStep('project_summary'); // Changed this to go to summary
                }}
              >
                No
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('both_arrangement')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Add new step for wet room glass door type
  if (step === 'wetroom_glass_door_type') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              What kind of glass door would you like for your wet room?
            </h1>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <Button
                variant="outline"
                className={`p-6 h-auto ${wetRoomGlassDoorType === 'sliding' ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => {
                  setWetRoomGlassDoorType('sliding');
                  setStep('project_summary'); // Changed to go to summary page
                }}
              >
                Sliding
              </Button>
              <Button
                variant="outline"
                className={`p-6 h-auto ${wetRoomGlassDoorType === 'swing' ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => {
                  setWetRoomGlassDoorType('swing');
                  setStep('project_summary'); // Changed to go to summary page
                }}
              >
                Swing
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('wetroom_glass_door')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Add separate shower glass door step
  if (step === 'separate_glass_door') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Would you like a shower glass door?
            </h1>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <Button
                variant="outline"
                className={`p-6 h-auto ${separateShowerGlassDoor === true ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => {
                  setSeparateShowerGlassDoor(true);
                  // Continue to next step
                  setStep('project_summary');
                }}
              >
                Yes
              </Button>
              <Button
                variant="outline"
                className={`p-6 h-auto ${separateShowerGlassDoor === false ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => {
                  setSeparateShowerGlassDoor(false);
                  // Continue to next step
                  setStep('project_summary');
                }}
              >
                No
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('both_arrangement')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Add vanity_count step
  if (step === 'vanity_count') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Would you like to choose a new vanity?
            </h1>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <Button
                variant="outline"
                className="p-6 h-auto flex flex-col items-center hover:border-indigo-600"
                onClick={() => handleVanityAnswer(true)}
              >
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-lg font-medium">Yes</span>
              </Button>

              <Button
                variant="outline"
                className="p-6 h-auto flex flex-col items-center hover:border-indigo-600"
                onClick={() => handleVanityAnswer(false)}
              >
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <span className="text-lg font-medium">No</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => {
                  if (showerTubArrangement === 'combo') {
                  setStep('wetroom_glass_door');
                  } else {
                  setStep('separate_glass_door');
                  }
            }}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Keep the original shower_dimensions step for when bathingSetup !== 'Both'
  if (step === 'shower_dimensions') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Please insert your desired shower dimensions
            </h1>

            <div className="w-full max-w-md space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="width">Width (feet)</Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="0"
                    value={showerDimensions.width}
                    onChange={(e) => setShowerDimensions({...showerDimensions, width: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="length">Length (feet)</Label>
                  <Input
                    id="length"
                    type="number"
                    placeholder="0"
                    value={showerDimensions.length}
                    onChange={(e) => setShowerDimensions({...showerDimensions, length: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (feet)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="0"
                    value={showerDimensions.height}
                    onChange={(e) => setShowerDimensions({...showerDimensions, height: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                onClick={() => {
                  const { width, length, height } = showerDimensions;
                  if (!width || !length || !height) {
                    alert("Please fill in all dimensions");
                    return;
                  }
                  setStep('shower_head');
                }}
                className="w-full bg-black hover:bg-gray-800 mt-8"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('shower_type')} // Go back to shower type, not shower head
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Find the step that handles the custom bathing setup input (after selecting "Other")
  if (step === 'custom_bathing_setup') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              What kind of bathing setup is it?
            </h1>

          <div className="w-full max-w-md">
            <Textarea
              value={customBathingSetup}
              onChange={(e) => setCustomBathingSetup(e.target.value)}
              placeholder="Please describe your desired bathing setup..."
              className="mb-6"
            />

            <Button
              className="w-full"
              onClick={() => setStep('project_summary')} // Changed to go to summary instead of next step
              disabled={!customBathingSetup.trim()}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('bathing_setup')}
          className="text-gray-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
  );
}

  // Add new step for other bathing setup
  if (step === 'other_bathing_setup') { // This step is currently not reachable via button clicks.
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              What kind of bathing setup is it?
            </h1>

            <div className="w-full max-w-md">
              <Input
                value={customBathingSetup}
                onChange={(e) => setCustomBathingSetup(e.target.value)}
                placeholder="Describe your bathing setup"
                className="mb-6"
              />
              <Button
                onClick={() => {
                  if (!customBathingSetup) {
                    alert("Please describe your bathing setup");
                    return;
                  }
                  setStep('project_summary'); // Changed to summary
                }}
                className="w-full bg-black hover:bg-gray-800"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('bathing_setup')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Shower Type Step
  if (step === 'shower_type') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              What kind of shower?
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-xl">
              {['Walk-in', 'Pre-fab', 'Other'].map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  className={`p-6 h-auto ${showerType === type ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                  onClick={() => handleShowerTypeSelect(type)}
                >
                  <span className="text-lg font-medium">{type}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('bathing_setup')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Other Shower Type Step
  if (step === 'other_shower_type') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${calculateProgress(step)}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-500 mb-8">
          Step {getStepNumber(step)} of {getTotalSteps()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              What kind of shower is it?
            </h1>

            <div className="w-full max-w-md">
              <Input
                value={otherShowerType}
                onChange={(e) => setOtherShowerType(e.target.value)}
                placeholder="Describe your shower type"
                className="mb-6"
              />

              <Button
                onClick={handleOtherShowerTypeSubmit}
                className="w-full bg-black hover:bg-gray-800"
                disabled={!otherShowerType}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep('shower_type')}
            className="text-gray-600"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Add tub type selection step
if (step === 'tub_type') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            What kind of tub?
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl">
            {['Alcove', 'Freestanding', 'Soaking', 'Walk-in', 'Jacuzzi', 'Other'].map((type) => (
              <Button
                key={type}
                variant="outline"
                className={`p-6 h-auto ${tubType === type ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => {
                  setTubType(type);
                  if (type === 'Other') {
                    setStep('other_tub_type');
                  } else {
                    // Go to tub dimensions instead of shower head
                    setStep('tub_dimensions');
                  }
                }}
              >
                <span className="text-lg font-medium">{type}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('bathing_setup')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Add other_tub_type to go to dimensions
if (step === 'other_tub_type') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            What kind of tub is it?
          </h1>

          <div className="w-full max-w-md">
            <Input
              value={otherTubType}
              onChange={(e) => setOtherTubType(e.target.value)}
              placeholder="Describe the tub type"
              className="mb-6"
            />
            <Button
              onClick={() => {
                setTubType(`Other: ${otherTubType}`);
                setStep('tub_dimensions');
              }}
              className="w-full bg-black hover:bg-gray-800"
              disabled={!otherTubType}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('tub_type')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Add tub dimensions step
if (step === 'tub_dimensions') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Please insert your desired tub dimensions
          </h1>

          <div className="w-full max-w-md">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (feet)
                </label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={tubDimensions.width}
                  onChange={(e) => setTubDimensions({...tubDimensions, width: e.target.value})}
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Length (feet)
                </label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={tubDimensions.length}
                  onChange={(e) => setTubDimensions({...tubDimensions, length: e.target.value})}
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (feet)
                </label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={tubDimensions.height}
                  onChange={(e) => setTubDimensions({...tubDimensions, height: e.target.value})}
                  placeholder="2"
                />
              </div>
            </div>
            <Button
              onClick={() => setStep('tub_shampoo_niche')}
              className="w-full bg-black hover:bg-gray-800"
              disabled={!tubDimensions.width || !tubDimensions.length || !tubDimensions.height}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('tub_type')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Add tub shampoo niche question
if (step === 'tub_shampoo_niche') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Would you like a shampoo niche?
          </h1>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <Button
              variant="outline"
              className={`p-6 h-auto ${wantsShampooNiche === true ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
              onClick={() => {
                setWantsShampooNiche(true);
                setStep('tub_filler');
              }}
            >
              <span className="text-lg font-medium">Yes</span>
            </Button>
            <Button
              variant="outline"
              className={`p-6 h-auto ${wantsShampooNiche === false ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
              onClick={() => {
                setWantsShampooNiche(false);
                setStep('tub_filler');
              }}
            >
              <span className="text-lg font-medium">No</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('tub_dimensions')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Add tub filler selection
if (step === 'tub_filler') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            What kind of tub filler would you like?
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl">
            {['Freestanding', 'Wall-mounted', 'Other'].map((type) => (
              <Button
                key={type}
                variant="outline"
                className={`p-6 h-auto ${tubFillerType === type ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => {
                  setTubFillerType(type);
                  if (type === 'Other') {
                    setStep('other_tub_filler');
                  } else {
                    // Go to shower head question
                    setStep('wants_tub_shower_head');
                  }
                }}
              >
                <span className="text-lg font-medium">{type}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('tub_shampoo_niche')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Add other tub filler type input
if (step === 'other_tub_filler') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            What other type of tub filler would you like?
          </h1>

          <div className="w-full max-w-md">
            <Input
              value={otherTubFillerType}
              onChange={(e) => setOtherTubFillerType(e.target.value)}
              placeholder="Describe the tub filler"
              className="mb-6"
            />
            <Button
              onClick={() => {
                setTubFillerType(`Other: ${otherTubFillerType}`);
                setStep('wants_tub_shower_head');
              }}
              className="w-full bg-black hover:bg-gray-800"
              disabled={!otherTubFillerType}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('tub_filler')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Add wants shower head question
if (step === 'wants_tub_shower_head') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Would you like a shower head in addition to the tub filler?
          </h1>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <Button
              variant="outline"
              className={`p-6 h-auto ${wantsTubShowerHead === true ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
              onClick={() => {
                setWantsTubShowerHead(true);
                setStep('tub_shower_head_type');
              }}
            >
              <span className="text-lg font-medium">Yes</span>
            </Button>

            <Button
              variant="outline"
              className={`p-6 h-auto ${wantsTubShowerHead === false ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
              onClick={() => {
                setWantsTubShowerHead(false);
                setStep('project_summary');
              }}
            >
              <span className="text-lg font-medium">No</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('tub_filler')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Add tub shower head type selection
if (step === 'tub_shower_head_type') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            What kind of shower head would you like?
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl">
            {['Fixed', 'Rainfall', 'Handheld', 'Dual', 'Ceiling-Mounted', 'Other'].map((type) => (
              <Button
                key={type}
                variant="outline"
                className={`p-6 h-auto ${tubShowerHeadType === type ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => {
                  setTubShowerHeadType(type);
                  if (type === 'Other') {
                    setStep('other_tub_shower_head');
                  } else {
                    setStep('project_summary');
                  }
                }}
              >
                <span className="text-lg font-medium">{type}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('wants_tub_shower_head')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Add other shower head type input
if (step === 'other_tub_shower_head') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            What other type of shower head would you like?
          </h1>

          <div className="w-full max-w-md">
            <Input
              value={otherTubShowerHeadType}
              onChange={(e) => setOtherTubShowerHeadType(e.target.value)}
              placeholder="Describe the shower head"
              className="mb-6"
            />
            <Button
              onClick={() => {
                setTubShowerHeadType(`Other: ${otherTubShowerHeadType}`);
                setStep('project_summary');
              }}
              className="w-full bg-black hover:bg-gray-800"
              disabled={!otherTubShowerHeadType}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('tub_shower_head_type')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Removed duplicate shower enclosure from here, keep only one

const handleShowerHeadSelect = (type) => {
  setShowerHeadType(type);
  if (type === 'Other') {
    setStep('other_shower_head');
  } else if (type === 'Keep Existing shower head') {
    setShowShowerHeadMessage(true);
  } else {
    setStep('shower_enclosure');
  }
};

const handleShowerHeadMessageContinue = () => {
  setShowShowerHeadMessage(false);
  setStep('shower_enclosure');
};

// Add shower head selection
if (step === 'shower_head') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            What kind of shower-head would you like?
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl mb-8">
            {['Fixed', 'Rainfall', 'Handheld', 'Dual', 'Ceiling-Mounted', 'Other'].map((type) => (
              <Button
                key={type}
                variant="outline"
                className={`p-6 h-auto ${showerHeadType === type ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => handleShowerHeadSelect(type)}
              >
                <span className="text-lg font-medium">{type}</span>
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            className={`p-4 w-full max-w-xl ${showerHeadType === 'Keep Existing shower head' ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
            onClick={() => handleShowerHeadSelect('Keep Existing shower head')}
          >
            <span className="text-lg font-medium">Keep Existing shower head</span>
          </Button>

          {showShowerHeadMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-xl text-center"
            >
              <p className="text-gray-700 mb-4">
                You can keep your existing shower head but when doing the shower demolition, shower valve replacement is usually needed. Shower head usually comes in a set with a matching valve so if you can get a new matching valve for your existing shower head, it's all good. But if not, you will have to replace the shower head and buy a new set.
              </p>
              <Button
                onClick={handleShowerHeadMessageContinue}
                className="bg-black hover:bg-gray-800"
              >
                Continue
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('shampoo_niche')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Add other shower head input
if (step === 'other_shower_head') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            What kind of shower head is it?
          </h1>

          <div className="w-full max-w-md">
            <Input
              value={otherShowerHeadType}
              onChange={(e) => setOtherShowerHeadType(e.target.value)}
              placeholder="Describe the shower head type"
              className="mb-6"
            />
            <Button
              onClick={() => {
                setShowerHeadType(`Other: ${otherShowerHeadType}`);
                setStep('shower_enclosure');
              }}
              className="w-full bg-black hover:bg-gray-800"
              disabled={!otherShowerHeadType}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('shower_head')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Add glass door type selection
if (step === 'glass_door_type') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            What kind of glass door would you like?
          </h1>

          <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
            {['Sliding', 'Swing', 'Half-Panel', 'Other'].map((type) => (
              <Button
                key={type}
                variant="outline"
                className={`p-6 h-auto ${glassDoorType === type ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => handleGlassDoorTypeSelect(type)}
              >
                <span className="text-lg font-medium">{type}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('shower_enclosure')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Add other glass door type input
if (step === 'other_glass_door_type') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            What kind of glass door is it?
          </h1>

          <div className="w-full max-w-md">
            <Input
              value={otherGlassDoorType}
              onChange={(e) => setOtherGlassDoorType(e.target.value)}
              placeholder="Describe the glass door type"
              className="mb-6"
            />
            <Button
              onClick={() => {
                setGlassDoorType(`Other: ${otherGlassDoorType}`);
                setStep('project_summary');
              }}
              className="w-full bg-black hover:bg-gray-800"
              disabled={!otherGlassDoorType}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('glass_door_type')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Add shower enclosure selection (Consolidated, original one was removed)
if (step === 'shower_enclosure') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            What kind of shower enclosure would you like?
          </h1>

          <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
            {['Glass Door', 'Curtain', 'None', 'Other'].map((type) => (
              <Button
                key={type}
                variant="outline"
                className={`p-6 h-auto ${showerEnclosureType === type ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
                onClick={() => handleShowerEnclosureSelect(type)}
              >
                <span className="text-lg font-medium">{type}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep(showerHeadType === 'Other' ? 'other_shower_head' : 'shower_head')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Add or update the other_shower_enclosure step (Consolidated)
if (step === 'other_shower_enclosure') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            What kind of shower enclosure is it?
          </h1>

          <div className="w-full max-w-md">
            <Input
              value={otherShowerEnclosureType}
              onChange={(e) => setOtherShowerEnclosureType(e.target.value)}
              placeholder="Describe the shower enclosure"
              className="mb-6"
            />
            <Button
              onClick={handleOtherShowerEnclosureSubmit}
              className="w-full bg-black hover:bg-gray-800"
              disabled={!otherShowerEnclosureType}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('shower_enclosure')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Shower Bench step (for single shower setup)
if (step === 'shower_bench') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Would you like a bench in your shower?
          </h1>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <Button
              variant="outline"
              className={`p-6 h-auto ${wantsShowerBench === true ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
              onClick={() => {
                setWantsShowerBench(true);
                setStep('shampoo_niche');
              }}
            >
              Yes
            </Button>
            <Button
              variant="outline"
              className={`p-6 h-auto ${wantsShowerBench === false ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
              onClick={() => {
                setWantsShowerBench(false);
                setStep('shampoo_niche');
              }}
            >
              No
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('shower_dimensions')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Shampoo Niche step (for single shower setup)
if (step === 'shampoo_niche') {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${calculateProgress(step)}%` }}
        />
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Step {getStepNumber(step)} of {getTotalSteps()}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Would you like a shampoo niche in your shower?
          </h1>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <Button
              variant="outline"
              className={`p-6 h-auto ${wantsShampooNiche === true ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
              onClick={() => {
                setWantsShampooNiche(true);
                setStep('shower_head');
              }}
            >
              Yes
            </Button>
            <Button
              variant="outline"
              className={`p-6 h-auto ${wantsShampooNiche === false ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-600'}`}
              onClick={() => {
                setWantsShampooNiche(false);
                setStep('shower_head');
              }}
            >
              No
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep('shower_bench')}
          className="text-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

// Project Summary Step (Final Step)
if (step === 'project_summary') {
    // Helper function to format selections
    const formatSelection = (selection) => {
      return selection && selection.startsWith('Other:')
        ? selection
        : selection || 'Not specified';
    };
    const hasBathroomMeasurements =
      bathroomDimensions?.length &&
      bathroomDimensions?.width &&
      bathroomDimensions?.height;
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
              Your Bathroom Remodel Summary
            </h1>

            <div className="w-full max-w-3xl">
              <p className="text-gray-700 mb-8 text-center">
                Here's a summary of your bathroom remodel project. Please review the details below.
              </p>

              {/* Project Details Display */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                <h3 className="font-semibold text-lg mb-3">Project Details</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Bathing Setup:</dt>
                    <dd className="font-medium">{bathingSetup === 'Other' ? customBathingSetup : bathingSetup}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Bathroom Measurements:</dt>
                    <dd className="font-medium">
                      {hasBathroomMeasurements && bathroomDimensions?.length && bathroomDimensions?.width && bathroomDimensions?.height
                        ? `${bathroomDimensions.length} x ${bathroomDimensions.width} x ${bathroomDimensions.height} feet`
                        : 'Not specified'}
                    </dd>
                  </div>
                </dl>
              </div>



<div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
  <h4 className="font-semibold text-lg mb-4">Your Selected Answers</h4>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-800">
    <div><strong>Renovation Type:</strong> {renovationType || "Not specified"}</div>
    <div><strong>Zip Code:</strong> {address?.zip_code || "Not specified"}</div>

    <div><strong>Bathroom Dimensions:</strong>
      {hasBathroomMeasurements && bathroomDimensions?.length && bathroomDimensions?.width && bathroomDimensions?.height
        ? ` ${bathroomDimensions.length} x ${bathroomDimensions.width} x ${bathroomDimensions.height} feet`
        : ' Not specified'}
    </div>
    <div><strong>Bathing Setup:</strong> {bathingSetup === 'Other' ? customBathingSetup : bathingSetup}</div>

    {bathingSetup === 'Shower' && (
        <>
            <div><strong>Shower Type:</strong> {formatSelection(showerType)}</div>
            <div><strong>Shower Dimensions:</strong> {showerDimensions.width} x {showerDimensions.length} x {showerDimensions.height} feet</div>
            <div><strong>Shower Head:</strong> {formatSelection(showerHeadType)}</div>
            <div><strong>Shower Enclosure:</strong> {formatSelection(showerEnclosureType)}</div>
            {showerEnclosureType === "Glass Door" && (
                <div><strong>Glass Door Type:</strong> {formatSelection(glassDoorType)}</div>
            )}
            <div><strong>Wants Bench:</strong> {wantsShowerBench === true ? 'Yes' : wantsShowerBench === false ? 'No' : 'Not specified'}</div>
            <div><strong>Wants Niche:</strong> {wantsShampooNiche === true ? 'Yes' : wantsShampooNiche === false ? 'No' : 'Not specified'}</div>
        </>
    )}

    {bathingSetup === 'Tub' && (
        <>
            <div><strong>Tub Type:</strong> {formatSelection(tubType)}</div>
            <div><strong>Tub Dimensions:</strong> {tubDimensions.width} x {tubDimensions.length} x {tubDimensions.height} feet</div>
            <div><strong>Wants Niche:</strong> {wantsShampooNiche === true ? 'Yes' : wantsShampooNiche === false ? 'No' : 'Not specified'}</div>
            <div><strong>Tub Filler:</strong> {formatSelection(tubFillerType)}</div>
            <div><strong>Wants Shower Head:</strong> {wantsTubShowerHead === true ? 'Yes' : wantsTubShowerHead === false ? 'No' : 'Not specified'}</div>
            {wantsTubShowerHead && (
                <div><strong>Tub Shower Head Type:</strong> {formatSelection(tubShowerHeadType)}</div>
            )}
        </>
    )}

    {bathingSetup === 'Both' && (
        <>
            <div><strong>Shower Type:</strong> {formatSelection(bothSetupChoices.shower)}</div>
            <div><strong>Shower Dimensions:</strong> {bothSetupChoices.showerDimensions.width} x {bothSetupChoices.showerDimensions.length} x {bothSetupChoices.showerDimensions.height} feet</div>
            <div><strong>Tub Type:</strong> {formatSelection(bothSetupChoices.tub)}</div>
            <div><strong>Tub Dimensions:</strong> {bothSetupChoices.tubDimensions.width} x {bothSetupChoices.tubDimensions.length} x {bothSetupChoices.tubDimensions.height} feet</div>
            <div><strong>Both Shower Head:</strong> {formatSelection(bothShowerHead)}</div>
            <div><strong>Both Wants Bench:</strong> {bothHasBench === true ? 'Yes' : bothHasBench === false ? 'No' : 'Not specified'}</div>
            <div><strong>Both Wants Niche:</strong> {bothHasNiche === true ? 'Yes' : bothHasNiche === false ? 'No' : 'Not specified'}</div>
            <div><strong>Arrangement:</strong> {showerTubArrangement === 'combo' ? 'Shower-tub combo (wet room)' : showerTubArrangement === 'separated' ? 'Shower and tub separated' : 'Not specified'}</div>
            {showerTubArrangement === 'combo' && (
                <>
                    <div><strong>Wet Room Glass Door:</strong> {wetRoomGlassDoor === true ? 'Yes' : wetRoomGlassDoor === false ? 'No' : 'Not specified'}</div>
                    {wetRoomGlassDoor && (
                        <div><strong>Wet Room Glass Door Type:</strong> {wetRoomGlassDoorType}</div>
                    )}
                </>
            )}
            {showerTubArrangement === 'separated' && (
                <div><strong>Separate Shower Glass Door:</strong> {separateShowerGlassDoor === true ? 'Yes' : separateShowerGlassDoor === false ? 'No' : 'Not specified'}</div>
            )}
        </>
    )}

    {changeLayout !== null && (
        <div>
            <strong>Change Layout:</strong> {changeLayout ? 'Yes' : 'No'}
            {changeLayout && Object.values(relocateItems).some(Boolean) && (
                <ul className="list-disc list-inside ml-4 mt-1">
                    {Object.entries(relocateItems).map(([item, isSelected]) =>
                        isSelected && (
                            <li key={item}>
                                {item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {relocationDistances[item] || 'N/A'} inches
                            </li>
                        )
                    )}
                </ul>
            )}
        </div>
    )}

    <div><strong>Has Design:</strong> {hasDesign ? "Yes" : "No"}</div>

    {wantsNewVanity ? (
        <>
            <div><strong>Vanity Type:</strong> {formatSelection(vanityType)}</div>
            <div><strong>Vanity Size:</strong> {vanitySize === 'Custom-made vanity size' ? customVanitySize : vanitySize}</div>
            <div><strong>Vanity Countertop:</strong> {formatSelection(vanityCountertop)}</div>
            <div><strong>Backsplash Height:</strong> {backsplashHeight} inches</div>
            <div><strong>Vanity Faucet:</strong> {formatSelection(vanityFaucet)}</div>
            <div><strong>Sink Type:</strong> {formatSelection(sinkType)}</div>
        </>
    ) : (
        <div><strong>Vanity:</strong> Keep existing, Backsplash: {backsplashHeight} inches</div>
    )}

    <div><strong>Mirror Type:</strong> {formatSelection(mirrorType)}</div>
    <div><strong>Toilet Type:</strong> {formatSelection(toiletType)}</div>

    <div>
      <strong>Electrical Outlets:</strong>
      {electricalDetails?.currentOutlets || "0"} current, {electricalDetails?.additionalOutlets || "0"} additional
    </div>

    <div>
      <strong>Lighting:</strong>
      {lightingDetails?.currentLights || "0"} current, {lightingDetails?.additionalLights || "0"} additional
    </div>
  </div>
</div>


          <div className="bg-gray-100 p-4 rounded-lg mt-4 text-sm text-gray-700">
  <h4 className="font-semibold mb-2">Generated AI Prompt</h4>
  <p className="whitespace-pre-wrap">
    {generateBathroomPrompt({
      renovationType,
      bathroomDimensions: hasBathroomMeasurements ? bathroomDimensions : null,
      zipCode: address?.zip_code,
      changeLayout,
      relocateItems,
      relocationDistances,
      hasDesign,
      wantsNewVanity,
      vanityType,
      vanitySize,
      customVanitySize,
      vanityCountertop,
      otherCountertopMaterial,
      backsplashHeight,
      vanityFaucet,
      otherFaucetType,
      sinkType,
      mirrorType,
      toiletType,
      bathingSetup,
      showerType,
      showerDimensions,
      wantsShowerBench,
      wantsShampooNiche,
      showerHeadType,
      showerEnclosure: showerEnclosureType,
      glassDoorType,
      wetRoomEnclosureType,
      wetRoomGlassDoorType,
      bothSetupChoices,
      bothShowerHead,
      otherBothShowerHead,
      bothHasNiche,
      bothHasBench,
      showerTubArrangement,
      customBathingSetup,
      electricalDetails,
      lightingDetails,
      tubType,
      tubDimensions,
      tubFillerType,
      wantsTubShowerHead,
      tubShowerHeadType,
    })}
  </p>
</div>

              <Button
                onClick={handleCompleteAndGetEstimate}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
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
function generateBathroomPrompt(data) {
  const {
    renovationType,
    bathroomDimensions,
    zipCode,
    changeLayout,
    relocateItems,
    relocationDistances,
    hasDesign,
    wantsNewVanity,
    vanityType,
    vanitySize,
    customVanitySize,
    vanityCountertop,
    otherCountertopMaterial,
    backsplashHeight,
    vanityFaucet,
    otherFaucetType,
    sinkType,
    mirrorType,
    toiletType,
    bathingSetup,
    showerType,
    showerDimensions,
    wantsShowerBench,
    wantsShampooNiche,
    showerHeadType,
    showerEnclosure,
    glassDoorType,
    tubType,
    tubDimensions,
    tubFillerType,
    wantsTubShowerHead,
    tubShowerHeadType,
    bothSetupChoices,
    bothShowerHead,
    otherBothShowerHead,
    bothHasBench,
    bothHasNiche,
    wetRoomEnclosureType,
    wetRoomGlassDoorType,
    showerTubArrangement,
    customBathingSetup,
    electricalDetails,
    lightingDetails,
  } = data;

  const prompt = [];

  prompt.push(`The client is planning a ${renovationType || "Full"} bathroom remodel. The project's Zip code is: ${zipCode || "Not specified"}.`);

  if (bathroomDimensions?.width && bathroomDimensions?.length && bathroomDimensions?.height) {
    prompt.push(`The bathroom dimensions are ${bathroomDimensions.width} by ${bathroomDimensions.length} and ${bathroomDimensions.height} high.`);
  }

  if (changeLayout) {
  if (relocateItems && typeof relocateItems === 'object') {
    const selectedItems = Object.entries(relocateItems)
      .filter(([_, isSelected]) => isSelected)
      .map(([itemKey]) => {
        const distance = relocationDistances?.[itemKey] || "unspecified";
        const labelMap = {
          showerDrainage: "Shower Drainage",
          showerHead: "Shower Head",
          tubFiller: "Tub Filler",
          toilet: "Toilet",
          vanity: "Vanity"
        };
        const label = labelMap[itemKey] || itemKey;
        return `the ${label} by ${distance}"`;
      });

    if (selectedItems.length > 0) {
      prompt.push(`They want to change the layout by relocating ${selectedItems.join(" and ")}.`);
    } else {
      prompt.push("They want to change the layout.");
    }
  } else {
    prompt.push("They want to change the layout.");
  }
} else {
  prompt.push("They don't want to change the layout.");
}


  prompt.push(hasDesign ? "The client has a design for his new bathroom." : "The client does not have a design for his new bathroom.");

  prompt.push(`They currently have ${electricalDetails.currentOutlets} electrical outlets and want to add ${electricalDetails.additionalOutlets} extra electrical outlets.`);
prompt.push(`They currently have ${lightingDetails.currentLights} lights and want to add ${lightingDetails.additionalLights} extra lights.`);

  if (!wantsNewVanity) {
    prompt.push(`They would like to keep their existing vanity, with a ${backsplashHeight || "unspecified"}" backsplash.`);
  } else {
    const size = vanitySize === "Custom-made vanity size" ? customVanitySize + '"' : vanitySize;
    const topMaterial = vanityCountertop === "Other" ? otherCountertopMaterial : vanityCountertop;
    const faucet = vanityFaucet === "Other" ? otherFaucetType : vanityFaucet;
    prompt.push(
      `They would like to have a new ${vanityType || "unspecified"} of ${size || "unspecified"} size. ` +
      `The countertop should be ${topMaterial || "unspecified"} with a ${backsplashHeight || "unspecified"}" backsplash. ` +
      `Vanity faucet is ${faucet || "unspecified"}, sink is ${sinkType || "unspecified"}, mirror is ${mirrorType || "unspecified"} and toilet is ${toiletType || "unspecified"}. `
    );
  }

  if (bathingSetup?.toLowerCase()=== "shower") {
    const width = showerDimensions?.width || "unspecified";
    const length = showerDimensions?.length || "unspecified";
    const height = showerDimensions?.height || "unspecified";
    prompt.push(
      `Bathing setup is shower and the type is ${showerType || "unspecified"} and the shower dimensions are ${width}' by ${length}' and ${height}' high. ` +
      `Shower head is ${showerHeadType || "unspecified"} and shower enclosure is ${showerEnclosure || "unspecified"}.`
    );
    if (wantsShowerBench) {
        prompt.push("They would like to have a bench in the shower.");
    }
    if (wantsShampooNiche) {
        prompt.push("They would like to have a shampoo niche.");
    }
    if (showerEnclosure === "Glass Door" && glassDoorType) {
     prompt.push(`The glass door is ${glassDoorType}.`);
    }
  }

if (bathingSetup?.toLowerCase() === "tub") {
  prompt.push(`Bathing setup is Tub and the type is ${tubType || "unspecified"}.`);

  if (tubDimensions?.width && tubDimensions?.length && tubDimensions?.height) {
    prompt.push(`Tub's dimensions are ${tubDimensions.width}' by ${tubDimensions.length}' and ${tubDimensions.height}' high.`);
  }

  if (wantsShampooNiche) {
    prompt.push("They would like to have a shampoo niche.");
  }

  if (tubFillerType) {
    prompt.push(`Type of tub filler is ${tubFillerType}.`);
  }

  if (wantsTubShowerHead && tubShowerHeadType) {
    prompt.push(`They would also like to add a ${tubShowerHeadType} shower head.`);
  }
}



if (bathingSetup?.toLowerCase() === "both") {
  prompt.push("Bathing setup is Both — a shower and a tub.");

  const showerDims = bothSetupChoices?.showerDimensions || {};
  const tubDims = bothSetupChoices?.tubDimensions || {};
  const showerHead = bothShowerHead === "Other" ? otherBothShowerHead : bothShowerHead;

  // Shower details
  prompt.push(
    `Type of shower is ${bothSetupChoices?.shower || "unspecified"} and the shower dimensions are ` +
    `${showerDims.width || "unspecified"}' by ${showerDims.length || "unspecified"}' and ${showerDims.height || "unspecified"}' high.`
  );

  prompt.push(`Shower head is ${showerHead || "unspecified"}.`);

  // Tub details
  prompt.push(
    `Tub type is ${bothSetupChoices?.tub || "unspecified"}. ` +
    `Tub dimensions are ${tubDims.width || "unspecified"}' by ${tubDims.length || "unspecified"}' and ${tubDims.height || "unspecified"}' high.`
  );

  if (bothHasNiche) {
    prompt.push("They would like to have a shampoo niche.");
  }

  if (bothHasBench) {
    prompt.push("They would like to have a bench in the shower.");
  }
  if (showerTubArrangement === "combo") {
    prompt.push("The shower and tub will be a combo in a wet room setup.");
    if (wetRoomGlassDoor && wetRoomGlassDoorType) {
        prompt.push(`The wet room will be enclosed with a ${wetRoomGlassDoorType} glass door.`);
    } else if (wetRoomGlassDoor === false) {
        prompt.push("The wet room will not have a glass door.");
    }
  } else if (showerTubArrangement === "separated") {
    prompt.push("The shower and tub will be separated.");
    if (separateShowerGlassDoor) {
        prompt.push("The shower area will have a glass door.");
    } else {
        prompt.push("The shower area will not have a glass door.");
    }
  }
}
if (bathingSetup?.toLowerCase() === "other" && customBathingSetup?.trim()) {
  prompt.push(`The bathing setup is ${customBathingSetup.trim()}.`);
}
prompt.push("Create a detailed and accurate estimate broken down into rough materials, materials and labor costs. Create a suggested 3D design based on client's input.");
  return prompt.join(" ");
}


return null;
}
