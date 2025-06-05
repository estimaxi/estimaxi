import { GlobalPricingData } from '@/api/entities';
import { RegionalMultiplierData } from '@/api/entities';

// Configuration name for active pricing data. This should match what's saved in the database.
// TODO: Make this configurable or dynamically fetched if multiple versions exist.
const ACTIVE_PRICING_CONFIG_NAME = 'active_v1'; 

let CACHED_PRICING_DATA = null;
let CACHED_MULTIPLIER_DATA = null;

/**
 * Fetches and parses the global pricing data from the database.
 * Caches the data after the first fetch to improve performance.
 * @returns {Promise<Array<Object>|null>} Parsed pricing data array or null if error/not found.
 */
export async function getGlobalPricing() {
    if (CACHED_PRICING_DATA) {
        return CACHED_PRICING_DATA;
    }

    try {
        const records = await GlobalPricingData.filter({ config_name: ACTIVE_PRICING_CONFIG_NAME });
        if (records && records.length > 0) {
            const pricingJsonString = records[0].pricing_json;
            if (pricingJsonString) {
                CACHED_PRICING_DATA = JSON.parse(pricingJsonString);
                return CACHED_PRICING_DATA;
            }
        }
        console.error('GlobalPricingData not found or pricing_json is empty for config:', ACTIVE_PRICING_CONFIG_NAME);
        return null;
    } catch (error) {
        console.error('Error fetching or parsing global pricing data:', error);
        return null;
    }
}

/**
 * Fetches and parses the regional multiplier data from the database.
 * Caches the data after the first fetch.
 * @returns {Promise<Array<Object>|null>} Parsed multiplier data array or null if error/not found.
 */
export async function getRegionalMultipliers() {
    if (CACHED_MULTIPLIER_DATA) {
        return CACHED_MULTIPLIER_DATA;
    }

    try {
        const records = await RegionalMultiplierData.filter({ config_name: ACTIVE_PRICING_CONFIG_NAME }); // Assuming same config name for simplicity
        if (records && records.length > 0) {
            const multipliersJsonString = records[0].multipliers_json;
            if (multipliersJsonString) {
                CACHED_MULTIPLIER_DATA = JSON.parse(multipliersJsonString);
                return CACHED_MULTIPLIER_DATA;
            }
        }
        console.error('RegionalMultiplierData not found or multipliers_json is empty for config:', ACTIVE_PRICING_CONFIG_NAME);
        return null;
    } catch (error) {
        console.error('Error fetching or parsing regional multiplier data:', error);
        return null;
    }
}

/**
 * Finds a specific pricing item by its code.
 * @param {string} itemCode - The code of the item to find.
 * @returns {Promise<Object|null>} The pricing item object or null if not found.
 */
export async function findPriceItemByCode(itemCode) {
    const pricingData = await getGlobalPricing();
    if (!pricingData) return null;
    return pricingData.find(item => item.Code === itemCode) || null;
}

/**
 * Finds regional multiplier for a given state and city.
 * Falls back to state-level "Other" or general "Other" if specific city not found.
 * @param {string} state - The state abbreviation (e.g., "CA").
 * @param {string} city - The city name.
 * @returns {Promise<number>} The multiplier value, or 1.0 if not found.
 */
export async function getMultiplierForLocation(state, city) {
    const multipliers = await getRegionalMultipliers();
    if (!multipliers) return 1.0;

    const cityUpper = city.toUpperCase();
    const stateUpper = state.toUpperCase();

    // Try exact match
    let match = multipliers.find(m => m.State.toUpperCase() === stateUpper && m.City.toUpperCase() === cityUpper);
    if (match) return match.Multiplier;

    // Try state-level "Other"
    match = multipliers.find(m => m.State.toUpperCase() === stateUpper && m.City.toUpperCase() === "OTHER");
    if (match) return match.Multiplier;
    
    // Try general "Other" if any exists (though less specific)
    match = multipliers.find(m => m.City.toUpperCase() === "OTHER" && !m.State); // Or however your general "Other" is defined
    if (match) return match.Multiplier;

    console.warn(`No specific multiplier found for ${city}, ${state}. Defaulting to 1.0.`);
    return 1.0;
}


/**
 * Placeholder for the main estimation generation logic.
 * This will be expanded significantly in subsequent steps.
 * 
 * @param {Object} projectDetails - Details from the questionnaire (e.g., type, subtype, answers, address).
 * @returns {Promise<Object>} A structured estimate object.
 */
export async function generateEstimate(projectDetails) {
    console.log("Generating estimate for:", projectDetails);

    const pricingData = await getGlobalPricing();
    const regionalMultipliers = await getRegionalMultipliers();

    if (!pricingData) {
        return { error: "Pricing data not available.", estimate: null };
    }
     if (!regionalMultipliers) {
        console.warn("Regional multipliers not available. Calculations will not be adjusted for region.");
    }

    // For now, let's just return a very basic structure.
    // This will be replaced with actual calculation logic.
    const estimate = {
        lineItems: [],
        subTotal: 0,
        regionalMultiplierApplied: 1.0,
        tax: 0, // Placeholder
        overhead: 0, // Placeholder
        totalEstimate: 0,
        assumptions: ["Initial placeholder estimate."]
    };

    // Example: Get multiplier (you'd get state/city from projectDetails.address)
    // const projectState = projectDetails.address?.state;
    // const projectCity = projectDetails.address?.city;
    // if (projectState && projectCity) {
    //     estimate.regionalMultiplierApplied = await getMultiplierForLocation(projectState, projectCity);
    // }
    
    console.log("Estimate generation stub complete.", estimate);
    return { error: null, estimate };
}

// Example Usage (for testing purposes, not part of the final component):
// async function testEngine() {
//     const priceItem = await findPriceItemByCode("012100101020");
//     console.log("Found Price Item:", priceItem);

//     const multiplier = await getMultiplierForLocation("AK", "ANCHORAGE");
//     console.log("Multiplier for Anchorage, AK:", multiplier);

//     const testProjectDetails = {
//         type: 'residential',
//         subtype: 'kitchen_remodel',
//         address: { city: 'ANCHORAGE', state: 'AK', zip_code: '99501' },
//         answers: { /* ... kitchen answers ... */ }
//     };
//     const estimateResult = await generateEstimate(testProjectDetails);
//     console.log("Generated Estimate Result:", estimateResult);
// }
// testEngine(); // Uncomment to run test when developing this file