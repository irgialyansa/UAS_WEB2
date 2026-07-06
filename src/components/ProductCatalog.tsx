/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, SlidersHorizontal, Star, ShoppingBag, X, Coffee, MapPin, Layers, Heart, Info } from "lucide-react";
import { Product, RoastLevel } from "../types.js";
import { useLanguage } from "./LanguageContext.tsx";

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

export default function ProductCatalog({ 
  products, 
  onAddToCart, 
  selectedProduct, 
  setSelectedProduct 
}: ProductCatalogProps) {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedRoast, setSelectedRoast] = useState<RoastLevel | "All">("All");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "rating">("default");
  const [quantity, setQuantity] = useState(1);

  // Search & Filter logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.origin.toLowerCase().includes(search.toLowerCase()) ||
      product.flavorNotes.some(note => note.toLowerCase().includes(search.toLowerCase()));
    
    const matchesRoast = selectedRoast === "All" || product.roastLevel === selectedRoast;

    return matchesSearch && matchesRoast;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // default
  });

  const getRoastColor = (roast: RoastLevel) => {
    switch (roast) {
      case "Light": return "bg-[#5A5A40]/10 text-[#5A5A40] border-[#5A5A40]/20";
      case "Medium": return "bg-[#8f806a]/15 text-[#8f806a] border-[#8f806a]/20";
      case "Dark": return "bg-[#4a4131] text-[#faf9f4] border-[#3a3326]";
    }
  };

  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  return (
    <div id="product-catalog-section" className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[24px] border border-[#eeebe3] shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7c776c] w-5 h-5" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#eeebe3] bg-[#faf9f4]/50 text-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:bg-white transition-all placeholder:text-[#7c776c]"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-1.5 text-[#7c776c] text-sm font-medium">
            <SlidersHorizontal className="w-4 h-4" />
            <span>{language === "id" ? "Filter:" : "Filter:"}</span>
          </div>

          <div className="flex bg-[#faf9f4] p-1 rounded-xl border border-[#eeebe3]">
            {(["All", "Light", "Medium", "Dark"] as const).map((roast) => (
              <button
                key={roast}
                onClick={() => setSelectedRoast(roast)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedRoast === roast
                    ? "bg-[#5A5A40] text-white shadow-sm"
                    : "text-[#7c776c] hover:text-[#5A5A40]"
                }`}
              >
                {roast === "All" ? (language === "id" ? "Semua Tingkat" : "All Levels") : roast}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-[#eeebe3] bg-white text-[#3a362e] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
          >
            <option value="default">{language === "id" ? "Urutkan Default" : "Default Sorting"}</option>
            <option value="price-asc">{language === "id" ? "Harga: Terendah" : "Price: Low to High"}</option>
            <option value="price-desc">{language === "id" ? "Harga: Tertinggi" : "Price: High to Low"}</option>
            <option value="rating">{language === "id" ? "Rating Tertinggi" : "Highest Rating"}</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[32px] border border-[#eeebe3] shadow-sm">
          <Coffee className="w-12 h-12 text-[#7c776c]/40 mx-auto mb-3" />
          <p className="text-[#2c2c24] font-serif font-semibold text-lg">{language === "id" ? "Kopi tidak ditemukan" : "Coffee not found"}</p>
          <p className="text-[#7c776c] text-sm max-w-sm mx-auto mt-1">
            {language === "id" ? "Coba gunakan kata kunci lain atau ubah filter tingkat sangrai." : "Try using other keywords or change the roast level filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-[24px] border border-[#eeebe3] shadow-xs overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col h-full"
            >
              {/* Product Image & Badge */}
              <div className="relative aspect-video overflow-hidden bg-[#faf9f4]">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border shadow-sm ${getRoastColor(product.roastLevel)}`}>
                    {product.roastLevel} Roast
                  </span>
                </div>
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center backdrop-blur-xs">
                    <span className="px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg">{t("outOfStock")}</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1 text-[#7c776c] text-xs">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-[#5A5A40]" />
                    <span className="truncate">{product.origin}</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-md text-xs font-bold shrink-0 border border-yellow-200/40">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-serif font-semibold text-[#2c2c24] line-clamp-1 mb-2">{product.name}</h3>
                
                <p className="text-[#7c776c] text-xs line-clamp-2 leading-relaxed mb-4 flex-1">{product.description}</p>

                {/* Flavor Notes */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.flavorNotes.slice(0, 3).map((note, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-[#5A5A40]/5 text-[#5A5A40] text-[10px] font-semibold rounded-md border border-[#5A5A40]/15">
                      {note}
                    </span>
                  ))}
                  {product.flavorNotes.length > 3 && (
                    <span className="px-2 py-0.5 bg-[#5A5A40]/5 text-[#5A5A40]/70 text-[10px] font-bold rounded-md border border-[#5A5A40]/15">
                      +{product.flavorNotes.length - 3}
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t border-[#eeebe3] flex items-center justify-between gap-3 mt-auto">
                  <div>
                    <span className="text-[#7c776c] text-[10px] uppercase tracking-wider font-bold block">{language === "id" ? "Harga / 250gr" : "Price / 250g"}</span>
                    <span className="text-lg font-bold text-[#2c2c24] font-mono">Rp{product.price.toLocaleString("id-ID")}</span>
                  </div>

                  <button
                    onClick={() => handleOpenDetail(product)}
                    className="px-4 py-2 bg-[#5A5A40] hover:bg-[#4a4a35] text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{language === "id" ? "Detail" : "Details"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-[#3a362e]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#eeebe3] flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">
            {/* Modal Image */}
            <div className="md:w-1/2 relative bg-[#faf9f4] aspect-square md:aspect-auto">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 md:hidden p-2 bg-white/80 hover:bg-white text-[#3a362e] rounded-full shadow-md backdrop-blur-xs transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="hidden md:flex justify-end mb-2">
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="p-1.5 hover:bg-[#faf9f4] text-[#7c776c] hover:text-[#3a362e] rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md border ${getRoastColor(selectedProduct.roastLevel)}`}>
                    {selectedProduct.roastLevel} Roast
                  </span>
                  <span className="text-[#eeebe3] text-xs">|</span>
                  <span className="text-[#7c776c] text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#5A5A40]" />
                    {selectedProduct.origin}
                  </span>
                </div>

                <h2 className="text-2xl font-serif font-semibold text-[#2c2c24] mb-3">{selectedProduct.name}</h2>

                <div className="flex items-center gap-1 mb-4">
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star 
                        key={idx} 
                        className={`w-4 h-4 ${idx < Math.floor(selectedProduct.rating) ? "fill-yellow-500 text-yellow-500" : "text-stone-200"}`} 
                      />
                    ))}
                  </div>
                  <span className="text-[#3a362e] text-xs font-bold font-mono ml-1">{selectedProduct.rating} / 5.0</span>
                </div>

                <div className="space-y-4 text-sm text-[#3a362e] mb-6">
                  <div>
                    <h4 className="text-[#2c2c24] font-bold text-xs uppercase tracking-wider mb-1">
                      {language === "id" ? "Catatan Rasa (Flavor Notes)" : "Flavor Notes"}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.flavorNotes.map((note, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-[#5A5A40]/5 text-[#5A5A40] text-xs font-medium rounded-lg border border-[#5A5A40]/15">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[#2c2c24] font-bold text-xs uppercase tracking-wider mb-1">
                      {language === "id" ? "Deskripsi Kopi" : "Coffee Description"}
                    </h4>
                    <p className="leading-relaxed text-xs text-[#7c776c]">{selectedProduct.description}</p>
                  </div>

                  <div className="flex justify-between items-center bg-[#faf9f4] p-3 rounded-xl border border-[#eeebe3]">
                    <span className="text-[#7c776c] text-xs">
                      {language === "id" ? "Ketersediaan Stok" : "Stock Availability"}
                    </span>
                    <span className={`text-xs font-bold ${selectedProduct.stock > 0 ? "text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md" : "text-red-700 bg-red-50 px-2 py-0.5 rounded-md"}`}>
                      {selectedProduct.stock > 0 
                        ? (language === "id" ? `${selectedProduct.stock} pack tersedia` : `${selectedProduct.stock} pack available`)
                        : (language === "id" ? "Stok Habis" : "Out of Stock")
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="pt-4 border-t border-[#eeebe3] flex items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[#7c776c] text-[10px] uppercase tracking-wider block">
                      {language === "id" ? "Total Harga" : "Total Price"}
                    </span>
                    <span className="text-xl font-bold text-[#2c2c24] font-mono">Rp{(selectedProduct.price * quantity).toLocaleString("id-ID")}</span>
                  </div>

                  {selectedProduct.stock > 0 && (
                    <div className="flex items-center border border-[#eeebe3] rounded-xl bg-white overflow-hidden">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-2.5 py-1.5 text-[#7c776c] hover:bg-[#faf9f4] font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 text-[#3a362e] font-mono text-sm font-semibold">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(q => Math.min(selectedProduct.stock, q + 1))}
                        className="px-2.5 py-1.5 text-[#7c776c] hover:bg-[#faf9f4] font-bold"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 py-3 border border-[#eeebe3] hover:bg-[#faf9f4] text-[#3a362e] font-semibold text-xs rounded-xl transition-all"
                  >
                    {language === "id" ? "Kembali" : "Back"}
                  </button>

                  <button
                    onClick={() => {
                      onAddToCart(selectedProduct, quantity);
                      setSelectedProduct(null);
                    }}
                    disabled={selectedProduct.stock === 0}
                    className="flex-1 py-3 bg-[#5A5A40] hover:bg-[#4a4a35] disabled:bg-stone-300 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t("addToCart")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
