import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Home, Zap, Shield, CheckCircle2 } from "lucide-react";

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
          className="mb-4"
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sage 200 Evolution Integration</h1>
          <p className="text-gray-600">
            API documentation for real-time pricing integration
          </p>
        </div>

        {/* Architecture Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              How It Works
            </CardTitle>
            <CardDescription>
              Sales staff work entirely within Sage 200 Evolution - no external portal needed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Step 1: Sales Order Entry</h3>
                  <p className="text-sm text-gray-600">
                    Sales staff create orders in Sage 200 Evolution as normal
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Step 2: Automatic API Call</h3>
                  <p className="text-sm text-gray-600">
                    Sage automatically calls the Pricing Engine API with customer and product details
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Step 3: Price Calculation</h3>
                  <p className="text-sm text-gray-600">
                    Engine applies sequential discounts: Base Price → Product Discount → Promotion → Log Fee
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Step 4: Return to Sage</h3>
                  <p className="text-sm text-gray-600">
                    Final price and breakdown are returned to Sage order screen in under 500ms
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoint */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-600" />
              Price Calculation Endpoint
            </CardTitle>
            <CardDescription>
              Real-time pricing calculation with discount breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Badge className="mb-2">POST</Badge>
                <code className="block bg-gray-900 text-white p-4 rounded-lg text-sm">
                  https://your-domain.com/api/pricing/calculate
                </code>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Request Body</h3>
                <pre className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "customerId": "CUST001",
  "productId": "PROD123",
  "quantity": 10,
  "quoteDate": "2025-12-11T00:00:00Z" // Optional
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Response</h3>
                <pre className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "basePrice": 100.00,
  "productDiscount": 15.0,
  "promotionDiscount": 5.0,
  "logFeeDiscount": 10.0,
  "priceAfterProductDiscount": 85.00,
  "priceAfterPromotion": 80.75,
  "finalPrice": 72.68,
  "totalDiscountAmount": 27.32,
  "totalDiscountPercentage": 27.32,
  "appliedPromotion": "Summer Sale 2025"
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Authentication
            </CardTitle>
            <CardDescription>
              Secure API access with token-based authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Authorization Header</h3>
                <code className="block bg-gray-900 text-white p-4 rounded-lg text-sm">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>
              <p className="text-sm text-gray-600">
                Contact your administrator to obtain an API key for Sage integration.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Business Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Business Rules & Timing</CardTitle>
            <CardDescription>
              How the system handles quotes, promotions, and price changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Quote Price Locking</h3>
                <p className="text-sm text-gray-600">
                  When a quote is created, the price is locked at the time of quote generation. 
                  If the quote is converted to an order after the expiry date or after a price 
                  change, the system uses the quote date to determine which price to apply.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Promotion Priority</h3>
                <p className="text-sm text-gray-600">
                  Active promotions are applied after product discounts but before log fees. 
                  If multiple promotions apply to the same product, the highest priority 
                  promotion is used.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Price List Changes</h3>
                <p className="text-sm text-gray-600">
                  When base prices are updated, existing quotes retain their original pricing. 
                  New quotes and orders use the updated prices immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
