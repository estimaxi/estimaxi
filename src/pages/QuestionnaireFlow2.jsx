import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Import components for different steps
import AddressForm from '../components/address/AddressForm';
import ProjectTypeSelector from '../components/project-types/ProjectTypeSelector';
import ResidentialSubtypes from '../components/project-types/residential/ResidentialSubtypes';
import CommercialSubtypes from '../components/project-types/CommercialSubtypes';
import IndustrialSubtypes from '../components/project-types/industrial/IndustrialSubtypes';
import CivilSubtypes from '../components/project-types/CivilSubtypes';
import NewConstructionFlow from '../components/project-types/residential/NewConstructionFlow';
import NewAdditionFlow from '../components/project-types/residential/NewAdditionFlow';
import BathroomRemodel from '../components/project-types/residential/BathroomRemodel';
import KitchenMeasurements from '../components/project-types/residential/KitchenMeasurements';
import BedroomMeasurements from '../components/project-types/residential/BedroomMeasurements';
import OfficeSubtypes from '../components/project-types/commercial/OfficeSubtypes';
import RetailSubtypes from '../components/project-types/commercial/RetailSubtypes';
import InstitutionalSubtypes from '../components/project-types/commercial/InstitutionalSubtypes';
import RecreationalSubtypes from '../components/project-types/commercial/RecreationalSubtypes';
import InfrastructureSubtypes from '../components/project-types/commercial/InfrastructureSubtypes';
import RenovationSubtypes from '../components/project-types/commercial/RenovationSubtypes';
import ManufacturingFacilitiesSubtypes from '../components/project-types/industrial/ManufacturingFacilitiesSubtypes';
import WarehousingLogisticsSubtypes from '../components/project-types/industrial/WarehousingLogisticsSubtypes';
import ProcessingPlantsSubtypes from '../components/project-types/industrial/ProcessingPlantsSubtypes';
import PowerEnergySubtypes from '../components/project-types/industrial/PowerEnergySubtypes';
import RefineriesExtractiveSubtypes from '../components/project-types/industrial/RefineriesExtractiveSubtypes';
import FabricationHeavySubtypes from '../components/project-types/industrial/FabricationHeavySubtypes';
import WasteWaterSubtypes from '../components/project-types/industrial/WasteWaterSubtypes';
// New Civil Detail Imports
import TransportationInfrastructureSubtypes from '../components/project-types/civil/TransportationInfrastructureSubtypes';
import UtilitiesEnergySubtypes from '../components/project-types/civil/UtilitiesEnergySubtypes';
import EnvironmentalPublicWorksSubtypes from '../components/project-types/civil/EnvironmentalPublicWorksSubtypes';
import UrbanInfrastructureSubtypes from '../components/project-types/civil/UrbanInfrastructureSubtypes';
import PublicFacilitiesSubtypes from '../components/project-types/civil/PublicFacilitiesSubtypes';


