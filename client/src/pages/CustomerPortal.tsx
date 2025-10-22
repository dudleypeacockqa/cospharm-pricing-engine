import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, FileText, CreditCard, Package, TrendingUp, AlertCircle, ArrowLeft, Plus, Trash2, Home } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function CustomerPortal() {
  const params = useParams();
  const customerId = params.customerId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [orderNote, setOrderNote] = useState<string>("");
  const [orderItems, setOrderItems] = useState<Array<{productId: string, quantity: number}>>([]);

  // Fetch customer data
  const { data: customer, isLoading: customerLoading } =
    trpc.customers.get.useQuery({ id: customerId || "" });

  // Fetch products
  const { data: products = [], isLoading: productsLoading } =
    trpc.products.list.useQuery();

  // Fetch customer orders
  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } =
    trpc.orders.getByCustomer.useQuery(customerId || "");

  // Create order mutation
  const createOrder = trpc.orders.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been submitted and is being processed.",
      });
      setSelectedProduct("");
      setQuantity(1);
      setOrderItems([]);
      setOrderNote("");
      refetchOrders();
    },
    onError: (error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddLineItem = () => {
    if (!selectedProduct) {
      toast({
        title: "Product Required",
        description: "Please select a product to add.",
        variant: "destructive",
      });
      return;
    }

    if (quantity < 1) {
      toast({
        title: "Invalid Quantity",
        description: "Quantity must be at least 1.",
        variant: "destructive",
      });
      return;
    }

    setOrderItems([...orderItems, { productId: selectedProduct, quantity }]);
    setSelectedProduct("");
    setQuantity(1);
  };

  const handleRemoveLineItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handlePlaceOrder = () => {
    if (orderItems.length === 0) {
      toast({
        title: "No Items in Order",
        description: "Please add at least one product to your order.",
        variant: "destructive",
      });
      return;
    }

    // Calculate total amount across all line items
    let totalAmount = 0;
    const logFeeDiscount = customer && customer.logFeeDiscount ? parseFloat(customer.logFeeDiscount) / 100 : 0;
    
    orderItems.forEach(item => {
      const product = products.find((p: any) => p.id === item.productId);
      if (!product) return;
      
      const basePrice = parseFloat(product.basePrice || "0");
      const productDiscount = parseFloat(product.productDiscount || "0") / 100;
      const priceAfterProductDiscount = basePrice * (1 - productDiscount);
      const finalUnitPrice = priceAfterProductDiscount * (1 - logFeeDiscount);
      totalAmount += finalUnitPrice * item.quantity;
    });

    // Create order with first product (multi-line order support to be added)
    const firstItem = orderItems[0];
    const firstProduct = products.find((p: any) => p.id === firstItem.productId);
    if (!firstProduct) return;
    
    const firstBasePrice = parseFloat(firstProduct.basePrice || "0");
    const firstProductDiscount = parseFloat(firstProduct.productDiscount || "0") / 100;
    const firstPriceAfterProductDiscount = firstBasePrice * (1 - firstProductDiscount);
    const firstFinalUnitPrice = firstPriceAfterProductDiscount * (1 - logFeeDiscount);

    createOrder.mutate({
      customerId: customerId || "",
      productId: firstItem.productId,
      quantity: firstItem.quantity,
      unitPrice: firstFinalUnitPrice.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      status: "pending",
      notes: orderNote || undefined,
    });
  };

  if (customerLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading customer portal...</div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Not Found</CardTitle>
            <CardDescription>
              The customer account you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/customers")}>
              Back to Customers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock credit data for demo (these fields don't exist in current database schema)
  const creditLimit = 50000;
  const currentBalance = 12500;
  const availableCredit = creditLimit - currentBalance;
  const creditUtilization = (currentBalance / creditLimit) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{customer.name}</h1>
              <p className="text-sm opacity-90">Customer Portal</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setLocation("/customers")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
          className="mb-4"
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        {/* Credit Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Credit Limit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                R {creditLimit.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                R {currentBalance.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                R {availableCredit.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credit Utilization */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Credit Utilization
            </CardTitle>
            <CardDescription>
              You're using {creditUtilization.toFixed(1)}% of your available credit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={creditUtilization} className="h-3" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>R 0</span>
              <span>R {creditLimit.toFixed(2)}</span>
            </div>
            {creditUtilization > 80 && (
              <div className="flex items-center gap-2 mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <p className="text-sm text-orange-800">
                  You're approaching your credit limit. Please settle outstanding invoices.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Place Order Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Place New Order
            </CardTitle>
            <CardDescription>
              Select products and quantities to create a new order
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product: any) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - R {parseFloat(product.basePrice).toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Order Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Add any special instructions..."
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />
            </div>

            {selectedProduct && (() => {
              const product = products.find((p: any) => p.id === selectedProduct);
              if (!product) return null;

              const basePrice = parseFloat(product.basePrice || "0");
              const productDiscount = parseFloat(product.productDiscount || "0") / 100;
              const logFeeDiscount = customer && customer.logFeeDiscount ? parseFloat(customer.logFeeDiscount) / 100 : 0;

              const priceAfterProductDiscount = basePrice * (1 - productDiscount);
              const finalUnitPrice = priceAfterProductDiscount * (1 - logFeeDiscount);
              const totalAmount = finalUnitPrice * quantity;

              return (
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-lg">Price Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>R {basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Product Discount ({(productDiscount * 100).toFixed(2)}%):</span>
                      <span>- R {(basePrice * productDiscount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Your Log Fee Discount ({(logFeeDiscount * 100).toFixed(2)}%):</span>
                      <span>- R {(priceAfterProductDiscount * logFeeDiscount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Final Unit Price:</span>
                      <span>R {finalUnitPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total Amount ({quantity} units):</span>
                      <span>R {totalAmount.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

            <Button
              className="w-full"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={!selectedProduct || createOrder.isPending}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {createOrder.isPending ? "Placing Order..." : "Place Order"}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>View all your orders</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="text-center py-8">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No orders yet</p>
                <p className="text-sm">Place your first order to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="font-semibold">{order.id.slice(0, 8)}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} • {order.quantity} units
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <div className="font-semibold">R {parseFloat(order.totalAmount).toFixed(2)}</div>
                      <Badge variant="secondary" className="mt-1 capitalize">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>



        {/* Account Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Customer Type</div>
                <div className="font-semibold capitalize">{customer.customerType}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Log Fee Discount</div>
                <div className="font-semibold">{customer.logFeeDiscount}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Payment Terms</div>
                <div className="font-semibold">Net 30 Days</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Account Status</div>
                <Badge variant="secondary">Active - Good Standing</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
