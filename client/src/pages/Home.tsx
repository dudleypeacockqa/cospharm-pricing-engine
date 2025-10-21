import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, Shield, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";

export default function Home() {
  const [isSeeded, setIsSeeded] = useState(false);
  const seedMutation = trpc.seed.populate.useMutation();

  useEffect(() => {
    // Auto-seed demo data on first load
    if (!isSeeded) {
      seedMutation.mutate(undefined, {
        onSuccess: () => setIsSeeded(true),
        onError: () => setIsSeeded(true), // Ignore errors (data might already exist)
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Pharmaceutical Pricing Operations
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Automate complex sequential discount calculations with mathematical precision. 
            Eliminate manual Excel workflows and gain complete pricing transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculator">
              <Button size="lg" className="gap-2">
                Try the Calculator
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="gap-2">
                View Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">The Challenge</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Current State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-gray-600">20+ hours/week on manual Excel calculations</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-gray-600">Zero visibility into pricing breakdown</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-gray-600">High risk of calculation errors</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-gray-600">Cannot scale with catalog growth</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-700">With CosPharm Engine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <p className="text-gray-700">Automated calculations in under 500ms</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <p className="text-gray-700">Complete audit trail and transparency</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <p className="text-gray-700">99.9% accuracy guarantee</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <p className="text-gray-700">Scales effortlessly to any catalog size</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Calculator className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Sequential Discount Engine</CardTitle>
                <CardDescription>
                  Mathematical precision with Base Price → Product Discount → Log Fee → Final Price
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Real-Time Analytics</CardTitle>
                <CardDescription>
                  Comprehensive dashboards showing discount allocation and pricing performance
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Complete Audit Trail</CardTitle>
                <CardDescription>
                  Immutable logs capturing every calculation for 7-year compliance retention
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 bg-blue-600 text-white rounded-lg my-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to See It in Action?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Try the interactive pricing calculator with real pharmaceutical products
          </p>
          <Link href="/calculator">
            <Button size="lg" variant="secondary" className="gap-2">
              Launch Calculator
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