export default function QuestionnaireFlow2() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSubtype, setSelectedSubtype] = useState(null);
  const [selectedIndustrialDetail, setSelectedIndustrialDetail] = useState(null);
  const [selectedCivilDetail, setSelectedCivilDetail] = useState(null); // New state for civil detail
  const [currentStep, setCurrentStep] = useState('address');
  const [address, setAddress] = useState({
    street_number: '',
    street_name: '',
    unit: '',
    city: '',
    state: '',
    zip_code: ''
  });

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressSubmit = () => {
    setCurrentStep('type');
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    if (type === 'residential') {
      setCurrentStep('residential_subtype');
    } else if (type === 'commercial') {
      setCurrentStep('commercial_subtype');
    } else if (type === 'industrial') {
      setCurrentStep('industrial_subtype');
    } else if (type === 'civil') {
      setCurrentStep('civil_subtype');
    } else {
      navigate(createPageUrl('ProjectQuestionnaire', `type=${type}&address=${encodeURIComponent(JSON.stringify(address))}`));
    }
  };



  const handleSubtypeSelect = (subtype) => {
    setSelectedSubtype(subtype);
    if (subtype === 'kitchen_remodel') {
      setCurrentStep('kitchen_measurements');
    } else if (subtype === 'new_construction') {
      setCurrentStep('new_construction_type');
    } else if (subtype === 'new_addition') {
      setCurrentStep('new_addition_type');
    } else if (subtype === 'bathroom_remodel') {
      setCurrentStep('bathroom_remodel');
    } else if (subtype === 'bedroom_renovation') {
      setCurrentStep('bedroom_measurements');
    } else {
      navigate(createPageUrl('ProjectQuestionnaire', `type=${selectedType}&subtype=${subtype}&address=${encodeURIComponent(JSON.stringify(address))}`));
    }
  };




  


    
  

  const handleCommercialSubtypeSelect = (subtype) => {
    setSelectedSubtype(subtype);
    if (subtype === 'office_buildings') {
      setCurrentStep('office_subtype');
    } else if (subtype === 'retail_hospitality') {
      setCurrentStep('retail_subtype');
    } else if (subtype === 'institutional_public') {
      setCurrentStep('institutional_subtype');
    } else if (subtype === 'recreational_entertainment') {
      setCurrentStep('recreational_subtype');
    } else if (subtype === 'infrastructure') {
      setCurrentStep('infrastructure_subtype');
    } else if (subtype === 'commercial_renovations') {
      setCurrentStep('renovation_subtype');
    } else {
      navigate(createPageUrl('ProjectQuestionnaire', `type=${selectedType}&subtype=${subtype}&address=${encodeURIComponent(JSON.stringify(address))}`));
    }
  };

  const handleIndustrialSubtypeSelect = (subtype) => {
    setSelectedSubtype(subtype);
    if (subtype === 'manufacturing_facilities') {
      setCurrentStep('manufacturing_facilities_detail');
    } else if (subtype === 'warehousing_logistics') {
      setCurrentStep('warehousing_logistics_detail');
    } else if (subtype === 'processing_plants') {
      setCurrentStep('processing_plants_detail');
    } else if (subtype === 'power_energy_facilities') {
      setCurrentStep('power_energy_detail');
    } else if (subtype === 'refineries_extractive') {
      setCurrentStep('refineries_extractive_detail');
    } else if (subtype === 'fabrication_heavy_industrial') {
      setCurrentStep('fabrication_heavy_detail');
    } else if (subtype === 'waste_water_treatment') {
      setCurrentStep('waste_water_detail');
    } else {
      navigate(createPageUrl('ProjectQuestionnaire', 
        `type=${selectedType}&subtype=${subtype}&address=${encodeURIComponent(JSON.stringify(address))}`
      ));
    }
  };

  const handleIndustrialDetailSelect = (industrialDetail) => {
    setSelectedIndustrialDetail(industrialDetail);
    navigate(createPageUrl('ProjectQuestionnaire', 
      `type=${selectedType}&subtype=${selectedSubtype}&industrial_detail=${industrialDetail}&address=${encodeURIComponent(JSON.stringify(address))}`
    ));
  };
  
  const handleInstitutionalSubtypeSelect = (subtype) => {
    navigate(createPageUrl('ProjectQuestionnaire', 
      `type=${selectedType}&subtype=institutional_public&institutional_type=${subtype}&address=${encodeURIComponent(JSON.stringify(address))}`
    ));
  };

  const handleRecreationalSubtypeSelect = (subtype) => {
    navigate(createPageUrl('ProjectQuestionnaire', 
      `type=${selectedType}&subtype=recreational_entertainment&recreational_type=${subtype}&address=${encodeURIComponent(JSON.stringify(address))}`
    ));
  };

  const handleInfrastructureSubtypeSelect = (subtype) => {
    navigate(createPageUrl('ProjectQuestionnaire', 
      `type=${selectedType}&subtype=infrastructure&infrastructure_type=${subtype}&address=${encodeURIComponent(JSON.stringify(address))}`
    ));
  };

  const handleRenovationSubtypeSelect = (subtype) => {
    navigate(createPageUrl('ProjectQuestionnaire', 
      `type=${selectedType}&subtype=commercial_renovations&renovation_type=${subtype}&address=${encodeURIComponent(JSON.stringify(address))}`
    ));
  };

  const handleOfficeSubtypeSelect = (subtype) => {
    navigate(createPageUrl('ProjectQuestionnaire', 
      `type=${selectedType}&subtype=office_buildings&office_type=${subtype}&address=${encodeURIComponent(JSON.stringify(address))}`
    ));
  };

  const handleRetailSubtypeSelect = (subtype) => {
    navigate(createPageUrl('ProjectQuestionnaire', 
      `type=${selectedType}&subtype=retail_hospitality&retail_type=${subtype}&address=${encodeURIComponent(JSON.stringify(address))}`
    ));
  };

  const handleNewAdditionTypeSelect = (additionType, details) => {
    const queryParams = `type=${selectedType}&subtype=${selectedSubtype}&additionType=${additionType}&address=${encodeURIComponent(JSON.stringify(address))}`;
    
    const detailsParam = details ? `&details=${encodeURIComponent(JSON.stringify(details))}` : '';
    
    navigate(createPageUrl('ProjectQuestionnaire', `${queryParams}${detailsParam}`));
  };

  const handleNewConstructionTypeSelect = (constructionType, details) => {
    const queryParams = `type=${selectedType}&subtype=${selectedSubtype}&constructionType=${constructionType}&address=${encodeURIComponent(JSON.stringify(address))}`;
    
    const detailsParam = details ? `&details=${encodeURIComponent(JSON.stringify(details))}` : '';
    
    navigate(createPageUrl('ProjectQuestionnaire', `${queryParams}${detailsParam}`));
  };

  const handleCivilSubtypeSelect = (subtype) => {
    setSelectedSubtype(subtype); // Store the selected civil subtype
    if (subtype === 'transportation_infrastructure') {
      setCurrentStep('transportation_infrastructure_detail');
    } else if (subtype === 'utilities_energy') {
      setCurrentStep('utilities_energy_detail');
    } else if (subtype === 'environmental_public_works') {
      setCurrentStep('environmental_public_works_detail');
    } else if (subtype === 'urban_infrastructure') {
      setCurrentStep('urban_infrastructure_detail');
    } else if (subtype === 'public_facilities') {
      setCurrentStep('public_facilities_detail');
    } else {
      // Fallback if a subtype doesn't have a detail page (should not happen with current setup)
      navigate(createPageUrl('ProjectQuestionnaire', 
        `type=${selectedType}&subtype=${subtype}&address=${encodeURIComponent(JSON.stringify(address))}`
      ));
    }
  };

  // New handler for Civil Detail Selections
  const handleCivilDetailSelect = (civilDetail) => {
    setSelectedCivilDetail(civilDetail); // Store civil detail
    navigate(createPageUrl('ProjectQuestionnaire', 
      `type=${selectedType}&subtype=${selectedSubtype}&civil_detail=${civilDetail}&address=${encodeURIComponent(JSON.stringify(address))}`
    ));
  };

  const goBack = () => {
    if (currentStep === 'office_subtype' || currentStep === 'retail_subtype' || 
        currentStep === 'institutional_subtype' || currentStep === 'recreational_subtype' || 
        currentStep === 'infrastructure_subtype' || currentStep === 'renovation_subtype') {
      setCurrentStep('commercial_subtype');
    } else if (currentStep.endsWith('_detail') && (
        currentStep.includes('industrial') || 
        currentStep.includes('manufacturing_facilities') ||
        currentStep.includes('warehousing_logistics') ||
        currentStep.includes('processing_plants') ||
        currentStep.includes('power_energy') ||
        currentStep.includes('refineries_extractive') ||
        currentStep.includes('fabrication_heavy') ||
        currentStep.includes('waste_water')
    )) { 
      setCurrentStep('industrial_subtype');
      setSelectedIndustrialDetail(null);
    } else if (currentStep.endsWith('_detail') && (
        currentStep.includes('civil') ||
        currentStep.includes('transportation_infrastructure') ||
        currentStep.includes('utilities_energy') ||
        currentStep.includes('environmental_public_works') ||
        currentStep.includes('urban_infrastructure') ||
        currentStep.includes('public_facilities')
    )) { 
        setCurrentStep('civil_subtype');
        setSelectedCivilDetail(null); 
    } else if (currentStep === 'commercial_subtype' || 
               currentStep === 'industrial_subtype' || 
               currentStep === 'civil_subtype') {
      setCurrentStep('type');
      setSelectedSubtype(null);
    } else if (currentStep === 'residential_subtype') {
      setCurrentStep('type');
      setSelectedSubtype(null);
    } else if (currentStep === 'type') {
      setCurrentStep('address');
      setSelectedType(null);
    } else if (currentStep === 'new_construction_type' || 
               currentStep === 'new_addition_type' ||
               currentStep === 'bathroom_remodel' || 
               currentStep === 'kitchen_measurements' || 
               currentStep === 'bedroom_measurements') {
      setCurrentStep('residential_subtype');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={goBack} disabled={currentStep === 'address'}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {currentStep === 'address' && (
        <AddressForm 
          address={address} 
          onAddressChange={handleAddressChange} 
          onSubmit={handleAddressSubmit} 
        />
      )}

      {currentStep === 'type' && (
        <ProjectTypeSelector 
          onSelectType={handleTypeSelect} 
          onBack={goBack} 
        />
      )}

      {currentStep === 'residential_subtype' && (
        <ResidentialSubtypes 
          onSelectSubtype={handleSubtypeSelect} 
          onBack={goBack} 
        />
      )}

      {currentStep === 'commercial_subtype' && (
        <CommercialSubtypes
          onSelectSubtype={handleCommercialSubtypeSelect}
          onBack={goBack}
        />
      )}

      {currentStep === 'industrial_subtype' && (
        <IndustrialSubtypes
          onSelectSubtype={handleIndustrialSubtypeSelect}
          onBack={goBack}
        />
      )}

      {currentStep === 'civil_subtype' && (
        <CivilSubtypes
          onSelectSubtype={handleCivilSubtypeSelect}
          onBack={goBack}
        />
      )}

      {currentStep === 'manufacturing_facilities_detail' && (
        <ManufacturingFacilitiesSubtypes
          onSelectSubtype={handleIndustrialDetailSelect}
          onBack={goBack}
        />
      )}
      {currentStep === 'warehousing_logistics_detail' && (
        <WarehousingLogisticsSubtypes
          onSelectSubtype={handleIndustrialDetailSelect}
          onBack={goBack}
        />
      )}
      {currentStep === 'processing_plants_detail' && (
        <ProcessingPlantsSubtypes
          onSelectSubtype={handleIndustrialDetailSelect}
          onBack={goBack}
        />
      )}
      {currentStep === 'power_energy_detail' && (
        <PowerEnergySubtypes
          onSelectSubtype={handleIndustrialDetailSelect}
          onBack={goBack}
        />
      )}
      {currentStep === 'refineries_extractive_detail' && (
        <RefineriesExtractiveSubtypes
          onSelectSubtype={handleIndustrialDetailSelect}
          onBack={goBack}
        />
      )}
      {currentStep === 'fabrication_heavy_detail' && (
        <FabricationHeavySubtypes
          onSelectSubtype={handleIndustrialDetailSelect}
          onBack={goBack}
        />
      )}
      {currentStep === 'waste_water_detail' && (
        <WasteWaterSubtypes
          onSelectSubtype={handleIndustrialDetailSelect}
          onBack={goBack}
        />
      )}

      {/* New Civil Detail Components */}
      {currentStep === 'transportation_infrastructure_detail' && (
        <TransportationInfrastructureSubtypes
          onSelectDetail={handleCivilDetailSelect}
          onBack={goBack}
        />
      )}
      {currentStep === 'utilities_energy_detail' && (
        <UtilitiesEnergySubtypes
          onSelectDetail={handleCivilDetailSelect}
          onBack={goBack}
        />
      )}
      {currentStep === 'environmental_public_works_detail' && (
        <EnvironmentalPublicWorksSubtypes
          onSelectDetail={handleCivilDetailSelect}
          onBack={goBack}
        />
      )}
      {currentStep === 'urban_infrastructure_detail' && (
        <UrbanInfrastructureSubtypes
          onSelectDetail={handleCivilDetailSelect}
          onBack={goBack}
        />
      )}
      {currentStep === 'public_facilities_detail' && (
        <PublicFacilitiesSubtypes
          onSelectDetail={handleCivilDetailSelect}
          onBack={goBack}
        />
      )}

      {currentStep === 'new_construction_type' && (
        <NewConstructionFlow 
          onSelect={handleNewConstructionTypeSelect} 
          onBack={goBack} 
        />
      )}

      {currentStep === 'new_addition_type' && (
        <NewAdditionFlow 
          onSelect={handleNewAdditionTypeSelect} 
          onBack={goBack} 
        />
      )}

      {currentStep === 'bathroom_remodel' && (
        <BathroomRemodel 
          onSelect={(type, details) => {
            navigate(createPageUrl('ProjectQuestionnaire', `type=${selectedType}&subtype=${type}&details=${encodeURIComponent(JSON.stringify(details))}&address=${encodeURIComponent(JSON.stringify(address))}`));
          }}
          onBack={goBack}
          address={address}
        />
      )}

      {currentStep === 'kitchen_measurements' && (
        <KitchenMeasurements 
          onContinue={(dimensions) => {
            navigate(createPageUrl('ProjectQuestionnaire', 
              `type=${selectedType}&subtype=${selectedSubtype}&dimensions=${encodeURIComponent(JSON.stringify(dimensions))}&address=${encodeURIComponent(JSON.stringify(address))}`
            ));
          }}
          onBack={goBack}
        />
      )}

      {currentStep === 'bedroom_measurements' && (
        <BedroomMeasurements 
          onContinue={(dimensions) => {
            navigate(createPageUrl('ProjectQuestionnaire', 
              `type=${selectedType}&subtype=${selectedSubtype}&dimensions=${encodeURIComponent(JSON.stringify(dimensions))}&address=${encodeURIComponent(JSON.stringify(address))}`
            ));
          }}
          onBack={goBack}
        />
      )}

      {currentStep === 'office_subtype' && (
        <OfficeSubtypes
          onSelectSubtype={handleOfficeSubtypeSelect}
          onBack={goBack}
        />
      )}

      {currentStep === 'retail_subtype' && (
        <RetailSubtypes
          onSelectSubtype={handleRetailSubtypeSelect}
          onBack={goBack}
        />
      )}

      {currentStep === 'institutional_subtype' && (
        <InstitutionalSubtypes
          onSelectSubtype={handleInstitutionalSubtypeSelect}
          onBack={goBack}
        />
      )}

      {currentStep === 'recreational_subtype' && (
        <RecreationalSubtypes
          onSelectSubtype={handleRecreationalSubtypeSelect}
          onBack={goBack}
        />
      )}

      {currentStep === 'infrastructure_subtype' && (
        <InfrastructureSubtypes
          onSelectSubtype={handleInfrastructureSubtypeSelect}
          onBack={goBack}
        />
      )}

      {currentStep === 'renovation_subtype' && (
        <RenovationSubtypes
          onSelectSubtype={handleRenovationSubtypeSelect}
          onBack={goBack}
        />
      )}
    </div>
  );
}