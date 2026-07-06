/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoastLevel = "Light" | "Medium" | "Dark";

export interface Product {
  id: string;
  name: string;
  origin: string;
  roastLevel: RoastLevel;
  flavorNotes: string[];
  price: number;
  stock: number;
  description: string;
  image: string;
  rating: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Completed" | "Cancelled";

export type PaymentMethod = "Bank Transfer" | "E-Wallet" | "Cash on Delivery";

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface AIRecommendationRequest {
  tastePreference: string;
  roastPreference: RoastLevel | "Any";
  budget: number;
  mood: string;
}

export interface AIRecommendationResponse {
  recommendedProductIds: string[];
  reason: string;
  brewingTip: string;
}
