/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { db } from "./src/server/db.js";
import { OrderStatus, PaymentMethod } from "./src/types.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

// Initialize Gemini client on server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
  console.log("Gemini AI integration successfully initialized.");
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables. AI recommendations will run in mock fallback mode.");
}

// ==================== COFFEE PRODUCTS CRUD ====================

// Read all products
app.get("/api/products", (req, res) => {
  try {
    const products = db.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Read single product
app.get("/api/products/:id", (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Create product (Admin action)
app.post("/api/products", (req, res) => {
  try {
    const { name, origin, roastLevel, flavorNotes, price, stock, description, image, rating } = req.body;
    
    if (!name || !origin || !roastLevel || !price || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newProduct = db.createProduct({
      name,
      origin,
      roastLevel,
      flavorNotes: Array.isArray(flavorNotes) ? flavorNotes : [],
      price: Number(price),
      stock: Number(stock) || 0,
      description,
      image: image || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
      rating: Number(rating) || 4.5
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update product (Admin action)
app.put("/api/products/:id", (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product (Admin action)
app.delete("/api/products/:id", (req, res) => {
  try {
    const success = db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});


// ==================== TRANSACTIONS/ORDERS CRUD ====================

// Read all orders
app.get("/api/orders", (req, res) => {
  try {
    const orders = db.getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Read single order
app.get("/api/orders/:id", (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Create order (Checkout)
app.post("/api/orders", (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, items, totalAmount, paymentMethod } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || !items.length || !totalAmount || !paymentMethod) {
      return res.status(400).json({ error: "Missing required checkout details" });
    }

    const newOrder = db.createOrder({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod as PaymentMethod
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to process checkout" });
  }
});

// Update order status (Admin action)
app.put("/api/orders/:id/status", (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status field is required" });
    }

    const updated = db.updateOrderStatus(req.params.id, status as OrderStatus);
    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Delete/Cancel order
app.delete("/api/orders/:id", (req, res) => {
  try {
    const success = db.deleteOrder(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ success: true, message: "Order deleted/cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});


// ==================== GEMINI AI RECOMMENDATION ====================

app.post("/api/ai/recommend", async (req, res) => {
  try {
    const { tastePreference, roastPreference, budget, mood, language = "id" } = req.body;
    const products = db.getProducts();

    const productSummaries = products.map(p => ({
      id: p.id,
      name: p.name,
      origin: p.origin,
      roastLevel: p.roastLevel,
      flavorNotes: p.flavorNotes.join(", "),
      price: p.price,
      description: p.description
    }));

    if (!ai) {
      // Fallback if API key is not available
      const filtered = products.filter(p => {
        if (roastPreference !== "Any" && p.roastLevel !== roastPreference) return false;
        if (budget && p.price > budget) return false;
        return true;
      });
      const selected = filtered.length > 0 ? filtered.slice(0, 2) : products.slice(0, 2);
      
      if (language === "en") {
        return res.json({
          recommendedProductIds: selected.map(s => s.id),
          reason: `Based on your taste preference of '${tastePreference}' and your mood '${mood}', we recommend our premium specialty beans tailored to satisfy your coffee cravings.`,
          brewingTip: "Use water at 90-93°C with a brewing ratio of 1:15 using a V60 brewer for the most balanced extraction and taste."
        });
      } else {
        return res.json({
          recommendedProductIds: selected.map(s => s.id),
          reason: `Berdasarkan preferensi rasa '${tastePreference}' dan mood '${mood}', kami merekomendasikan kopi Nusantara pilihan terbaik yang seimbang dan nikmat di lidah Anda.`,
          brewingTip: "Gunakan air suhu 90-93°C dengan rasio seduh 1:15 menggunakan alat seduh V60 untuk hasil rasa yang optimal."
        });
      }
    }

    const isEn = language === "en";

    const prompt = isEn
      ? `You are a professional Coffee Sommelier (coffee tasting expert) for IRGIkopi, premium Indonesian specialty coffee brand.
Here is the list of available coffees at IRGIkopi:
${JSON.stringify(productSummaries, null, 2)}

The user is asking for coffee recommendations based on these preferences:
- Taste Preference: ${tastePreference || "Any"}
- Roast Level: ${roastPreference || "Any"}
- Maximum Budget: Rp${budget ? budget.toLocaleString("id-ID") : "Unlimited"}
- Mood/Activity: ${mood || "Normal"}

Please choose a maximum of 2 coffees that best match the above criteria from the list. Return their IDs in recommendedProductIds.
Write an exceptionally engaging, warm, poetic, and high-class explanation in English (around 3-4 sentences).
CRITICAL: Never mention that you are an "AI", "AI sommelier", "AI assistant", "artificial intelligence", "algorithm", "large language model", or any tech references. Write the response purely in a friendly, expert, warm, and authoritative tone of a professional human coffee sommelier guiding a customer in IRGIkopi's boutique store.
Also provide a pro brewing tip (in English) that fits the selected coffees to maximize their flavor.`
      : `Anda adalah seorang Coffee Sommelier professional (ahli cita rasa kopi) Indonesia untuk IRGIkopi.
Berikut adalah daftar kopi yang tersedia di IRGIkopi:
${JSON.stringify(productSummaries, null, 2)}

User meminta rekomendasi kopi berdasarkan kriteria berikut:
- Preferensi Rasa: ${tastePreference || "Apa saja"}
- Tingkat Sangrai (Roast): ${roastPreference || "Any"}
- Anggaran Maksimal: Rp${budget ? budget.toLocaleString("id-ID") : "Tidak terbatas"}
- Mood/Suasana: ${mood || "Normal"}

Silakan pilih maksimal 2 kopi yang paling cocok dari daftar di atas. Berikan ID kopi tersebut dalam recommendedProductIds.
Tulis penjelasan/alasan yang sangat menarik, bersemangat, puitis, dan berkelas dalam Bahasa Indonesia (sekitar 3-4 kalimat).
PENTING: Jangan menyebutkan kata-kata seperti "Sebagai AI", "Kecerdasan Buatan", "Algoritma", "Model bahasa besar", atau referensi teknologi sejenis. Tuliskan tanggapan Anda murni dengan nada ramah, ahli, hangat, dan berwibawa layaknya seorang barista senior atau sommelier kopi manusia yang ahli secara personal di butik kopi premium IRGIkopi.
Berikan juga satu pro brewing tip khusus (Bahasa Indonesia) yang sesuai untuk kopi-kopi rekomendasi tersebut agar rasanya maksimal.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: isEn 
                ? "List of recommended coffee product IDs that best match the user's preferences."
                : "Daftar ID produk kopi yang direkomendasikan yang paling cocok dengan preferensi pengguna."
            },
            reason: {
              type: Type.STRING,
              description: isEn
                ? "An attractive explanation in English of why these coffees match the user's preferences."
                : "Penjelasan menarik dalam bahasa Indonesia mengapa kopi tersebut cocok untuk pengguna."
            },
            brewingTip: {
              type: Type.STRING,
              description: isEn
                ? "A special brewing tip in English to get the maximum flavor from the recommended coffees."
                : "Tips menyeduh kopi terpilih dalam bahasa Indonesia agar rasanya maksimal."
            }
          },
          required: ["recommendedProductIds", "reason", "brewingTip"]
        }
      }
    });

    const recommendationData = JSON.parse(response.text?.trim() || "{}");
    res.json(recommendationData);
  } catch (error) {
    console.error("Sommelier Error:", error);
    res.status(500).json({ error: "Gagal memproses rekomendasi sommelier" });
  }
});


// ==================== VITE MIDDLEWARE SETUP ====================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from dist/.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server IRGIkopi running at http://localhost:${PORT}`);
  });
}

startServer();
