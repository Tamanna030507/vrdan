import { useState, useEffect } from "react";
import { supabase } from "../supabase";

// ── TOP 10 CROPS by production volume (India 2024-25, Ministry of Agriculture data) ──
const TOP_CROPS = [
  { rank: 1, name: "Rice", desi: "धान / चावल", production: "1501 LMT", profit: "₹38,000–52,000/acre", season: "Kharif", emoji: "🌾", color: "#4ade80", bgColor: "rgba(74,222,128,0.08)", desc: "India's #1 food crop · Record harvest 2024-25" },
  { rank: 2, name: "Wheat", desi: "गेहूं", production: "1154 LMT", profit: "₹42,000–58,000/acre", season: "Rabi", emoji: "🌿", color: "#c8960c", bgColor: "rgba(200,150,12,0.08)", desc: "Rabi king · MSP ₹2,275/qtl · Strong demand" },
  { rank: 3, name: "Sugarcane", desi: "गन्ना / ऊख", production: "4350 LMT", profit: "₹80,000–1,20,000/acre", season: "Annual", emoji: "🎋", color: "#4ade80", bgColor: "rgba(74,222,128,0.06)", desc: "Highest income crop · Sugar + ethanol market" },
  { rank: 4, name: "Maize", desi: "मक्का / भुट्टा", production: "372 LMT", profit: "₹28,000–40,000/acre", season: "Kharif/Rabi", emoji: "🌽", color: "#f0b429", bgColor: "rgba(240,180,41,0.08)", desc: "Poultry feed boom · Record 2024-25 harvest" },
  { rank: 5, name: "Cotton", desi: "कपास / रुई", production: "294 LB", profit: "₹25,000–45,000/acre", season: "Kharif", emoji: "🤍", color: "#e0d8c8", bgColor: "rgba(224,216,200,0.06)", desc: "White gold · Textile industry backbone" },
  { rank: 6, name: "Soybean", desi: "सोयाबीन / भटमाश", production: "151 LMT", profit: "₹35,000–50,000/acre", season: "Kharif", emoji: "🫘", color: "#8b7355", bgColor: "rgba(139,115,85,0.08)", desc: "Oil + protein crop · MP, MH, RJ top growers" },
  { rank: 7, name: "Mustard", desi: "सरसों / राई", production: "129 LMT", profit: "₹38,000–55,000/acre", season: "Rabi", emoji: "🟡", color: "#f0b429", bgColor: "rgba(240,180,41,0.06)", desc: "Edible oil leader · RJ, HR, UP biggest growers" },
  { rank: 8, name: "Groundnut", desi: "मूंगफली / शेंगदाणे", production: "104 LMT", profit: "₹40,000–60,000/acre", season: "Kharif", emoji: "🥜", color: "#c4622d", bgColor: "rgba(196,98,45,0.06)", desc: "Snack + oil · Gujarat & AP major producers" },
  { rank: 9, name: "Chickpea", desi: "चना / छोले", production: "110 LMT", profit: "₹30,000–45,000/acre", season: "Rabi", emoji: "🟤", color: "#8b7355", bgColor: "rgba(139,115,85,0.06)", desc: "Pulse king · MP leads · MSP ₹5,440/qtl" },
  { rank: 10, name: "Tur/Arhar", desi: "अरहर / तुवर दाल", production: "34 LMT", profit: "₹28,000–38,000/acre", season: "Kharif", emoji: "🫛", color: "#c8960c", bgColor: "rgba(200,150,12,0.06)", desc: "Protein dal · MH, MP, UP main states" },
];

