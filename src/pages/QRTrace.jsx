import { useState, useEffect } from "react";

const BLOCKCHAIN_LOG = [
  { hash: "a3f9c2d1e8b4", action: "Harvest Logged", detail: "Wheat · 18 quintals · Plot 347", date: "Mar 20 · 09:00", color: "#c8960c" },
  { hash: "b7d4e1f8c2a9", action: "Treatment Applied", detail: "Propiconazole 25% EC · 200ml/acre", date: "Mar 19 · 16:45", color: "#4ade80" },
  { hash: "c9f2a8b3d1e5", action: "Disease Detected", detail: "Wheat Rust · Zone C · 94% confidence", date: "Mar 19 · 14:32", color: "#c4622d" },
  { hash: "d1e5b3c7f9a2", action: "Purchase Verified", detail: "Kisan Agro Sikar · INR 340 · UPI", date: "Mar 19 · 15:10", color: "#4ade80" },
  { hash: "e4c7f9a2b3d1", action: "Irrigation Logged", detail: "3.2 hours · Full farm coverage", date: "Mar 15 · 07:00", color: "#4ade80" },
  { hash: "f8a2c1d9e5b7", action: "Soil Reading", detail: "pH 6.4 · Moisture 67% · N: 42mg/kg", date: "Mar 10 · 08:30", color: "#c8960c" },
  { hash: "g2b5d8f1c4e7", action: "Fertilizer Applied", detail: "Urea 12kg · Nitrogen boost", date: "Mar 05 · 06:00", color: "#4ade80" },
  { hash: "h6c3e9a7d2f4", action: "Sowing Logged", detail: "Wheat seed · 4.2 acres · Certified", date: "Feb 20 · 07:00", color: "#c8960c" },
];

const PESTICIDE_DB = {
  "KISAN-001": { valid: true, name: "Propiconazole 25% EC", batch: "KA2024031", mfg: "Mar 2024", exp: "Mar 2026", supplier: "Kisan Agro Ltd", verified: true },
  "FAKE-999": { valid: false, name: "Unknown Product", batch: "INVALID", mfg: "Unknown", exp: "Unknown", supplier: "Unverified", verified: false },
  "GREEN-202": { valid: true, name: "Neem Oil Concentrate", batch: "GE2024028", mfg: "Feb 2024", exp: "Feb 2025", supplier: "Green Earth Organics", verified: true },
};

function QRCodeSVG({ value, size = 160, color = "#c8960c" }) {
  const cells = 21;
  const cellSize = size / cells;
  const pattern = Array.from({ length: cells }, (_, r) =>
    Array.from({ length: cells }, (_, c) => {
      const inCorner = (r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7);
      const onBorder = inCorner && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= cells - 7 && (r === cells - 7 || r === cells - 1 || c === 0 || c === 6)));
      const innerSquare = (r >= 2 && r <= 4 && c >= 2 && c <= 4) || (r >= 2 && r <= 4 && c >= cells - 5 && c <= cells - 3) || (r >= cells - 5 && r <= cells - 3 && c >= 2 && c <= 4);
      if (inCorner) return onBorder || innerSquare ? 1 : 0;
      const hash = (r * 31 + c * 17 + value.charCodeAt(r % value.length)) % 3;
      return hash === 0 ? 1 : 0;
    })
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="#0d0d0d" rx="8" />
      {pattern.map((row, r) =>
        row.map((cell, c) =>
          cell ? <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize - 0.5} height={cellSize - 0.5} fill={color} rx="0.5" /> : null
        )
      )}
      <rect x={size / 2 - 16} y={size / 2 - 16} width={32} height={32} fill="#0d0d0d" rx="4" />
      <text x={size / 2} y={size / 2 + 6} textAnchor="middle" fontSize="14" fontWeight="900" fill={color} fontFamily="serif">V</text>
    </svg>
  );
}

