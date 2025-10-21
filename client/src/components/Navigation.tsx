import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Calculator, Package, Users, BarChart3, Home, Tag } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/calculator", label: "Calculator", icon: Calculator },
    { path: "/products", label: "Products", icon: Package },
    { path: "/customers", label: "Customers", icon: Users },
    { path: "/promotions", label: "Promotions", icon: Tag },
    { path: "/reports", label: "Reports", icon: BarChart3 },
  ];

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <div className="flex items-center gap-2 font-bold text-xl text-primary cursor-pointer">
                <Calculator className="h-6 w-6" />
                CosPharm Pricing Engine
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
