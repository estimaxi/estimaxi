import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Printer, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';

// Helper function to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
};

export default function EstimateResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [estimate, setEstimate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // The estimate data is expected to be passed via location state
        // In a real app, you might fetch this by ID if navigating directly
        if (location.state?.estimate) {
            setEstimate(location.state.estimate);
            setLoading(false);
        } else {
            // If no estimate data is found, it might be an error or direct navigation
            // For now, we'll just show an error.
            // Later, we might fetch by a projectId from URL params.
            console.error("Estimate data not found in location state.");
            setError("Estimate data not found. Please try generating the estimate again.");
            setLoading(false);
            // navigate(createPageUrl('ProjectOwnerDashboard')); // Optionally redirect
        }
    }, [location.state, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="ml-4 text-lg">Loading Estimate...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen p-6 text-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{error}</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => navigate(createPageUrl('ProjectOwnerDashboard'))} className="w-full">
                            Back to Dashboard
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
    
    if (!estimate) {
         return (
            <div className="flex flex-col justify-center items-center min-h-screen p-6 text-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>No Estimate Data</CardTitle>
                         <CardDescription>No estimate data was provided to display.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Please try generating your estimate again through the questionnaire.</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => navigate(createPageUrl('ProjectOwnerDashboard'))} className="w-full">
                            Back to Dashboard
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const { lineItems = [], subTotal = 0, regionalMultiplier = 1, taxRate = 0, taxAmount = 0, overheadRate = 0, overheadAmount = 0, totalEstimate = 0, projectDetails = {}, assumptions = [], summary = "" } = estimate;

    const categories = [...new Set(lineItems.map(item => item.category || 'Uncategorized'))];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Questionnaire
                </Button>

                <Card className="shadow-xl">
                    <CardHeader className="bg-blue-600 text-white p-6 rounded-t-lg">
                        <CardTitle className="text-3xl font-bold">Project Estimate</CardTitle>
                        {projectDetails.type && projectDetails.subtype && (
                            <CardDescription className="text-blue-100 mt-1">
                                For {projectDetails.type.replace(/_/g, ' ')} - {projectDetails.subtype.replace(/_/g, ' ')}
                                {projectDetails.address?.zip_code && ` in ZIP ${projectDetails.address.zip_code}`}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="p-6">
                        {summary && (
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                                <h3 className="font-semibold text-blue-700 mb-2">Estimate Summary</h3>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{summary}</p>
                            </div>
                        )}

                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Cost Breakdown</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">Description</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead className="text-right">Unit Cost</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map(category => (
                                    <React.Fragment key={category}>
                                        <TableRow className="bg-gray-100">
                                            <TableCell colSpan={6} className="font-semibold text-gray-700 py-2 px-3">{category}</TableCell>
                                        </TableRow>
                                        {lineItems.filter(item => (item.category || 'Uncategorized') === category).map((item, index) => (
                                            <TableRow key={`${category}-${index}`}>
                                                <TableCell className="py-2 px-3">{item.description}
                                                    {item.notes && <p className="text-xs text-red-500 italic mt-1">{item.notes}</p>}
                                                </TableCell>
                                                <TableCell className="py-2 px-3 text-xs text-gray-500">{item.code}</TableCell>
                                                <TableCell className="text-right py-2 px-3">{item.quantity}</TableCell>
                                                <TableCell className="py-2 px-3">{item.unit}</TableCell>
                                                <TableCell className="text-right py-2 px-3">{formatCurrency(item.unitCost)}</TableCell>
                                                <TableCell className="text-right py-2 px-3">{formatCurrency(item.totalCost)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                            <TableFooter className="bg-gray-50">
                                <TableRow>
                                    <TableCell colSpan={5} className="text-right font-semibold">Subtotal (Before Regional Adjustment)</TableCell>
                                    <TableCell className="text-right font-semibold">{formatCurrency(subTotal / regionalMultiplier)}</TableCell>
                                </TableRow>
                                {regionalMultiplier !== 1 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-right">Regional Multiplier ({projectDetails.address?.city}, {projectDetails.address?.state})</TableCell>
                                    <TableCell className="text-right">{regionalMultiplier.toFixed(3)}x</TableCell>
                                </TableRow>
                                )}
                                <TableRow>
                                    <TableCell colSpan={5} className="text-right font-semibold">Adjusted Subtotal</TableCell>
                                    <TableCell className="text-right font-semibold">{formatCurrency(subTotal)}</TableCell>
                                </TableRow>
                                {overheadRate > 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-right">Overhead & Profit ({(overheadRate * 100).toFixed(0)}%)</TableCell>
                                    <TableCell className="text-right">{formatCurrency(overheadAmount)}</TableCell>
                                </TableRow>
                                )}
                                {taxRate > 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-right">Estimated Sales Tax ({(taxRate * 100).toFixed(1)}%)</TableCell>
                                    <TableCell className="text-right">{formatCurrency(taxAmount)}</TableCell>
                                </TableRow>
                                )}
                                <TableRow className="border-t-2 border-gray-300">
                                    <TableCell colSpan={5} className="text-right text-lg font-bold">Estimated Total</TableCell>
                                    <TableCell className="text-right text-lg font-bold">{formatCurrency(totalEstimate)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>

                        {assumptions && assumptions.length > 0 && (
                            <div className="mt-8 pt-6 border-t">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Assumptions & Notes</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                    {assumptions.map((assumption, index) => (
                                        <li key={index}>{assumption}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
                            <p>This estimate is based on the information provided and standard pricing. Actual costs may vary based on site conditions, final selections, and market fluctuations.</p>
                            <p>Estimax &copy; {new Date().getFullYear()}</p>
                        </div>

                    </CardContent>
                    <CardFooter className="p-6 flex flex-col sm:flex-row justify-end gap-3">
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" /> Download PDF (Coming Soon)
                        </Button>
                        <Button>
                            <Printer className="mr-2 h-4 w-4" /> Print Estimate (Coming Soon)
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}