/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShoppingCart, X, Trash2, CreditCard, MapPin, Phone, User, Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { Product, OrderItem, PaymentMethod } from "../types.js";
import { useLanguage } from "./LanguageContext.tsx";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onRefreshData: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onRefreshData
}: CartDrawerProps) {
  const { language, t } = useLanguage();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Bank Transfer");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    setError(null);

    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          items: orderItems,
          totalAmount,
          paymentMethod
        })
      });

      if (!res.ok) {
        throw new Error(language === "id" 
          ? "Gagal memproses checkout. Silakan periksa koneksi atau persediaan stok." 
          : "Failed to process checkout. Please check your connection or stock availability.");
      }

      const newOrder = await res.json();
      setCreatedOrderId(newOrder.id);
      setCheckoutSuccess(true);
      onClearCart();
      onRefreshData();

      // Reset fields
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setShippingAddress("");
    } catch (err: any) {
      setError(err.message || (language === "id" ? "Gagal melakukan pemesanan." : "Failed to place order."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="cart-drawer-backdrop" className="fixed inset-0 bg-[#3a362e]/40 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-[#eeebe3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#5A5A40]" />
            <h3 className="text-lg font-serif font-bold text-[#2c2c24]">{t("cartTitle")}</h3>
            <span className="bg-[#5A5A40]/10 text-[#5A5A40] text-xs font-bold font-mono px-2 py-0.5 rounded-full">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-[#faf9f4] text-[#7c776c] hover:text-[#3a362e] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {checkoutSuccess ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-emerald-50 text-[#5A5A40] rounded-full">
              <CheckCircle2 className="w-16 h-16 animate-bounce" />
            </div>
            <div>
              <h4 className="text-xl font-serif font-bold text-[#2c2c24]">{t("orderSuccess")}</h4>
              <p className="text-[#7c776c] text-sm mt-1.5">
                {t("orderSuccessDesc")}
              </p>
              {createdOrderId && (
                <p className="text-xs font-mono font-bold bg-[#faf9f4] text-[#3a362e] px-3 py-1 rounded-lg inline-block mt-3 border border-[#eeebe3]">
                  {t("orderIdLabel")}: #{createdOrderId.substring(4)}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setCheckoutSuccess(false);
                setCreatedOrderId(null);
                onClose();
              }}
              className="px-6 py-2.5 bg-[#5A5A40] hover:bg-[#4a4a35] text-white font-semibold text-xs rounded-xl transition-all shadow-sm"
            >
              {t("backToShop")}
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="text-center py-16 text-[#7c776c] space-y-3">
                <ShoppingCart className="w-12 h-12 mx-auto text-[#eeebe3]" />
                <p className="text-[#3a362e] font-serif font-semibold text-sm">{t("cartEmpty")}</p>
                <p className="text-[#7c776c] text-xs">{t("cartEmptyDesc")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs font-bold text-[#7c776c] uppercase tracking-wider mb-2">
                  {language === "id" ? "Daftar Belanjaan" : "Your Shopping List"}
                </p>
                <div className="divide-y divide-[#eeebe3] max-h-[220px] overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="py-3 flex gap-3 first:pt-0 last:pb-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-14 h-14 object-cover rounded-lg border border-[#eeebe3]/50 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#2c2c24] text-xs truncate leading-tight">{item.product.name}</h4>
                        <p className="text-[10px] text-[#7c776c] mt-0.5">{item.product.origin}</p>
                        <p className="text-[#5A5A40] text-xs font-bold mt-1 font-mono">Rp{item.product.price.toLocaleString("id-ID")}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between shrink-0">
                        <button 
                          onClick={() => onRemoveFromCart(item.product.id)}
                          className="p-1 text-[#7c776c] hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center border border-[#eeebe3] rounded-lg bg-[#faf9f4] overflow-hidden text-xs">
                          <button 
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-0.5 font-bold hover:bg-[#eeebe3] text-[#7c776c]"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono font-semibold text-[#2c2c24]">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                            className="px-2 py-0.5 font-bold hover:bg-[#eeebe3] text-[#7c776c]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total Display */}
                <div className="bg-[#faf9f4] p-4 rounded-xl border border-[#eeebe3] flex justify-between items-center">
                  <span className="text-[#7c776c] text-xs font-bold">{t("subtotal")}</span>
                  <span className="text-lg font-bold text-[#2c2c24] font-mono">Rp{totalAmount.toLocaleString("id-ID")}</span>
                </div>
              </div>
            )}

            {/* Checkout Form */}
            {cartItems.length > 0 && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-4 border-t border-[#eeebe3]">
                <p className="text-xs font-bold text-[#7c776c] uppercase tracking-wider">{t("checkoutForm")}</p>
                
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-[#3a362e] text-[10px] uppercase font-bold tracking-wider mb-1.5 block flex items-center gap-1">
                      <User className="w-3 h-3 text-[#5A5A40]" /> {t("fullName")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t("fullNamePlaceholder")}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeebe3] text-[#3a362e] text-xs focus:outline-none focus:ring-2 focus:ring-[#5A5A40] placeholder-[#7c776c]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#3a362e] text-[10px] uppercase font-bold tracking-wider mb-1.5 block flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#5A5A40]" /> Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="customer@email.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeebe3] text-[#3a362e] text-xs focus:outline-none focus:ring-2 focus:ring-[#5A5A40] placeholder-[#7c776c]"
                      />
                    </div>

                    <div>
                      <label className="text-[#3a362e] text-[10px] uppercase font-bold tracking-wider mb-1.5 block flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#5A5A40]" /> {t("phone")}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder={t("phonePlaceholder")}
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeebe3] text-[#3a362e] text-xs focus:outline-none focus:ring-2 focus:ring-[#5A5A40] placeholder-[#7c776c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#3a362e] text-[10px] uppercase font-bold tracking-wider mb-1.5 block flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#5A5A40]" /> {t("address")}
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder={t("addressPlaceholder")}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeebe3] text-[#3a362e] text-xs focus:outline-none focus:ring-2 focus:ring-[#5A5A40] placeholder-[#7c776c]"
                    />
                  </div>

                  <div>
                    <label className="text-[#3a362e] text-[10px] uppercase font-bold tracking-wider mb-1.5 block flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-[#5A5A40]" /> {t("paymentMethod")}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Bank Transfer", "E-Wallet", "Cash on Delivery"] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`py-2 px-1 rounded-lg border text-[10px] font-bold transition-all ${
                            paymentMethod === method
                              ? "bg-[#5A5A40] border-[#5A5A40] text-white shadow-xs"
                              : "border-[#eeebe3] bg-white text-[#7c776c] hover:bg-[#faf9f4]"
                          }`}
                        >
                          {method === "Bank Transfer" ? t("bankTransfer") : method === "E-Wallet" ? t("ewallet") : t("cod")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-3 bg-[#5A5A40] hover:bg-[#4a4a35] disabled:bg-[#5A5A40]/60 text-white rounded-xl font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? t("submittingOrder") : t("submitOrder")}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
