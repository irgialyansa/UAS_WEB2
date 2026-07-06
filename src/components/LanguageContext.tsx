import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "id" | "en";

export const translations = {
  id: {
    // Nav & Common
    welcomeBanner: "Selamat Datang di IRGIkopi Arabika Premium",
    allCoffee: "Semua Kopi",
    sommelier: "Coffee Sommelier",
    advantages: "Keunggulan",
    myOrders: "Pesanan Saya",
    adminMode: "Mode Administrator",
    customerMode: "Kembali Belanja",
    welcomeText: "Selamat Datang",
    loadingData: "Sedang memuat data IRGIkopi...",
    activeOrders: "Riwayat Pesanan Aktif",
    activeOrdersDesc: "Berikut adalah transaksi yang terdaftar dalam database server IRGIkopi saat ini.",

    // Search and Filters
    searchPlaceholder: "Cari kopi arabika Nusantara (Simalungun, Gayo, Kintamani...)",
    roastLevel: "Tingkat Panggang",
    allRoast: "Semua Tingkat",
    roastLight: "Light (Ringan, Asam Buah)",
    roastMedium: "Medium (Seimbang, Manis)",
    roastDark: "Dark (Pekat, Body Tebal)",

    // Cart Drawer
    cartTitle: "Keranjang Belanja",
    cartEmpty: "Keranjang masih kosong",
    cartEmptyDesc: "Pilih kopi arabika favorit Anda dan tambahkan ke dalam keranjang untuk melanjutkan pemesanan.",
    subtotal: "Subtotal Produk",
    checkoutForm: "Formulir Checkout Pesanan",
    fullName: "Nama Lengkap",
    fullNamePlaceholder: "Contoh: Irgi Fahrezi",
    phone: "No. Telepon",
    phonePlaceholder: "Contoh: 081234567890",
    address: "Alamat Pengiriman Lengkap",
    addressPlaceholder: "Contoh: Jl. Kopi Arabika No. 12, Bandung, Jawa Barat",
    paymentMethod: "Metode Pembayaran",
    bankTransfer: "Transfer Bank",
    ewallet: "E-Wallet",
    cod: "Cash on Delivery",
    submitOrder: "Pesan Sekarang (Kirim)",
    submittingOrder: "Memproses Pesanan Kopi...",
    orderSuccess: "Pesanan Berhasil Dibuat!",
    orderSuccessDesc: "Terima kasih telah memesan kopi di IRGIkopi. Pesanan Anda telah terdaftar dalam sistem.",
    orderIdLabel: "KODE INVOICE PESANAN",
    backToShop: "Kembali Belanja",
    buyNow: "Beli Sekarang",
    addToCart: "Tambah Ke Keranjang",
    outOfStock: "Habis",
    stockLabel: "Stok:",
    notesLabel: "Catatan Rasa:",

    // Coffee Sommelier
    sommelierTitle: "Coffee Sommelier",
    sommelierSubtitle: "Temukan biji kopi terbaik Nusantara yang dirancang khusus untuk lidah dan suasana hati Anda.",
    tasteLabel: "Apa preferensi rasa utama yang Anda inginkan?",
    tastePlaceholder: "Contoh: asam buah segar, manis karamel, pahit pekat cokelat, herbal rempah...",
    roastPreferenceLabel: "Tingkat Roasting Kopi",
    allRoastLevels: "Semua Tingkatan",
    budgetLabel: "Berapa anggaran maksimal Anda? (per 250gr)",
    moodLabel: "Bagaimana suasana hati atau aktivitas minum kopi Anda?",
    moodPlaceholder: "Contoh: santai sore hari, fokus kerja lembur, menyambut pagi hari berenergi...",
    sommelierSubmitBtn: "Minta Rekomendasi Sommelier",
    sommelierLoadingTitle: "Sedang meracik rekomendasi...",
    sommelierLoadingDesc: "Sistem sommelier kami sedang menganalisis profil keasaman, bodi, dan aroma kopi IRGIkopi yang paling serasi dengan keinginan Anda.",
    sommelierReadyTitle: "Siap merekomendasikan",
    sommelierReadyDesc: "Masukkan preferensi Anda di sebelah kiri dan dapatkan saran seduhan kopi Nusantara yang paling sempurna.",
    sommelierAnalysis: "Analisis Sommelier Rasa",
    sommelierRecommendedProducts: "Kopi Rekomendasi Untuk Anda",
    viewProduct: "Lihat Produk",
    brewingTipLabel: "Rekomendasi Cara Penyeduhan",

    // Admin Dashboard
    adminBadge: "Mode Administrator",
    adminTitle: "IRGIkopi Management",
    adminSubtitle: "Kelola katalog kopi arabika, stok, dan proses pengiriman transaksi pembeli secara real-time.",
    refreshBtn: "Segarkan Data",
    coffeeListTitle: "Daftar Biji Kopi",
    addCoffeeBtn: "Tambah Kopi Nusantara",
    thName: "Nama Produk",
    thOrigin: "Asal Daerah",
    thRoast: "Tingkat Roast",
    thPrice: "Harga",
    thAction: "Aksi",
    orderStatusTitle: "Kelola Status Pesanan Kopi",
    noTransactions: "Belum ada transaksi",
    noTransactionsDesc: "Belum ada pembeli yang melakukan checkout kopi di platform Anda saat ini.",
    shippingStatus: "Status Pengiriman",
    orderedCoffee: "Kopi Yang Dipesan",
    shippingAddress: "Alamat Pengiriman",
    paymentMethodAdmin: "Metode Pembayaran",
    totalTransfer: "Total Transfer",
    cancelBtn: "Batal",
    saveBtn: "Simpan Kopi",
    saving: "Menyimpan...",
    editing: "Mengedit...",
    editTitle: "Edit Kopi Nusantara",
    addTitle: "Tambah Kopi Nusantara Baru",
    coffeeNameLabel: "Nama Produk Kopi",
    coffeeOriginLabel: "Asal Daerah / Kebun",
    coffeePriceLabel: "Harga / 250gr",
    coffeeStockLabel: "Stok Awal",
    coffeeNotesLabel: "Catatan Rasa (Flavor Notes) - pisahkan koma",
    coffeeImgUrlLabel: "URL Gambar Kopi",
    coffeeDescLabel: "Deskripsi Produk",
    confirmDelete: "Apakah Anda yakin ingin menghapus produk kopi ini dari katalog IRGIkopi?",

    // Catalog Headers
    catalogHeaderTitle: "Kopi Arabika Nusantara Terbaik",
    catalogHeaderSubtitle: "Menampilkan pilihan biji kopi Arabika single-origin pilihan dengan karakteristik unik dari berbagai pegunungan di Indonesia.",

    // Advantages Section
    advantagesTitle: "Mengapa Memilih IRGIkopi?",
    advantagesSubtitle: "Setiap cangkir menyajikan dedikasi terbaik dari hulu ke hilir untuk kenikmatan kopi sejati.",
    adv1Title: "100% Arabika Premium",
    adv1Desc: "Hanya memilih biji kopi specialty grade berkualitas terbaik dari perkebunan dataran tinggi terbaik Indonesia.",
    adv2Title: "Kurasi Sommelier Presisi",
    adv2Desc: "Sistem sommelier ahli kami membantu Anda menemukan profil rasa yang paling cocok dengan preferensi lidah Anda secara instan.",
    adv3Title: "Roasting Segar",
    adv3Desc: "Biji kopi dipanggang secara higienis dalam batch kecil untuk memastikan kesegaran aroma dan keaslian cita rasa optimal.",

    // Footer
    footerDesc: "Pelopor e-commerce kopi arabika single origin premium Indonesia dengan kurasi cita rasa berbasis preferensi rasa yang presisi.",
    footerLinks: "Tautan Cepat",
    footerHonors: "Gelar Kehormatan",
    honor1: "☕ Best Indonesian Specialty Coffee Platform",
    honor2: "🎓 Certified Q-Grader Selection Standards",
    honor3: "📦 100% Eco-friendly Degassing Valve Pack",
    footerCopyright: "IRGIkopi Specialty Beans. Seluruh hak cipta dilindungi.",
    footerTerms: "Syarat & Ketentuan",
    footerPrivacy: "Kebijakan Privasi",
    footerContact: "Hubungi Kami"
  },
  en: {
    // Nav & Common
    welcomeBanner: "Welcome to IRGIkopi Premium Arabica",
    allCoffee: "All Coffees",
    sommelier: "Coffee Sommelier",
    advantages: "Our Advantages",
    myOrders: "My Orders",
    adminMode: "Administrator Mode",
    customerMode: "Back to Shop",
    welcomeText: "Welcome",
    loadingData: "Loading IRGIkopi data...",
    activeOrders: "Active Orders History",
    activeOrdersDesc: "Below are the transactions currently registered in the IRGIkopi server database.",

    // Search and Filters
    searchPlaceholder: "Search Nusantara arabica coffee (Simalungun, Gayo, Kintamani...)",
    roastLevel: "Roast Level",
    allRoast: "All Levels",
    roastLight: "Light (Bright, Fruity Acidity)",
    roastMedium: "Medium (Balanced, Sweet)",
    roastDark: "Dark (Rich, Full Body)",

    // Cart Drawer
    cartTitle: "Shopping Cart",
    cartEmpty: "Your cart is empty",
    cartEmptyDesc: "Select your favorite arabica coffee and add it to your cart to proceed with the order.",
    subtotal: "Product Subtotal",
    checkoutForm: "Order Checkout Form",
    fullName: "Full Name",
    fullNamePlaceholder: "Example: Irgi Fahrezi",
    phone: "Phone Number",
    phonePlaceholder: "Example: +6281234567890",
    address: "Complete Shipping Address",
    addressPlaceholder: "Example: Jl. Kopi Arabika No. 12, Bandung, West Java",
    paymentMethod: "Payment Method",
    bankTransfer: "Bank Transfer",
    ewallet: "E-Wallet",
    cod: "Cash on Delivery",
    submitOrder: "Order Now (Send)",
    submittingOrder: "Processing Coffee Order...",
    orderSuccess: "Order Successfully Created!",
    orderSuccessDesc: "Thank you for ordering coffee at IRGIkopi. Your order has been registered in our system.",
    orderIdLabel: "ORDER INVOICE CODE",
    backToShop: "Back to Shop",
    buyNow: "Buy Now",
    addToCart: "Add to Cart",
    outOfStock: "Sold Out",
    stockLabel: "Stock:",
    notesLabel: "Flavor Notes:",

    // Coffee Sommelier
    sommelierTitle: "Coffee Sommelier",
    sommelierSubtitle: "Discover the best single-origin coffees of Indonesia tailored specifically for your palate and mood.",
    tasteLabel: "What is your primary taste preference?",
    tastePlaceholder: "Example: fresh fruity acidity, sweet caramel, rich dark chocolate, herbal spice...",
    roastPreferenceLabel: "Coffee Roasting Level",
    allRoastLevels: "All Roasting Levels",
    budgetLabel: "What is your maximum budget? (per 250g)",
    moodLabel: "What is your mood or coffee-drinking activity?",
    moodPlaceholder: "Example: relaxing afternoon, focusing on late-night work, welcoming an energetic morning...",
    sommelierSubmitBtn: "Request Sommelier Recommendation",
    sommelierLoadingTitle: "Crafting your recommendation...",
    sommelierLoadingDesc: "Our sommelier system is analyzing the acidity, body, and aroma profiles of IRGIkopi that perfectly match your desires.",
    sommelierReadyTitle: "Ready to Recommend",
    sommelierReadyDesc: "Enter your preferences on the left and get the perfect Indonesian coffee brew suggestion.",
    sommelierAnalysis: "Flavor Sommelier Analysis",
    sommelierRecommendedProducts: "Recommended Coffees for You",
    viewProduct: "View Product",
    brewingTipLabel: "Recommended Brewing Method",

    // Admin Dashboard
    adminBadge: "Administrator Mode",
    adminTitle: "IRGIkopi Management",
    adminSubtitle: "Manage arabica coffee catalog, stock, and process order shipments in real-time.",
    refreshBtn: "Refresh Data",
    coffeeListTitle: "Coffee Bean List",
    addCoffeeBtn: "Add Indonesian Coffee",
    thName: "Product Name",
    thOrigin: "Origin",
    thRoast: "Roast Level",
    thPrice: "Price",
    thAction: "Action",
    orderStatusTitle: "Manage Coffee Order Status",
    noTransactions: "No transactions yet",
    noTransactionsDesc: "No buyers have checked out coffee on your platform yet.",
    shippingStatus: "Shipping Status",
    orderedCoffee: "Ordered Coffees",
    shippingAddress: "Shipping Address",
    paymentMethodAdmin: "Payment Method",
    totalTransfer: "Total Transfer",
    cancelBtn: "Cancel",
    saveBtn: "Save Coffee",
    saving: "Saving...",
    editing: "Editing...",
    editTitle: "Edit Indonesian Coffee",
    addTitle: "Add New Indonesian Coffee",
    coffeeNameLabel: "Coffee Product Name",
    coffeeOriginLabel: "Origin / Farm",
    coffeePriceLabel: "Price / 250g",
    coffeeStockLabel: "Initial Stock",
    coffeeNotesLabel: "Flavor Notes - separate with comma",
    coffeeImgUrlLabel: "Coffee Image URL",
    coffeeDescLabel: "Product Description",
    confirmDelete: "Are you sure you want to delete this coffee product from the IRGIkopi catalog?",

    // Catalog Headers
    catalogHeaderTitle: "Best Indonesian Arabica Beans",
    catalogHeaderSubtitle: "Showcasing selected single-origin Arabica coffee beans with unique characteristics from various mountain ranges in Indonesia.",

    // Advantages Section
    advantagesTitle: "Why Choose IRGIkopi?",
    advantagesSubtitle: "Every cup serves the finest dedication from seed to cup for true coffee pleasure.",
    adv1Title: "100% Premium Arabica",
    adv1Desc: "Only selecting top specialty grade coffee beans from Indonesia's finest high-altitude plantations.",
    adv2Title: "Precision Sommelier Selection",
    adv2Desc: "Our expert sommelier system helps you find the flavor profile that matches your preferences instantly.",
    adv3Title: "Fresh Roasted",
    adv3Desc: "Coffee beans are hygienically roasted in small batches to ensure optimal aroma freshness and authentic taste.",

    // Footer
    footerDesc: "Pioneer of Indonesian premium single origin arabica e-commerce with precision flavor curation based on flavor preferences.",
    footerLinks: "Quick Links",
    footerHonors: "Honors & Standards",
    honor1: "☕ Best Indonesian Specialty Coffee Platform",
    honor2: "🎓 Certified Q-Grader Selection Standards",
    honor3: "📦 100% Eco-friendly Degassing Valve Pack",
    footerCopyright: "IRGIkopi Specialty Beans. All rights reserved.",
    footerTerms: "Terms & Conditions",
    footerPrivacy: "Privacy Policy",
    footerContact: "Contact Us"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.id) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("irgikopi_lang");
    return (saved === "en" || saved === "id") ? saved : "id";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("irgikopi_lang", lang);
  };

  const t = (key: keyof typeof translations.id): string => {
    const translationSet = translations[language] || translations.id;
    return translationSet[key] || translations.id[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
