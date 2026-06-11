export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  loyaltyPoints: number;
  referralCode: string;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string; // Home, Work, etc.
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Seller {
  id: string;
  userId: string;
  companyName: string;
  logo: string;
  rating: number;
  description: string;
  joinedAt: string;
  isVerified: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentCategoryId?: string; // For subcategories
  image?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size?: string;
  color?: string;
  material?: string;
  price: number;
  discountPrice?: number;
  stock: number;
}

export interface Product {
  id: string;
  sellerId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  specs: Record<string, string>;
  basePrice: number;
  currentDiscount?: number;
  averageRating: number;
  reviewCount: number;
  isAiRecommended?: boolean;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  maxDiscountAmount: number;
  minOrderValue: number;
  expiresAt: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  userId: string;
  sellerId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCharge: number;
  couponApplied?: string;
  discountAmount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'REFUNDED';
  addressId: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  sentimentConfidence?: number;
  isFlaggedFake?: boolean;
  aiReviewSummary?: string;
  createdAt: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  createdAt: string;
}

// AI Engine Metrics
export interface InventoryForecast {
  productId: string;
  productName: string;
  currentStock: number;
  predictedDemandQuantity: number;
  daysToStockout: number;
  recommendedRestockQty: number;
}

export interface PricingOptimization {
  productId: string;
  productName: string;
  originalPrice: number;
  optimizedPrice: number;
  competitorAvgPrice: number;
  demandFactor: number; // 0.5 to 1.5
  seasonMultiplier: number;
}
