import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Users, Mail, Phone, TrendingDown, ExternalLink, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Customers() {
  const { data: customers, isLoading } = trpc.customers.list.useQuery();
  const [, setLocation] = useLocation();

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
          <h1 className="text-3xl font-bold mb-2">Customer Directory</h1>
          <p className="text-gray-600">
            {customers?.length || 0} customers with configured log fee discounts
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading customers...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {customers?.map((customer) => (
              <Card key={customer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Users className="h-8 w-8 text-blue-600" />
                    <Badge variant={customer.customerType === "wholesaler" ? "default" : "secondary"}>
                      {customer.customerType}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{customer.name}</CardTitle>
                  <CardDescription>Customer Account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customer.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{customer.phone}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <TrendingDown className="h-4 w-4" />
                          Log Fee Discount
                        </span>
                        <span className="font-bold text-lg text-blue-600">
                          {customer.logFeeDiscount}%
                        </span>
                      </div>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => setLocation(`/portal/${customer.id}`)}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Customer Portal
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
