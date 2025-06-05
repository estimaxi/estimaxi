import { getMultiplierForLocation } from './EstimationEngine';
import { calculateKitchenEstimateLineItems } from './KitchenEstimator';
import { calculateBathroomEstimateLineItems } from './BathroomEstimator';

// --- Configuration ---
// These could eventually be fetched from a settings entity or be more dynamic
const DEFAULT_OVERHEAD_RATE = 0.15; // 15%
const DEFAULT_TAX_RATE = 0.08;    // 8% (Example, varies by location)

/**
 * Orchestrates the full estimation process for a project.
 * 
 * @param {Object} projectDetails - Contains all data from the questionnaire.
 *   Expected structure:
 *   {
 *     type: 'residential' | 'commercial',
 *     subtype: 'kitchen_remodel' | 'bathroom_remodel' | ...,
 *     address: { street_number, street_name, city, state, zip_code },
 *     questionnaire_answers: { ...specific answers for the subtype... }
 *   }
 * @returns {Promise<Object|null>} A structured estimate object or null if critical error.
 */
export async function calculateProjectEstimate(projectDetails) {
    if (!projectDetails || !projectDetails.type || !projectDetails.subtype || !projectDetails.address) {
        console.error("calculateProjectEstimate: Missing critical project details.");
        return null;
    }

    let rawLineItems = [];
    const { type, subtype, address, questionnaire_answers } = projectDetails;

    try {
        // 1. Get raw line items from the specific estimator
        if (subtype === 'kitchen_remodel') {
            rawLineItems = await calculateKitchenEstimateLineItems(questionnaire_answers, address);
        } else if (subtype === 'bathroom_remodel') {
            rawLineItems = await calculateBathroomEstimateLineItems(questionnaire_answers, address);
        } else {
            console.error(`Unsupported project subtype for estimation: ${subtype}`);
            // For unsupported types, return a minimal estimate object or handle as error
            return {
                projectDetails,
                lineItems: [],
                subTotalBeforeMultiplier: 0,
                regionalMultiplier: 1,
                subTotal: 0,
                overheadRate: DEFAULT_OVERHEAD_RATE,
                overheadAmount: 0,
                totalBeforeTax: 0,
                taxRate: DEFAULT_TAX_RATE,
                taxAmount: 0,
                totalEstimate: 0,
                assumptions: [`Estimation for '${subtype.replace(/_/g, ' ')}' is not yet fully implemented.`],
                summary: "Basic project placeholder."
            };
        }

        if (!rawLineItems) {
            console.error("Specific estimator did not return line items for subtype:", subtype);
            rawLineItems = []; // Ensure it's an array
        }
        
        // 2. Calculate Subtotal before regional multiplier
        const subTotalBeforeMultiplier = rawLineItems.reduce((sum, item) => sum + (item.totalCost || 0), 0);

        // 3. Get Regional Multiplier
        const regionalMultiplier = await getMultiplierForLocation(address.state, address.city);

        // 4. Apply Regional Multiplier to each line item and calculate new subtotal
        const adjustedLineItems = rawLineItems.map(item => ({
            ...item,
            unitCost: (item.unitCost || 0) * regionalMultiplier,
            totalCost: (item.totalCost || 0) * regionalMultiplier,
        }));
        const subTotal = adjustedLineItems.reduce((sum, item) => sum + (item.totalCost || 0), 0);

        // 5. Calculate Overhead
        const overheadRate = DEFAULT_OVERHEAD_RATE; // Could be dynamic later
        const overheadAmount = subTotal * overheadRate;

        // 6. Calculate Total Before Tax
        const totalBeforeTax = subTotal + overheadAmount;

        // 7. Calculate Tax
        const taxRate = DEFAULT_TAX_RATE; // Could be dynamic or based on location later
        const taxAmount = totalBeforeTax * taxRate;

        // 8. Calculate Final Total Estimate
        const totalEstimate = totalBeforeTax + taxAmount;

        // 9. Define Assumptions and Summary (can be made more dynamic)
        const assumptions = [
            `Prices are based on standard quality materials and finishes unless otherwise specified.`,
            `Regional cost multiplier of ${regionalMultiplier.toFixed(3)} for ${address.city}, ${address.state} has been applied.`,
            `Assumes unobstructed access and normal working hours.`,
            `Does not include costs for permits, unforeseen structural issues, or hazardous material abatement unless explicitly stated.`,
            `Overhead & Profit at ${(overheadRate * 100).toFixed(0)}%.`,
            `Sales tax at ${(taxRate * 100).toFixed(1)}% applied to total before tax.`
        ];
        if (rawLineItems.some(item => item.notes && item.notes.includes("Pricing code not found"))) {
            assumptions.push("One or more items could not be priced automatically due to missing pricing codes. The estimate may be incomplete or require manual adjustment for these items.");
        }

        const summary = `This estimate for a ${subtype.replace(/_/g, ' ')} project at ${address.street_number} ${address.street_name}, ${address.city}, ${address.state} ${address.zip_code} includes material and labor costs, adjusted for regional pricing, plus standard overhead and estimated sales tax.`;
        
        return {
            projectDetails,
            lineItems: adjustedLineItems,
            subTotalBeforeMultiplier, // For display purposes, to show effect of multiplier
            regionalMultiplier,
            subTotal, // This is after multiplier
            overheadRate,
            overheadAmount,
            totalBeforeTax,
            taxRate,
            taxAmount,
            totalEstimate,
            assumptions,
            summary
        };

    } catch (error) {
        console.error("Error in calculateProjectEstimate:", error);
        // Return a structure that can be handled by the results page, indicating an error
        return {
            projectDetails,
            lineItems: [],
            error: `An unexpected error occurred while generating the estimate: ${error.message}. Please try again or contact support.`,
            subTotal: 0,
            totalEstimate: 0,
            assumptions: ["Estimate generation failed due to an internal error."],
            summary: "Failed to generate estimate."
        };
    }
}