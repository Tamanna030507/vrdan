import { useState } from "react";

const MSP_DATA = [
  { crop: "Wheat", msp: 2275, market: 2200, season: "Rabi 2025-26" },
  { crop: "Mustard", msp: 5950, market: 5800, season: "Rabi 2025-26" },
  { crop: "Chickpea", msp: 5440, market: 5200, season: "Rabi 2025-26" },
  { crop: "Barley", msp: 1850, market: 1800, season: "Rabi 2025-26" },
  { crop: "Rice", msp: 2300, market: 3400, season: "Kharif 2025" },
  { crop: "Soybean", msp: 4892, market: 4600, season: "Kharif 2025" },
  { crop: "Maize", msp: 2090, market: 2150, season: "Kharif 2025" },
];

const POLICY_TABS = [
  { id: "pmkisan", label: "PM-KISAN" },
  { id: "pmfby", label: "PMFBY" },
  { id: "kcc", label: "Kisan Credit Card" },
  { id: "nabard", label: "NABARD Loans" },
  { id: "soil", label: "Soil Health Card" },
  { id: "fertilizer", label: "Fertilizer Subsidy" },
];

const POLICY_DATA = {
  pmkisan: {
    name: "PM-KISAN", full: "Pradhan Mantri Kisan Samman Nidhi",
    benefit: "INR 6,000 per year", color: "#4ade80",
    status: "Active", statusColor: "#4ade80", tag: "Direct Cash",
    monetary: "INR 2,000 credited April 1. Total INR 6,000 this year straight to your bank.",
    nextPayment: "April 1, 2026", installment: "INR 2,000 per installment",
    desc: "Direct income support to all farmer families. 3 installments of INR 2,000 each year directly to bank account. No paperwork needed after registration.",
    howTo: "Register at pmkisan.gov.in with Aadhaar + bank details. Process takes 3-5 days.",
    eligibility: "All landholding farmer families except income tax payers and government employees.",
    steps: ["Visit pmkisan.gov.in or nearest CSC", "Click 'New Farmer Registration'", "Enter Aadhaar number + bank account", "Upload land records", "Submit — payment starts next installment"],
    helpline: "PM-KISAN Helpline: 155261",
  },
  pmfby: {
    name: "PMFBY", full: "Pradhan Mantri Fasal Bima Yojana",
    benefit: "Up to INR 2 lakh crop insurance", color: "#c8960c",
    status: "Enrollment Open", statusColor: "#c8960c", tag: "Insurance",
    monetary: "Pay INR 900 premium → get up to INR 60,000 compensation if crop fails.",
    nextPayment: "Enrollment deadline: March 31, 2026", installment: "Premium: 1.5% of sum insured",
    desc: "If crop fails due to drought, flood, pest or disease — government pays full compensation. You pay only 1.5% premium. Government pays the rest.",
    howTo: "Enroll at nearest bank or Common Service Centre before sowing deadline. Loanee farmers auto-enrolled.",
    eligibility: "All farmers growing notified crops in notified areas. Compulsory for loanee farmers.",
    steps: ["Visit nearest bank or CSC before sowing deadline", "Fill PMFBY application form", "Pay premium amount (1.5-2% of sum insured)", "Get policy document and keep it safe", "In case of loss — report within 72 hours to bank"],
    helpline: "PMFBY Helpline: 1800-200-7710",
  },
  kcc: {
    name: "Kisan Credit Card", full: "KCC Short Term Credit Scheme",
    benefit: "Loan up to INR 3 lakh at 4% interest", color: "#c8960c",
    status: "Always Open", statusColor: "#4ade80", tag: "Loan",
    monetary: "Borrow INR 1 lakh at 4% = INR 4,000 interest. Moneylender charges INR 40,000.",
    nextPayment: "Revolving credit — use anytime", installment: "4% per year",
    desc: "Special credit card for farmers. Borrow for seeds, fertilizers, pesticides at just 4% per year. Moneylenders charge 40%. You save 36% on every loan.",
    howTo: "Apply at any nationalized bank — SBI, PNB, Bank of Baroda, etc. Documents needed are simple.",
    eligibility: "All farmers with agricultural land. No minimum land size. Individual, joint, or tenant farmers.",
    steps: ["Visit any nationalized bank branch", "Ask for KCC application form", "Submit land records + Aadhaar + 2 passport photos", "Bank inspection of land within 7 days", "Card issued within 2 weeks"],
    helpline: "NABARD Helpline: 1800-22-0100",
  },
  nabard: {
    name: "NABARD RIDF", full: "Rural Infrastructure Development Fund",
    benefit: "Loans at 6-7% for farm infrastructure", color: "#8b7355",
    status: "Active", statusColor: "#4ade80", tag: "Infrastructure Loan",
    monetary: "Commercial loan at 14% vs NABARD at 6.5% — save INR 1.85 lakh on INR 10 lakh loan.",
    nextPayment: "Rolling applications year-round", installment: "Up to INR 25 lakh",
    desc: "Low interest loans for drip irrigation systems, cold storage, farm equipment, and processing units. Much cheaper than commercial loans.",
    howTo: "Apply through State Government nodal agency or directly at NABARD regional office.",
    eligibility: "Individual farmers, farmer groups, cooperatives, and FPOs.",
    steps: ["Prepare project report for infrastructure", "Contact State Agriculture Department", "Submit application with DPR", "NABARD appraisal within 30 days", "Loan sanctioned and disbursed in tranches"],
    helpline: "NABARD: 022-26539895",
  },
  soil: {
    name: "Soil Health Card", full: "Soil Health Card Scheme",
    benefit: "Free soil testing every 2 years", color: "#c8960c",
    status: "Active", statusColor: "#4ade80", tag: "Free Service",
    monetary: "Save INR 3,000-8,000 per acre by buying only the fertilizers your soil actually needs.",
    nextPayment: "Free — every 2 years", installment: "Completely Free",
    desc: "Government tests your soil for free and gives you a card showing NPK levels, pH, and micronutrient deficiencies. Buy exactly the right fertilizer.",
    howTo: "Contact nearest Krishi Vigyan Kendra or Agricultural Officer. Bring soil sample in clean bag.",
    eligibility: "All farmers. Every farmer entitled to free testing once every 2 years.",
    steps: ["Collect soil from 6-8 spots in your field", "Mix them together in a clean bag (500g)", "Visit Krishi Vigyan Kendra or Agriculture Office", "Submit sample with land details", "Card ready in 7-10 days — follow the recommendations"],
    helpline: "Soil Health Card: 1800-180-1551",
  },
  fertilizer: {
    name: "Fertilizer Subsidy", full: "NBS Nutrient Based Subsidy Scheme",
    benefit: "Save INR 800-1,200 per bag", color: "#4ade80",
    status: "Active — Increased", statusColor: "#4ade80", tag: "Subsidy",
    monetary: "DAP market price INR 3,000 → you pay INR 1,350. Government pays INR 1,650 for you.",
    nextPayment: "Ongoing — automatic at purchase", installment: "Per bag savings at licensed dealer",
    desc: "Government subsidizes DAP, MOP, and complex fertilizers heavily. Recent DAP subsidy increased by INR 200 per bag. You automatically get subsidized price.",
    howTo: "Buy from licensed retailer using Aadhaar-linked PoS machine. Subsidy applied automatically at checkout.",
    eligibility: "All farmers. Linked to Aadhaar for direct benefit transfer.",
    steps: ["Find licensed fertilizer dealer in your area", "Carry Aadhaar card", "Dealer will scan Aadhaar on PoS machine", "Subsidized price applied automatically", "Keep receipt for records"],
    helpline: "Fertilizer Helpline: 1800-11-4000",
  },
};

