
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  Building,
  Save,
  Loader2,
  FileText,
  CheckCircle,
  PlusCircle,
  X,
  UploadCloud
} from "lucide-react";

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

export default function ContractorProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    company_name: '',
    description: '',
    specialties: [],
    service_area: '',
    insurance_info: '',
    availability: '',
    job_size_preference: '',
    use_subcontractors: false,
    google_review_link: '',
    yelp_review_link: '',
    license_number: '',
    portfolio_images: [],
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await User.me();
      setProfile({
        company_name: userData.company_name || '',
        description: userData.description || '',
        specialties: userData.specialties || [],
        service_area: userData.service_area || '',
        insurance_info: userData.insurance_info || '',
        availability: userData.availability || '',
        job_size_preference: userData.job_size_preference || '',
        use_subcontractors: userData.use_subcontractors || false,
        google_review_link: userData.google_review_link || '',
        yelp_review_link: userData.yelp_review_link || '',
        license_number: userData.license_number || '',
        portfolio_images: userData.portfolio_images || [],
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialtyChange = (specialty) => {
    setProfile(prev => {
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

  const handleSave = async () => {
    setSaving(true);
    try {
      await User.updateMyUserData(profile);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const [newImages, setNewImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const handleRemoveImage = (index, type) => {
    if (type === 'new') {
      setNewImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setProfile(prev => ({
        ...prev,
        portfolio_images: prev.portfolio_images.filter((_, i) => i !== index)
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contractor Profile</h1>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-green-600 hover:bg-green-700"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              Update your company details and business preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="company_name"
                  value={profile.company_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, company_name: e.target.value }))}
                  className="pl-10"
                  placeholder="Your Company Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                value={profile.description}
                onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Tell clients about your company..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Areas of Expertise</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {specialtiesOptions.map((specialty) => (
                  <div key={specialty.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`specialty-${specialty.id}`}
                      checked={profile.specialties?.includes(specialty.id)}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service_area">Service Area</Label>
                <Select
                  value={profile.service_area}
                  onValueChange={(value) => setProfile(prev => ({ ...prev, service_area: value }))}
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

              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={profile.availability}
                  onValueChange={(value) => setProfile(prev => ({ ...prev, availability: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="When can you start?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediately">Immediately</SelectItem>
                    <SelectItem value="next_week">Next Week</SelectItem>
                    <SelectItem value="next_month">Next Month</SelectItem>
                    <SelectItem value="next_3_months">Next 3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_size_preference">Preferred Project Size</Label>
                <Select
                  value={profile.job_size_preference}
                  onValueChange={(value) => setProfile(prev => ({ ...prev, job_size_preference: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less_than_10k">Less than $10,000</SelectItem>
                    <SelectItem value="10k_to_50k">$10,000 - $50,000</SelectItem>
                    <SelectItem value="50k_to_100k">$50,000 - $100,000</SelectItem>
                    <SelectItem value="more_than_100k">More than $100,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="insurance_info">Insurance Information</Label>
                <Input
                  id="insurance_info"
                  value={profile.insurance_info}
                  onChange={(e) => setProfile(prev => ({ ...prev, insurance_info: e.target.value }))}
                  placeholder="Insurance policy number"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="use_subcontractors"
                checked={profile.use_subcontractors}
                onCheckedChange={(checked) => setProfile(prev => ({ ...prev, use_subcontractors: checked }))}
              />
              <Label htmlFor="use_subcontractors">I use subcontractors</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Images</CardTitle>
            <CardDescription>
              Showcase your best work to potential clients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.portfolio_images && profile.portfolio_images.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Current Portfolio</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {profile.portfolio_images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url || image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-40 object-cover rounded-md border"
                      />
                      <button
                        onClick={() => handleRemoveImage(index, 'existing')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {newImages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">New Uploads</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {newImages.map((file, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New upload ${index + 1}`}
                        className="w-full h-40 object-cover rounded-md border"
                      />
                      <button
                        onClick={() => handleRemoveImage(index, 'new')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <Label htmlFor="new_portfolio_images">Add New Images</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="new_portfolio_images" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-700">
                      Drag and drop files, or click to browse
                    </span>
                    <Input
                      id="new_portfolio_images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Online Presence</CardTitle>
            <CardDescription>
              Link your online reviews and social media profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="google_review_link">Google Reviews Link</Label>
              <Input
                id="google_review_link"
                value={profile.google_review_link}
                onChange={(e) => setProfile(prev => ({ ...prev, google_review_link: e.target.value }))}
                placeholder="https://g.page/yourbusiness"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yelp_review_link">Yelp Reviews Link</Label>
              <Input
                id="yelp_review_link"
                value={profile.yelp_review_link}
                onChange={(e) => setProfile(prev => ({ ...prev, yelp_review_link: e.target.value }))}
                placeholder="https://yelp.com/biz/yourbusiness"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
