import { findPriceItemByCode } from './EstimationEngine';

/**
 * Calculates line items for a bathroom remodel based on project details.
 * 
 * @param {Object} bathroomDetails - Specific answers from the bathroom questionnaire.
 * @param {Object} projectAddress - The address of the project for regional adjustments.
 * @returns {Promise<Array<Object>>} A list of line items for the bathroom estimate.
 */
export async function calculateBathroomEstimateLineItems(bathroomDetails, projectAddress) {
    const lineItems = [];

    // --- Demolition ---
    const demolitionItem = await findPriceItemByCode('DEMOLITION_BATHROOM_STD'); // Placeholder
    if (demolitionItem) {
        lineItems.push({
            description: 'Standard Bathroom Demolition & Prep',
            code: demolitionItem.Code,
            quantity: 1,
            unit: demolitionItem.Unit || 'ALLOW',
            unitCost: (demolitionItem['Material Cost'] || 0) + (demolitionItem['Installation Cost'] || 0),
            totalCost: (demolitionItem['Material Cost'] || 0) + (demolitionItem['Installation Cost'] || 0),
            category: 'Demolition & Prep'
        });
    } else {
        console.warn("Pricing code DEMOLITION_BATHROOM_STD not found.");
    }

    // --- Tub/Shower ---
    // Example: bathroomDetails.bathingSetup could be 'new_tub_shower_combo', 'walk_in_shower_std'
    let bathingSetupCode = 'BATH_TUB_SHOWER_COMBO_STD'; // Default placeholder
    if (bathroomDetails.bathingSetup === 'walk_in_shower_std') {
        bathingSetupCode = 'BATH_WALK_IN_SHOWER_STD'; // Placeholder
    } else if (bathroomDetails.bathingSetup === 'freestanding_tub_std') {
        bathingSetupCode = 'BATH_FREESTANDING_TUB_STD'; // Placeholder
    }
    const bathingItem = await findPriceItemByCode(bathingSetupCode);
    if (bathingItem) {
        lineItems.push({
            description: `New ${bathroomDetails.bathingSetup?.replace(/_/g, ' ') || 'Tub/Shower Combo'}`,
            code: bathingItem.Code,
            quantity: 1,
            unit: bathingItem.Unit || 'EA',
            unitCost: (bathingItem['Material Cost'] || 0) + (bathingItem['Installation Cost'] || 0),
            totalCost: (bathingItem['Material Cost'] || 0) + (bathingItem['Installation Cost'] || 0),
            category: 'Plumbing Fixtures'
        });
    } else {
        console.warn(`Pricing code ${bathingSetupCode} not found.`);
         lineItems.push({
            description: `New ${bathroomDetails.bathingSetup?.replace(/_/g, ' ') || 'Tub/Shower Combo'} (Pricing TBD)`,
            code: 'N/A',
            quantity: 1,
            unit: 'EA',
            unitCost: 0,
            totalCost: 0,
            category: 'Plumbing Fixtures',
            notes: `Pricing code ${bathingSetupCode} not found.`
        });
    }

    // --- Toilet ---
    // Example: bathroomDetails.toiletType could be 'standard_height', 'comfort_height'
    const toiletItem = await findPriceItemByCode('BATH_TOILET_STD_INSTALL'); // Placeholder
    if (toiletItem) {
        lineItems.push({
            description: 'New Toilet (Standard)',
            code: toiletItem.Code,
            quantity: 1,
            unit: toiletItem.Unit || 'EA',
            unitCost: (toiletItem['Material Cost'] || 0) + (toiletItem['Installation Cost'] || 0),
            totalCost: (toiletItem['Material Cost'] || 0) + (toiletItem['Installation Cost'] || 0),
            category: 'Plumbing Fixtures'
        });
    } else {
        console.warn("Pricing code BATH_TOILET_STD_INSTALL not found.");
    }
    
    // --- Vanity & Sink ---
    // Example: bathroomDetails.vanityType 'single_sink_std_36in', 'double_sink_std_60in'
    // Example: bathroomDetails.vanityWidth (e.g., 36, 48, 60 inches)
    let vanityCode = 'BATH_VANITY_SINK_STD_36IN'; // Default placeholder
    if (bathroomDetails.vanityWidth) {
        if (bathroomDetails.vanityWidth <= 36) vanityCode = 'BATH_VANITY_SINK_STD_36IN';
        else if (bathroomDetails.vanityWidth <= 48) vanityCode = 'BATH_VANITY_SINK_STD_48IN'; // Placeholder
        else vanityCode = 'BATH_VANITY_SINK_STD_60IN'; // Placeholder for larger or double
    }
    const vanityItem = await findPriceItemByCode(vanityCode);
    if (vanityItem) {
        lineItems.push({
            description: `New Vanity & Sink (approx. ${bathroomDetails.vanityWidth || 36} inch)`,
            code: vanityItem.Code,
            quantity: 1,
            unit: vanityItem.Unit || 'EA',
            unitCost: (vanityItem['Material Cost'] || 0) + (vanityItem['Installation Cost'] || 0),
            totalCost: (vanityItem['Material Cost'] || 0) + (vanityItem['Installation Cost'] || 0),
            category: 'Cabinetry & Fixtures'
        });
    } else {
        console.warn(`Pricing code ${vanityCode} not found.`);
    }

    // --- Flooring ---
    // Example: bathroomDetails.flooringSqFt
    if (bathroomDetails.flooringSqFt > 0) {
        const flooringItem = await findPriceItemByCode('FLOORING_TILE_MID_BATH'); // Placeholder
        if (flooringItem) {
            const quantity = bathroomDetails.flooringSqFt;
            const unitCost = (flooringItem['Material Cost'] || 0) + (flooringItem['Installation Cost'] || 0);
            lineItems.push({
                description: `Bathroom Tile Flooring`,
                code: flooringItem.Code,
                quantity: quantity,
                unit: flooringItem.Unit || 'SF',
                unitCost: unitCost,
                totalCost: quantity * unitCost,
                category: 'Flooring'
            });
        } else {
            console.warn("Pricing code FLOORING_TILE_MID_BATH not found.");
        }
    }
    
    // --- Tiling (Walls / Shower Surround) ---
    // Example: bathroomDetails.wallTileSqFt
    if (bathroomDetails.wallTileSqFt > 0) {
        const wallTileItem = await findPriceItemByCode('TILE_WALL_SHOWER_STD'); // Placeholder
        if (wallTileItem) {
            const quantity = bathroomDetails.wallTileSqFt;
            const unitCost = (wallTileItem['Material Cost'] || 0) + (wallTileItem['Installation Cost'] || 0);
            lineItems.push({
                description: `Shower/Wall Tiling`,
                code: wallTileItem.Code,
                quantity: quantity,
                unit: wallTileItem.Unit || 'SF',
                unitCost: unitCost,
                totalCost: quantity * unitCost,
                category: 'Tiling'
            });
        } else {
            console.warn("Pricing code TILE_WALL_SHOWER_STD not found.");
        }
    }

    // TODO: Add more categories: Lighting, Ventilation, Painting, Accessories etc.

    console.log("Bathroom line items calculated:", lineItems);
    return lineItems;
}