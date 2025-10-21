import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BarChart3, Activity, TrendingUp, DollarSign } from "lucide-react";

export default function Reports() {
  const { data: auditLog } = trpc.pricing.auditLog.useQuery();
  const { data: products } = trpc.products.list.useQuery();
  const { data: customers } = trpc.customers.list.useQuery();

  const totalCalculations = auditLog?.length || 0;
  const avgDiscount = auditLog && auditLog.length > 0
    ? auditLog.reduce((sum, log) => sum + parseFloat(log.productDiscount || "0"), 0) / auditLog.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">
            Real-time insights into pricing calculations and discount allocation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Active SKUs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Active accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Calculations</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCalculations}</div>
              <p className="text-xs text-muted-foreground">Total processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Discount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgDiscount.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Product discounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Calculations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Pricing Calculations</CardTitle>
            <CardDescription>Latest audit log entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditLog && auditLog.length > 0 ? (
                auditLog.slice(0, 10).map((log) => (
                  <div key={log.id} className="flex justify-between items-center border-b pb-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Product ID: {log.productId.substring(0, 8)}...</p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.createdAt!).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">R {log.basePrice} → R {log.finalPrice}</p>
                      <p className="text-xs text-gray-500">
                        Discounts: {log.productDiscount}% + {log.logFeeDiscount || "0"}%
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No calculations yet. Try the calculator to see audit logs here.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
