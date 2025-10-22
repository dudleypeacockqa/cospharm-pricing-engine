import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Calculator as CalcIcon, ArrowRight, TrendingDown, Plus, Trash2, FileText, Mail, Download, ShoppingCart, Home } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QuoteItem {
  productId: string;
  productName: string;
  quantity: number;
  basePrice: number;
  productDiscount: number;
  unitPrice: number;
  lineTotal: number;
}

export default function Calculator() {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [quoteName, setQuoteName] = useState<string>("");
  const [quoteNotes, setQuoteNotes] = useState<string>("");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [calculation, setCalculation] = useState<any>(null);

  const { data: products } = trpc.products.list.useQuery();
  const { data: customers } = trpc.customers.list.useQuery();
  const calculateMutation = trpc.pricing.calculate.useMutation();
  
  const generatePDF = trpc.quotes.generatePDF.useMutation({
    onSuccess: (data) => {
      toast({
        title: "PDF Generated",
        description: "Your quote PDF has been generated successfully.",
      });
      // Download PDF
      const link = document.createElement('a');
      link.href = data.pdfUrl;
      link.download = `quote-${Date.now()}.pdf`;
      link.click();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const emailQuote = trpc.quotes.email.useMutation({
    onSuccess: () => {
      toast({
        title: "Email Sent",
        description: "Quote has been sent successfully.",
      });
      setIsEmailDialogOpen(false);
      setEmailAddress("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCalculate = () => {
    if (!selectedProduct) return;
    calculateMutation.mutate(
      {
        productId: selectedProduct,
        customerId: selectedCustomer && selectedCustomer !== "none" ? selectedCustomer : undefined,
      },
      {
        onSuccess: (data) => setCalculation(data),
      }
    );
  };

  const handleAddToQuote = () => {
    if (!selectedProduct || !calculation) {
      toast({
        title: "Error",
        description: "Please calculate a price first before adding to quote.",
        variant: "destructive",
      });
      return;
    }

    const product = products?.find(p => p.id === selectedProduct);
    if (!product) return;

    const newItem: QuoteItem = {
      productId: selectedProduct,
      productName: product.name,
      quantity: quantity,
      basePrice: calculation.basePrice,
      productDiscount: calculation.productDiscount,
      unitPrice: calculation.finalPrice,
      lineTotal: calculation.finalPrice * quantity,
    };

    setQuoteItems([...quoteItems, newItem]);
    toast({
      title: "Added to Quote",
      description: `${product.name} (x${quantity}) added to quote.`,
    });

    // Reset selections
    setSelectedProduct("");
    setQuantity(1);
    setCalculation(null);
  };

  const handleRemoveItem = (index: number) => {
    setQuoteItems(quoteItems.filter((_, i) => i !== index));
  };

  const calculateQuoteTotals = () => {
    const subtotal = quoteItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalDiscount = quoteItems.reduce((sum, item) => {
      const discountAmount = (item.basePrice * item.quantity) - item.lineTotal;
      return sum + discountAmount;
    }, 0);
    return { subtotal, totalDiscount };
  };

  const handleGeneratePDF = () => {
    if (quoteItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to the quote first.",
        variant: "destructive",
      });
      return;
    }

    const customer = customers?.find(c => c.id === selectedCustomer);
    const totals = calculateQuoteTotals();

    generatePDF.mutate({
      quoteName: quoteName || `Quote ${new Date().toLocaleDateString()}`,
      customerName: customer?.name || "Walk-in Customer",
      items: quoteItems,
      subtotal: totals.subtotal,
      totalDiscount: totals.totalDiscount,
      notes: quoteNotes,
    });
  };

  const handleEmailQuote = () => {
    if (!emailAddress) {
      toast({
        title: "Error",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    const customer = customers?.find(c => c.id === selectedCustomer);
    const totals = calculateQuoteTotals();

    emailQuote.mutate({
      quoteName: quoteName || `Quote ${new Date().toLocaleDateString()}`,
      customerName: customer?.name || "Walk-in Customer",
      items: quoteItems,
      subtotal: totals.subtotal,
      totalDiscount: totals.totalDiscount,
      notes: quoteNotes,
      emailAddress: emailAddress,
    });
  };

  const selectedProductData = products?.find((p) => p.id === selectedProduct);
  const selectedCustomerData = customers?.find((c) => c.id === selectedCustomer && selectedCustomer !== "none");
  const quoteTotals = calculateQuoteTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="mb-4"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Pricing Calculator & Quote Builder</h1>
            <p className="text-gray-600">
              Calculate prices with sequential discounts and build multi-product quotes
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Calculator */}
            <div className="lg:col-span-2 space-y-6">
              {/* Input Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalcIcon className="h-5 w-5" />
                    Calculate Price
                  </CardTitle>
                  <CardDescription>
                    Select product, customer, and quantity to calculate pricing
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
                            {product.name} - N$ {product.basePrice}
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
                        <SelectItem value="none">No Customer (Product Discount Only)</SelectItem>
                        {customers?.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} - {customer.logFeeDiscount}% Log Fee
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

                  <div className="flex gap-2">
                    <Button onClick={handleCalculate} disabled={!selectedProduct} className="flex-1 gap-2">
                      Calculate Price
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    {calculation && (
                      <Button 
                        onClick={handleAddToQuote} 
                        variant="outline"
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add to Quote
                      </Button>
                    )}
                  </div>
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
                        <span className="text-lg font-bold">N$ {calculation.basePrice.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b bg-white px-3 rounded">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-blue-600" />
                          <span>Product Discount ({calculation.productDiscount}%)</span>
                        </div>
                        <span className="font-semibold text-blue-600">
                          N$ {calculation.priceAfterProductDiscount.toFixed(2)}
                        </span>
                      </div>

                      {calculation.logFeeDiscount > 0 && (
                        <div className="flex justify-between items-center py-2 border-b bg-white px-3 rounded">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-blue-600" />
                            <span>Log Fee Discount ({calculation.logFeeDiscount}%)</span>
                          </div>
                          <span className="font-semibold text-blue-600">
                            N$ {calculation.priceAfterLogFee.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center py-3 bg-green-600 text-white px-4 rounded-lg mt-4">
                        <span className="text-lg font-bold">Unit Price</span>
                        <span className="text-2xl font-bold">N$ {calculation.finalPrice.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center py-3 bg-[#1e3a8a] text-white px-4 rounded-lg">
                        <span className="text-lg font-bold">Line Total (x{quantity})</span>
                        <span className="text-2xl font-bold">N$ {(calculation.finalPrice * quantity).toFixed(2)}</span>
                      </div>

                      <div className="text-sm text-gray-600 text-center pt-2">
                        Unit Discount: N$ {calculation.totalDiscountAmount.toFixed(2)} (
                        {calculation.totalDiscountPercentage.toFixed(2)}%)
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Quote Builder */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Quote Builder
                  </CardTitle>
                  <CardDescription>
                    {quoteItems.length} item(s) in quote
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="quoteName">Quote Name</Label>
                    <Input
                      id="quoteName"
                      value={quoteName}
                      onChange={(e) => setQuoteName(e.target.value)}
                      placeholder="e.g., Monthly Order - January"
                    />
                  </div>

                  <div>
                    <Label htmlFor="quoteNotes">Notes (Optional)</Label>
                    <Textarea
                      id="quoteNotes"
                      value={quoteNotes}
                      onChange={(e) => setQuoteNotes(e.target.value)}
                      placeholder="Add any special instructions or notes..."
                      rows={3}
                    />
                  </div>

                  {quoteItems.length > 0 && (
                    <>
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-semibold">N$ {quoteTotals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Total Discount:</span>
                          <span className="font-semibold">-N$ {quoteTotals.totalDiscount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                          <span>Total:</span>
                          <span>N$ {quoteTotals.subtotal.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button 
                          onClick={handleGeneratePDF}
                          className="w-full gap-2 bg-[#1e3a8a] hover:bg-[#1e40af]"
                          disabled={generatePDF.isPending}
                        >
                          <FileText className="h-4 w-4" />
                          {generatePDF.isPending ? "Generating..." : "Generate PDF"}
                        </Button>

                        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full gap-2">
                              <Mail className="h-4 w-4" />
                              Email Quote
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Email Quote</DialogTitle>
                              <DialogDescription>
                                Send this quote to a customer via email
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={emailAddress}
                                  onChange={(e) => setEmailAddress(e.target.value)}
                                  placeholder="customer@example.com"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleEmailQuote}
                                disabled={emailQuote.isPending}
                                className="bg-[#1e3a8a] hover:bg-[#1e40af]"
                              >
                                {emailQuote.isPending ? "Sending..." : "Send Email"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button 
                          onClick={() => setQuoteItems([])}
                          variant="outline"
                          className="w-full gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Clear Quote
                        </Button>
                      </div>
                    </>
                  )}

                  {quoteItems.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No items in quote yet</p>
                      <p className="text-xs">Calculate a price and add items to build your quote</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quote Items Table */}
          {quoteItems.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quote Items</CardTitle>
                <CardDescription>Review and manage items in your quote</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Base Price</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Line Total</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quoteItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">N$ {item.basePrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-green-600">{item.productDiscount}%</TableCell>
                        <TableCell className="text-right font-semibold">N$ {item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-bold">N$ {item.lineTotal.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

