
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { FileText, CheckCircle, Plus, ArrowRight, Loader2, Circle, Building, UserPlus, Mail, Phone, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const specialtiesOptions = [
{ id: "general", label: "General Contractor" },
{ id: "plumbing", label: "Plumbing" },
{ id: "electrical", label: "Electrical" },
{ id: "carpentry", label: "Carpentry" },
{ id: "masonry", label: "Masonry" },
{ id: "roofing", label: "Roofing" },
{ id: "hvac", label: "HVAC" },
{ id: "painting", label: "Painting" },
{ id: "landscaping", label: "Landscaping" },
{ id: "flooring", label: "Flooring" },
{ id: "drywall", label: "Drywall" },
{ id: "framing", label: "Framing" },
{ id: "engineering", label: "Engineering" },
{ id: "architecture", label: "Architecture" },
{ id: "civil", label: "Civil" },
];

const stateLicenseRequirement = {
  AL: true, AK: false, AZ: true, AR: true, CA: true, CO: false, CT: false,
  DE: true, FL: true, GA: true, HI: true, ID: false, IL: false, IN: false,
  IA: false, KS: false, KY: false, LA: true, ME: false, MD: true, MA: true,
  MI: true, MN: false, MS: true, MO: false, MT: false, NE: false, NV: true,
  NH: false, NJ: true, NM: true, NY: false, NC: true, ND: false, OH: false,
  OK: false, OR: true, PA: false, RI: true, SC: true, SD: false, TN: true,
  TX: false, UT: true, VT: false, VA: true, WA: true, WV: true, WI: false,
  WY: false
};
const zipCodeLicenseRequirement = {
// Simulated mapping (in real scenario this would be fetched from API)
"77001": true, // license required
"90210": false, // no license required
};

export default function ContractorSignup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(location.state?.step || 1);
  const [loading, setLoading] = useState(false);
  const [licenseInfo, setLicenseInfo] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    zip_code: '',
    state: '',
    license_required: false,
    company_name: '',
    license_number: '',
    years_experience: '',
    specialties: [],
    description: '',
    service_area: '',
    insurance_info: '',
    availability: '',
    job_size_preference: '',
    use_subcontractors: false,
    google_review_link: '',
    yelp_review_link: '',
    portfolio_images: []
  });
  const [validationErrors, setValidationErrors] = useState([]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setLoading(true);
      try {
        // Here's a simplification - using a static mapping instead of AI
        // This makes the app more reliable and faster for demo purposes
        const requiresLicense = stateLicenseRequirement[value] || false;
        setLicenseInfo({
          requires_license: requiresLicense,
          license_types: requiresLicense ? ["General Contractor", "Residential Builder"] : [],
          licensing_authority: requiresLicense ? `${value} Contractors Board` : "",
          explanation: requiresLicense 
            ? `${value} requires contractors to obtain a state license before performing construction work.` 
            : `${value} does not require a state-level license for general contractors, but local permits may be required.`
        });
        
        setFormData(prev => ({
          ...prev,
          [name]: value,
          license_required: requiresLicense
        }));
      } catch (error) {
        console.error('Error checking license requirements:', error);
        setFormData(prev => ({
          ...prev,
          [name]: value,
          license_required: false
        }));
      } finally {
        setLoading(false);
      }
    } else if (name === "specialties") {
      const currentSpecialties = formData.specialties || [];
      const updatedSpecialties = currentSpecialties.includes(value)
        ? currentSpecialties.filter(s => s !== value)
        : [...currentSpecialties, value];
      setFormData(prev => ({ ...prev, specialties: updatedSpecialties }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Add the missing function for specialty change
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

  // Add the missing function for personal info submission
  const handleSubmitPersonalInfo = (e) => {
    e.preventDefault();
    // Update to redirect to OTP verification
    navigate(createPageUrl('ContractorOTPVerification'));
  };

  const handleSubmitBusinessInfo = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Clear previous errors
    setValidationErrors([]);

    // Validate required fields
    const errors = [];

    if (!formData.company_name) errors.push("Company Name is required.");
    if (formData.license_required && !formData.license_number) {
      errors.push("License Number is required in your state.");
    }
    if (!formData.years_experience) errors.push("Years of Experience is required.");
    if (!formData.service_area) errors.push("Service Area is required.");
    if (formData.specialties.length === 0) errors.push("Please select at least one area of expertise.");
    if (!formData.description) errors.push("Company Description is required.");

    if (errors.length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      await User.updateMyUserData({
        role_type: 'contractor',
        ...formData
      });

      setStep(3);
    } catch (error) {
      console.error('Error saving contractor data:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (location.state?.step) {
      setStep(location.state.step);
    }
  }, [location.state]);

  const renderStepOne = () => (
    <form onSubmit={handleSubmitPersonalInfo}>
      <CardHeader>
        <CardTitle className="text-2xl">Personal Information</CardTitle>
        <CardDescription>
          Tell us about yourself to create your contractor account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <div className="relative">
            <UserPlus className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="full_name"
              name="full_name"
              placeholder="John Smith"
              className="pl-10"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              className="pl-10"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              name="phone"
              placeholder="(555) 123-4567"
              className="pl-10"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="address"
              name="address"
              placeholder="123 Main St, City, State"
              className="pl-10"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zip_code">ZIP Code</Label>
          <Input
            id="zip_code"
            name="zip_code"
            placeholder="12345"
            value={formData.zip_code}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select
            value={formData.state}
            onValueChange={(value) => handleChange({ target: { name: 'state', value } })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(stateLicenseRequirement).map((st) => (
                <SelectItem key={st} value={st}>{st}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Next Step
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </form>
  );
useEffect(() => {
  const state = formData.state;
  if (state) {
    const requiresLicense = stateLicenseRequirement[state] || false;
    setLicenseInfo({
      requires_license: requiresLicense,
      license_types: requiresLicense ? ["General Contractor", "Residential Builder"] : [],
      licensing_authority: requiresLicense ? `${state} Contractors Board` : "",
      explanation: requiresLicense 
        ? `${state} requires contractors to obtain a state license before performing construction work.` 
        : `${state} does not require a state-level license for general contractors, but local permits may be required.`
    });
  }
}, [step]);

  const renderStepTwo = () => (
    <form onSubmit={handleSubmitBusinessInfo}>
      <CardHeader>
        <CardTitle className="text-2xl">Business Information</CardTitle>
        <CardDescription>
          Tell us about your business and areas of expertise
        </CardDescription>
      </CardHeader>

      {validationErrors.length > 0 && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-md mb-4">
          <ul className="list-disc list-inside text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <CardContent className="space-y-4">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name</Label>
          <div className="relative">
            <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="company_name"
              name="company_name"
              placeholder="Your Company LLC"
              className="pl-10"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* License Information Display */}
        {formData.state && licenseInfo && (
          <div className={`p-4 rounded-lg ${licenseInfo.requires_license ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
            <div className="flex items-start gap-3">
              {licenseInfo.requires_license ? (
                <FileText className="h-5 w-5 text-amber-500 mt-0.5" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              )}
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {licenseInfo.requires_license 
                    ? `${formData.state} requires contractor licensing` 
                    : `${formData.state} does not require general contractor licensing`
                  }
                </p>
                <p className="text-sm text-gray-600">{licenseInfo.explanation}</p>
                {licenseInfo.requires_license && (
                  <p className="text-sm text-gray-600">
                    Licensing Authority: {licenseInfo.licensing_authority}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* License Number Field - Only show if required */}
        {formData.state && licenseInfo?.requires_license && (
          <div className="space-y-2">
            <Label htmlFor="license_number">
              Contractor License Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="license_number"
              name="license_number"
              placeholder="Enter your license number"
              value={formData.license_number}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500">
              Your license will be verified with {licenseInfo.licensing_authority}
            </p>
          </div>
        )}

        {/* Rest of the form fields */}
        <div className="space-y-2">
          <Label htmlFor="insurance_info">Insurance Information</Label>
          <Input
            id="insurance_info"
            name="insurance_info"
            placeholder="Insurance policy number"
            value={formData.insurance_info}
            onChange={handleChange}
          />
        </div>

        {/* Years of Experience */}
        <div className="space-y-2">
          <Label htmlFor="years_experience">Years of Experience</Label>
          <Input
            id="years_experience"
            name="years_experience"
            type="number"
            min="1"
            placeholder="5"
            value={formData.years_experience}
            onChange={handleChange}
            required
          />
        </div>

        {/* Service Area */}
        <div className="space-y-2">
          <Label htmlFor="service_area">Service Area (miles)</Label>
          <Select
            value={formData.service_area}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, service_area: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 miles</SelectItem>
              <SelectItem value="10">10 miles</SelectItem>
              <SelectItem value="25">25 miles</SelectItem>
              <SelectItem value="50">50 miles</SelectItem>
              <SelectItem value="100">100+ miles</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Use Subcontractors */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_subcontractors"
            name="use_subcontractors"
            checked={formData.use_subcontractors}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, use_subcontractors: checked }))
            }
          />
          <Label htmlFor="use_subcontractors">I use subcontractors</Label>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <Label htmlFor="availability">Availability</Label>
          <Select
            value={formData.availability}
            onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="When can you start new projects?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediately">Immediately</SelectItem>
              <SelectItem value="next_week">Next Week</SelectItem>
              <SelectItem value="next_month">Next Month</SelectItem>
              <SelectItem value="next_3_months">Next 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Size Preference */}
        <div className="space-y-2">
          <Label htmlFor="job_size_preference">Preferred Project Size</Label>
          <Select
            value={formData.job_size_preference}
            onValueChange={(value) => setFormData(prev => ({ ...prev, job_size_preference: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select preferred project size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="less_than_10k">Less than $10,000</SelectItem>
              <SelectItem value="10k_to_50k">$10,000 - $50,000</SelectItem>
              <SelectItem value="50k_to_100k">$50,000 - $100,000</SelectItem>
              <SelectItem value="more_than_100k">More than $100,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Google Reviews */}
        <div className="space-y-2">
          <Label htmlFor="google_review_link">Google Review Link</Label>
          <Input
            id="google_review_link"
            name="google_review_link"
            placeholder="https://g.page/yourbusiness"
            value={formData.google_review_link}
            onChange={handleChange}
          />
        </div>

        {/* Yelp Reviews */}
        <div className="space-y-2">
          <Label htmlFor="yelp_review_link">Yelp Review Link</Label>
          <Input
            id="yelp_review_link"
            name="yelp_review_link"
            placeholder="https://yelp.com/biz/yourbusiness"
            value={formData.yelp_review_link}
            onChange={handleChange}
          />
        </div>

        {/* Areas of Expertise */}
        <div className="space-y-2">
          <Label>Areas of Expertise</Label>
          <div className="grid grid-cols-2 gap-2">
            {specialtiesOptions.map((specialty) => (
              <div key={specialty.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`specialty-${specialty.id}`}
                  checked={formData.specialties?.includes(specialty.id)}
                  onCheckedChange={() => handleSpecialtyChange(specialty.id)}
                />
                <label
                  htmlFor={`specialty-${specialty.id}`}
                  className="text-sm cursor-pointer"
                >
                  {specialty.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Company Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Company Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Tell potential clients about your company, experience, and what makes you unique..."
            value={formData.description}
            onChange={handleChange}
            className="min-h-[100px]"
            required
          />
        </div>

        {/* Portfolio Upload */}
        <div className="space-y-2">
          <Label htmlFor="portfolio_images">Portfolio Images (optional)</Label>
          <Input
            id="portfolio_images"
            name="portfolio_images"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                portfolio_images: Array.from(e.target.files),
              }))
            }
          />
          <p className="text-sm text-muted-foreground">
            You can upload photos of past projects now or do it later in your profile.
          </p>

          {/* Thumbnails */}
          {formData.portfolio_images?.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {formData.portfolio_images.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`portfolio-${index}`}
                  className="w-full h-24 object-cover rounded-md border"
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(1)}
          className="w-full sm:w-auto"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Create Contractor Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </form>
  );

  const renderStepThree = () => (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Account Created Successfully!</CardTitle>
        <CardDescription>
          You're ready to start receiving project invitations and matching with clients.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-gray-600">
          Your contractor profile is now active. You can manage your profile, upload your portfolio, and start accepting new projects.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={() => navigate(createPageUrl('ContractorDashboard'))}
        >
          Go to Contractor Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </>
  );

  return (
    <div className="max-w-md mx-auto py-12">
      <Card>
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderStepThree()}
      </Card>
    </div>
  );
}
