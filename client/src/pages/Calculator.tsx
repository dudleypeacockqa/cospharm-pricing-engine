import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Calculator as CalcIcon, ArrowRight, TrendingDown } from "lucide-react";
import { useState } from "react";

export default function Calculator() {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [calculation, setCalculation] = useState<any>(null);

  const { data: products } = trpc.products.list.useQuery();
  const { data: customers } = trpc.customers.list.useQuery();
  const calculateMutation = trpc.pricing.calculate.useMutation();

  const handleCalculate = () => {
    if (!selectedProduct) return;
    calculateMutation.mutate(
      {
        productId: selectedProduct,
        customerId: selectedCustomer || undefined,
      },
      {
        onSuccess: (data) => setCalculation(data),
      }
    );
  };

  const selectedProductData = products?.find((p) => p.id === selectedProduct);
  const selectedCustomerData = customers?.find((c) => c.id === selectedCustomer);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Pricing Calculator</h1>
            <p className="text-gray-600">
              Calculate final prices with sequential discount logic in real-time
            </p>
          </div>

          <div className="grid gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalcIcon className="h-5 w-5" />
                  Calculate Price
                </CardTitle>
                <CardDescription>
                  Select a product and optionally a customer to see the sequential discount breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Product</label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - R {product.basePrice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Customer (Optional)</label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Customer (Product Discount Only)</SelectItem>
                      {customers?.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} - {customer.logFeeDiscount}% Log Fee
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleCalculate} disabled={!selectedProduct} className="w-full gap-2">
                  Calculate Final Price
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            {calculation && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle>Calculation Result</CardTitle>
                  <CardDescription>Sequential discount breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Base Price (SEP)</span>
                      <span className="text-lg font-bold">R {calculation.basePrice.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b bg-white px-3 rounded">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-blue-600" />
                        <span>Product Discount ({calculation.productDiscount}%)</span>
                      </div>
                      <span className="font-semibold text-blue-600">
                        R {calculation.priceAfterProductDiscount.toFixed(2)}
                      </span>
                    </div>

                    {calculation.logFeeDiscount > 0 && (
                      <div className="flex justify-between items-center py-2 border-b bg-white px-3 rounded">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-blue-600" />
                          <span>Log Fee Discount ({calculation.logFeeDiscount}%)</span>
                        </div>
                        <span className="font-semibold text-blue-600">
                          R {calculation.priceAfterLogFee.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-3 bg-green-600 text-white px-4 rounded-lg mt-4">
                      <span className="text-lg font-bold">Final Price</span>
                      <span className="text-2xl font-bold">R {calculation.finalPrice.toFixed(2)}</span>
                    </div>

                    <div className="text-sm text-gray-600 text-center pt-2">
                      Total Discount: R {calculation.totalDiscountAmount.toFixed(2)} (
                      {calculation.totalDiscountPercentage.toFixed(2)}%)
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info Section */}
            {selectedProductData && (
              <Card>
                <CardHeader>
                  <CardTitle>Selected Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Product Name:</span>
                      <p className="font-medium">{selectedProductData.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <p className="font-medium">{selectedProductData.category || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Base Price:</span>
                      <p className="font-medium">R {selectedProductData.basePrice}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Product Discount:</span>
                      <p className="font-medium">{selectedProductData.productDiscount}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