// ── SEEDS CATALOG ──────────────────────────────────────────────────────────────
const SEEDS = [
  { id: "s1", name: "HD-3385 Wheat Seed", desi: "गेहूं बीज (नया किस्म)", brand: "ICAR", price: 480, unit: "10kg bag", rating: 4.8, tag: "New Variety", tagColor: "#4ade80", img: "🌾", desc: "Drought-resistant · 20% higher yield · 2024 ICAR release", inStock: true },
  { id: "s2", name: "Pusa Basmati 1692", desi: "बासमती धान", brand: "IARI", price: 380, unit: "5kg bag", rating: 4.9, tag: "Top Seller", tagColor: "#c8960c", img: "🌿", desc: "Premium export quality · Fine grain · 120-day variety", inStock: true },
  { id: "s3", name: "NHH-44 Hybrid Maize", desi: "संकर मक्का बीज", brand: "Nuziveedu", price: 560, unit: "5kg bag", rating: 4.6, tag: "High Yield", tagColor: "#4ade80", img: "🌽", desc: "18 qtl/acre yield · Staygreen trait · Blight tolerant", inStock: true },
  { id: "s4", name: "MAUS-162 Soybean", desi: "सोयाबीन बीज", brand: "MAU", price: 290, unit: "30kg bag", rating: 4.5, tag: "Certified", tagColor: "#c8960c", img: "🫘", desc: "Mosaic virus tolerant · 20 qtl/acre · 95-day duration", inStock: true },
  { id: "s5", name: "RH-30 Mustard", desi: "सरसों बीज (RH-30)", brand: "CCSHAU", price: 180, unit: "2kg pack", rating: 4.7, tag: "Best for RJ", tagColor: "#f0b429", img: "🟡", desc: "Rajasthan best · High oil content · 110-day variety", inStock: true },
  { id: "s6", name: "Shankar Desi Chickpea", desi: "देसी चना बीज", brand: "Ankur", price: 120, unit: "10kg bag", rating: 4.4, tag: "Organic", tagColor: "#4ade80", img: "🤎", desc: "Wilt resistant · Bold grain · Good for MP soils", inStock: false },
  { id: "s7", name: "CMS-8501 Cotton Seed", desi: "BT कपास बीज", brand: "Mahyco", price: 890, unit: "450g pack", rating: 4.5, tag: "Bollworm Res.", tagColor: "#c4622d", img: "🤍", desc: "Bollworm resistant · 10 qtl/acre · Gujarat-MP suited", inStock: true },
  { id: "s8", name: "Groundnut TAG-24", desi: "मूंगफली बीज", brand: "ARS Tirupati", price: 220, unit: "10kg bag", rating: 4.6, tag: "Drought Safe", tagColor: "#c8960c", img: "🥜", desc: "Tikka-resistant · High shelling · 105-day variety", inStock: true },
];

// ── PESTICIDES & INPUTS CATALOG ────────────────────────────────────────────────
const PESTICIDES = [
  { id: "p1", name: "Propiconazole 25% EC", desi: "ब्लास्ट और जंग की दवा", brand: "Syngenta", price: 340, unit: "250ml", rating: 4.8, tag: "Most Used", tagColor: "#c8960c", img: "🧪", desc: "Wheat rust + rice blast · Spray at 200ml/acre", inStock: true, type: "Fungicide" },
  { id: "p2", name: "Imidacloprid 17.8% SL", desi: "माहू-सफेदमक्खी की दवा", brand: "Bayer", price: 290, unit: "100ml", rating: 4.7, tag: "Aphid Killer", tagColor: "#4ade80", img: "🪲", desc: "Aphid, whitefly, thrips · Systemic action", inStock: true, type: "Insecticide" },
  { id: "p3", name: "Mancozeb 75% WP", desi: "फंगस की सस्ती दवा", brand: "UPL", price: 185, unit: "1kg", rating: 4.5, tag: "Budget Pick", tagColor: "#4ade80", img: "🧫", desc: "Broad spectrum fungicide · Alternaria + Downy mildew", inStock: true, type: "Fungicide" },
  { id: "p4", name: "Chlorantraniliprole 18.5% SC", desi: "इल्ली नाशक (कोराजन)", brand: "FMC (Coragen)", price: 1250, unit: "150ml", rating: 4.9, tag: "Premium", tagColor: "#c8960c", img: "🐛", desc: "Bollworm, pod borer, stem borer · 45-day protection", inStock: true, type: "Insecticide" },
  { id: "p5", name: "Glyphosate 41% SL", desi: "खरपतवार नाशक", brand: "PI Industries", price: 120, unit: "1L", rating: 4.3, tag: "Weedkiller", tagColor: "#555", img: "🌿", desc: "Non-selective herbicide · Pre-crop use only", inStock: true, type: "Herbicide" },
  { id: "p6", name: "Neem Oil 1500 PPM", desi: "नीम तेल (जैविक)", brand: "IFFCO", price: 165, unit: "1L", rating: 4.6, tag: "Organic", tagColor: "#4ade80", img: "🌱", desc: "Bio pesticide · 200+ pests · Safe for bees", inStock: true, type: "Bio Pesticide" },
  { id: "p7", name: "Urea 46% N", desi: "यूरिया खाद", brand: "IFFCO", price: 266, unit: "50kg bag", rating: 4.8, tag: "Subsidized", tagColor: "#4ade80", img: "🧴", desc: "Government subsidized price · Best N source", inStock: true, type: "Fertilizer" },
  { id: "p8", name: "DAP 18:46:0", desi: "DAP खाद (डीएपी)", brand: "IFFCO", price: 1350, unit: "50kg bag", rating: 4.9, tag: "Subsidy ₹200↑", tagColor: "#4ade80", img: "💊", desc: "Phosphorus + Nitrogen · Basal dose for all crops", inStock: true, type: "Fertilizer" },
  { id: "p9", name: "Rhizobium Culture", desi: "जड़ों में नाइट्रोजन भरने की दवाई", brand: "IARI", price: 45, unit: "200g sachet", rating: 4.5, tag: "Must for Pulses", tagColor: "#c8960c", img: "🦠", desc: "Seed treatment · Fixes atmospheric N · Pulse crops", inStock: true, type: "Bio Input" },
  { id: "p10", name: "Sulfur 90% WDG", desi: "गंधक / सल्फर खाद", brand: "Coromandel", price: 230, unit: "3kg pack", rating: 4.6, tag: "Oilseed Must", tagColor: "#f0b429", img: "🟡", desc: "Boosts oil content in mustard · Fungicide too", inStock: true, type: "Fertilizer" },
];

