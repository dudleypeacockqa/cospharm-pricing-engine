import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Package, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Products() {
  const { data: products, isLoading } = trpc.products.list.useQuery();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Product Catalog</h1>
          <p className="text-gray-600">
            {products?.length || 0} pharmaceutical products with configured discounts
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Package className="h-8 w-8 text-blue-600" />
                    <Badge variant="secondary">{product.category || "General"}</Badge>
                  </div>
                  <CardTitle className="mt-4">{product.name}</CardTitle>
                  <CardDescription>
                    {product.barcode && `Barcode: ${product.barcode}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Base Price</span>
                      <span className="font-bold text-lg">R {product.basePrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <TrendingDown className="h-4 w-4" />
                        Product Discount
                      </span>
                      <span className="font-semibold text-blue-600">
                        {product.productDiscount}%
                      </span>
                    </div>
                    {product.bonusPattern && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Bonus Pattern</span>
                        <Badge variant="outline">{product.bonusPattern}</Badge>
                      </div>
                    )}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">After Discount</span>
                        <span className="font-bold text-green-600">
                          R {(parseFloat(product.basePrice) * (1 - parseFloat(product.productDiscount || "0") / 100)).toFixed(2)}
                        </span>
                      </div>
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
