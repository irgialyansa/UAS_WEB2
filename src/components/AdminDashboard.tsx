/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Coffee, ShoppingBag, Plus, Edit2, Trash2, ListOrdered, CheckCircle, 
  X, RefreshCw, Layers, MapPin, DollarSign, Package, AlertCircle 
} from "lucide-react";
import { Product, Order, OrderStatus, RoastLevel, PaymentMethod } from "../types.js";
import { useLanguage } from "./LanguageContext.tsx";

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onRefreshData: () => void;
}

export default function AdminDashboard({ products, orders, onRefreshData }: AdminDashboardProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  
  // Products form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  
  const [prodName, setProdName] = useState("");
  const [prodOrigin, setProdOrigin] = useState("");
  const [prodRoast, setProdRoast] = useState<RoastLevel>("Medium");
  const [prodPrice, setProdPrice] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodNotes, setProdNotes] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodImage, setProdImage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const resetProductForm = () => {
    setEditingProduct(null);
    setProdName("");
    setProdOrigin("");
    setProdRoast("Medium");
    setProdPrice("");
    setProdStock("");
    setProdNotes("");
    setProdDesc("");
    setProdImage("");
  };

  const handleOpenAddProduct = () => {
    resetProductForm();
    setIsProductFormOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdOrigin(product.origin);
    setProdRoast(product.roastLevel);
    setProdPrice(product.price.toString());
    setProdStock(product.stock.toString());
    setProdNotes(product.flavorNotes.join(", "));
    setProdDesc(product.description);
    setProdImage(product.image);
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const productPayload = {
      name: prodName,
      origin: prodOrigin,
      roastLevel: prodRoast,
      flavorNotes: prodNotes.split(",").map(n => n.trim()).filter(n => n),
      price: Number(prodPrice),
      stock: Number(prodStock),
      description: prodDesc,
      image: prodImage || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop"
    };

    try {
      let url = "/api/products";
      let method = "POST";

      if (editingProduct) {
        url = `/api/products/${editingProduct.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload)
      });

      if (!res.ok) {
        throw new Error(language === "id" ? "Gagal menyimpan produk kopi." : "Failed to save coffee product.");
      }

      setMessage({
        type: "success",
        text: editingProduct 
          ? (language === "id" ? "Kopi berhasil diperbarui!" : "Coffee successfully updated!")
          : (language === "id" ? "Kopi baru berhasil ditambahkan ke katalog!" : "New coffee successfully added to catalog!")
      });
      setIsProductFormOpen(false);
      resetProductForm();
      onRefreshData();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || (language === "id" ? "Gagal menyimpan data." : "Failed to save data.") });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const isConfirmed = confirm(language === "id" 
      ? "Apakah Anda yakin ingin menghapus produk kopi ini dari katalog IRGIkopi?" 
      : "Are you sure you want to delete this coffee product from the IRGIkopi catalog?");
    if (!isConfirmed) return;
    setIsLoading(true);
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(language === "id" ? "Gagal menghapus produk." : "Failed to delete product.");
      
      setMessage({ type: "success", text: language === "id" ? "Produk kopi berhasil dihapus dari katalog." : "Coffee product successfully deleted from the catalog." });
      onRefreshData();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || (language === "id" ? "Gagal menghapus produk." : "Failed to delete product.") });
    } finally {
      setIsLoading(false);
    }
  };

  // Orders logic
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      if (!res.ok) throw new Error(language === "id" ? "Gagal memperbarui status transaksi." : "Failed to update transaction status.");

      setMessage({ 
        type: "success", 
        text: language === "id" 
          ? `Status pesanan #${orderId.substring(4)} diperbarui menjadi ${status}!` 
          : `Order #${orderId.substring(4)} status updated to ${status}!`
      });
      onRefreshData();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || (language === "id" ? "Gagal mengubah status pesanan." : "Failed to change order status.") });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const isConfirmed = confirm(language === "id" 
      ? "Apakah Anda yakin ingin menghapus catatan transaksi ini secara permanen?" 
      : "Are you sure you want to permanently delete this transaction record?");
    if (!isConfirmed) return;
    
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(language === "id" ? "Gagal menghapus catatan transaksi." : "Failed to delete transaction record.");

      setMessage({ type: "success", text: language === "id" ? "Catatan transaksi berhasil dihapus dari sistem." : "Transaction record successfully deleted from the system." });
      onRefreshData();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || (language === "id" ? "Gagal menghapus transaksi." : "Failed to delete transaction.") });
    }
  };

  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Shipped":
        return "bg-[#5A5A40]/10 text-[#5A5A40] border-[#5A5A40]/20";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
    }
  };

  return (
    <div id="admin-dashboard-container" className="bg-white rounded-[32px] border border-[#eeebe3] shadow-sm overflow-hidden p-6 md:p-8">
      {/* Admin Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#eeebe3]">
        <div>
          <span className="px-2.5 py-0.5 bg-[#5A5A40] text-white text-[10px] font-bold tracking-wider uppercase rounded-md">
            {language === "id" ? "Mode Administrator" : "Administrator Mode"}
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#2c2c24] mt-1">IRGIkopi Management</h2>
          <p className="text-[#7c776c] text-sm">
            {language === "id" 
              ? "Kelola katalog kopi arabika, stok, dan proses pengiriman transaksi pembeli secara real-time." 
              : "Manage arabica coffee catalog, stock, and process buyer transactions in real-time."}
          </p>
        </div>

        <button 
          onClick={onRefreshData}
          className="px-4 py-2 bg-[#faf9f4] hover:bg-[#eeebe3] text-[#3a362e] text-xs font-semibold rounded-xl transition-all border border-[#eeebe3] flex items-center justify-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{language === "id" ? "Segarkan Data" : "Refresh Data"}</span>
        </button>
      </div>

      {/* Alerts */}
      {message && (
        <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${
          message.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
            : "bg-red-50 text-red-800 border-red-200"
        }`}>
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          )}
          <div>
            <p className="font-semibold text-sm">
              {message.type === "success" 
                ? (language === "id" ? "Operasi Sukses" : "Operation Success") 
                : (language === "id" ? "Kesalahan Sistem" : "System Error")}
            </p>
            <p className="text-xs mt-0.5">{message.text}</p>
          </div>
          <button onClick={() => setMessage(null)} className="ml-auto text-stone-400 hover:text-stone-700 text-sm">×</button>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex border-b border-[#eeebe3] mb-6 gap-2">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "products"
              ? "border-[#5A5A40] text-[#5A5A40]"
              : "border-transparent text-[#7c776c] hover:text-[#5A5A40]"
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>{language === "id" ? "Katalog Produk Kopi" : "Coffee Catalog"} ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "orders"
              ? "border-[#5A5A40] text-[#5A5A40]"
              : "border-transparent text-[#7c776c] hover:text-[#5A5A40]"
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>{language === "id" ? "Kelola Transaksi" : "Manage Transactions"} ({orders.length})</span>
        </button>
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-serif font-semibold text-[#2c2c24] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#5A5A40]" />
              <span>{language === "id" ? "Daftar Biji Kopi" : "Coffee Beans List"}</span>
            </h3>
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2.5 bg-[#5A5A40] hover:bg-[#4a4a35] text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{language === "id" ? "Tambah Kopi Nusantara" : "Add Nusantara Coffee"}</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto border border-[#eeebe3] rounded-2xl bg-[#faf9f4]/25">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#faf9f4] border-b border-[#eeebe3] text-[#7c776c] font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4">{language === "id" ? "Nama Produk" : "Product Name"}</th>
                  <th className="py-3.5 px-4">{language === "id" ? "Asal Daerah" : "Origin Region"}</th>
                  <th className="py-3.5 px-4">{language === "id" ? "Tingkat Roast" : "Roast Level"}</th>
                  <th className="py-3.5 px-4 text-right">{language === "id" ? "Harga / 250gr" : "Price / 250g"}</th>
                  <th className="py-3.5 px-4 text-center">{language === "id" ? "Stok (Pack)" : "Stock (Packs)"}</th>
                  <th className="py-3.5 px-4 text-center">{language === "id" ? "Aksi" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeebe3]">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#faf9f4]/50 bg-white transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-10 h-10 object-cover rounded-lg border border-[#eeebe3]/50 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-[#2c2c24] leading-tight">{product.name}</p>
                          <p className="text-[10px] text-[#7c776c] mt-0.5 truncate max-w-[150px] font-mono">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#3a362e] font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#5A5A40]" />
                        <span>{product.origin}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        product.roastLevel === "Light" ? "bg-[#5A5A40]/10 text-[#5A5A40] border-[#5A5A40]/20" :
                        product.roastLevel === "Medium" ? "bg-[#8f806a]/15 text-[#8f806a] border-[#8f806a]/20" :
                        "bg-[#4a4131] text-[#faf9f4] border-[#3a3326]"
                      }`}>
                        {product.roastLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold font-mono text-[#2c2c24]">
                      Rp{product.price.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-mono font-bold text-sm px-2 py-1 rounded-lg ${
                        product.stock === 0 ? "text-red-700 bg-red-50" :
                        product.stock <= 5 ? "text-amber-700 bg-amber-50" :
                        "text-emerald-700 bg-emerald-50"
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditProduct(product)}
                          className="p-1.5 bg-[#faf9f4] hover:bg-[#5A5A40]/10 text-[#3a362e] hover:text-[#5A5A40] rounded-lg transition-colors border border-[#eeebe3]"
                          title={language === "id" ? "Edit Produk" : "Edit Product"}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 bg-[#faf9f4] hover:bg-red-50 text-[#3a362e] hover:text-red-600 rounded-lg transition-colors border border-[#eeebe3]"
                          title={language === "id" ? "Hapus Produk" : "Delete Product"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-semibold text-[#2c2c24] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#5A5A40]" />
            <span>{language === "id" ? "Kelola Status Pesanan Kopi" : "Manage Coffee Order Status"}</span>
          </h3>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-[#faf9f4] rounded-2xl border border-dashed border-[#eeebe3]">
              <ShoppingBag className="w-10 h-10 text-[#7c776c]/40 mx-auto mb-2" />
              <p className="text-[#3a362e] font-serif font-semibold">{language === "id" ? "Belum ada transaksi" : "No transactions yet"}</p>
              <p className="text-[#7c776c] text-xs">
                {language === "id" 
                  ? "Belum ada pembeli yang melakukan checkout kopi di platform Anda." 
                  : "No buyers have checked out coffee on your platform yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-[#eeebe3] bg-[#faf9f4]/35 rounded-2xl p-5 hover:shadow-sm transition-shadow">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 pb-4 border-b border-[#eeebe3] mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#2c2c24] font-bold font-mono">Invoice #{order.id.substring(4)}</span>
                        <span className="text-[#eeebe3]">|</span>
                        <span className="text-[#7c776c] text-xs font-mono">{new Date(order.createdAt).toLocaleString(language === "id" ? "id-ID" : "en-US")}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#7c776c]">
                        <span className="font-semibold text-[#3a362e]">{order.customerName}</span>
                        <span>({order.customerEmail})</span>
                        <span>• {language === "id" ? "No. Telp" : "Phone"}: {order.customerPhone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#7c776c] block mb-1">
                          {language === "id" ? "Status Pengiriman" : "Shipping Status"}
                        </label>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getOrderStatusBadge(order.status)} focus:outline-none`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">{language === "id" ? "Processing (Disangrai/Dikemas)" : "Processing (Roasting/Packing)"}</option>
                          <option value="Shipped">{language === "id" ? "Shipped (Dalam Perjalanan)" : "Shipped (In Transit)"}</option>
                          <option value="Completed">{language === "id" ? "Completed (Diterima)" : "Completed (Delivered)"}</option>
                          <option value="Cancelled">{language === "id" ? "Cancelled (Batal)" : "Cancelled (Void)"}</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2 bg-white text-[#7c776c] hover:text-red-600 border border-[#eeebe3] rounded-xl hover:bg-red-50/50 transition-colors self-end"
                        title={language === "id" ? "Hapus Transaksi" : "Delete Transaction"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Items */}
                    <div className="lg:col-span-7 space-y-2">
                      <p className="text-[10px] uppercase font-bold text-[#7c776c]">{language === "id" ? "Kopi Yang Dipesan" : "Ordered Coffee"}</p>
                      <div className="space-y-1.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="bg-white px-3 py-2 rounded-xl border border-[#eeebe3]/80 flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-mono bg-[#faf9f4] text-[#3a362e] px-1.5 py-0.5 rounded-md font-bold">{item.quantity}x</span>
                              <span className="font-bold text-[#2c2c24]">{item.productName}</span>
                            </div>
                            <span className="font-mono text-[#7c776c]">@ Rp{item.price.toLocaleString("id-ID")}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping and Payment info */}
                    <div className="lg:col-span-5 flex flex-col justify-between p-3.5 bg-white border border-[#eeebe3]/80 rounded-xl text-xs">
                      <div className="space-y-2">
                        <div>
                          <span className="text-[#7c776c] font-bold text-[9px] uppercase tracking-wider block">{language === "id" ? "Alamat Pengiriman" : "Shipping Address"}</span>
                          <span className="text-[#3a362e] font-medium">{order.shippingAddress}</span>
                        </div>
                        <div>
                          <span className="text-[#7c776c] font-bold text-[9px] uppercase tracking-wider block">{language === "id" ? "Metode Pembayaran" : "Payment Method"}</span>
                          <span className="font-semibold text-[#2c2c24]">
                            {order.paymentMethod === "Bank Transfer" ? (language === "id" ? "Transfer Bank" : "Bank Transfer") : order.paymentMethod}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#eeebe3] mt-3 flex justify-between items-center">
                        <span className="text-[#5A5A40] font-bold text-[10px] uppercase">{language === "id" ? "Total Transfer" : "Total Paid"}</span>
                        <span className="font-bold text-[#5A5A40] font-mono text-sm">Rp{order.totalAmount.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT PRODUCT FORM MODAL */}
      {isProductFormOpen && (
        <div className="fixed inset-0 bg-[#3a362e]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#eeebe3] flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Form Header */}
            <div className="p-6 border-b border-[#eeebe3] flex items-center justify-between">
              <h4 className="text-lg font-serif font-bold text-[#2c2c24] flex items-center gap-2">
                <Coffee className="w-5 h-5 text-[#5A5A40]" />
                <span>
                  {editingProduct 
                    ? (language === "id" ? "Edit Kopi Nusantara" : "Edit Nusantara Coffee") 
                    : (language === "id" ? "Tambah Kopi Nusantara" : "Add Nusantara Coffee")}
                </span>
              </h4>
              <button 
                onClick={() => setIsProductFormOpen(false)}
                className="p-1.5 hover:bg-[#faf9f4] text-[#7c776c] hover:text-[#3a362e] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#3a362e] uppercase mb-1.5">
                    {language === "id" ? "Nama Produk Kopi" : "Coffee Product Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder={language === "id" ? "Contoh: Aceh Gayo Winey Sweet" : "Example: Aceh Gayo Winey Sweet"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeebe3] text-[#3a362e] text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3a362e] uppercase mb-1.5">
                    {language === "id" ? "Asal Daerah / Kebun" : "Origin Area / Estate"}
                  </label>
                  <input
                    type="text"
                    required
                    value={prodOrigin}
                    onChange={(e) => setProdOrigin(e.target.value)}
                    placeholder={language === "id" ? "Contoh: Bener Meriah, Aceh" : "Example: Bener Meriah, Aceh"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeebe3] text-[#3a362e] text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3a362e] uppercase mb-1.5">
                    {language === "id" ? "Tingkat Roast" : "Roast Level"}
                  </label>
                  <select
                    value={prodRoast}
                    onChange={(e) => setProdRoast(e.target.value as RoastLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeebe3] text-[#3a362e] text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  >
                    <option value="Light">Light</option>
                    <option value="Medium">Medium</option>
                    <option value="Dark">Dark</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3a362e] uppercase mb-1.5">
                    {language === "id" ? "Harga / 250gr (Rp)" : "Price / 250g (IDR)"}
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="85000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeebe3] text-[#3a362e] text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3a362e] uppercase mb-1.5">
                    {language === "id" ? "Stok Awal (Pack)" : "Initial Stock (Packs)"}
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    placeholder="20"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeebe3] text-[#3a362e] text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a362e] uppercase mb-1.5">
                  {language === "id" ? "Catatan Rasa (Flavor Notes) - pisahkan koma" : "Flavor Notes - separate by comma"}
                </label>
                <input
                  type="text"
                  value={prodNotes}
                  onChange={(e) => setProdNotes(e.target.value)}
                  placeholder="Floral, Citrus, Caramel, Sweet Tea"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeebe3] text-[#3a362e] text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a362e] uppercase mb-1.5">
                  {language === "id" ? "URL Gambar Kopi" : "Coffee Image URL"}
                </label>
                <input
                  type="url"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeebe3] text-[#3a362e] text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3a362e] uppercase mb-1.5">
                  {language === "id" ? "Deskripsi Produk" : "Product Description"}
                </label>
                <textarea
                  required
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder={language === "id" 
                    ? "Masukkan profil lengkap, cita rasa, ketinggian tanam, serta keunggulan biji kopi arabika ini..." 
                    : "Enter complete profile, taste profile, cultivation altitude, and advantages of this arabica coffee..."}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeebe3] text-[#3a362e] text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40] placeholder:text-[#7c776c]"
                />
              </div>

              <div className="pt-4 border-t border-[#eeebe3] flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductFormOpen(false)}
                  className="flex-1 py-3 border border-[#eeebe3] hover:bg-[#faf9f4] text-[#3a362e] font-semibold text-xs rounded-xl transition-all"
                >
                  {language === "id" ? "Batal" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-[#5A5A40] hover:bg-[#4a4a35] disabled:bg-[#5A5A40]/60 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{language === "id" ? "Menyimpan..." : "Saving..."}</span>
                    </>
                  ) : (
                    <span>{language === "id" ? "Simpan Kopi" : "Save Coffee"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
