/**
 * Pricing calculation utilities for CosPharm
 * Implements sequential discount logic: Base Price → Product Discount → Log Fee Discount → Final Price
 */

export interface PricingCalculation {
  basePrice: number;
  productDiscount: number;
  logFeeDiscount: number;
  priceAfterProductDiscount: number;
  priceAfterLogFee: number;
  finalPrice: number;
  totalDiscountAmount: number;
  totalDiscountPercentage: number;
}

/**
 * Calculate final price with sequential discounts
 * @param basePrice - Original product price (SEP)
 * @param productDiscountPercent - Product-specific discount percentage (0-100)
 * @param logFeeDiscountPercent - Customer-specific log fee discount percentage (0-100)
 * @returns Detailed pricing breakdown
 */
export function calculatePrice(
  basePrice: number,
  productDiscountPercent: number,
  logFeeDiscountPercent: number = 0
): PricingCalculation {
  // Step 1: Apply product discount
  const productDiscountMultiplier = 1 - productDiscountPercent / 100;
  const priceAfterProductDiscount = basePrice * productDiscountMultiplier;

  // Step 2: Apply log fee discount to the discounted price
  const logFeeDiscountMultiplier = 1 - logFeeDiscountPercent / 100;
  const priceAfterLogFee = priceAfterProductDiscount * logFeeDiscountMultiplier;

  // Final price
  const finalPrice = priceAfterLogFee;

  // Calculate total discount
  const totalDiscountAmount = basePrice - finalPrice;
  const totalDiscountPercentage = (totalDiscountAmount / basePrice) * 100;

  return {
    basePrice,
    productDiscount: productDiscountPercent,
    logFeeDiscount: logFeeDiscountPercent,
    priceAfterProductDiscount,
    priceAfterLogFee,
    finalPrice,
    totalDiscountAmount,
    totalDiscountPercentage,
  };
}

/**
 * Parse price string to number (handles currency formatting)
 */
export function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));
}

/**
 * Format number as price string
 */
export function formatPrice(price: number): string {
  return price.toFixed(2);
}

/**
 * Parse discount percentage string to number
 */
export function parseDiscount(discountStr: string): number {
  return parseFloat(discountStr.replace(/[^0-9.-]+/g, ""));
}

