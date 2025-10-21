import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, FileText, CreditCard, Package, TrendingUp, AlertCircle } from "lucide-react";
import { Link } from "wouter";

// Demo customer data
const demoCustomer = {
  name: "Windhoek Pharmacy",
  accountNumber: "WP-2024-001",
  creditLimit: 150000,
  currentBalance: 87500,
  availableCredit: 62500,
  logFeeDiscount: 5,
};

const demoOrders = [
  {
    id: "ORD-2024-103",
    date: "2024-10-18",
    status: "Delivered",
    items: 12,
    total: 15750.50,
  },
  {
    id: "ORD-2024-098",
    date: "2024-10-15",
    status: "Delivered",
    items: 8,
    total: 8920.00,
  },
  {
    id: "ORD-2024-092",
    date: "2024-10-10",
    status: "Delivered",
    items: 15,
    total: 22340.75,
  },
];

const demoInvoices = [
  { id: "INV-2024-156", date: "2024-10-18", amount: 15750.50, status: "Paid", dueDate: "2024-11-17" },
  { id: "INV-2024-151", date: "2024-10-15", amount: 8920.00, status: "Paid", dueDate: "2024-11-14" },
  { id: "INV-2024-145", date: "2024-10-10", amount: 22340.75, status: "Outstanding", dueDate: "2024-11-09" },
  { id: "INV-2024-138", date: "2024-10-05", amount: 18450.00, status: "Outstanding", dueDate: "2024-11-04" },
];

export default function CustomerPortal() {
  const creditUtilization = (demoCustomer.currentBalance / demoCustomer.creditLimit) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{demoCustomer.name}</h1>
              <p className="text-sm opacity-90">Account: {demoCustomer.accountNumber}</p>
            </div>
            <Link href="/">
              <Button variant="secondary" size="sm">
                Back to Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Credit Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Credit Limit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                N$ {demoCustomer.creditLimit.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                N$ {demoCustomer.currentBalance.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                N$ {demoCustomer.availableCredit.toLocaleString()}
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
              <span>N$ 0</span>
              <span>N$ {demoCustomer.creditLimit.toLocaleString()}</span>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/products">
            <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
              <ShoppingCart className="h-6 w-6" />
              <span>Place Order</span>
            </Button>
          </Link>
          <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
            <Package className="h-6 w-6" />
            <span>Order History</span>
          </Button>
          <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
            <FileText className="h-6 w-6" />
            <span>Statements</span>
          </Button>
          <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
            <CreditCard className="h-6 w-6" />
            <span>Make Payment</span>
          </Button>
        </div>

        {/* Recent Orders */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your last 3 orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="font-semibold">{order.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.date} • {order.items} items
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="font-semibold">N$ {order.total.toLocaleString()}</div>
                    <Badge variant="secondary" className="mt-1">
                      {order.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices & Statements</CardTitle>
            <CardDescription>Recent invoices and payment status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="font-semibold">{invoice.id}</div>
                    <div className="text-sm text-muted-foreground">
                      Issued: {invoice.date} • Due: {invoice.dueDate}
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="font-semibold">N$ {invoice.amount.toLocaleString()}</div>
                    <Badge 
                      variant={invoice.status === "Paid" ? "secondary" : "destructive"}
                      className="mt-1"
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">Download PDF</Button>
                </div>
              ))}
            </div>
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
                <div className="font-semibold">Wholesaler</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Log Fee Discount</div>
                <div className="font-semibold">{demoCustomer.logFeeDiscount}%</div>
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
