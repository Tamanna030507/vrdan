import { useState, useEffect, useRef } from "react";

const TYPEWRITER_LINES = ["Detect. Treat.", "Buy Real.", "Grow More."];

const STATS = [
  { number: "140M+", label: "Farmers in India", sub: "किसान" },
  { number: "40%", label: "Yield lost to disease", sub: "बीमारी से नुकसान" },
  { number: "INR 23K", label: "Lost per season", sub: "प्रति सीजन नुकसान" },
  { number: "4 sec", label: "To diagnose any crop", sub: "फसल की जांच" },
];

const PROBLEMS = [
  { text: "Disease detected too late — entire crop lost", hindi: "बहुत देर से पता चला?" },
  { text: "Wrong treatment bought from local market", hindi: "गलत दवाई खरीदी?" },
  { text: "Fake pesticides destroying the harvest", hindi: "नकली कीटनाशक?" },
  { text: "No verified supplier nearby to trust", hindi: "भरोसेमंद दुकान नहीं?" },
  { text: "No record of what was applied to the crop", hindi: "कोई रिकॉर्ड नहीं?" },
];

const FEATURES = [
  { title: "AI Disease Detection", desc: "Point your phone camera at any crop. CNN model identifies the disease in 4 seconds with 94% accuracy. No lab. No expert. Just your phone.", tag: "Core Feature" },
  { title: "Verified Supplier Marketplace", desc: "Every diagnosis links directly to verified suppliers within 50km. Compare prices, check authenticity badges, order and pay in one flow.", tag: "Marketplace" },
  { title: "Fake Pesticide Detection", desc: "Scan any pesticide QR before buying. Platform cross-checks against flagged counterfeit batches reported by farmers across India.", tag: "Trust Layer" },
  { title: "IoT Phone Sensors", desc: "No hardware needed. Your phone camera, GPS, and light sensor act as the entire IoT layer — soil color, canopy health, sun exposure.", tag: "Zero Hardware" },
  { title: "Blockchain Crop Ledger", desc: "Every disease detection, treatment applied, and purchase logged permanently. QR on harvest bag shows buyers the complete verified history.", tag: "Blockchain" },
  { title: "Voice Assistant", desc: "Farmer describes symptoms in Hindi. Platform identifies disease, recommends treatment, and places order — all through voice.", tag: "Multilingual" },
];

const FLOW = [
  { step: "01", title: "Upload Photo", desc: "Farmer points phone at diseased crop" },
  { step: "02", title: "AI Diagnoses", desc: "CNN model identifies disease in 4 seconds" },
  { step: "03", title: "Treatment Shown", desc: "Exact product recommended with dosage" },
  { step: "04", title: "Verified Supplier", desc: "3 nearby verified suppliers shown with prices" },
  { step: "05", title: "Order & Pay", desc: "Direct UPI payment to supplier" },
  { step: "06", title: "Logged Forever", desc: "Treatment recorded on blockchain ledger" },
];

function useTypewriter(lines, speed = 90, pause = 1000) {
  const [display, setDisplay] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (done) return;
    const current = lines[lineIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => { setDisplay(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, speed);
    } else if (!deleting && charIdx === current.length) {
      if (lineIdx === lines.length - 1) { setDone(true); return; }
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => { setDisplay(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }, speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false); setLineIdx(i => i + 1);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, lineIdx, done, lines, speed, pause]);
  return { display, done, finalLine: lines[lines.length - 1] };
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function StatCard({ number, label, sub, delay }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ ...S.statCard, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `all 0.6s ease ${delay}s` }}>
      <div style={S.statNum}>{number}</div>
      <div style={S.statLabel}>{label}</div>
      <div style={S.statHindi}>{sub}</div>
    </div>
  );
}

function ProblemRow({ text, hindi, idx, show, crossed }) {
  return (
    <div style={{ ...S.problemRow, opacity: show ? 1 : 0, transform: show ? "translateX(0)" : "translateX(-32px)", transition: `all 0.5s ease ${idx * 0.12}s` }}>
      <div style={{ ...S.problemDot, background: crossed ? "#4ade80" : "#c8960c" }} />
      <div style={{ flex: 1 }}>
        <span style={{ ...S.problemText, textDecoration: crossed ? "line-through" : "none", color: crossed ? "#444" : "#e0d8c8", transition: "all 0.4s ease" }}>{text}</span>
        <span style={S.problemHindi}> — {hindi}</span>
      </div>
      {crossed && <span style={S.checkMark}>✓</span>}
    </div>
  );
}