export default function QRTrace({ language = "EN" }) {
  const [view, setView] = useState("farmer");
  const [consumerTab, setConsumerTab] = useState("story");
  const [farmerTab, setFarmerTab] = useState("generate");
  const [batchName, setBatchName] = useState("Wheat Harvest — Mar 2026");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [pesticideCode, setPesticideCode] = useState("");
  const [pesticideResult, setPesticideResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const handleGenerateQR = () => setQrGenerated(true);

  const handlePesticideScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const code = pesticideCode.toUpperCase().trim() || "FAKE-999";
      setPesticideResult(PESTICIDE_DB[code] || PESTICIDE_DB["FAKE-999"]);
    }, 1800);
  };

  const handlePayment = () => {
    setPaymentDone(true);
    setTimeout(() => setPaymentDone(false), 3000);
  };

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scanLine { 0%{top:8%} 100%{top:88%} }
      `}</style>

      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={S.headerTag}>Blockchain Traceability</div>
          <h1 style={S.headerTitle}>QR Trace</h1>
          <p style={S.headerSub}>Every grain verified · Farm to fork · Forever on blockchain</p>
        </div>
        {/* View Toggle */}
        <div style={S.viewToggle}>
          <button style={{ ...S.viewBtn, ...(view === "farmer" ? S.viewBtnActive : {}) }} onClick={() => setView("farmer")}>Farmer View</button>
          <button style={{ ...S.viewBtn, ...(view === "consumer" ? S.viewBtnActive : {}) }} onClick={() => setView("consumer")}>Consumer View</button>
        </div>
      </div>

      {/* ── FARMER VIEW ── */}
      {view === "farmer" && (
        <div style={{ animation: "slideIn 0.3s ease" }}>
          <div style={S.farmerTabs}>
            {[["generate", "Generate QR"], ["blockchain", "Blockchain Log"], ["pesticide", "Pesticide Scanner"]].map(([id, label]) => (
              <button key={id} style={{ ...S.tab, ...(farmerTab === id ? S.tabActive : {}) }} onClick={() => setFarmerTab(id)}>{label}</button>
            ))}
          </div>

          {/* Generate QR */}
          {farmerTab === "generate" && (
            <div style={S.twoCol}>
              <div style={S.card}>
                <div style={S.cardTitle}>Generate Harvest QR</div>
                <p style={{ fontSize: "12px", color: "#555", marginTop: "6px", marginBottom: "20px", lineHeight: 1.7 }}>
                  Create a tamper-proof QR code for your harvest batch. Buyers scan it to see the complete verified history of your crop.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { label: "Batch Name", value: batchName, set: setBatchName, placeholder: "e.g. Wheat Harvest Mar 2026" },
                  ].map(({ label, value, set, placeholder }) => (
                    <div key={label}>
                      <div style={S.inputLabel}>{label}</div>
                      <input style={S.input} value={value} onChange={e => set(e.target.value)} placeholder={placeholder} />
                    </div>
                  ))}
                  {[
                    ["Farmer", "Ramesh Kumar"],
                    ["Plot", "347 · Sikar, Rajasthan"],
                    ["Crop", "Wheat · 18 Quintals"],
                    ["Harvest Date", "March 20, 2026"],
                    ["Quality Score", "94 / 100"],
                    ["Zero Synthetic Pesticides", "Verified ✓"],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #141414" }}>
                      <span style={{ fontSize: "12px", color: "#555" }}>{l}</span>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#e0d8c8" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <button style={S.generateBtn} onClick={handleGenerateQR}>
                  {qrGenerated ? "Regenerate QR Code" : "Generate QR Code"}
                </button>
              </div>

              {/* QR Display */}
              <div style={S.card}>
                <div style={S.cardTitle}>Your Harvest QR</div>
                {!qrGenerated ? (
                  <div style={S.qrPlaceholder}>
                    <div style={S.qrPlaceholderInner}>
                      <div style={S.qrPlaceholderIcon}>⬛</div>
                      <div style={S.qrPlaceholderText}>Fill details and click Generate</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ animation: "fadeUp 0.4s ease" }}>
                    <div style={S.qrWrap}>
                      <QRCodeSVG value={batchName} size={180} color="#c8960c" />
                      <div style={S.qrHash}>
                        <span style={S.hashLabel}>HASH</span>
                        <span style={S.hashValue}>f8a2c1d9e5b7</span>
                        <span style={S.verifiedBadge}>✓ On Chain</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                      <button style={S.qrActionBtn}>Download PNG</button>
                      <button style={S.qrActionBtn}>Print Label</button>
                      <button style={S.qrActionBtn}>Share Link</button>
                    </div>
                    <div style={S.qrInfo}>
                      <div style={{ fontSize: "10px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Encoded Information</div>
                      {["Farmer identity · GPS coordinates", "Full treatment history", "Every chemical used · verified", "Harvest date · quantity", "Blockchain timestamp"].map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#c8960c", flexShrink: 0 }} />
                          <span style={{ fontSize: "12px", color: "#666" }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Blockchain Log */}
          {farmerTab === "blockchain" && (
            <div style={S.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <div style={S.cardTitle}>Blockchain Activity Log</div>
                <span style={{ ...S.pill, color: "#4ade80", borderColor: "rgba(74,222,128,0.2)" }}>Tamper-proof</span>
              </div>
              <p style={{ fontSize: "12px", color: "#555", marginBottom: "20px", lineHeight: 1.7 }}>
                Every farm action is permanently recorded with a unique cryptographic hash. Cannot be edited, deleted, or faked.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {BLOCKCHAIN_LOG.map((log, i) => (
                  <div key={i} style={{ ...S.logRow, borderLeft: `3px solid ${log.color}` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#e0d8c8" }}>{log.action}</span>
                        <span style={{ fontSize: "10px", color: "#444" }}>{log.date}</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>{log.detail}</div>
                      <div style={S.hashRow}>
                        <span style={S.hashLabel}>HASH</span>
                        <span style={S.hashValue}>{log.hash}</span>
                        <span style={{ fontSize: "10px", color: "#4ade80", fontWeight: "600" }}>✓ Verified</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={S.blockchainFooter}>
                All {BLOCKCHAIN_LOG.length} records stored permanently on chain · Scannable by buyers via QR
              </div>
            </div>
          )}

          {/* Pesticide Scanner */}
          {farmerTab === "pesticide" && (
            <div style={S.twoCol}>
              <div style={S.card}>
                <div style={S.cardTitle}>Fake Pesticide Detector</div>
                <p style={{ fontSize: "12px", color: "#555", marginTop: "6px", marginBottom: "20px", lineHeight: 1.7 }}>
                  Scan any pesticide QR or enter its batch code before buying. We cross-check against our national database of verified and flagged products.
                </p>

                {/* Scan animation */}
                <div style={S.scanBox}>
                  {scanning && <div style={S.scanAnimLine} />}
                  <div style={S.scanCornerTL} /><div style={S.scanCornerTR} />
                  <div style={S.scanCornerBL} /><div style={S.scanCornerBR} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {scanning ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                        <div style={S.spinner} />
                        <span style={{ fontSize: "11px", color: "#c8960c", letterSpacing: "1px" }}>Checking database...</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: "11px", color: "#444", letterSpacing: "1px" }}>Point camera at QR</span>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <div style={S.inputLabel}>Or enter batch code manually</div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      style={{ ...S.input, flex: 1 }}
                      value={pesticideCode}
                      onChange={e => setPesticideCode(e.target.value)}
                      placeholder="e.g. KISAN-001 or GREEN-202"
                    />
                    <button style={S.scanBtn} onClick={handlePesticideScan}>
                      {scanning ? "..." : "Check"}
                    </button>
                  </div>
                  <div style={{ fontSize: "10px", color: "#444", marginTop: "6px" }}>Try: KISAN-001 (valid) or FAKE-999 (counterfeit)</div>
                </div>
              </div>

              {/* Pesticide Result */}
              <div style={S.card}>
                <div style={S.cardTitle}>Verification Result</div>
                {!pesticideResult ? (
                  <div style={{ textAlign: "center", padding: "48px 24px", color: "#333" }}>
                    <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.3 }}>🔍</div>
                    <div style={{ fontSize: "13px" }}>Scan or enter a batch code to verify</div>
                  </div>
                ) : (
                  <div style={{ animation: "fadeUp 0.3s ease", marginTop: "14px" }}>
                    <div style={{ ...S.resultBox, borderColor: pesticideResult.valid ? "rgba(74,222,128,0.3)" : "rgba(196,98,45,0.3)", background: pesticideResult.valid ? "rgba(74,222,128,0.04)" : "rgba(196,98,45,0.04)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                        <div style={{ ...S.resultIcon, background: pesticideResult.valid ? "rgba(74,222,128,0.1)" : "rgba(196,98,45,0.1)", color: pesticideResult.valid ? "#4ade80" : "#c4622d" }}>
                          {pesticideResult.valid ? "✓" : "✗"}
                        </div>
                        <div>
                          <div style={{ fontSize: "16px", fontWeight: "800", color: pesticideResult.valid ? "#4ade80" : "#c4622d", fontFamily: "'Playfair Display', serif" }}>
                            {pesticideResult.valid ? "GENUINE PRODUCT" : "COUNTERFEIT DETECTED"}
                          </div>
                          <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>
                            {pesticideResult.valid ? "Safe to purchase and use" : "Do NOT use this product"}
                          </div>
                        </div>
                      </div>
                      {[
                        ["Product Name", pesticideResult.name],
                        ["Batch Number", pesticideResult.batch],
                        ["Manufactured", pesticideResult.mfg],
                        ["Expiry", pesticideResult.exp],
                        ["Supplier", pesticideResult.supplier],
                      ].map(([l, v]) => (
                        <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <span style={{ fontSize: "11px", color: "#555" }}>{l}</span>
                          <span style={{ fontSize: "12px", fontWeight: "600", color: "#e0d8c8" }}>{v}</span>
                        </div>
                      ))}
                      {!pesticideResult.valid && (
                        <div style={{ marginTop: "12px", padding: "10px", background: "rgba(196,98,45,0.08)", borderRadius: "8px" }}>
                          <div style={{ fontSize: "11px", color: "#c4622d", fontWeight: "700", marginBottom: "3px" }}>Report This Product</div>
                          <div style={{ fontSize: "11px", color: "#555" }}>This batch has been flagged in 3 districts. Tap to report to authorities.</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CONSUMER VIEW ── */}
      {view === "consumer" && (
        <div style={{ animation: "slideIn 0.3s ease" }}>
          <div style={S.consumerWrap}>
            <div style={S.consumerTabs}>
              {[["story", "Farm Story"], ["certificate", "Certificate"], ["payment", "Pay Farmer"]].map(([id, label]) => (
                <button key={id} style={{ ...S.tab, ...(consumerTab === id ? S.tabActive : {}) }} onClick={() => setConsumerTab(id)}>{label}</button>
              ))}
            </div>

            {/* Farm Story */}
            {consumerTab === "story" && (
              <div style={{ ...S.card, maxWidth: "680px", margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
                <div style={S.storyHeader}>
                  <div style={S.farmerAvatar}>R</div>
                  <div>
                    <div style={S.farmerName}>Ramesh Kumar</div>
                    <div style={S.farmerLocation}>Sikar, Rajasthan · Farming since 1987</div>
                  </div>
                  <div style={{ ...S.pill, marginLeft: "auto", color: "#4ade80", borderColor: "rgba(74,222,128,0.2)" }}>✓ Verified Farmer</div>
                </div>

                <div style={S.storyDivider} />

                <div style={S.storyProductBox}>
                  <div style={{ flex: 1 }}>
                    <div style={S.storyProductLabel}>You're holding</div>
                    <div style={S.storyProductName}>Wheat · Batch WH-2026-347</div>
                    <div style={S.storyProductSub}>Harvested March 20, 2026 · 18 Quintals</div>
                  </div>
                  <div style={S.scoreCircle}>
                    <div style={S.scoreNum}>94</div>
                    <div style={S.scoreLabel}>Quality</div>
                  </div>
                </div>

                <div style={S.storyStats}>
                  {[
                    ["Zero Synthetic Pesticides", "✓", "#4ade80"],
                    ["Organic Treatments Only", "✓", "#4ade80"],
                    ["Water Efficient", "✓", "#4ade80"],
                    ["Fair Price Received", "INR 2,200/Qtl", "#c8960c"],
                  ].map(([l, v, c]) => (
                    <div key={l} style={S.storyStat}>
                      <div style={S.storyStatLabel}>{l}</div>
                      <div style={{ ...S.storyStatVal, color: c }}>{v}</div>
                    </div>
                  ))}
                </div>

                <div style={S.storyTimeline}>
                  <div style={S.cardTitle}>Journey of this grain</div>
                  <div style={{ marginTop: "14px" }}>
                    {[
                      { dot: "#c8960c", title: "Seeds Sown", detail: "February 20 · Certified seed · Plot 347", date: "Feb 20" },
                      { dot: "#4ade80", title: "Fertilizer Applied", detail: "Urea 12kg · Nitrogen boost · Organic", date: "Mar 05" },
                      { dot: "#4ade80", title: "Irrigation Done", detail: "3.2 hours · Rain debt covered", date: "Mar 15" },
                      { dot: "#c4622d", title: "Disease Detected", detail: "Wheat Rust · Treated with certified fungicide", date: "Mar 19" },
                      { dot: "#4ade80", title: "Treatment Verified", detail: "Propiconazole · Sourced from verified supplier", date: "Mar 19" },
                      { dot: "#c8960c", title: "Harvested", detail: "18 quintals · Quality tested · 94/100", date: "Mar 20" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "14px", position: "relative" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.dot, marginTop: "5px", flexShrink: 0, zIndex: 1 }} />
                        {i < 5 && <div style={{ position: "absolute", left: "3px", top: "14px", bottom: "-14px", width: "1px", background: "#1a1a1a" }} />}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: "#e0d8c8" }}>{item.title}</span>
                            <span style={{ fontSize: "10px", color: "#444" }}>{item.date}</span>
                          </div>
                          <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{item.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Certificate */}
            {consumerTab === "certificate" && (
              <div style={{ ...S.certificate, animation: "fadeUp 0.4s ease" }}>
                <div style={S.certBorder}>
                  <div style={S.certHeader}>
                    <div style={S.certLogo}>VRDAN</div>
                    <div style={S.certSubtitle}>वरदान · Verified Farm Certificate</div>
                  </div>
                  <div style={S.certDividerLine} />
                  <div style={S.certTitle}>Certificate of Authenticity</div>
                  <div style={S.certBody}>
                    This certifies that the agricultural produce bearing batch number
                    <span style={{ color: "#c8960c", fontWeight: "700" }}> WH-2026-347 </span>
                    was grown by
                    <span style={{ color: "#c8960c", fontWeight: "700" }}> Ramesh Kumar </span>
                    on Plot 347, Sikar, Rajasthan, using verified inputs only, with full traceability recorded on blockchain.
                  </div>
                  <div style={S.certStats}>
                    {[
                      ["Crop", "Wheat"],
                      ["Quantity", "18 Quintals"],
                      ["Quality Score", "94/100"],
                      ["Pesticide Use", "Zero Synthetic"],
                      ["Harvest Date", "Mar 20, 2026"],
                      ["Chain ID", "f8a2c1d9e5b7"],
                    ].map(([l, v]) => (
                      <div key={l} style={S.certStat}>
                        <div style={S.certStatLabel}>{l}</div>
                        <div style={S.certStatVal}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={S.certDividerLine} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                    <div>
                      <div style={{ fontSize: "10px", color: "#555", letterSpacing: "1px", marginBottom: "4px" }}>BLOCKCHAIN VERIFIED</div>
                      <div style={{ fontSize: "11px", color: "#c8960c", fontFamily: "monospace" }}>VRDAN-f8a2c1d9e5b7-2026</div>
                    </div>
                    <QRCodeSVG value="WH-2026-347" size={80} color="#c8960c" />
                  </div>
                </div>
              </div>
            )}

            {/* Pay Farmer */}
            {consumerTab === "payment" && (
              <div style={{ ...S.card, maxWidth: "480px", margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
                <div style={S.cardTitle}>Pay Farmer Directly</div>
                <p style={{ fontSize: "12px", color: "#555", marginTop: "6px", marginBottom: "20px", lineHeight: 1.7 }}>
                  No middlemen. 100% of your payment goes directly to Ramesh Kumar via UPI.
                </p>
                <div style={S.payFarmerCard}>
                  <div style={S.farmerAvatar}>R</div>
                  <div>
                    <div style={S.farmerName}>Ramesh Kumar</div>
                    <div style={S.farmerLocation}>Sikar, Rajasthan</div>
                    <div style={{ fontSize: "10px", color: "#4ade80", marginTop: "3px" }}>✓ Verified · UPI: ramesh.kumar@upi</div>
                  </div>
                </div>
                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[["Product", "Wheat · Batch WH-2026-347"], ["Quantity", "1 Quintal"], ["Price", "INR 2,200"]].map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #141414" }}>
                      <span style={{ fontSize: "12px", color: "#555" }}>{l}</span>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#e0d8c8" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "16px" }}>
                  {["GPay", "PhonePe", "Paytm"].map(app => (
                    <button key={app} style={S.upiBtn} onClick={handlePayment}>
                      {app}
                    </button>
                  ))}
                </div>
                {paymentDone && (
                  <div style={{ ...S.successBox, animation: "fadeUp 0.3s ease" }}>
                    <div style={{ fontSize: "20px", color: "#4ade80", marginBottom: "6px" }}>✓</div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#4ade80" }}>Payment Successful</div>
                    <div style={{ fontSize: "11px", color: "#555", marginTop: "3px" }}>INR 2,200 sent to Ramesh Kumar</div>
                    <div style={{ fontSize: "10px", color: "#333", marginTop: "6px" }}>Logged on blockchain · Hash: x9k2m4p1</div>
                  </div>
                )}
                <div style={{ marginTop: "16px", padding: "12px", background: "rgba(200,150,12,0.05)", borderRadius: "8px", border: "1px solid rgba(200,150,12,0.1)", fontSize: "11px", color: "#555", lineHeight: 1.6 }}>
                  This transaction will be permanently recorded on blockchain, linking your payment to the farm batch for complete traceability.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  page: { background: "#0a0a0a", minHeight: "100vh", paddingTop: "70px", color: "#e0d8c8", padding: "90px 48px 48px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" },
  headerTag: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "8px" },
  headerTitle: { fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "900", color: "#e0d8c8", lineHeight: 1 },
  headerSub: { fontSize: "13px", color: "#555", marginTop: "6px" },
  viewToggle: { display: "flex", background: "#111", padding: "4px", borderRadius: "12px", border: "1px solid #1a1a1a", gap: "4px" },
  viewBtn: { background: "none", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "#555", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  viewBtnActive: { background: "#1a1a1a", color: "#c8960c" },
  farmerTabs: { display: "flex", gap: "4px", background: "#111", padding: "4px", borderRadius: "12px", border: "1px solid #1a1a1a", marginBottom: "20px", width: "fit-content" },
  tab: { background: "none", border: "none", padding: "9px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "#555", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  tabActive: { background: "#1a1a1a", color: "#c8960c" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  card: { background: "#111", borderRadius: "16px", border: "1px solid #1a1a1a", padding: "22px" },
  cardTitle: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" },
  inputLabel: { fontSize: "10px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" },
  input: { width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px 14px", color: "#e0d8c8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" },
  generateBtn: { width: "100%", background: "#c8960c", color: "#0a0a0a", border: "none", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: "20px" },
  qrPlaceholder: { height: "220px", background: "#0d0d0d", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "14px" },
  qrPlaceholderInner: { textAlign: "center" },
  qrPlaceholderIcon: { fontSize: "32px", opacity: 0.2, marginBottom: "10px" },
  qrPlaceholderText: { fontSize: "12px", color: "#444" },
  qrWrap: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "14px", gap: "12px" },
  qrHash: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center" },
  hashLabel: { fontSize: "9px", color: "#444", letterSpacing: "1px", background: "#1a1a1a", padding: "2px 6px", borderRadius: "3px" },
  hashValue: { fontSize: "11px", color: "#555", fontFamily: "monospace" },
  verifiedBadge: { fontSize: "10px", color: "#4ade80", fontWeight: "600" },
  qrActionBtn: { flex: 1, background: "#0d0d0d", border: "1px solid #2a2a2a", color: "#666", padding: "8px", borderRadius: "8px", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  qrInfo: { marginTop: "16px", padding: "14px", background: "#0d0d0d", borderRadius: "10px", border: "1px solid #1a1a1a" },
  logRow: { background: "#0d0d0d", borderRadius: "10px", padding: "14px 16px" },
  hashRow: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  blockchainFooter: { marginTop: "16px", padding: "12px 16px", background: "rgba(200,150,12,0.04)", borderRadius: "8px", textAlign: "center", fontSize: "11px", color: "#555", border: "1px solid rgba(200,150,12,0.08)" },
  pill: { fontSize: "10px", fontWeight: "700", border: "1px solid", padding: "4px 10px", borderRadius: "20px" },
  scanBox: { height: "140px", background: "#0d0d0d", borderRadius: "12px", position: "relative", overflow: "hidden", border: "1px solid #1a1a1a" },
  scanAnimLine: { position: "absolute", left: "8px", right: "8px", height: "1px", background: "rgba(200,150,12,0.7)", animation: "scanLine 1.5s ease-in-out infinite alternate", boxShadow: "0 0 8px rgba(200,150,12,0.4)" },
  scanCornerTL: { position: "absolute", top: "8px", left: "8px", width: "16px", height: "16px", borderTop: "2px solid #c8960c", borderLeft: "2px solid #c8960c" },
  scanCornerTR: { position: "absolute", top: "8px", right: "8px", width: "16px", height: "16px", borderTop: "2px solid #c8960c", borderRight: "2px solid #c8960c" },
  scanCornerBL: { position: "absolute", bottom: "8px", left: "8px", width: "16px", height: "16px", borderBottom: "2px solid #c8960c", borderLeft: "2px solid #c8960c" },
  scanCornerBR: { position: "absolute", bottom: "8px", right: "8px", width: "16px", height: "16px", borderBottom: "2px solid #c8960c", borderRight: "2px solid #c8960c" },
  spinner: { width: "18px", height: "18px", border: "2px solid #1a1a1a", borderTop: "2px solid #c8960c", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  scanBtn: { background: "#c8960c", color: "#0a0a0a", border: "none", padding: "10px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  resultBox: { borderRadius: "12px", border: "1px solid", padding: "16px" },
  resultIcon: { width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "700", flexShrink: 0 },
  consumerWrap: {},
  consumerTabs: { display: "flex", gap: "4px", background: "#111", padding: "4px", borderRadius: "12px", border: "1px solid #1a1a1a", marginBottom: "20px", width: "fit-content" },
  storyHeader: { display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" },
  farmerAvatar: { width: "48px", height: "48px", borderRadius: "50%", background: "rgba(200,150,12,0.15)", border: "2px solid rgba(200,150,12,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "900", color: "#c8960c", fontFamily: "'Playfair Display', serif", flexShrink: 0 },
  farmerName: { fontSize: "16px", fontWeight: "800", color: "#e0d8c8", fontFamily: "'Playfair Display', serif" },
  farmerLocation: { fontSize: "11px", color: "#555", marginTop: "2px" },
  storyDivider: { height: "1px", background: "#1a1a1a", margin: "16px 0" },
  storyProductBox: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#0d0d0d", borderRadius: "10px", marginBottom: "14px" },
  storyProductLabel: { fontSize: "9px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" },
  storyProductName: { fontSize: "16px", fontWeight: "800", color: "#e0d8c8", fontFamily: "'Playfair Display', serif" },
  storyProductSub: { fontSize: "11px", color: "#555", marginTop: "3px" },
  scoreCircle: { width: "56px", height: "56px", borderRadius: "50%", background: "rgba(74,222,128,0.08)", border: "2px solid rgba(74,222,128,0.2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  scoreNum: { fontSize: "18px", fontWeight: "900", color: "#4ade80", fontFamily: "'Playfair Display', serif", lineHeight: 1 },
  scoreLabel: { fontSize: "8px", color: "#4ade80", letterSpacing: "0.5px" },
  storyStats: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" },
  storyStat: { background: "#0d0d0d", borderRadius: "8px", padding: "10px 12px" },
  storyStatLabel: { fontSize: "10px", color: "#555", marginBottom: "4px" },
  storyStatVal: { fontSize: "13px", fontWeight: "700" },
  storyTimeline: { marginTop: "4px" },
  certificate: { maxWidth: "600px", margin: "0 auto" },
  certBorder: { background: "#111", borderRadius: "16px", border: "1px solid rgba(200,150,12,0.2)", padding: "32px", position: "relative" },
  certHeader: { textAlign: "center", marginBottom: "16px" },
  certLogo: { fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "900", color: "#c8960c", letterSpacing: "6px" },
  certSubtitle: { fontSize: "11px", color: "#555", marginTop: "4px", letterSpacing: "2px" },
  certDividerLine: { height: "1px", background: "rgba(200,150,12,0.2)", margin: "16px 0" },
  certTitle: { fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", color: "#e0d8c8", textAlign: "center", marginBottom: "16px" },
  certBody: { fontSize: "13px", color: "#888", lineHeight: 1.9, textAlign: "center", marginBottom: "20px" },
  certStats: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "8px" },
  certStat: { background: "#0d0d0d", borderRadius: "8px", padding: "10px 12px" },
  certStatLabel: { fontSize: "9px", color: "#444", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" },
  certStatVal: { fontSize: "13px", fontWeight: "700", color: "#c8960c" },
  payFarmerCard: { display: "flex", alignItems: "center", gap: "14px", padding: "14px", background: "#0d0d0d", borderRadius: "10px", marginTop: "14px" },
  upiBtn: { background: "#0d0d0d", border: "1px solid #2a2a2a", color: "#e0d8c8", padding: "12px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  successBox: { marginTop: "14px", padding: "16px", background: "rgba(74,222,128,0.06)", borderRadius: "10px", border: "1px solid rgba(74,222,128,0.15)", textAlign: "center" },
};