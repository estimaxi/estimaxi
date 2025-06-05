
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Loader2, Upload, Camera, PlusCircle, Building, MapPin, Star, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Instagram, Facebook, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export default function ContractorProfileBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    legal_structure: '',
    company_type: '',
    license_number: '',
    years_experience: '',
    service_area: '',
    specialties: [],
    insurance_company: '',
    insurance_policy_number: '',
    has_insurance: true,
    business_model: '',
    availability: '',
    preferred_project_size: '',
    google_link: '',
    facebook_link: '',
    instagram_link: '',
    tiktok_link: '',
    description: '',
    profile_picture: null,
    portfolio_images: []
  });
  const [showNoInsuranceDialog, setShowNoInsuranceDialog] = useState(false);

  const [profilePreview, setProfilePreview] = useState(null);
  const [portfolioPreviews, setPortfolioPreviews] = useState([]);

  const totalSteps = 11;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.company_name) {
      return;
    }
    
    if (step === 3 && formData.insurance_company && formData.insurance_policy_number) {
      setStep(4);
    } else if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const [profileComplete, setProfileComplete] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfileComplete(true);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProgress = () => {
    const progress = (step / totalSteps) * 100;
    return (
      <div className="mb-8">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-2 flex justify-between">
          <span>Step {step} of {totalSteps}</span>
          <span>Your company profile</span>
        </div>
      </div>
    );
  };

  const legalStructures = [
    { id: 'llc', name: 'LLC (Limited Liability Company)' },
    { id: 's_corp', name: 'S-Corporation' },
    { id: 'c_corp', name: 'C-Corporation' },
    { id: 'sole_prop', name: 'Sole Proprietorship' },
    { id: 'partnership', name: 'Partnership' },
    { id: 'other', name: 'Other' }
  ];

  const handleSkipInsurance = () => {
    setShowNoInsuranceDialog(true);
  };

  const handleProceedWithoutInsurance = () => {
    setFormData(prev => ({
      ...prev,
      has_insurance: false,
      insurance_company: '',
      insurance_policy_number: ''
    }));
    setShowNoInsuranceDialog(false);
    setStep(4);
  };
  
  const handleFindInsurance = () => {
    setShowNoInsuranceDialog(false);
    window.open('https://www.statefarm.com/small-business-solutions/insurance/contractors', '_blank');
  };

  const specialtiesOptions = [
    { id: "general", label: "General Contractor" },
    { id: "electrical", label: "Electrical" },
    { id: "plumbing", label: "Plumbing" },
    { id: "carpentry", label: "Carpentry" },
    { id: "masonry", label: "Masonry" },
    { id: "roofing", label: "Roofing" },
    { id: "hvac", label: "HVAC" },
    { id: "painting", label: "Painting" },
    { id: "landscaping", label: "Landscaping" },
    { id: "flooring", label: "Flooring" },
    { id: "drywall", label: "Drywall" },
    { id: "framing", label: "Framing" },
    { id: "engineering", label: "Structural Engineering" },
    { id: "architecture", label: "Architecture" },
    { id: "civil", label: "Civil Engineering" },
    { id: "mep", label: "MEP" },
    { id: "other", label: "Other" }
  ];

  const handleSpecialtyChange = (specialty) => {
    setFormData(prev => {
      const currentSpecialties = prev.specialties || [];
      if (currentSpecialties.includes(specialty)) {
        return {
          ...prev,
          specialties: currentSpecialties.filter(s => s !== specialty)
        };
      } else {
        return {
          ...prev,
          specialties: [...currentSpecialties, specialty]
        };
      }
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profile_picture: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePortfolioImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      setFormData(prev => ({ 
        ...prev, 
        portfolio_images: [...prev.portfolio_images, ...files]
      }));
      
      const newPreviews = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          if (newPreviews.length === files.length) {
            setPortfolioPreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePortfolioImage = (index) => {
    setFormData(prev => ({
      ...prev,
      portfolio_images: prev.portfolio_images.filter((_, i) => i !== index)
    }));
    setPortfolioPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-8 text-center">What's your company's name?</h2>
            <Input
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              placeholder="Enter your company name"
              className="h-12 mt-2 max-w-sm w-full text-center text-lg"
              autoFocus
            />

            <div className="mt-8 w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-3">
                What is the legal structure of your company?
              </h3>
              <Select
                value={formData.legal_structure}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, legal_structure: value }))
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select company structure" />
                </SelectTrigger>
                <SelectContent>
                  {legalStructures.map((structure) => (
                    <SelectItem 
                      key={structure.id} 
                      value={structure.id}
                      className="py-3"
                    >
                      {structure.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleNext}
              disabled={!formData.company_name || !formData.legal_structure || loading}
              className="mt-8 bg-orange-500 hover:bg-orange-600 w-full max-w-sm h-12 text-lg"
            >
              Continue
            </Button>
          </div>
        );
      
      case 2:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-8 text-center">
              How many years of experience in construction does your company have?
            </h2>
            
            <div className="flex items-center max-w-sm w-full">
              <Button
                variant="outline"
                className="h-12 w-12 text-xl"
                onClick={() => {
                  if (Number(formData.years_experience) > 0) {
                    setFormData(prev => ({
                      ...prev,
                      years_experience: String(Number(prev.years_experience || 0) - 1)
                    }));
                  }
                }}
                disabled={!formData.years_experience || Number(formData.years_experience) <= 0}
              >
                -
              </Button>
              
              <Input
                name="years_experience"
                value={formData.years_experience}
                onChange={handleInputChange}
                type="number"
                min="0"
                className="h-12 mx-4 text-center text-xl"
                placeholder="0"
              />
              
              <Button
                variant="outline"
                className="h-12 w-12 text-xl"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    years_experience: String(Number(prev.years_experience || 0) + 1)
                  }));
                }}
              >
                +
              </Button>
            </div>
            
            <span className="text-gray-500 mt-2">
              {formData.years_experience 
                ? `${formData.years_experience} year${Number(formData.years_experience) !== 1 ? 's' : ''}`
                : 'Enter years of experience'
              }
            </span>
            
            <Button
              onClick={handleNext}
              disabled={!formData.years_experience || loading}
              className="mt-8 bg-orange-500 hover:bg-orange-600 w-full max-w-sm h-12 text-lg"
            >
              Continue
            </Button>
          </div>
        );
      
      case 3:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Please provide us with your insurance information
            </h2>
            
            <div className="space-y-4 w-full max-w-sm">
              <div>
                <label htmlFor="insurance_company" className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance company name
                </label>
                <Input
                  id="insurance_company"
                  name="insurance_company"
                  value={formData.insurance_company}
                  onChange={handleInputChange}
                  placeholder="e.g. State Farm, Allstate"
                  className="h-12"
                />
              </div>
              
              <div>
                <label htmlFor="insurance_policy_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance policy number
                </label>
                <Input
                  id="insurance_policy_number"
                  name="insurance_policy_number"
                  value={formData.insurance_policy_number}
                  onChange={handleInputChange}
                  placeholder="e.g. POL-12345678"
                  className="h-12"
                />
              </div>
            </div>
            
            <div className="mt-8 flex flex-col gap-3 w-full max-w-sm">
              <Button
                onClick={handleNext}
                disabled={!formData.insurance_company || !formData.insurance_policy_number || loading}
                className="bg-orange-500 hover:bg-orange-600 h-12 text-lg"
              >
                Continue
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSkipInsurance}
                className="h-12 text-lg"
              >
                I don't have insurance
              </Button>
            </div>

            <Dialog open={showNoInsuranceDialog} onOpenChange={setShowNoInsuranceDialog}>
              <DialogContent className="max-w-sm mx-auto">
                <div className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                    <svg 
                      className="w-8 h-8 text-amber-500"
                      fill="none" 
                      strokeWidth={2}
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Important Notice</h3>
                  <p className="text-gray-600 mb-6">
                    You can still proceed with creating your company's profile without insurance but note that not having insurance is a serious factor when project owners choose contractors.
                  </p>
                  <p className="text-gray-600 mb-6">
                    Consider purchasing an insurance package from a third party company (NEXT, Statefarm etc...) to have a stronger and more reliable company's profile.
                  </p>
                  <div className="flex flex-col gap-3 w-full">
                    <Button
                      onClick={handleFindInsurance}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Help me find the right insurance
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowNoInsuranceDialog(false)}
                      className="w-full"
                    >
                      Go Back
                    </Button>
                    <Button
                      onClick={handleProceedWithoutInsurance}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      Continue Without Insurance
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      
      case 4:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-8 text-center">
              What's the radius of your service area?
            </h2>
            
            <div className="w-full max-w-sm space-y-4">
              <Select
                value={formData.service_area}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, service_area: value }))
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select service radius" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Within 5 miles</SelectItem>
                  <SelectItem value="10">Within 10 miles</SelectItem>
                  <SelectItem value="25">Within 25 miles</SelectItem>
                  <SelectItem value="50">Within 50 miles</SelectItem>
                  <SelectItem value="75">Within 75 miles</SelectItem>
                  <SelectItem value="100">Within 100 miles</SelectItem>
                  <SelectItem value="unlimited">Unlimited / Willing to travel</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleNext}
                disabled={!formData.service_area || loading}
                className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg mt-6"
              >
                Continue
              </Button>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-8 text-center">
              What's your business model for construction projects?
            </h2>
            
            <div className="w-full max-w-sm space-y-4">
              {[
                {
                  id: 'subcontractors',
                  label: 'I use subcontractors',
                  description: 'I work with independent contractors for different aspects of projects'
                },
                {
                  id: 'in_house',
                  label: 'All of my employees are in-house',
                  description: 'I have a dedicated team of full-time employees'
                },
                {
                  id: 'hybrid',
                  label: 'I use subcontractors and in-house employees',
                  description: 'I maintain a core team and bring in contractors as needed'
                }
              ].map((option) => (
                <div
                  key={option.id}
                  className={`
                    relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${formData.business_model === option.id 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-orange-200'}
                  `}
                  onClick={() => setFormData(prev => ({ ...prev, business_model: option.id }))}
                >
                  <div className="flex items-center mb-2">
                    <div 
                      className={`
                        w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                        ${formData.business_model === option.id 
                          ? 'border-orange-500' 
                          : 'border-gray-300'}
                      `}
                    >
                      {formData.business_model === option.id && (
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                      )}
                    </div>
                    <span className="font-medium text-lg">{option.label}</span>
                  </div>
                  <p className="text-gray-600 text-sm ml-8">
                    {option.description}
                  </p>
                </div>
              ))}

              <Button
                onClick={handleNext}
                disabled={!formData.business_model || loading}
                className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg mt-6"
              >
                Continue
              </Button>
            </div>
          </div>
        );
      
      case 6:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-8 text-center">
              When can you start new projects?
            </h2>
            
            <div className="w-full max-w-sm space-y-3">
              {[
                {
                  id: 'immediately',
                  label: 'Immediately',
                  description: 'I can start right away'
                },
                {
                  id: 'within_week',
                  label: 'Within a week',
                  description: 'I can start in the next 7 days'
                },
                {
                  id: 'within_month',
                  label: 'Within a month',
                  description: 'I can start in the next 30 days'
                },
                {
                  id: 'within_3_6_months',
                  label: 'Within 3-6 months',
                  description: 'I can start in the next 3-6 months'
                },
                {
                  id: 'more_than_6_months',
                  label: 'More than 6 months',
                  description: 'I am currently fully booked'
                }
              ].map((option) => (
                <div
                  key={option.id}
                  className={`
                    relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${formData.availability === option.id 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-orange-200'}
                  `}
                  onClick={() => setFormData(prev => ({ ...prev, availability: option.id }))}
                >
                  <div className="flex items-center mb-1">
                    <div 
                      className={`
                        w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                        ${formData.availability === option.id 
                          ? 'border-orange-500' 
                          : 'border-gray-300'}
                      `}
                    >
                      {formData.availability === option.id && (
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                      )}
                    </div>
                    <span className="font-medium text-lg">{option.label}</span>
                  </div>
                  <p className="text-gray-500 text-sm ml-8">
                    {option.description}
                  </p>
                </div>
              ))}

              <Button
                onClick={handleNext}
                disabled={!formData.availability || loading}
                className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg mt-6"
              >
                Continue
              </Button>
            </div>
          </div>
        );
      
      case 7:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-8 text-center">
              What is your preferred project size?
            </h2>
            
            <div className="w-full max-w-sm space-y-3">
              {[
                {
                  id: 'less_than_10k',
                  label: 'Less than $10,000',
                  description: 'Smaller projects and repairs'
                },
                {
                  id: '10k_to_50k',
                  label: '$10,000 - $50,000',
                  description: 'Medium-sized remodels and renovations'
                },
                {
                  id: '50k_to_100k',
                  label: '$50,000 - $100,000',
                  description: 'Large renovations and small additions'
                },
                {
                  id: 'more_than_100k',
                  label: 'More than $100,000',
                  description: 'Major projects and new construction'
                }
              ].map((option) => (
                <div
                  key={option.id}
                  className={`
                    relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${formData.preferred_project_size === option.id 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-orange-200'}
                  `}
                  onClick={() => setFormData(prev => ({ ...prev, preferred_project_size: option.id }))}
                >
                  <div className="flex items-center mb-1">
                    <div 
                      className={`
                        w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                        ${formData.preferred_project_size === option.id 
                          ? 'border-orange-500' 
                          : 'border-gray-300'}
                      `}
                    >
                      {formData.preferred_project_size === option.id && (
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                      )}
                    </div>
                    <span className="font-medium text-lg">{option.label}</span>
                  </div>
                  <p className="text-gray-500 text-sm ml-8">
                    {option.description}
                  </p>
                </div>
              ))}

              <Button
                onClick={handleNext}
                disabled={!formData.preferred_project_size || loading}
                className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg mt-6"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Please share your social media links
            </h2>
            
            <div className="w-full max-w-sm space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Search className="w-5 h-5 text-red-500 mr-2" />
                    <label className="text-sm font-medium text-gray-700">
                      Google Reviews
                    </label>
                  </div>
                  <Input
                    name="google_link"
                    value={formData.google_link}
                    onChange={handleInputChange}
                    placeholder="https://g.page/yourbusiness"
                    className="h-12"
                  />
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Facebook className="w-5 h-5 text-blue-600 mr-2" />
                    <label className="text-sm font-medium text-gray-700">
                      Facebook
                    </label>
                  </div>
                  <Input
                    name="facebook_link"
                    value={formData.facebook_link}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/yourbusiness"
                    className="h-12"
                  />
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Instagram className="w-5 h-5 text-pink-600 mr-2" />
                    <label className="text-sm font-medium text-gray-700">
                      Instagram
                    </label>
                  </div>
                  <Input
                    name="instagram_link"
                    value={formData.instagram_link}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/yourbusiness"
                    className="h-12"
                  />
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <svg 
                      className="w-5 h-5 mr-2" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0011.14-4.02v-7a8.16 8.16 0 004.65 1.49v-3.88a4.85 4.85 0 01-1.2 0z"/>
                    </svg>
                    <label className="text-sm font-medium text-gray-700">
                      TikTok
                    </label>
                  </div>
                  <Input
                    name="tiktok_link"
                    value={formData.tiktok_link}
                    onChange={handleInputChange}
                    placeholder="https://tiktok.com/@yourbusiness"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleNext}
                  className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg"
                >
                  Continue
                </Button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  All social media links are optional
                </p>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-8 text-center">
              What are your areas of expertise?
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Select all that apply to your business
            </p>
            
            <div className="w-full max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {specialtiesOptions.map((specialty) => (
                  <div
                    key={specialty.id}
                    className={`
                      flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all
                      ${formData.specialties?.includes(specialty.id) 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-orange-200'}
                    `}
                    onClick={() => handleSpecialtyChange(specialty.id)}
                  >
                    <Checkbox
                      checked={formData.specialties?.includes(specialty.id)}
                      onCheckedChange={() => handleSpecialtyChange(specialty.id)}
                      className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                    <label className="text-sm font-medium cursor-pointer flex-1">
                      {specialty.label}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  onClick={handleNext}
                  disabled={!formData.specialties?.length || loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg"
                >
                  Continue
                </Button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Select at least one area of expertise
                </p>
              </div>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-4 text-center">
              Tell your potential clients about your company
            </h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              This is where you write about your company's strong advantages and why the clients should hire you for their project. Be authentic and creative!
            </p>
            
            <div className="w-full max-w-xl">
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Share your company's story, experience, and what makes you unique..."
                className="min-h-[200px] p-4 text-base"
              />

              <div className="mt-8">
                <Button
                  onClick={handleNext}
                  disabled={!formData.description || loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg"
                >
                  Continue
                </Button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Tell your story in a way that resonates with potential clients
                </p>
              </div>
            </div>
          </div>
        );

      case 11:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Add photos to showcase your work
            </h2>
            
            {/* Profile Picture Section */}
            <div className="w-full max-w-xl mb-10">
              <h3 className="text-xl font-semibold mb-4">Add your company logo or profile picture</h3>
              <p className="text-gray-600 mb-4">
                This will be the first image clients see when viewing your profile
              </p>
              
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {profilePreview ? (
                    <div className="w-40 h-40 rounded-full overflow-hidden">
                      <img 
                        src={profilePreview} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Camera className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-2 cursor-pointer shadow-md">
                    <Upload className="h-5 w-5 text-white" />
                    <input 
                      type="file" 
                      id="profile-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500 mb-10">
                <p>Placeholder: In the production app, this would upload to cloud storage</p>
              </div>
            </div>
            
            {/* Portfolio Images Section */}
            <div className="w-full max-w-xl">
              <h3 className="text-xl font-semibold mb-4">Add photos of your projects</h3>
              <p className="text-gray-600 mb-4">
                Showcase your best work to attract potential clients
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {/* Display portfolio previews */}
                {portfolioPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src={preview} 
                        alt={`Portfolio ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePortfolioImage(index)}
                    >
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                {/* Upload button */}
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <PlusCircle className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Add photos</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    multiple
                    onChange={handlePortfolioImagesChange}
                  />
                </label>
              </div>
              
              <div className="text-center text-sm text-gray-500 mb-8">
                <p>Placeholder: In the production app, images would be uploaded to cloud storage</p>
              </div>
              
              <Button
                onClick={handleSubmit}
                className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing Profile...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </Button>
            </div>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  const [showPreview, setShowPreview] = useState(false);

  if (profileComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-400 py-8 px-6 text-white relative">
              <div className="flex items-center">
                <div className="mr-6">
                  {profilePreview ? (
                    <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
                      <img 
                        src={profilePreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-white bg-opacity-30 flex items-center justify-center border-4 border-white">
                      <Building className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">{formData.company_name}</h1>
                  <div className="flex items-center text-white text-opacity-90 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Service area: {formData.service_area} miles</span>
                  </div>
                </div>
                <div className="absolute top-6 right-6">
                  <Button 
                    variant="outline" 
                    className="bg-white text-orange-500 hover:bg-orange-50"
                    onClick={() => setShowPreview(true)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </div>
              </div>
            </div>

            <div className="px-6 py-8">
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Company Info */}
                <div className="md:col-span-2 space-y-8">
                  <section>
                    <h2 className="text-xl font-semibold mb-4">About</h2>
                    <p className="text-gray-700">{formData.description}</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">Areas of Expertise</h2>
                    <div className="flex flex-wrap gap-2">
                      {formData.specialties?.map((specialty, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                        >
                          {specialtiesOptions.find(s => s.id === specialty)?.label || specialty}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
                    {portfolioPreviews.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {portfolioPreviews.map((preview, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                            <img 
                              src={preview} 
                              alt={`Portfolio ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No portfolio images added</p>
                    )}
                  </section>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-5">
                    <h3 className="font-medium mb-4">Business Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Business Model</p>
                        <p className="font-medium">
                          {formData.business_model === 'subcontractors' && 'Uses Subcontractors'}
                          {formData.business_model === 'in_house' && 'All In-house Employees'}
                          {formData.business_model === 'hybrid' && 'Hybrid (In-house & Subcontractors)'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Years of Experience</p>
                        <p className="font-medium">{formData.years_experience} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Insurance</p>
                        <p className="font-medium">
                          {formData.insurance_company ? 
                            `Insured by ${formData.insurance_company}` : 
                            'Not insured'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-5">
                    <h3 className="font-medium mb-4">Project Preferences</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Availability</p>
                        <p className="font-medium">
                          {formData.availability === 'immediately' && 'Available immediately'}
                          {formData.availability === 'within_week' && 'Within a week'}
                          {formData.availability === 'within_month' && 'Within a month'}
                          {formData.availability === 'within_3_6_months' && 'Within 3-6 months'}
                          {formData.availability === 'more_than_6_months' && 'More than 6 months'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Preferred Project Size</p>
                        <p className="font-medium">
                          {formData.preferred_project_size === 'less_than_10k' && 'Less than $10,000'}
                          {formData.preferred_project_size === '10k_to_50k' && '$10,000 - $50,000'}
                          {formData.preferred_project_size === '50k_to_100k' && '$50,000 - $100,000'}
                          {formData.preferred_project_size === 'more_than_100k' && 'More than $100,000'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-5">
                    <h3 className="font-medium mb-4">Contact & Social</h3>
                    <div className="space-y-3">
                      {formData.google_link && (
                        <a href={formData.google_link} target="_blank" rel="noopener noreferrer" 
                           className="flex items-center text-blue-600 hover:underline">
                          <Search className="h-4 w-4 mr-2 text-red-500" />
                          Google Reviews
                        </a>
                      )}
                      {formData.facebook_link && (
                        <a href={formData.facebook_link} target="_blank" rel="noopener noreferrer"
                           className="flex items-center text-blue-600 hover:underline">
                          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                          Facebook
                        </a>
                      )}
                      {formData.instagram_link && (
                        <a href={formData.instagram_link} target="_blank" rel="noopener noreferrer"
                           className="flex items-center text-blue-600 hover:underline">
                          <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                          Instagram
                        </a>
                      )}
                      {formData.tiktok_link && (
                        <a href={formData.tiktok_link} target="_blank" rel="noopener noreferrer"
                           className="flex items-center text-blue-600 hover:underline">
                          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0011.14-4.02v-7a8.16 8.16 0 004.65 1.49v-3.88a4.85 4.85 0 01-1.2 0z"/>
                          </svg>
                          TikTok
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setProfileComplete(false)}
            >
              Edit Profile
            </Button>
            
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => navigate(createPageUrl('ContractorExplainerVideo'))}
            >
              Go to Video Tutorial
            </Button>
          </div>
        </div>

        {/* Preview Modal */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-3xl h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Client View</DialogTitle>
              <DialogDescription>This is how project owners will see your profile</DialogDescription>
            </DialogHeader>
            
            <div className="pt-4">
              {/* Company Header */}
              <div className="flex items-center mb-6">
                {profilePreview ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img 
                      src={profilePreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                    <Building className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                
                <div>
                  <h2 className="text-xl font-bold">{formData.company_name || "Company Name"}</h2>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Service area: {formData.service_area || "0"} miles</span>
                    <span className="mx-2">•</span>
                    <span>{formData.years_experience || "0"} years experience</span>
                  </div>
                </div>
              </div>
              
              {/* Rating Preview (simulated) */}
              <div className="flex items-center mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={i < 4 ? "h-5 w-5 fill-yellow-400 text-yellow-400" : "h-5 w-5 text-gray-300"} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  4.0 (0 reviews)
                </span>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-gray-700">{formData.description || "No description provided."}</p>
              </div>
              
              {/* Specialties */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.specialties?.length > 0 ? (
                    formData.specialties.map((specialty, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {specialtiesOptions.find(s => s.id === specialty)?.label || specialty}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">No specialties selected</span>
                  )}
                </div>
              </div>
              
              {/* Portfolio */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Portfolio</h3>
                {portfolioPreviews.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {portfolioPreviews.map((preview, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={preview} 
                          alt={`Portfolio ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No portfolio images available</p>
                )}
              </div>
              
              {/* Business Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-3">
                    <p className="text-sm text-gray-500">Business Model</p>
                    <p>
                      {formData.business_model === 'subcontractors' && 'Uses Subcontractors'}
                      {formData.business_model === 'in_house' && 'All In-house Employees'}
                      {formData.business_model === 'hybrid' && 'Hybrid Model'}
                      {!formData.business_model && 'Not specified'}
                    </p>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="text-sm text-gray-500">Availability</p>
                    <p>
                      {formData.availability === 'immediately' && 'Available Immediately'}
                      {formData.availability === 'within_week' && 'Within a week'}
                      {formData.availability === 'within_month' && 'Within a month'}
                      {formData.availability === 'within_3_6_months' && 'Within 3-6 months'}
                      {formData.availability === 'more_than_6_months' && 'More than 6 months'}
                      {!formData.availability && 'Not specified'}
                    </p>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="text-sm text-gray-500">Preferred Project Size</p>
                    <p>
                      {formData.preferred_project_size === 'less_than_10k' && 'Less than $10,000'}
                      {formData.preferred_project_size === '10k_to_50k' && '$10,000 - $50,000'}
                      {formData.preferred_project_size === '50k_to_100k' && '$50,000 - $100,000'}
                      {formData.preferred_project_size === 'more_than_100k' && 'More than $100,000'}
                      {!formData.preferred_project_size && 'Not specified'}
                    </p>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="text-sm text-gray-500">Insurance</p>
                    <p>{formData.insurance_company ? `Yes - ${formData.insurance_company}` : 'Not insured'}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-gray-500 text-sm mt-8">
                <p>This preview shows how your profile appears to potential clients</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b px-4 py-3 flex items-center">
        <button 
          onClick={handleBack}
          className="p-2 -ml-2"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-medium flex-1 text-center mr-8">Build your company profile</h1>
      </div>

      <div className="flex-1 p-6">
        {renderProgress()}
        
        <div className="bg-white rounded-lg shadow p-6">
          {renderStep()}
        </div>
      </div>

      {step !== 1 && (
        <div className="bg-white border-t p-4 flex justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : step === totalSteps ? (
              "Finish"
            ) : (
              <>
                Continue
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