function FeatureCard({ title, desc, tag, idx }) {
  const [ref, visible] = useInView();
  const [hovered, setHovered] = useState(false);
  const isCoreFeature = tag === "Core Feature";
  return (
    <div ref={ref}
      style={{ ...S.featureCard, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: `all 0.6s ease ${(idx % 3) * 0.1}s`, background: isCoreFeature ? "rgba(200,150,12,0.05)" : hovered ? "#1a1a1a" : "#111", borderColor: isCoreFeature ? "rgba(200,150,12,0.3)" : hovered ? "#c8960c" : "#2a2a2a", boxShadow: hovered ? "0 20px 60px rgba(200,150,12,0.08)" : "none" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div style={{ ...S.featureNum, color: isCoreFeature ? "#c8960c" : hovered ? "#c8960c" : "#333" }}>0{idx + 1}</div>
        <span style={{ ...S.featureTag, borderColor: isCoreFeature ? "rgba(200,150,12,0.3)" : "rgba(200,150,12,0.12)", color: isCoreFeature ? "#c8960c" : "#c8960c" }}>{tag}</span>
      </div>
      <h3 style={S.featureTitle}>{title}</h3>
      <p style={S.featureDesc}>{desc}</p>
      <div style={{ ...S.featureArrow, opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(-8px)", transition: "all 0.3s ease" }}>Explore →</div>
    </div>
  );
}

function FlowStep({ step, title, desc, idx }) {
  const [ref, visible] = useInView(0.1);
  return (
    <div ref={ref} style={{ ...S.flowStep, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `all 0.5s ease ${idx * 0.1}s` }}>
      <div style={S.flowNum}>{step}</div>
      <div style={S.flowLine} />
      <div style={S.flowTitle}>{title}</div>
      <div style={S.flowDesc}>{desc}</div>
    </div>
  );
}

export default function LandingPage({ setCurrentPage }) {
  const { display, done, finalLine } = useTypewriter(TYPEWRITER_LINES);
  const [probRef, probVisible] = useInView(0.1);
  const [showSolution, setShowSolution] = useState(false);
  const [heroRef, heroVisible] = useInView(0.01);

  useEffect(() => {
    if (probVisible) {
      setTimeout(() => setShowSolution(true), PROBLEMS.length * 120 + 1400);
    }
  }, [probVisible]);

  const displayText = done ? finalLine : display;

  return (
    <div style={S.page}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scan { 0%{top:10%} 100%{top:85%} }
      `}</style>

      {/* HERO */}
      <section style={S.hero} ref={heroRef}>
        <div style={S.heroGlow1} />
        <div style={S.heroGlow2} />
        <div style={S.heroGrid} />

        <div style={{ ...S.heroInner, opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(40px)", transition: "all 1s ease 0.2s" }}>
          <div style={S.heroBadge}>
            <span style={S.heroBadgeDot} />
            AI Crop Disease Detection · India
          </div>

          <h1 style={S.heroTitle}>
            <span style={S.heroTitleGold}>{displayText}</span>
            <span style={{ color: "#c8960c", animation: done ? "none" : "blink 1s step-end infinite", opacity: done ? 0 : 1 }}>|</span>
          </h1>

          <p style={S.heroSub} className="hindi">
            पहचानो। इलाज करो। असली खरीदो।
          </p>

          <p style={S.heroDesc}>
            India's first AI platform that detects crop disease in 4 seconds,
            recommends the exact treatment, and connects farmers directly to
            verified suppliers — eliminating fake pesticides forever.
          </p>

          <div style={S.heroBtns}>
            <button style={S.btnPrimary} onClick={() => setCurrentPage("journal")}>
              Detect Disease Now
            </button>
            <button style={S.btnSecondary} onClick={() => setCurrentPage("dashboard")}>
              View Dashboard
            </button>
          </div>

          <div style={S.scrollHint}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#c8960c", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={S.scrollText}>Scroll to explore</span>
          </div>
        </div>

        {/* Detection Card Visual */}
        <div style={{ ...S.heroCardWrap, opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(40px)", transition: "all 1s ease 0.5s" }}>
          <div style={S.detectionCard}>
            <div style={S.detectionTop}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={S.liveDot} />
                <span style={S.liveText}>LIVE DETECTION</span>
              </div>
              <span style={S.farmName}>Camera Active</span>
            </div>

            {/* Crop scan simulation */}
            <div style={S.cropScanBox}>
              <div style={S.scanZone1} />
              <div style={S.scanZone2} />
              <div style={S.scanZone3} />
              <div style={S.scanLine} />
              <div style={S.scanCornerTL} />
              <div style={S.scanCornerTR} />
              <div style={S.scanCornerBL} />
              <div style={S.scanCornerBR} />
              <div style={S.scanLabel}>Analyzing leaf pattern...</div>
            </div>

            {/* Detection result */}
            <div style={S.detectionResult}>
              <div style={S.resultHeader}>
                <span style={S.resultBadge}>DETECTED</span>
                <span style={S.resultConf}>94% confidence</span>
              </div>
              <div style={S.resultName}>Wheat Rust (Puccinia)</div>
              <div style={S.resultDesc}>Fungal infection — act within 72 hours</div>
            </div>

            {/* Treatment */}
            <div style={S.treatmentBox}>
              <div style={S.treatmentLabel}>Recommended Treatment</div>
              <div style={S.treatmentName}>Propiconazole 25% EC</div>
              <div style={S.treatmentDose}>Dose: 200ml per acre · Apply before rain</div>
            </div>

            {/* Suppliers */}
            <div style={S.suppliersBox}>
              <div style={S.suppliersLabel}>Verified Suppliers Near You</div>
              {[
                { name: "Kisan Agro Sikar", dist: "2.3 km", price: "INR 340", verified: true },
                { name: "Green Earth Store", dist: "4.1 km", price: "INR 310", verified: true },
              ].map((s, i) => (
                <div key={i} style={S.supplierRow}>
                  <div>
                    <div style={S.supplierName}>{s.name} {s.verified && <span style={S.verifiedBadge}>Verified</span>}</div>
                    <div style={S.supplierDist}>{s.dist} away</div>
                  </div>
                  <div style={S.supplierPrice}>{s.price}</div>
                </div>
              ))}
            </div>

            <div style={S.orderBtn}>Order Now · Pay via UPI</div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={S.statsSection}>
        <div style={S.statsGrid}>
          {STATS.map((s, i) => <StatCard key={i} {...s} delay={i * 0.1} />)}
        </div>
      </section>

      {/* FLOW */}
      <section style={S.flowSection}>
        <div style={S.flowInner}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div style={S.sectionTag}>How It Works</div>
            <h2 style={S.sectionTitle}>
              Photo to purchase.<br />
              <span style={S.titleGold}>In under 60 seconds.</span>
            </h2>
          </div>
          <div style={S.flowGrid}>
            {FLOW.map((f, i) => <FlowStep key={i} {...f} idx={i} />)}
          </div>
        </div>
      </section>

      {/* PROBLEMS */}
      <section style={S.problemSection}>
        <div style={S.problemInner}>
          <div style={S.problemLeft}>
            <div style={S.sectionTag}>The Problem</div>
            <h2 style={S.sectionTitle}>
              Farmers lose crores<br />
              <span style={S.titleGold}>every single season.</span>
            </h2>
            <p style={S.sectionDesc}>
              Late detection. Wrong treatment. Fake products.
              Three problems. One platform that fixes all of them permanently.
            </p>
            {showSolution && (
              <div style={S.solutionCard}>
                <div style={S.solutionLine} />
                <div>
                  <div style={S.solutionTitle}>VRDAN eliminates all 5. In one flow.</div>
                  <div style={S.solutionHindi} className="hindi">वरदान — सबका हल, एक ही जगह।</div>
                </div>
              </div>
            )}
          </div>
          <div style={S.problemRight} ref={probRef}>
            {PROBLEMS.map((p, i) => (
              <ProblemRow key={i} {...p} idx={i} show={probVisible} crossed={showSolution} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={S.featuresSection}>
        <div style={S.featuresInner}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={S.sectionTag}>The Platform</div>
            <h2 style={S.sectionTitle}>
              Built for the real India.<br />
              <span style={S.titleGold}>Every single farmer.</span>
            </h2>
          </div>
          <div style={S.featuresGrid}>
            {FEATURES.map((f, i) => <FeatureCard key={i} {...f} idx={i} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={S.ctaSection}>
        <div style={S.ctaGlow} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={S.sectionTag}>The Vision</div>
          <h2 style={S.ctaTitle}>
            Built for 140 million farmers.<br />
            <span style={S.titleGold}>Ready for the world.</span>
          </h2>
          <p style={S.ctaDesc} className="hindi">
            वरदान के साथ, हर किसान स्मार्ट किसान।
          </p>
          <div style={{ ...S.heroBtns, justifyContent: "center" }}>
            <button style={S.btnPrimary} onClick={() => setCurrentPage("journal")}>
              Detect Disease Now
            </button>
            <button style={S.btnSecondary} onClick={() => setCurrentPage("dashboard")}>
              View Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

const S = {
  page: { background: "#0a0a0a", minHeight: "100vh", paddingTop: "70px", color: "#e0d8c8" },
  hero: { minHeight: "calc(100vh - 70px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 60px", position: "relative", overflow: "hidden", gap: "80px", flexWrap: "wrap" },
  heroGlow1: { position: "absolute", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(200,150,12,0.07) 0%, transparent 70%)", top: "10%", left: "15%", pointerEvents: "none" },
  heroGlow2: { position: "absolute", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(45,90,27,0.05) 0%, transparent 70%)", bottom: "10%", right: "15%", pointerEvents: "none" },
  heroGrid: { position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)", backgroundSize: "60px 60px" },
  heroInner: { flex: 1, maxWidth: "520px", zIndex: 1 },
  heroBadge: { display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(200,150,12,0.08)", border: "1px solid rgba(200,150,12,0.2)", color: "#c8960c", padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px", marginBottom: "28px" },
  heroBadgeDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#c8960c", display: "inline-block", boxShadow: "0 0 6px #c8960c" },
  heroTitle: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 6vw, 70px)", fontWeight: "900", lineHeight: 1.05, marginBottom: "16px", minHeight: "80px" },
  heroTitleGold: { color: "#c8960c" },
  heroSub: { fontSize: "17px", color: "#666", marginBottom: "16px", letterSpacing: "1px" },
  heroDesc: { fontSize: "15px", color: "#888", lineHeight: 1.9, marginBottom: "40px", maxWidth: "460px" },
  heroBtns: { display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "48px" },
  btnPrimary: { background: "#c8960c", color: "#0a0a0a", border: "none", padding: "16px 32px", borderRadius: "50px", fontSize: "14px", fontWeight: "800", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.5px" },
  btnSecondary: { background: "transparent", color: "#e0d8c8", border: "1px solid #2a2a2a", padding: "16px 32px", borderRadius: "50px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  scrollHint: { display: "flex", alignItems: "center", gap: "10px" },
  scrollText: { fontSize: "11px", color: "#444", letterSpacing: "2px", textTransform: "uppercase" },

  heroCardWrap: { flex: 1, display: "flex", justifyContent: "center", zIndex: 1 },
  detectionCard: { background: "#111", borderRadius: "20px", border: "1px solid #1e1e1e", width: "340px", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.5)" },
  detectionTop: { background: "#0d0d0d", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1a1a1a" },
  liveDot: { width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" },
  liveText: { color: "#4ade80", fontSize: "10px", fontWeight: "700", letterSpacing: "3px" },
  farmName: { color: "#555", fontSize: "11px" },

  cropScanBox: { height: "160px", background: "#0d1a0a", position: "relative", overflow: "hidden" },
  scanZone1: { position: "absolute", background: "#2d5a1b", top: "15%", left: "10%", width: "35%", height: "50%", borderRadius: "4px", opacity: 0.7 },
  scanZone2: { position: "absolute", background: "#4a7c35", top: "20%", left: "48%", width: "42%", height: "40%", borderRadius: "4px", opacity: 0.6 },
  scanZone3: { position: "absolute", background: "#c4622d", top: "55%", left: "25%", width: "30%", height: "30%", borderRadius: "4px", opacity: 0.5 },
  scanLine: { position: "absolute", left: "8px", right: "8px", height: "1px", background: "rgba(200,150,12,0.6)", top: "50%", animation: "scan 2s ease-in-out infinite alternate", boxShadow: "0 0 8px rgba(200,150,12,0.4)" },
  scanCornerTL: { position: "absolute", top: "6px", left: "6px", width: "16px", height: "16px", borderTop: "2px solid #c8960c", borderLeft: "2px solid #c8960c" },
  scanCornerTR: { position: "absolute", top: "6px", right: "6px", width: "16px", height: "16px", borderTop: "2px solid #c8960c", borderRight: "2px solid #c8960c" },
  scanCornerBL: { position: "absolute", bottom: "6px", left: "6px", width: "16px", height: "16px", borderBottom: "2px solid #c8960c", borderLeft: "2px solid #c8960c" },
  scanCornerBR: { position: "absolute", bottom: "6px", right: "6px", width: "16px", height: "16px", borderBottom: "2px solid #c8960c", borderRight: "2px solid #c8960c" },
  scanLabel: { position: "absolute", bottom: "8px", left: "0", right: "0", textAlign: "center", fontSize: "9px", color: "#c8960c", letterSpacing: "1px" },

  detectionResult: { padding: "14px 18px", borderBottom: "1px solid #1a1a1a" },
  resultHeader: { display: "flex", justifyContent: "space-between", marginBottom: "6px" },
  resultBadge: { fontSize: "9px", fontWeight: "700", letterSpacing: "2px", color: "#c4622d", background: "rgba(196,98,45,0.1)", padding: "3px 8px", borderRadius: "4px" },
  resultConf: { fontSize: "10px", color: "#4ade80", fontWeight: "600" },
  resultName: { fontSize: "15px", fontWeight: "800", color: "#e0d8c8", fontFamily: "'Playfair Display', serif", marginBottom: "3px" },
  resultDesc: { fontSize: "11px", color: "#c4622d" },

  treatmentBox: { padding: "12px 18px", borderBottom: "1px solid #1a1a1a", background: "rgba(200,150,12,0.04)" },
  treatmentLabel: { fontSize: "9px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" },
  treatmentName: { fontSize: "14px", fontWeight: "700", color: "#c8960c", marginBottom: "2px" },
  treatmentDose: { fontSize: "10px", color: "#555" },

  suppliersBox: { padding: "12px 18px", borderBottom: "1px solid #1a1a1a" },
  suppliersLabel: { fontSize: "9px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" },
  supplierRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  supplierName: { fontSize: "12px", fontWeight: "600", color: "#e0d8c8" },
  verifiedBadge: { fontSize: "8px", background: "rgba(74,222,128,0.1)", color: "#4ade80", padding: "2px 6px", borderRadius: "3px", marginLeft: "6px", fontWeight: "700", letterSpacing: "0.5px" },
  supplierDist: { fontSize: "10px", color: "#444" },
  supplierPrice: { fontSize: "13px", fontWeight: "700", color: "#c8960c" },

  orderBtn: { margin: "12px", background: "#c8960c", color: "#0a0a0a", borderRadius: "8px", padding: "12px", textAlign: "center", fontSize: "12px", fontWeight: "800", letterSpacing: "0.5px", cursor: "pointer" },

  statsSection: { background: "#0d0d0d", borderTop: "1px solid #151515", borderBottom: "1px solid #151515", padding: "70px 60px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", maxWidth: "1100px", margin: "0 auto" },
  statCard: { textAlign: "center", padding: "36px 24px", background: "#111", borderRadius: "16px", border: "1px solid #1a1a1a" },
  statNum: { fontFamily: "'Playfair Display', serif", fontSize: "48px", fontWeight: "900", color: "#c8960c", lineHeight: 1 },
  statLabel: { color: "#666", fontSize: "13px", marginTop: "10px" },
  statHindi: { color: "#333", fontSize: "11px", marginTop: "4px" },

  flowSection: { padding: "120px 60px", background: "#0a0a0a" },
  flowInner: { maxWidth: "1100px", margin: "0 auto" },
  flowGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1px", background: "#1a1a1a", border: "1px solid #1a1a1a", borderRadius: "16px", overflow: "hidden" },
  flowStep: { padding: "32px 24px", background: "#111" },
  flowNum: { fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "900", color: "#c8960c", marginBottom: "16px" },
  flowLine: { width: "24px", height: "2px", background: "#c8960c", marginBottom: "12px", opacity: 0.4 },
  flowTitle: { fontSize: "14px", fontWeight: "700", color: "#e0d8c8", marginBottom: "8px" },
  flowDesc: { fontSize: "12px", color: "#555", lineHeight: 1.6 },

  problemSection: { padding: "120px 60px", background: "#0d0d0d" },
  problemInner: { display: "flex", gap: "100px", maxWidth: "1100px", margin: "0 auto", alignItems: "flex-start", flexWrap: "wrap" },
  problemLeft: { flex: 1, minWidth: "280px" },
  problemRight: { flex: 1, minWidth: "280px" },
  sectionTag: { display: "inline-block", color: "#c8960c", fontSize: "10px", fontWeight: "700", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "18px" },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: "900", color: "#e0d8c8", lineHeight: 1.15, marginBottom: "20px" },
  titleGold: { color: "#c8960c" },
  sectionDesc: { fontSize: "15px", color: "#555", lineHeight: 1.9, marginBottom: "40px" },
  solutionCard: { display: "flex", alignItems: "flex-start", gap: "16px", background: "rgba(200,150,12,0.06)", border: "1px solid rgba(200,150,12,0.15)", borderRadius: "12px", padding: "20px 22px", animation: "fadeUp 0.5s ease forwards" },
  solutionLine: { width: "3px", minHeight: "40px", background: "#c8960c", borderRadius: "2px", flexShrink: 0 },
  solutionTitle: { fontSize: "15px", fontWeight: "700", color: "#c8960c", marginBottom: "6px" },
  solutionHindi: { fontSize: "13px", color: "#555" },
  problemRow: { display: "flex", alignItems: "center", gap: "14px", padding: "18px 0", borderBottom: "1px solid #141414" },
  problemDot: { width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0, transition: "background 0.4s ease" },
  problemText: { fontSize: "15px", fontWeight: "500", transition: "all 0.4s ease" },
  problemHindi: { fontSize: "12px", color: "#444" },
  checkMark: { color: "#4ade80", fontSize: "14px", fontWeight: "700" },

  featuresSection: { padding: "120px 60px", background: "#0a0a0a" },
  featuresInner: { maxWidth: "1100px", margin: "0 auto" },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1px", background: "#1a1a1a", border: "1px solid #1a1a1a", borderRadius: "16px", overflow: "hidden" },
  featureCard: { padding: "36px", cursor: "pointer", transition: "all 0.3s ease" },
  featureNum: { fontSize: "32px", fontWeight: "900", fontFamily: "'Playfair Display', serif", transition: "color 0.3s ease", lineHeight: 1 },
  featureTag: { fontSize: "9px", fontWeight: "700", letterSpacing: "2px", color: "#c8960c", background: "rgba(200,150,12,0.08)", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(200,150,12,0.12)", textTransform: "uppercase" },
  featureTitle: { fontFamily: "'Playfair Display', serif", fontSize: "19px", fontWeight: "700", color: "#e0d8c8", marginBottom: "10px" },
  featureDesc: { fontSize: "14px", color: "#555", lineHeight: 1.8, marginBottom: "16px" },
  featureArrow: { fontSize: "12px", color: "#c8960c", fontWeight: "700", letterSpacing: "0.5px" },

  ctaSection: { padding: "140px 60px", textAlign: "center", background: "#0d0d0d", position: "relative", overflow: "hidden" },
  ctaGlow: { position: "absolute", width: "800px", height: "400px", background: "radial-gradient(ellipse, rgba(200,150,12,0.05) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" },
  ctaTitle: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 60px)", fontWeight: "900", color: "#e0d8c8", lineHeight: 1.1, marginBottom: "20px" },
  ctaDesc: { fontSize: "18px", color: "#555", marginBottom: "52px" },
};