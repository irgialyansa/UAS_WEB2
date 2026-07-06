/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import { Product, Order, OrderStatus } from "../types.js";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

// Seed Products Data
const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Aceh Gayo Organic",
    origin: "Dataran Tinggi Gayo, Aceh",
    roastLevel: "Medium",
    flavorNotes: ["Black Tea", "Caramel", "Peach", "Brown Sugar"],
    price: 95000,
    stock: 24,
    description: "Kopi Gayo organik premium dengan cita rasa seimbang, keasaman buah persik yang segar, serta sentuhan teh hitam dan karamel manis di akhir.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
    rating: 4.8
  },
  {
    id: "prod-2",
    name: "Sumatra Mandheling Classic",
    origin: "Toba, Sumatera Utara",
    roastLevel: "Dark",
    flavorNotes: ["Earthy", "Dark Chocolate", "Cedar", "Sweet Tobacco"],
    price: 88000,
    stock: 18,
    description: "Cita rasa klasik Sumatera yang legendaris. Memiliki bodi yang sangat tebal (bold), tingkat keasaman rendah, dengan aroma bumi, cokelat hitam, dan kayu cedar hangat.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=600&auto=format&fit=crop",
    rating: 4.7
  },
  {
    id: "prod-3",
    name: "Bali Kintamani Honey Process",
    origin: "Lereng Gunung Batur, Bali",
    roastLevel: "Light",
    flavorNotes: ["Citrus", "Orange", "Honey", "Jasmine"],
    price: 110000,
    stock: 15,
    description: "Diproses dengan metode Honey untuk menonjolkan kemanisan alami. Menghadirkan rasa asam segar jeruk Bali (citrus) berpadu manis madu dan aroma melati yang lembut.",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop",
    rating: 4.9
  },
  {
    id: "prod-4",
    name: "Sulawesi Toraja Kalosi",
    origin: "Tana Toraja, Sulawesi Selatan",
    roastLevel: "Medium",
    flavorNotes: ["Ripe Berry", "Herbal", "Spices", "Cacao"],
    price: 92000,
    stock: 20,
    description: "Kopi eksotis dari dataran tinggi Toraja. Menawarkan kedalaman rasa rempah-rempah nusantara yang hangat, buah beri matang, bodi penuh, serta keasaman yang anggun.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop",
    rating: 4.6
  },
  {
    id: "prod-5",
    name: "Java Preanger West Java",
    origin: "Gunung Malabar, Jawa Barat",
    roastLevel: "Medium",
    flavorNotes: ["Jasmine", "Brown Sugar", "Nutty", "Vanilla"],
    price: 85000,
    stock: 30,
    description: "Merupakan kopi bersejarah Priangan yang aromatik. Aroma melati yang khas dipadukan dengan rasa gula merah karamel, rasa gurih kacang almond, dan akhir yang manis beraroma vanila.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop",
    rating: 4.7
  },
  {
    id: "prod-6",
    name: "Flores Bajawa Gourmet",
    origin: "Bajawa, Nusa Tenggara Timur",
    roastLevel: "Dark",
    flavorNotes: ["Chocolate", "Nutty", "Macadamia", "Caramel"],
    price: 90000,
    stock: 12,
    description: "Kopi dari tanah vulkanis Flores yang kaya mineral. Menghasilkan rasa cokelat pekat berpadu rasa gurih kacang makadamia panggang dan manis karamel tebal.",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600&auto=format&fit=crop",
    rating: 4.5
  }
];

// Seed Orders
const SEED_ORDERS: Order[] = [
  {
    id: "ord-1",
    customerName: "Budi Santoso",
    customerEmail: "budi@email.com",
    customerPhone: "081234567890",
    shippingAddress: "Jl. Diponegoro No. 42, Bandung, Jawa Barat",
    items: [
      {
        productId: "prod-1",
        productName: "Aceh Gayo Organic",
        price: 95000,
        quantity: 2
      },
      {
        productId: "prod-3",
        productName: "Bali Kintamani Honey Process",
        price: 110000,
        quantity: 1
      }
    ],
    totalAmount: 300000,
    status: "Completed",
    paymentMethod: "Bank Transfer",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: "ord-2",
    customerName: "Siti Rahma",
    customerEmail: "siti@email.com",
    customerPhone: "089876543210",
    shippingAddress: "Perumahan Indah Asri Blok C-10, Kebayoran Baru, Jakarta Selatan",
    items: [
      {
        productId: "prod-2",
        productName: "Sumatra Mandheling Classic",
        price: 88000,
        quantity: 1
      }
    ],
    totalAmount: 88000,
    status: "Processing",
    paymentMethod: "E-Wallet",
    createdAt: new Date().toISOString()
  }
];

interface DbStructure {
  products: Product[];
  orders: Order[];
}

// Ensure database file and directory exist
function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DbStructure = {
      products: SEED_PRODUCTS,
      orders: SEED_ORDERS
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
    console.log("Database initialized with seed data!");
  }
}

// Read database contents
function readDb(): DbStructure {
  initDb();
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read database, resetting to seeds", error);
    return { products: SEED_PRODUCTS, orders: SEED_ORDERS };
  }
}

// Write to database
function writeDb(data: DbStructure) {
  initDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

// Database Operations
export const db = {
  // --- Products CRUD ---
  getProducts(): Product[] {
    return readDb().products;
  },

  getProductById(id: string): Product | undefined {
    return readDb().products.find(p => p.id === id);
  },

  createProduct(product: Omit<Product, "id">): Product {
    const data = readDb();
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`
    };
    data.products.push(newProduct);
    writeDb(data);
    return newProduct;
  },

  updateProduct(id: string, updatedFields: Partial<Product>): Product | null {
    const data = readDb();
    const index = data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    data.products[index] = {
      ...data.products[index],
      ...updatedFields
    };
    writeDb(data);
    return data.products[index];
  },

  deleteProduct(id: string): boolean {
    const data = readDb();
    const filtered = data.products.filter(p => p.id !== id);
    if (filtered.length === data.products.length) return false;

    data.products = filtered;
    writeDb(data);
    return true;
  },

  // --- Orders CRUD ---
  getOrders(): Order[] {
    return readDb().orders;
  },

  getOrderById(id: string): Order | undefined {
    return readDb().orders.find(o => o.id === id);
  },

  createOrder(orderData: Omit<Order, "id" | "createdAt" | "status">): Order {
    const data = readDb();
    
    // Process stock reduction for each item
    for (const item of orderData.items) {
      const prodIndex = data.products.findIndex(p => p.id === item.productId);
      if (prodIndex !== -1) {
        // Decrease stock but don't go below 0
        data.products[prodIndex].stock = Math.max(0, data.products[prodIndex].stock - item.quantity);
      }
    }

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    data.orders.push(newOrder);
    writeDb(data);
    return newOrder;
  },

  updateOrderStatus(id: string, status: OrderStatus): Order | null {
    const data = readDb();
    const index = data.orders.findIndex(o => o.id === id);
    if (index === -1) return null;

    data.orders[index].status = status;
    writeDb(data);
    return data.orders[index];
  },

  deleteOrder(id: string): boolean {
    const data = readDb();
    const filtered = data.orders.filter(o => o.id !== id);
    if (filtered.length === data.orders.length) return false;

    data.orders = filtered;
    writeDb(data);
    return true;
  }
};
