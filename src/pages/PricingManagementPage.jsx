import React, { useState, useEffect } from 'react';
import { GlobalPricingData } from '@/api/entities';
import { RegionalMultiplierData } from '@/api/entities';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast"; // Assuming useToast is available

// Define fixed config names to manage a single record for each type
const PRICING_CONFIG_NAME = "active_pricing_config";
const MULTIPLIER_CONFIG_NAME = "active_multiplier_config";

export default function PricingManagementPage() {
  const [pricingJson, setPricingJson] = useState('');
  const [multipliersJson, setMultipliersJson] = useState('');
  const [pricingConfigId, setPricingConfigId] = useState(null);
  const [multiplierConfigId, setMultiplierConfigId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast ? useToast() : { toast: (m) => console.log(m.title, m.description) }; // Fallback for toast

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load Global Pricing Data
        const pricingResults = await GlobalPricingData.filter({ config_name: PRICING_CONFIG_NAME });
        if (pricingResults.length > 0) {
          setPricingJson(pricingResults[0].pricing_json);
          setPricingConfigId(pricingResults[0].id);
        }

        // Load Regional Multiplier Data
        const multiplierResults = await RegionalMultiplierData.filter({ config_name: MULTIPLIER_CONFIG_NAME });
        if (multiplierResults.length > 0) {
          setMultipliersJson(multiplierResults[0].multipliers_json);
          setMultiplierConfigId(multiplierResults[0].id);
        }
      } catch (error) {
        console.error("Error loading pricing data:", error);
        toast({ title: "Error", description: "Failed to load existing pricing data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [toast]);

  const isValidJson = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  const handleSavePricingData = async () => {
    if (!pricingJson.trim()) {
      toast({ title: "Validation Error", description: "Pricing JSON cannot be empty.", variant: "destructive" });
      return;
    }
    if (!isValidJson(pricingJson)) {
      toast({ title: "Validation Error", description: "The entered pricing data is not valid JSON.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      if (pricingConfigId) {
        await GlobalPricingData.update(pricingConfigId, { pricing_json: pricingJson });
      } else {
        const newConfig = await GlobalPricingData.create({ config_name: PRICING_CONFIG_NAME, pricing_json: pricingJson });
        setPricingConfigId(newConfig.id);
      }
      toast({ title: "Success", description: "Global pricing data saved successfully." });
    } catch (error) {
      console.error("Error saving pricing data:", error);
      toast({ title: "Error", description: "Failed to save global pricing data.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMultipliersData = async () => {
    if (!multipliersJson.trim()) {
      toast({ title: "Validation Error", description: "Multipliers JSON cannot be empty.", variant: "destructive" });
      return;
    }
    if (!isValidJson(multipliersJson)) {
      toast({ title: "Validation Error", description: "The entered multipliers data is not valid JSON.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    try {
      if (multiplierConfigId) {
        await RegionalMultiplierData.update(multiplierConfigId, { multipliers_json: multipliersJson });
      } else {
        const newConfig = await RegionalMultiplierData.create({ config_name: MULTIPLIER_CONFIG_NAME, multipliers_json: multipliersJson });
        setMultiplierConfigId(newConfig.id);
      }
      toast({ title: "Success", description: "Regional multiplier data saved successfully." });
    } catch (error) {
      console.error("Error saving multipliers data:", error);
      toast({ title: "Error", description: "Failed to save regional multiplier data.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Manage Pricing Data</CardTitle>
          <CardDescription>
            Paste your JSON content for global project pricing and regional multipliers.
            This data will be used in the estimation process.
          </CardDescription>
        </CardHeader>
      </Card>

      {isLoading && <p>Loading existing configurations...</p>}

      {!isLoading && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Global Pricing Data</CardTitle>
              <CardDescription>Paste the entire JSON for your itemized pricing list.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="pricingJson">Pricing JSON</Label>
              <Textarea
                id="pricingJson"
                value={pricingJson}
                onChange={(e) => setPricingJson(e.target.value)}
                placeholder='{ "item": "cost", ... }'
                className="min-h-[300px] font-mono text-sm"
              />
              <Button onClick={handleSavePricingData} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Global Pricing Data"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Multipliers Data</CardTitle>
              <CardDescription>Paste the entire JSON for regional cost multipliers (e.g., by ZIP code or state).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="multipliersJson">Multipliers JSON</Label>
              <Textarea
                id="multipliersJson"
                value={multipliersJson}
                onChange={(e) => setMultipliersJson(e.target.value)}
                placeholder='{ "region_identifier": "multiplier", ... }'
                className="min-h-[200px] font-mono text-sm"
              />
              <Button onClick={handleSaveMultipliersData} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Regional Multipliers"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}