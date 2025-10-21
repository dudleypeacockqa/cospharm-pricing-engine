import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus, Calendar, Tag, TrendingDown, Gift } from "lucide-react";

export default function Promotions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    promotionType: "percentage",
    discountValue: "",
    bonusPattern: "",
    startDate: "",
    endDate: "",
  });

  const { data: promotions, isLoading } = trpc.promotions.list.useQuery();
  const createPromotion = trpc.promotions.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Promotion Created",
        description: "The promotion has been created successfully.",
      });
      setIsDialogOpen(false);
      resetForm();
      trpc.useUtils().promotions.list.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePromotion = trpc.promotions.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Promotion Deleted",
        description: "The promotion has been deleted successfully.",
      });
      trpc.useUtils().promotions.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      promotionType: "percentage",
      discountValue: "",
      bonusPattern: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createPromotion.mutate({
      name: formData.name,
      description: formData.description || null,
      promotionType: formData.promotionType,
      discountValue: formData.discountValue ? parseFloat(formData.discountValue) : null,
      bonusPattern: formData.bonusPattern || null,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      active: true,
      priority: 0,
    });
  };

  const getPromotionIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return <TrendingDown className="h-5 w-5 text-green-600" />;
      case "fixed_amount":
        return <Tag className="h-5 w-5 text-blue-600" />;
      case "bonus_buy":
        return <Gift className="h-5 w-5 text-purple-600" />;
      default:
        return <Tag className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPromotionTypeLabel = (type: string) => {
    switch (type) {
      case "percentage":
        return "Percentage Discount";
      case "fixed_amount":
        return "Fixed Amount";
      case "bonus_buy":
        return "Bonus Buy (e.g., Buy 5 Get 1 Free)";
      case "bundle":
        return "Bundle Deal";
      default:
        return type;
    }
  };

  const isPromotionActive = (startDate: Date, endDate: Date) => {
    const now = new Date();
    return now >= new Date(startDate) && now <= new Date(endDate);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading promotions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promotions & Specials</h1>
          <p className="text-gray-600 mt-1">Manage time-based offers and bonus patterns</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1e3a8a] hover:bg-[#1e40af]">
              <Plus className="mr-2 h-4 w-4" />
              Create Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create New Promotion</DialogTitle>
                <DialogDescription>
                  Set up a new promotional offer with time-based activation
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Promotion Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Black Friday 2024"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Special discount for Black Friday weekend"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="promotionType">Promotion Type *</Label>
                  <Select
                    value={formData.promotionType}
                    onValueChange={(value) => setFormData({ ...formData, promotionType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Discount</SelectItem>
                      <SelectItem value="fixed_amount">Fixed Amount Discount</SelectItem>
                      <SelectItem value="bonus_buy">Bonus Buy (Buy X Get Y Free)</SelectItem>
                      <SelectItem value="bundle">Bundle Deal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(formData.promotionType === "percentage" || formData.promotionType === "fixed_amount") && (
                  <div className="grid gap-2">
                    <Label htmlFor="discountValue">
                      {formData.promotionType === "percentage" ? "Discount Percentage (%)" : "Discount Amount (N$)"}
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      step="0.01"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      placeholder={formData.promotionType === "percentage" ? "15" : "50.00"}
                    />
                  </div>
                )}
                {formData.promotionType === "bonus_buy" && (
                  <div className="grid gap-2">
                    <Label htmlFor="bonusPattern">Bonus Pattern</Label>
                    <Input
                      id="bonusPattern"
                      value={formData.bonusPattern}
                      onChange={(e) => setFormData({ ...formData, bonusPattern: e.target.value })}
                      placeholder="Buy 5 Get 1 Free"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#1e3a8a] hover:bg-[#1e40af]">
                  Create Promotion
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {promotions && promotions.length > 0 ? (
          promotions.map((promotion: any) => (
            <Card key={promotion.id} className="relative">
              {isPromotionActive(promotion.startDate, promotion.endDate) && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              )}
              <CardHeader>
                <div className="flex items-start gap-3">
                  {getPromotionIcon(promotion.promotionType)}
                  <div className="flex-1">
                    <CardTitle className="text-lg">{promotion.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {getPromotionTypeLabel(promotion.promotionType)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {promotion.description && (
                  <p className="text-sm text-gray-600 mb-4">{promotion.description}</p>
                )}
                
                {promotion.discountValue && (
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-[#dc2626]">
                      {promotion.promotionType === "percentage" ? `${promotion.discountValue}%` : `N$${promotion.discountValue}`}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">discount</span>
                  </div>
                )}
                
                {promotion.bonusPattern && (
                  <div className="mb-3">
                    <span className="text-sm font-semibold text-purple-600">{promotion.bonusPattern}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mt-4 pt-4 border-t flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this promotion?")) {
                        deletePromotion.mutate({ id: promotion.id });
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Gift className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Promotions Yet</h3>
              <p className="text-gray-600 text-center mb-4">
                Create your first promotion to offer special deals and discounts to your customers.
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-[#1e3a8a] hover:bg-[#1e40af]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Promotion
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

