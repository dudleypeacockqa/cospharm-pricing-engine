import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Calculator, TrendingUp, Shield, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Calculator,
      title: "Sequential Discount Engine",
      description: "Mathematical precision with Base Price → Product Discount → Log Fee → Final Price calculation in under 500ms",
      color: "bg-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description: "Comprehensive dashboards showing discount allocation and pricing performance across your entire catalog",
      color: "bg-purple-500"
    },
    {
      icon: Shield,
      title: "Complete Audit Trail",
      description: "Immutable logs capturing every calculation for 7-year compliance retention and full transparency",
      color: "bg-orange-500"
    },
    {
      icon: Zap,
      title: "Sage Evolution Integration",
      description: "Seamless bidirectional sync with your ERP system for automated pricing updates and order processing",
      color: "bg-green-500"
    }
  ];

  const challenges = [
    "20+ hours/week on manual Excel calculations",
    "Zero visibility into pricing breakdown",
    "High risk of calculation errors",
    "Cannot scale with catalog growth"
  ];

  const solutions = [
    "Automated calculations in under 500ms",
    "Complete audit trail and transparency",
    "99.9% accuracy guarantee",
    "Scales effortlessly to any catalog size"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#3E4C6D] via-[#4A5C7C] to-[#5A6C8C] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2LTIuNjkgNi02cy0yLjY5LTYtNi02LTYgMi42OS02IDYgMi42OSA2IDYgNnptMCAxMmMzLjMxIDAgNi0yLjY5IDYtNnMtMi42OS02LTYtNi02IDIuNjktNiA2IDIuNjkgNiA2IDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="text-sm font-semibold tracking-wider uppercase bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                Pharmaceutical Pricing Excellence
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your Pharmaceutical<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">
                Pricing Operations
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Automate complex sequential discount calculations with mathematical precision.<br />
              Eliminate manual Excel workflows and gain complete pricing transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/calculator">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                  Try the Calculator
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 py-6 text-lg backdrop-blur-sm">
                  View Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Challenge Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">The Challenge</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-red-100 bg-red-50/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-red-700">Current State</h3>
                <ul className="space-y-4">
                  {challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-2 border-green-100 bg-green-50/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-green-700">With CosPharm Engine</h3>
                <ul className="space-y-4">
                  {solutions.map((solution, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{solution}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Core Features</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Enterprise-grade pricing automation built for pharmaceutical distribution
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-t-4 hover:shadow-xl transition-shadow duration-300" style={{ borderTopColor: feature.color.replace('bg-', '#') }}>
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMTRjMy4zMSAwIDYtMi42OSA2LTZzLTIuNjktNi02LTYtNiAyLjY5LTYgNiAyLjY5IDYgNiA2em0wIDEyYzMuMzEgMCA2LTIuNjkgNi02cy0yLjY5LTYtNi02LTYgMi42OS02IDYgMi42OSA2IDYgNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to See It in Action?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Try the interactive pricing calculator with real pharmaceutical products
          </p>
          <Link href="/calculator">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all">
              Launch Calculator
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3E4C6D] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            © 2024 CosPharm Pricing Engine. <span className="italic">Believe in Good</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

