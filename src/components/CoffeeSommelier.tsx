/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Coffee, Thermometer, Flame, Banknote, Smile, RefreshCw, Eye } from "lucide-react";
import { Product, RoastLevel, AIRecommendationResponse } from "../types.js";
import { motion } from "motion/react";
import { useLanguage } from "./LanguageContext.tsx";

interface CoffeeSommelierProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function CoffeeSommelier({ products, onSelectProduct }: CoffeeSommelierProps) {
  const { language, t } = useLanguage();
  const [tastePreference, setTastePreference] = useState("");
  const [roastPreference, setRoastPreference] = useState<RoastLevel | "Any">("Any");
  const [budget, setBudget] = useState(150000);
  const [mood, setMood] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const response = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tastePreference,
          roastPreference,
          budget,
          mood,
          lang: language // Pass current language to backend for localized reasons!
        }),
      });

      if (!response.ok) {
        throw new Error(language === "id" ? "Gagal mendapatkan rekomendasi dari AI" : "Failed to get recommendations from AI");
      }

      const data: AIRecommendationResponse = await response.json();
      setRecommendation(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || (language === "id" ? "Terjadi kesalahan jaringan." : "A network error occurred."));
    } finally {
      setIsLoading(false);
    }
  };

  const matchedProducts = products.filter(p => 
    recommendation?.recommendedProductIds.includes(p.id)
  );

  return (
    <div id="ai-sommelier-container" className="bg-[#5A5A40]/5 rounded-[32px] p-6 md:p-8 border border-[#5A5A40]/15 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-[#5A5A40] text-white rounded-2xl">
          <Coffee className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-semibold text-[#2c2c24]">{t("sommelierTitle")}</h2>
          <p className="text-[#7c776c] text-sm">{t("sommelierSubtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Preference Form */}
        <form onSubmit={handleGetRecommendation} className="lg:col-span-5 space-y-5">
          <div>
            <label className="block text-[#3a362e] text-sm font-semibold mb-2 flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-[#5A5A40]" /> {t("tasteLabel")}
            </label>
            <textarea
              value={tastePreference}
              onChange={(e) => setTastePreference(e.target.value)}
              placeholder={t("tastePlaceholder")}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#eeebe3] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] bg-white text-stone-900 text-sm placeholder:text-stone-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#3a362e] text-sm font-semibold mb-2 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#5A5A40]" /> {t("roastPreferenceLabel")}
              </label>
              <select
                value={roastPreference}
                onChange={(e) => setRoastPreference(e.target.value as RoastLevel | "Any")}
                className="w-full px-3 py-2.5 rounded-xl border border-[#eeebe3] bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
              >
                <option value="Any">{t("allRoastLevels")}</option>
                <option value="Light">Light ({language === "id" ? "Asam Segar" : "Bright Acidity"})</option>
                <option value="Medium">Medium ({language === "id" ? "Seimbang" : "Balanced"})</option>
                <option value="Dark">Dark ({language === "id" ? "Pahit Tebal" : "Bold Bitter"})</option>
              </select>
            </div>

            <div>
              <label className="block text-[#3a362e] text-sm font-semibold mb-2 flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-[#5A5A40]" /> {language === "id" ? "Mood / Suasana" : "Mood / Vibe"}
              </label>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder={t("moodPlaceholder")}
                className="w-full px-3 py-2.5 rounded-xl border border-[#eeebe3] bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40] placeholder:text-stone-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#3a362e] text-sm font-semibold mb-2 flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-[#5A5A40]" /> {t("budgetLabel")}
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min={80000}
                max={150000}
                step={5000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
              />
              <div className="flex justify-between text-xs text-[#7c776c] font-mono">
                <span>Rp80.000</span>
                <span className="text-[#5A5A40] font-bold text-sm">Rp{budget.toLocaleString("id-ID")}</span>
                <span>Rp150.000</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#5A5A40] hover:bg-[#4a4a35] disabled:bg-[#5A5A40]/60 text-white rounded-xl font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{language === "id" ? "Menganalisis Cita Rasa..." : "Analyzing Flavors..."}</span>
              </>
            ) : (
              <>
                <Coffee className="w-5 h-5" />
                <span>{t("sommelierSubmitBtn")}</span>
              </>
            )}
          </button>
        </form>

        {/* AI Recommendations Output */}
        <div className="lg:col-span-7 flex flex-col justify-center min-h-[300px] border border-dashed border-[#eeebe3] bg-white/50 rounded-2xl p-6">
          {isLoading && (
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <Coffee className="w-12 h-12 text-[#5A5A40] animate-bounce mx-auto" />
                <Coffee className="w-5 h-5 text-amber-700 absolute -top-1 -right-1" />
              </div>
              <div className="max-w-sm mx-auto">
                <p className="text-[#2c2c24] font-semibold text-sm">{t("sommelierLoadingTitle")}</p>
                <p className="text-[#7c776c] text-xs mt-1">{t("sommelierLoadingDesc")}</p>
              </div>
            </div>
          )}

          {!isLoading && !recommendation && !error && (
            <div className="text-center space-y-3 py-8">
              <div className="p-3 bg-white inline-block rounded-full shadow-xs text-stone-400 border border-[#eeebe3]">
                <Coffee className="w-10 h-10 text-[#5A5A40]/70" />
              </div>
              <div>
                <p className="text-[#2c2c24] font-semibold text-sm">{t("sommelierReadyTitle")}</p>
                <p className="text-[#7c776c] text-xs max-w-sm mx-auto mt-1">{t("sommelierReadyDesc")}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center p-4 bg-red-50 border border-red-100 rounded-xl text-red-800">
              <p className="font-semibold text-sm">{language === "id" ? "Gagal memuat rekomendasi" : "Failed to load recommendations"}</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          )}

          {!isLoading && recommendation && (
            <div className="space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-[#5A5A40]/10 text-[#5A5A40] text-xs font-bold rounded-full mb-2">{t("sommelierAnalysis")}</span>
                <p className="font-serif italic text-stone-800 leading-relaxed text-sm bg-white p-4 rounded-2xl border border-[#eeebe3] shadow-xs">&ldquo;{recommendation.reason}&rdquo;</p>
              </div>

              {matchedProducts.length > 0 ? (
                <div>
                  <h4 className="text-[#2c2c24] font-semibold text-xs uppercase tracking-wider mb-3">{t("sommelierRecommendedProducts")}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {matchedProducts.map(product => (
                      <div key={product.id} className="bg-white rounded-2xl p-3 border border-[#eeebe3] shadow-xs flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded-lg" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-stone-900 text-sm truncate">{product.name}</h5>
                          <p className="text-stone-500 text-xs truncate">{product.origin}</p>
                          <p className="text-[#5A5A40] text-xs font-bold mt-1">Rp{product.price.toLocaleString("id-ID")}</p>
                        </div>
                        <button
                          onClick={() => onSelectProduct(product)}
                          className="p-1.5 bg-[#5A5A40]/10 text-[#5A5A40] hover:bg-[#5A5A40]/25 rounded-lg transition-colors"
                          title={t("viewProduct")}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-stone-500 italic">
                  {language === "id" ? "Kopi terpilih tidak lagi tersedia dalam katalog saat ini." : "Selected coffee is no longer available in the current catalog."}
                </div>
              )}

              <div className="bg-[#5A5A40]/10 p-4 rounded-2xl border border-[#5A5A40]/20 flex gap-3">
                <Thermometer className="w-5 h-5 text-[#5A5A40] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[#2c2c24] font-semibold text-xs uppercase tracking-wider mb-0.5">{t("brewingTipLabel")}</h5>
                  <p className="text-[#3a362e] text-xs leading-relaxed">{recommendation.brewingTip}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