export default function PoliciesPage({ language = "EN" }) {
  const [policyTab, setPolicyTab] = useState("pmkisan");
  const policy = POLICY_DATA[policyTab];

  return (
    <div style={S.page}>
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={S.header}>
        <div>
          <div style={S.headerTag}>Government Schemes</div>
          <h1 style={S.headerTitle}>Policies</h1>
          <p style={S.headerSub}>MSP guaranteed prices · All major farmer schemes explained</p>
        </div>
        <div style={S.govtBadge}>Official Government Schemes</div>
      </div>

      {/* MSP Table */}
      <div style={{ ...S.card, marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={S.cardTitle}>MSP — Minimum Support Price 2025-26</div>
          <span style={S.govtVerified}>Government Guaranteed</span>
        </div>
        <p style={{ fontSize: "12px", color: "#555", marginBottom: "14px", lineHeight: 1.7 }}>
          Never sell below MSP. If mandi price falls below MSP, government is legally bound to buy your crop at this price.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr>{["Crop", "MSP (INR/Qtl)", "Market Price", "Difference", "Season", "Status"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#444", fontWeight: "600", fontSize: "10px", letterSpacing: "0.5px", borderBottom: "1px solid #1a1a1a" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {MSP_DATA.map((row, i) => {
                const diff = row.market - row.msp;
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #141414" }}>
                    <td style={{ padding: "10px 12px", fontWeight: "700", color: "#e0d8c8" }}>{row.crop}</td>
                    <td style={{ padding: "10px 12px", color: "#c8960c", fontWeight: "700" }}>INR {row.msp.toLocaleString()}</td>
                    <td style={{ padding: "10px 12px", color: "#e0d8c8" }}>INR {row.market.toLocaleString()}</td>
                    <td style={{ padding: "10px 12px", color: diff >= 0 ? "#4ade80" : "#c4622d", fontWeight: "700" }}>{diff >= 0 ? "+" : ""}{diff.toLocaleString()}</td>
                    <td style={{ padding: "10px 12px", color: "#555", fontSize: "11px" }}>{row.season}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: "10px", fontWeight: "700", color: diff < 0 ? "#4ade80" : "#555", background: diff < 0 ? "rgba(74,222,128,0.08)" : "#1a1a1a", padding: "3px 8px", borderRadius: "4px" }}>
                        {diff < 0 ? "Claim MSP →" : "Market Better"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Policy Sub-Tabs */}
      <div style={S.policyTabsWrap}>
        {POLICY_TABS.map(t => (
          <button key={t.id} style={{ ...S.policyTab, ...(policyTab === t.id ? { ...S.policyTabActive, borderColor: POLICY_DATA[t.id].color, color: POLICY_DATA[t.id].color } : {}) }}
            onClick={() => setPolicyTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Policy Detail */}
      <div style={S.policyLayout} key={policyTab}>
        {/* Left — Main info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "fadeUp 0.3s ease" }}>
          <div style={{ ...S.card, borderColor: policy.color + "33", background: policy.color + "04" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: "900", color: policy.color }}>{policy.name}</div>
                <div style={{ fontSize: "12px", color: "#555", marginTop: "3px" }}>{policy.full}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
                <span style={{ fontSize: "9px", fontWeight: "700", background: policy.color + "15", color: policy.color, padding: "4px 10px", borderRadius: "20px", border: `1px solid ${policy.color}33` }}>{policy.tag}</span>
                <span style={{ fontSize: "9px", fontWeight: "700", color: policy.statusColor, background: policy.statusColor + "10", padding: "3px 8px", borderRadius: "20px", border: `1px solid ${policy.statusColor}33` }}>{policy.status}</span>
              </div>
            </div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#e0d8c8", marginBottom: "10px" }}>{policy.benefit}</div>
            <div style={{ fontSize: "13px", color: "#888", lineHeight: 1.8 }}>{policy.desc}</div>
          </div>

          <div style={{ ...S.card, background: "rgba(74,222,128,0.03)", borderColor: "rgba(74,222,128,0.15)" }}>
            <div style={{ fontSize: "10px", color: "#4ade80", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Money in your pocket</div>
            <div style={{ fontSize: "14px", color: "#4ade80", lineHeight: 1.7 }}>{policy.monetary}</div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>Eligibility</div>
            <div style={{ fontSize: "13px", color: "#888", lineHeight: 1.8, marginTop: "10px" }}>{policy.eligibility}</div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>How to Apply</div>
            <div style={{ fontSize: "13px", color: "#888", lineHeight: 1.8, marginTop: "10px", marginBottom: "14px" }}>{policy.howTo}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {policy.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: policy.color + "15", border: `1px solid ${policy.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700", color: policy.color, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ fontSize: "12px", color: "#888", lineHeight: 1.6, paddingTop: "3px" }}>{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Quick info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={S.card}>
            <div style={S.cardTitle}>Key Details</div>
            <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                ["Benefit", policy.benefit],
                ["Next Payment / Deadline", policy.nextPayment],
                ["Amount / Rate", policy.installment],
                ["Status", policy.status],
              ].map(([l, v]) => (
                <div key={l} style={{ padding: "10px 12px", background: "#0d0d0d", borderRadius: "8px" }}>
                  <div style={{ fontSize: "9px", color: "#444", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>{l}</div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#e0d8c8" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...S.card, background: "rgba(200,150,12,0.04)", borderColor: "rgba(200,150,12,0.15)" }}>
            <div style={S.cardTitle}>Helpline</div>
            <div style={{ marginTop: "10px", fontSize: "16px", fontWeight: "700", color: "#c8960c" }}>{policy.helpline}</div>
            <div style={{ fontSize: "11px", color: "#555", marginTop: "4px" }}>Toll-free · Available Mon-Sat 9am-6pm</div>
          </div>

          <div style={{ ...S.card }}>
            <div style={S.cardTitle}>Other Schemes</div>
            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {POLICY_TABS.filter(t => t.id !== policyTab).map(t => (
                <button key={t.id}
                  style={{ background: "none", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "9px 12px", textAlign: "left", color: "#666", fontSize: "12px", fontWeight: "500", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
                  onClick={() => setPolicyTab(t.id)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#c8960c"; e.currentTarget.style.color = "#c8960c"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.color = "#666"; }}
                >
                  {t.label} →
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { background: "#0a0a0a", minHeight: "100vh", paddingTop: "70px", color: "#e0d8c8", padding: "90px 48px 48px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" },
  headerTag: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "8px" },
  headerTitle: { fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "900", color: "#e0d8c8", lineHeight: 1 },
  headerSub: { fontSize: "13px", color: "#555", marginTop: "6px" },
  govtBadge: { background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80", padding: "10px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: "600" },
  card: { background: "#111", borderRadius: "16px", border: "1px solid #1a1a1a", padding: "20px" },
  cardTitle: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" },
  govtVerified: { fontSize: "11px", color: "#4ade80", background: "rgba(74,222,128,0.08)", padding: "4px 12px", borderRadius: "20px", border: "1px solid rgba(74,222,128,0.2)", fontWeight: "600" },
  policyTabsWrap: { display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" },
  policyTab: { background: "#111", border: "1px solid #1a1a1a", color: "#555", padding: "9px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  policyTabActive: { background: "rgba(200,150,12,0.06)" },
  policyLayout: { display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px" },
};