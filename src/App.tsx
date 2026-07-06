/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Coffee, Sparkles, ShoppingBag, ShoppingCart, UserCheck, Shield, 
  MapPin, Clock, Truck, ShieldCheck, Heart, ArrowRight, Star, Plus, Eye 
} from "lucide-react";
import { Product, Order } from "./types.js";
import CoffeeSommelier from "./components/CoffeeSommelier.tsx";
import ProductCatalog from "./components/ProductCatalog.tsx";
import AdminDashboard from "./components/AdminDashboard.tsx";
import CartDrawer, { CartItem } from "./components/CartDrawer.tsx";
import { useLanguage } from "./components/LanguageContext.tsx";
// @ts-ignore
import logoImg from "./assets/images/irgikopi_logo_1783331419657.jpg";

export default function App() {
  const { language, setLanguage, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const [userRole, setUserRole] = useState<"buyer" | "admin">("buyer");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch products and orders
  const fetchData = async () => {
    try {
      const [prodRes, ordRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders")
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData);
      }
    } catch (error) {
      console.error("Gagal memuat data dari server:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        return prevItems.map((item) => 
          item.product.id === product.id 
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
    // Visual feedback
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fdfcf8] text-[#3a362e]">
      {/* Role and Utility Switcher Bar */}
      <div className="bg-[#5A5A40] text-white/90 py-2.5 px-4 text-xs font-semibold flex justify-between items-center border-b border-[#4a4a35]">
        <div className="flex items-center gap-1.5 text-white/80">
          <Coffee className="w-3.5 h-3.5 text-[#faf9f4]" />
          <span>{t("welcomeBanner")}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-white/60 hidden sm:inline">{language === "id" ? "Pilih Tampilan Peran:" : "Select Role View:"}</span>
          <div className="flex bg-[#4a4a35] p-0.5 rounded-xl border border-[#3f3f2d]">
            <button
              onClick={() => setUserRole("buyer")}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                userRole === "buyer" 
                  ? "bg-[#5A5A40] text-white shadow-xs" 
                  : "text-white/60 hover:text-white"
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>{language === "id" ? "Pembeli" : "Buyer"}</span>
            </button>
            <button
              onClick={() => setUserRole("admin")}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                userRole === "admin" 
                  ? "bg-[#5A5A40] text-white shadow-xs border border-white/10" 
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>{language === "id" ? "Admin Toko" : "Store Admin"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Premium Header */}
      <header className="sticky top-0 bg-[#fdfcf8]/90 backdrop-blur-md border-b border-[#eeebe3] z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setUserRole("buyer")}>
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[#eeebe3] shadow-sm flex items-center justify-center bg-white shrink-0">
              <img 
                src={logoImg} 
                alt="IRGIkopi Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-xl font-serif font-bold tracking-tight text-[#2c2c24] block leading-tight">IRGIkopi</span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#5A5A40] block font-mono">
                {language === "id" ? "Spesialis Arabika" : "Arabica Specialty"}
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#7c776c]">
            <button onClick={() => { setUserRole("buyer"); setTimeout(() => document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="hover:text-[#5A5A40] transition-colors">{t("allCoffee")}</button>
            <button onClick={() => { setUserRole("buyer"); setTimeout(() => document.getElementById("ai-sommelier-container")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="hover:text-[#5A5A40] transition-colors flex items-center gap-1"><Coffee className="w-3.5 h-3.5 text-[#5A5A40]" /> {t("sommelier")}</button>
            <button onClick={() => { setUserRole("buyer"); setTimeout(() => document.getElementById("advantages-section")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="hover:text-[#5A5A40] transition-colors">{t("advantages")}</button>
            {orders.length > 0 && <button onClick={() => { setUserRole("buyer"); setTimeout(() => document.getElementById("invoice-history-section")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="hover:text-[#5A5A40] transition-colors">{t("myOrders")}</button>}
          </nav>

          {/* Cart Icon & Language Selector */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex bg-[#faf9f4] p-1 rounded-xl border border-[#eeebe3] items-center gap-1 shrink-0">
              <button
                onClick={() => setLanguage("id")}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all uppercase ${
                  language === "id"
                    ? "bg-[#5A5A40] text-white"
                    : "text-[#7c776c] hover:text-[#5A5A40]"
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all uppercase ${
                  language === "en"
                    ? "bg-[#5A5A40] text-white"
                    : "text-[#7c776c] hover:text-[#5A5A40]"
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-white hover:bg-[#faf9f4] text-[#3a362e] hover:text-[#5A5A40] rounded-xl transition-all border border-[#eeebe3] flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#5A5A40] text-white font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Application Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        {!isLoaded ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
            <div className="w-10 h-10 border-4 border-[#5A5A40] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#7c776c] text-xs font-semibold">{t("loadingData")}</p>
          </div>
        ) : (
          <>
            {userRole === "buyer" ? (
              // BUYER / CUSTOMER VIEW
              <div className="space-y-12">
                
                {/* Hero / Promo Section */}
                <div className="relative bg-[#5A5A40] rounded-[32px] overflow-hidden p-8 md:p-12 lg:p-16 text-white border border-[#4a4a35] shadow-md flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 text-[#faf9f4] text-xs font-bold uppercase tracking-wider rounded-xl">
                      {language === "id" ? "🏆 100% Arabika Nusantara Asli" : "🏆 100% Authentic Indonesian Arabica"}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-serif font-semibold leading-tight tracking-tight">
                      {language === "id" ? (
                        <>
                          Seduh Cita Rasa <br className="hidden md:inline" />
                          <span className="text-[#faf9f4]">
                            Tanah Vulkanis Nusantara
                          </span>
                        </>
                      ) : (
                        <>
                          Brew the Flavor of <br className="hidden md:inline" />
                          <span className="text-[#faf9f4]">
                            Indonesian Volcanic Soil
                          </span>
                        </>
                      )}
                    </h1>
                    <p className="text-[#faf9f4]/80 text-sm md:text-base leading-relaxed max-w-lg font-light">
                      {language === "id" 
                        ? "Menghadirkan kurasi biji kopi arabika terbaik dari ujung barat Sumatera hingga timur Flores, disangrai secara eksklusif untuk menghasilkan cita rasa kelas dunia." 
                        : "Bringing a premium curation of the finest arabica coffee beans from the western tip of Sumatra to the east of Flores, exclusively roasted to produce world-class flavor."
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 pt-2">
                      <button 
                        onClick={() => document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" })}
                        className="px-6 py-3 bg-white text-[#5A5A40] hover:bg-[#faf9f4] rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-black/5"
                      >
                        <span>{language === "id" ? "Jelajahi Kopi" : "Explore Coffees"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => document.getElementById("ai-sommelier-container")?.scrollIntoView({ behavior: "smooth" })}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-white/25"
                      >
                        <Coffee className="w-4 h-4 text-white" />
                        <span>{language === "id" ? "Konsultasi Sommelier" : "Consult Sommelier"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 aspect-square max-w-[280px] bg-white/5 rounded-3xl border border-white/10 p-4 flex items-center justify-center relative shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop" 
                      alt="IRGIkopi Hero Bean" 
                      className="w-full h-full object-cover rounded-2xl shadow-2xl relative z-10 filter brightness-95"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full"></div>
                  </div>
                </div>

                {/* AI Sommelier Section */}
                <section id="ai-sommelier-section" className="scroll-mt-24">
                  <CoffeeSommelier 
                    products={products} 
                    onSelectProduct={(product) => setSelectedProduct(product)} 
                  />
                </section>

                {/* Advantages Bento Section */}
                <section id="advantages-section" className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-[32px] border border-[#eeebe3] shadow-sm">
                  <div className="flex items-start gap-4 p-4 hover:bg-[#faf9f4] rounded-2xl transition-colors">
                    <div className="p-3 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif font-semibold text-[#2c2c24] text-sm">
                        {language === "id" ? "Pengiriman Seluruh Indonesia" : "Nationwide Delivery"}
                      </h4>
                      <p className="text-[#7c776c] text-xs mt-1">
                        {language === "id" 
                          ? "Kemasan kedap udara premium dilindungi bubble wrap tebal menjamin kopi segar sampai di rumah Anda." 
                          : "Premium airtight packaging protected by thick bubble wrap guarantees fresh coffee delivered to your doorstep."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 hover:bg-[#faf9f4] rounded-2xl transition-colors">
                    <div className="p-3 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif font-semibold text-[#2c2c24] text-sm">
                        {language === "id" ? "Freshly Roasted Guarantee" : "Freshly Roasted Guarantee"}
                      </h4>
                      <p className="text-[#7c776c] text-xs mt-1">
                        {language === "id" 
                          ? "Kami hanya menjual biji kopi dengan waktu sangrai (roast date) tidak lebih dari 14 hari untuk rasa optimal." 
                          : "We only sell coffee beans with a roast date of no more than 14 days for optimal flavor."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 hover:bg-[#faf9f4] rounded-2xl transition-colors">
                    <div className="p-3 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif font-semibold text-[#2c2c24] text-sm">
                        {language === "id" ? "Kemurnian Terjamin" : "Guaranteed Purity"}
                      </h4>
                      <p className="text-[#7c776c] text-xs mt-1">
                        {language === "id" 
                          ? "100% murni kopi arabika single origin tanpa campuran perasa buatan, jagung, ataupun pengawet." 
                          : "100% pure single origin arabica coffee without any artificial flavors, corn, or preservatives."}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Product Catalog Section */}
                <section id="catalog-section" className="scroll-mt-24">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h2 className="text-2xl font-serif font-semibold text-[#2c2c24]">
                        {language === "id" ? "Etalase Kopi Nusantara" : "Indonesian Coffee Showcase"}
                      </h2>
                      <p className="text-[#7c776c] text-xs mt-1">
                        {language === "id" 
                          ? "Pilih kemurnian biji kopi arabika pilihan dari pegunungan vulkanis legendaris." 
                          : "Choose the purity of selected arabica coffee beans from legendary volcanic mountains."}
                      </p>
                    </div>
                    <span className="text-xs text-[#7c776c] font-semibold font-mono bg-white px-3 py-1.5 rounded-lg border border-[#eeebe3] shadow-xs">
                      {language === "id" ? `${products.length} Kopi Tersedia` : `${products.length} Coffees Available`}
                    </span>
                  </div>

                  <ProductCatalog 
                    products={products}
                    onAddToCart={handleAddToCart}
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                  />
                </section>

                {/* Buyer Order History Section */}
                {orders.length > 0 && (
                  <section id="invoice-history-section" className="bg-white rounded-[32px] p-6 md:p-8 border border-[#eeebe3] shadow-sm space-y-4">
                    <div>
                      <h3 className="text-lg font-serif font-semibold text-[#2c2c24] flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-[#5A5A40]" />
                        <span>{t("activeOrders")}</span>
                      </h3>
                      <p className="text-[#7c776c] text-xs mt-1">{t("activeOrdersDesc")}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-[#eeebe3] p-4 rounded-2xl bg-[#faf9f4] text-xs space-y-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-bold font-mono text-[#2c2c24]">Invoice: #{order.id.substring(4)}</span>
                              <span className="text-[#7c776c] block text-[10px]">{new Date(order.createdAt).toLocaleDateString("id-ID")}</span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                              order.status === "Pending" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                              order.status === "Processing" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                              order.status === "Shipped" ? "bg-[#5A5A40]/10 text-[#5A5A40] border border-[#5A5A40]/20" :
                              order.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                              "bg-red-50 text-red-700 border border-red-200"
                            }`}>
                              {order.status}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-[#3a362e]">
                                <span>{item.quantity}x {item.productName}</span>
                                <span className="font-mono text-[#7c776c]">Rp{(item.price * item.quantity).toLocaleString("id-ID")}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-[#eeebe3] flex justify-between items-center font-bold text-[#2c2c24]">
                            <span>{language === "id" ? "Total Pembayaran" : "Total Payment"} ({order.paymentMethod})</span>
                            <span className="font-mono text-[#5A5A40]">Rp{order.totalAmount.toLocaleString("id-ID")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              </div>
            ) : (
              // ADMIN CONTROL DASHBOARD VIEW
              <AdminDashboard 
                products={products}
                orders={orders}
                onRefreshData={fetchData}
              />
            )}
          </>
        )}
      </main>

      {/* Shopping Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onRefreshData={fetchData}
      />

      {/* Elegant Footer */}
      <footer className="bg-[#5A5A40] text-white/90 mt-16 pt-12 pb-6 px-4 md:px-8 border-t border-[#4a4a35]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#4a4a35] bg-white flex items-center justify-center shrink-0">
                <img 
                  src={logoImg} 
                  alt="IRGIkopi Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-lg font-serif font-semibold text-white">IRGIkopi</span>
            </div>
            <p className="text-xs text-[#faf9f4]/75 leading-relaxed font-light font-sans">
              {t("footerDesc")}
            </p>
          </div>

          <div>
            <h4 className="text-white text-xs uppercase font-extrabold tracking-wider mb-4 font-serif">
              {language === "id" ? "Metode Pembayaran" : "Payment Methods"}
            </h4>
            <ul className="text-xs space-y-2 text-[#faf9f4]/75 font-medium">
              <li>• {language === "id" ? "Transfer Bank Mandiri/BCA/BRI" : "Bank Transfer Mandiri/BCA/BRI"}</li>
              <li>• E-Wallet (GoPay, OVO, Dana)</li>
              <li>• Cash on Delivery (COD)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs uppercase font-extrabold tracking-wider mb-4 font-serif">
              {language === "id" ? "Wilayah Kurasi" : "Curation Regions"}
            </h4>
            <ul className="text-xs space-y-2 text-[#faf9f4]/75 font-medium">
              <li>• {language === "id" ? "Dataran Tinggi Gayo, Aceh" : "Gayo Highlands, Aceh"}</li>
              <li>• {language === "id" ? "Danau Toba, Sumatera Utara" : "Lake Toba, North Sumatra"}</li>
              <li>• {language === "id" ? "Gunung Malabar & Malabar, Jawa" : "Mt. Malabar & West Java"}</li>
              <li>• {language === "id" ? "Lereng Gunung Batur, Bali Kintamani" : "Mt. Batur Slopes, Bali Kintamani"}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs uppercase font-extrabold tracking-wider mb-4 font-serif">
              {t("footerHonors")}
            </h4>
            <ul className="text-xs space-y-2 text-[#faf9f4]/75 font-medium">
              <li>{t("honor1")}</li>
              <li>{t("honor2")}</li>
              <li>{t("honor3")}</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[#4a4a35] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} {language === "id" ? "IRGIkopi Specialty Beans. Seluruh hak cipta dilindungi." : "IRGIkopi Specialty Beans. All rights reserved."}</p>
          <div className="flex gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">{t("footerTerms")}</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">{t("footerPrivacy")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
