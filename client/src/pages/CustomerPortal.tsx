import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ShoppingCart, FileText, CreditCard, Package, TrendingUp, AlertCircle, 
  Home, Plus, Trash2, Phone, Mail, MapPin, User, Building, Calendar 
} from "lucide-react";
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

  const handlePlaceOrder = async () => {
    if (orderItems.length === 0) {
      toast({
        title: "No Items in Order",
        description: "Please add at least one product to your order.",
        variant: "destructive",
      });
      return;
    }

    // For MVP, create a single order for the first item
    // In production, this would create multiple line items or a proper order structure
    const firstItem = orderItems[0];
    const product = products.find(p => p.id === firstItem.productId);
    if (!product) return;

    const unitPrice = parseFloat(product.basePrice);
    const totalAmount = unitPrice * firstItem.quantity;

    createOrder.mutate({
      customerId: customerId || "",
      productId: firstItem.productId,
      quantity: firstItem.quantity,
      unitPrice: unitPrice.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      notes: orderNote || undefined,
    });
  };

  if (customerLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customer portal...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Not Found</h2>
          <p className="text-gray-600 mb-4">The requested customer could not be found.</p>
          <Button onClick={() => setLocation("/customers")}>
            Back to Customer Directory
          </Button>
        </div>
      </div>
    );
  }

  // Calculate credit metrics (using mock data for demo)
  const creditLimit = 50000;
  const currentBalance = 12500;
  const availableCredit = creditLimit - currentBalance;
  const creditUtilization = (currentBalance / creditLimit) * 100;
  const creditStatus = creditUtilization > 80 ? "warning" : creditUtilization > 95 ? "danger" : "good";

  // Calculate order stats
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total || "0"), 0);
  const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button variant="outline" size="sm" onClick={() => setLocation("/")}>
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <Badge variant="outline" className="text-xs">
                [FOR INTERNAL COSPHARM USE ONLY]
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600">Customer Portal & Account Management</p>
          </div>
          <Badge variant={customer.active === "yes" ? "default" : "destructive"}>
            {customer.active === "yes" ? "Active Account" : "Inactive"}
          </Badge>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Credit Limit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">N$ {creditLimit.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">N$ {currentBalance.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Available Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">N$ {availableCredit.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalOrders}</div>
              <p className="text-xs text-gray-500 mt-1">Avg: N$ {avgOrderValue.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Credit Utilization Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Credit Utilization
                </CardTitle>
                <CardDescription>
                  You're using {creditUtilization.toFixed(1)}% of your available credit
                </CardDescription>
              </div>
              {creditStatus === "warning" && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Approaching Limit
                </Badge>
              )}
              {creditStatus === "danger" && (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Credit Limit Reached
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Current Balance</span>
                <span className="font-semibold">N$ {currentBalance.toLocaleString()}</span>
              </div>
              <Progress 
                value={creditUtilization} 
                className={`h-3 ${creditStatus === "danger" ? "bg-red-100" : creditStatus === "warning" ? "bg-yellow-100" : "bg-green-100"}`}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>N$ 0</span>
                <span>N$ {creditLimit.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <p className="text-sm text-gray-600">Outstanding Balance</p>
                <p className="text-lg font-bold text-orange-600">N$ {currentBalance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available to Order</p>
                <p className="text-lg font-bold text-green-600">N$ {availableCredit.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">Next Payment Due</p>
                  <p className="text-xs text-blue-700">
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-NA', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information & Account Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>Primary contacts for this account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Company Address */}
              <div className="pb-4 border-b">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">123 Main Street, Windhoek, Namibia</p>
                  </div>
                </div>
              </div>

              {/* Primary Contact (Orders) */}
              <div className="pb-4 border-b">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Primary Contact (Orders)</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">John Smith</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href="tel:+264611234567" className="text-sm text-blue-600 hover:underline">
                      +264 61 123 4567
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href="mailto:orders@pharmacy.com.na" className="text-sm text-blue-600 hover:underline">
                      orders@pharmacy.com.na
                    </a>
                  </div>
                </div>
              </div>

              {/* Accounts Contact (Payments) */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Accounts Contact (Payments)</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">Mary Johnson</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href="tel:+264611234568" className="text-sm text-blue-600 hover:underline">
                      +264 61 123 4568
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href="mailto:accounts@pharmacy.com.na" className="text-sm text-blue-600 hover:underline">
                      accounts@pharmacy.com.na
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>Business terms and account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer Type</p>
                  <p className="font-semibold text-gray-900">Retail</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Log Fee Discount</p>
                  <p className="font-semibold text-gray-900">{customer.logFeeDiscount || "2.50"}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Terms</p>
                  <p className="font-semibold text-gray-900">Net 30 Days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Status</p>
                  <Badge variant={customer.active === "yes" ? "default" : "destructive"}>
                    {customer.active === "yes" ? "Active - Good Standing" : "Inactive"}
                  </Badge>
                </div>
                <div className="col-span-2 pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-1">CosPharm Account Manager</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <p className="font-semibold text-gray-900">Sarah Williams</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Your dedicated contact at CosPharm for account support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Place New Order */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Place New Order
            </CardTitle>
            <CardDescription>Select products and quantities to create a new order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="product">Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - N$ {product.basePrice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            <Button onClick={handleAddLineItem} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add to Order
            </Button>

            {orderItems.length > 0 && (
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm text-gray-700">Order Items ({orderItems.length})</h4>
                {orderItems.map((item, index) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{product?.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLineItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  );
                })}

                <div className="pt-4">
                  <Label htmlFor="orderNote">Order Notes (Optional)</Label>
                  <Input
                    id="orderNote"
                    placeholder="Add any special instructions..."
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handlePlaceOrder} 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={createOrder.isPending}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {createOrder.isPending ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Order History
            </CardTitle>
            <CardDescription>View all your orders</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No orders yet</p>
                <p className="text-sm text-gray-500">Place your first order to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-NA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }) : 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">N$ {parseFloat(order.total || "0").toFixed(2)}</p>
                        <Badge variant="outline">{order.status}</Badge>
                      </div>
                    </div>
                    {order.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">Note: {order.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