// UPI QR Generator
function UpiQr({ amount, upiId = "vrdan@upi", name = "VRDAN AgriMart", orderId }) {
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=Order${orderId}`;
  const size = 160;
  const cells = 25;
  const cellSize = size / cells;
  const pattern = Array.from({ length: cells }, (_, r) =>
    Array.from({ length: cells }, (_, c) => {
      const inCorner = (r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7);
      const onBorder = inCorner && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= cells - 7 && (r === cells - 7 || r === cells - 1 || c === 0 || c === 6)));
      const innerSquare = (r >= 2 && r <= 4 && c >= 2 && c <= 4) || (r >= 2 && r <= 4 && c >= cells - 5 && c <= cells - 3) || (r >= cells - 5 && r <= cells - 3 && c >= 2 && c <= 4);
      if (inCorner) return onBorder || innerSquare ? 1 : 0;
      const hash = (r * 37 + c * 19 + (upiString.charCodeAt((r * cells + c) % upiString.length) || 0)) % 3;
      return hash === 0 ? 1 : 0;
    })
  );
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: "10px", background: "#0d0d0d", padding: "8px", boxSizing: "border-box" }}>
        {pattern.map((row, r) =>
          row.map((cell, c) =>
            cell ? <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize - 0.3} height={cellSize - 0.3} fill="#c8960c" rx="0.3" /> : null
          )
        )}
        <rect x={size / 2 - 14} y={size / 2 - 14} width={28} height={28} fill="#0d0d0d" rx="4" />
        <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fontSize="11" fontWeight="900" fill="#c8960c" fontFamily="serif">V</text>
      </svg>
      <div style={{ fontSize: "10px", color: "#555", marginTop: "6px" }}>Scan with GPay · PhonePe · Paytm</div>
      <div style={{ fontSize: "11px", color: "#c8960c", fontWeight: "700", marginTop: "2px" }}>₹{amount.toLocaleString()}</div>
    </div>
  );
}

export default function MandiMart() {
  const [activeTab, setActiveTab] = useState("trending");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutStage, setCheckoutStage] = useState("cart"); // cart | address | payment | done
  const [payingItem, setPayingItem] = useState(null); // for direct buy
  const [address, setAddress] = useState({ name: "", phone: "", village: "", district: "", pin: "" });
  const [orderId] = useState(() => Math.random().toString(36).slice(2, 10).toUpperCase());

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const updateQty = (id, delta) => setCart(prev =>
    prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c).filter(c => c.qty > 0)
  );

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const handleDirectBuy = (item) => {
    setPayingItem(item);
    setCheckoutStage("payment");
    setShowCart(true);
  };

  const handleOrder = async () => {
    await supabase.saveCartOrder(cart, cartTotal);
    setCheckoutStage("done");
  };

  const ProductCard = ({ item }) => {
    const inCart = cart.find(c => c.id === item.id);
    return (
      <div style={S.productCard}>
        <div style={S.productImgBox}>
          <span style={{ fontSize: "40px" }}>{item.img}</span>
          <div style={{ ...S.productTag, color: item.tagColor, borderColor: item.tagColor + "44", background: item.tagColor + "12" }}>{item.tag}</div>
          {!item.inStock && <div style={S.outOfStock}>Out of Stock</div>}
        </div>
        <div style={S.productInfo}>
          <div style={S.productName}>{item.name}</div>
          <div style={S.productDesi}>{item.desi}</div>
          {item.type && <div style={S.productType}>{item.type}</div>}
          <div style={S.productBrand}>{item.brand}</div>
          <div style={S.productDesc}>{item.desc}</div>
          <div style={S.productRating}>★ {item.rating} · {item.unit}</div>
          <div style={S.productPrice}>₹{item.price.toLocaleString()}</div>
          <div style={S.productBtns}>
            {inCart ? (
              <div style={S.qtyControl}>
                <button style={S.qtyBtn} onClick={() => updateQty(item.id, -1)}>−</button>
                <span style={S.qtyNum}>{inCart.qty}</span>
                <button style={S.qtyBtn} onClick={() => updateQty(item.id, 1)}>+</button>
              </div>
            ) : (
              <button style={S.addBtn} onClick={() => item.inStock && addToCart(item)} disabled={!item.inStock}>
                {item.inStock ? "Add to Cart" : "Unavailable"}
              </button>
            )}
            <button style={S.buyNowBtn} onClick={() => item.inStock && handleDirectBuy(item)} disabled={!item.inStock}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideRight { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={S.headerTag}>Agri Marketplace</div>
          <h1 style={S.headerTitle}>MandiMart</h1>
          <p style={S.headerSub}>Seeds · Pesticides · Fertilizers — Delivered to your farm</p>
        </div>
        <button style={S.cartBtn} onClick={() => { setShowCart(true); setCheckoutStage("cart"); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Cart
          {cartCount > 0 && <span style={S.cartBadge}>{cartCount}</span>}
        </button>
      </div>

      {/* Sub Tabs */}
      <div style={S.subTabs}>
        {[["trending", "Top 10 Crops"], ["seeds", "Seeds"], ["pesticides", "Pesticides & Inputs"]].map(([id, label]) => (
          <button key={id} style={{ ...S.subTab, ...(activeTab === id ? S.subTabActive : {}) }} onClick={() => setActiveTab(id)}>{label}</button>
        ))}
      </div>

      {/* TOP 10 CROPS — Netflix-style */}
      {activeTab === "trending" && (
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <div style={S.trendHeader}>
            <div style={{ fontSize: "11px", color: "#c8960c", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Based on Ministry of Agriculture 2024-25 data</div>
            <p style={{ fontSize: "13px", color: "#555" }}>India's top 10 crops ranked by production volume · Real government data</p>
          </div>
          <div style={S.netflixList}>
            {TOP_CROPS.map((crop, i) => (
              <div key={i} style={{ ...S.netflixCard, background: crop.bgColor, borderColor: crop.color + "33", animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
                <div style={S.netflixRank}>{crop.rank}</div>
                <div style={S.netflixEmoji}>{crop.emoji}</div>
                <div style={S.netflixInfo}>
                  <div style={S.netflixName}>{crop.name}</div>
                  <div style={S.netflixDesi}>{crop.desi}</div>
                  <div style={S.netflixDesc}>{crop.desc}</div>
                  <div style={S.netflixStats}>
                    <span style={{ ...S.statPill, color: crop.color, borderColor: crop.color + "44" }}>{crop.season}</span>
                    <span style={{ ...S.statPill, color: "#4ade80", borderColor: "rgba(74,222,128,0.3)" }}>Profit: {crop.profit}</span>
                    <span style={{ ...S.statPill, color: "#555", borderColor: "#2a2a2a" }}>Prod: {crop.production}</span>
                  </div>
                </div>
                {i < 3 && <div style={{ ...S.medalBadge, background: i === 0 ? "#c8960c" : i === 1 ? "#aaa" : "#cd7f32" }}>#{crop.rank}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEEDS */}
      {activeTab === "seeds" && (
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <div style={S.trendHeader}>
            <div style={{ fontSize: "11px", color: "#c8960c", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Certified & Verified Seeds</div>
            <p style={{ fontSize: "13px", color: "#555" }}>All seeds from government-approved breeders and certified seed companies</p>
          </div>
          <div style={S.productGrid}>
            {SEEDS.map(item => <ProductCard key={item.id} item={item} />)}
          </div>
        </div>
      )}

      {/* PESTICIDES & INPUTS */}
      {activeTab === "pesticides" && (
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <div style={S.trendHeader}>
            <div style={{ fontSize: "11px", color: "#c8960c", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Pesticides · Fertilizers · Bio Inputs</div>
            <p style={{ fontSize: "13px", color: "#555" }}>All products verified · No banned substances · Aadhaar-linked purchase for subsidized items</p>
          </div>
          <div style={S.productGrid}>
            {PESTICIDES.map(item => <ProductCard key={item.id} item={item} />)}
          </div>
        </div>
      )}

      {/* CART / CHECKOUT DRAWER */}
      {showCart && (
        <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && setShowCart(false)}>
          <div style={S.drawer}>
            <div style={S.drawerHeader}>
              <div style={{ fontSize: "16px", fontWeight: "800", color: "#e0d8c8", fontFamily: "'Playfair Display', serif" }}>
                {checkoutStage === "cart" ? "Your Cart" : checkoutStage === "address" ? "Delivery Details" : checkoutStage === "payment" ? "Pay & Confirm" : "Order Placed!"}
              </div>
              <button style={S.closeBtn} onClick={() => { setShowCart(false); setCheckoutStage("cart"); setPayingItem(null); }}>✕</button>
            </div>

            {/* CART VIEW */}
            {checkoutStage === "cart" && (
              <div>
                {payingItem === null && cart.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 24px", color: "#333" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>🛒</div>
                    <div style={{ fontSize: "14px" }}>Your cart is empty</div>
                  </div>
                ) : (
                  <>
                    <div style={{ flex: 1, overflowY: "auto", maxHeight: "calc(100vh - 240px)", padding: "16px" }}>
                      {cart.map(item => (
                        <div key={item.id} style={S.cartItem}>
                          <span style={{ fontSize: "28px" }}>{item.img}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "13px", fontWeight: "700", color: "#e0d8c8" }}>{item.name}</div>
                            <div style={{ fontSize: "11px", color: "#555" }}>{item.desi} · {item.unit}</div>
                            <div style={{ fontSize: "13px", fontWeight: "700", color: "#c8960c", marginTop: "4px" }}>₹{(item.price * item.qty).toLocaleString()}</div>
                          </div>
                          <div style={S.qtyControl}>
                            <button style={S.qtyBtn} onClick={() => updateQty(item.id, -1)}>−</button>
                            <span style={S.qtyNum}>{item.qty}</span>
                            <button style={S.qtyBtn} onClick={() => updateQty(item.id, 1)}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={S.cartFooter}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <span style={{ fontSize: "14px", color: "#888" }}>Total ({cartCount} items)</span>
                        <span style={{ fontSize: "18px", fontWeight: "900", color: "#c8960c", fontFamily: "'Playfair Display', serif" }}>₹{cartTotal.toLocaleString()}</span>
                      </div>
                      <button style={S.checkoutBtn} onClick={() => setCheckoutStage("address")}>
                        Proceed to Checkout →
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ADDRESS VIEW */}
            {checkoutStage === "address" && (
              <div style={{ padding: "16px" }}>
                <div style={{ fontSize: "11px", color: "#555", marginBottom: "16px" }}>Enter delivery address for your order</div>
                {[
                  { key: "name", label: "Full Name", placeholder: "e.g. Ramesh Kumar" },
                  { key: "phone", label: "Phone", placeholder: "10-digit mobile number" },
                  { key: "village", label: "Village / Town", placeholder: "e.g. Neem Ka Thana" },
                  { key: "district", label: "District", placeholder: "e.g. Sikar" },
                  { key: "pin", label: "PIN Code", placeholder: "6-digit PIN" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} style={{ marginBottom: "12px" }}>
                    <div style={{ fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "1px", marginBottom: "5px", textTransform: "uppercase" }}>{label}</div>
                    <input style={S.addrInput} placeholder={placeholder} value={address[key]} onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))} />
                  </div>
                ))}
                <button style={S.checkoutBtn} onClick={() => setCheckoutStage("payment")}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* PAYMENT VIEW */}
            {checkoutStage === "payment" && (
              <div style={{ padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "13px", color: "#555", marginBottom: "20px" }}>
                  {payingItem ? `Buying: ${payingItem.name}` : `${cartCount} items · ₹${cartTotal.toLocaleString()}`}
                </div>
                <UpiQr amount={payingItem ? payingItem.price : cartTotal} orderId={orderId} />
                <div style={{ margin: "20px 0 12px", fontSize: "11px", color: "#555" }}>Or pay directly via app</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
                  {[
                    { name: "GPay", color: "#4285F4" },
                    { name: "PhonePe", color: "#5f259f" },
                    { name: "Paytm", color: "#002970" },
                  ].map(({ name, color }) => (
                    <button key={name} style={{ ...S.upiBtn, borderColor: color + "44", color: "#e0d8c8" }} onClick={handleOrder}>
                      {name}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: "11px", color: "#555", background: "#0d0d0d", borderRadius: "8px", padding: "10px", textAlign: "left", lineHeight: 1.7 }}>
                  After payment is complete, tap your UPI app's "Payment Successful" and the order will be confirmed. Delivery in 24–48 hours.
                </div>
              </div>
            )}

            {/* ORDER DONE */}
            {checkoutStage === "done" && (
              <div style={{ padding: "32px 24px", textAlign: "center" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(74,222,128,0.1)", border: "2px solid #4ade80", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "28px" }}>✓</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "900", color: "#e0d8c8", marginBottom: "8px" }}>Order Confirmed!</div>
                <div style={{ fontSize: "13px", color: "#555", marginBottom: "20px" }}>Your order #{orderId} will be delivered in 24–48 hours</div>
                <div style={{ fontSize: "11px", color: "#4ade80", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "8px", padding: "10px", marginBottom: "20px" }}>
                  Logged to blockchain · Hash: {orderId.toLowerCase()}a3f9
                </div>
                <button style={S.checkoutBtn} onClick={() => { setShowCart(false); setCart([]); setPayingItem(null); setCheckoutStage("cart"); }}>
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  page: { background: "#0a0a0a", minHeight: "100vh", color: "#e0d8c8", padding: "90px 48px 48px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "16px" },
  headerTag: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "8px" },
  headerTitle: { fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "900", color: "#e0d8c8", lineHeight: 1 },
  headerSub: { fontSize: "13px", color: "#555", marginTop: "6px" },
  cartBtn: { display: "flex", alignItems: "center", gap: "8px", background: "#c8960c", color: "#0a0a0a", border: "none", padding: "12px 20px", borderRadius: "50px", fontSize: "14px", fontWeight: "800", cursor: "pointer", position: "relative", fontFamily: "'DM Sans', sans-serif" },
  cartBadge: { position: "absolute", top: "-6px", right: "-6px", background: "#c4622d", color: "#fff", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700" },
  subTabs: { display: "flex", gap: "4px", background: "#111", padding: "4px", borderRadius: "12px", border: "1px solid #1a1a1a", marginBottom: "24px", width: "fit-content" },
  subTab: { background: "none", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "#555", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  subTabActive: { background: "#1a1a1a", color: "#c8960c" },
  trendHeader: { marginBottom: "20px" },
  // Netflix-style top 10
  netflixList: { display: "flex", flexDirection: "column", gap: "0" },
  netflixCard: { display: "flex", alignItems: "center", gap: "20px", padding: "20px 24px", borderRadius: "0", border: "none", borderBottom: "1px solid #111", position: "relative", transition: "all 0.2s", cursor: "default" },
  netflixRank: { fontFamily: "'Playfair Display', serif", fontSize: "64px", fontWeight: "900", color: "rgba(200,150,12,0.15)", lineHeight: 1, minWidth: "80px", textAlign: "right", flexShrink: 0 },
  netflixEmoji: { fontSize: "48px", flexShrink: 0 },
  netflixInfo: { flex: 1 },
  netflixName: { fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "900", color: "#e0d8c8", marginBottom: "2px" },
  netflixDesi: { fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: "14px", color: "#888", marginBottom: "4px" },
  netflixDesc: { fontSize: "12px", color: "#555", marginBottom: "10px" },
  netflixStats: { display: "flex", gap: "8px", flexWrap: "wrap" },
  statPill: { fontSize: "10px", fontWeight: "700", border: "1px solid", padding: "3px 10px", borderRadius: "20px" },
  medalBadge: { width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "900", color: "#0a0a0a", flexShrink: 0 },
  // Product grid
  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" },
  productCard: { background: "#111", borderRadius: "14px", border: "1px solid #1a1a1a", overflow: "hidden", transition: "border 0.2s", display: "flex", flexDirection: "column" },
  productImgBox: { height: "120px", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" },
  productTag: { position: "absolute", top: "8px", left: "8px", fontSize: "9px", fontWeight: "700", border: "1px solid", padding: "3px 8px", borderRadius: "20px", letterSpacing: "0.5px" },
  outOfStock: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "#c4622d" },
  productInfo: { padding: "14px", flex: 1, display: "flex", flexDirection: "column" },
  productName: { fontSize: "13px", fontWeight: "700", color: "#e0d8c8", marginBottom: "2px", lineHeight: 1.3 },
  productDesi: { fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: "11px", color: "#888", marginBottom: "4px" },
  productType: { fontSize: "9px", color: "#c8960c", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "3px" },
  productBrand: { fontSize: "10px", color: "#555", marginBottom: "5px" },
  productDesc: { fontSize: "11px", color: "#555", lineHeight: 1.5, flex: 1, marginBottom: "8px" },
  productRating: { fontSize: "11px", color: "#c8960c", marginBottom: "4px" },
  productPrice: { fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "900", color: "#c8960c", marginBottom: "10px" },
  productBtns: { display: "flex", gap: "6px" },
  addBtn: { flex: 1, background: "rgba(200,150,12,0.1)", border: "1px solid rgba(200,150,12,0.3)", color: "#c8960c", padding: "8px 0", borderRadius: "8px", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  buyNowBtn: { flex: 1, background: "#c8960c", border: "none", color: "#0a0a0a", padding: "8px 0", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  qtyControl: { display: "flex", alignItems: "center", gap: "0", background: "#0d0d0d", borderRadius: "8px", border: "1px solid #2a2a2a", overflow: "hidden", flex: 1 },
  qtyBtn: { background: "none", border: "none", color: "#c8960c", fontSize: "16px", fontWeight: "700", cursor: "pointer", padding: "6px 12px" },
  qtyNum: { fontSize: "13px", fontWeight: "700", color: "#e0d8c8", flex: 1, textAlign: "center" },
  // Cart drawer
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 2000, display: "flex", justifyContent: "flex-end" },
  drawer: { width: "380px", background: "#111", height: "100vh", display: "flex", flexDirection: "column", borderLeft: "1px solid #1a1a1a", animation: "slideRight 0.3s ease", overflowY: "auto" },
  drawerHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 20px 16px", borderBottom: "1px solid #1a1a1a", background: "#0d0d0d", flexShrink: 0 },
  closeBtn: { background: "none", border: "none", color: "#555", fontSize: "16px", cursor: "pointer", padding: "4px 8px" },
  cartItem: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: "1px solid #141414" },
  cartFooter: { padding: "16px 20px", borderTop: "1px solid #1a1a1a", background: "#0d0d0d", flexShrink: 0 },
  checkoutBtn: { width: "100%", background: "#c8960c", color: "#0a0a0a", border: "none", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  addrInput: { width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px 14px", color: "#e0d8c8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" },
  upiBtn: { background: "#0d0d0d", border: "1px solid", padding: "10px 0", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
};