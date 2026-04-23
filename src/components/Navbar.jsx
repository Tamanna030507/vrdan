const Navbar = ({ currentPage, setCurrentPage, canGoBack, canGoForward, goBack, goForward }) => {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "dashboard", label: "Dashboard" },
    { id: "journal", label: "RogPehchan" },
    { id: "mandi", label: "Mandi Intel" },
    { id: "news", label: "News & Trends" },
    { id: "policies", label: "Policies" },
    { id: "qr", label: "QR Trace" },
    { id: "cropwar", label: "Crop Intel" },
  ];

  return (
    <nav style={S.nav}>
      <div style={S.navHistory}>
        <button style={{ ...S.historyBtn, opacity: canGoBack ? 1 : 0.3 }} onClick={goBack} disabled={!canGoBack}>←</button>
        <button style={{ ...S.historyBtn, opacity: canGoForward ? 1 : 0.3 }} onClick={goForward} disabled={!canGoForward}>→</button>
      </div>

      <div style={S.logo} onClick={() => setCurrentPage("home")}>
        <div style={S.logoMark}>V</div>
        <div>
          <div style={S.logoText}>VRDAN</div>
          <div style={S.logoSub}>वरदान</div>
        </div>
      </div>

      <div style={S.navLinks}>
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setCurrentPage(item.id)}
            style={{ ...S.navBtn, ...(currentPage === item.id ? S.navBtnActive : {}) }}>
            {item.label}
          </button>
        ))}
      </div>

      <div style={S.navRight}>
        <div style={S.langToggle}>
          {[{code:"hi",label:"हिं"},{code:"pa",label:"ਪੰਜਾਬੀ"},{code:"mr",label:"मराठी"},{code:"en",label:"EN"}].map(l => (
            <button key={l.code} style={S.langBtn} onClick={() => {
              const select = document.querySelector(".goog-te-combo");
              if (select) { select.value = l.code; select.dispatchEvent(new Event("change")); }
            }}>{l.label}</button>
          ))}
        </div>
        <div id="google_translate_element" style={{ display: "none" }} />
        <button
          style={{ ...S.profileBtn, ...(currentPage === "profile" ? { background: "rgba(200,150,12,0.2)", borderColor: "#c8960c" } : {}) }}
          onClick={() => setCurrentPage("profile")}
          title="Farmer Profile"
        >
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: "900", color: "#c8960c" }}>K</span>
        </button>
      </div>
    </nav>
  );
};

// Inject Google Translate once
if (!window._gtLoaded) {
  window._gtLoaded = true;
  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      { pageLanguage: "en", includedLanguages: "hi,pa,mr,ta,te,gu,en", autoDisplay: false },
      "google_translate_element"
    );
  };
  const s = document.createElement("script");
  s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  s.async = true;
  document.head.appendChild(s);
}

const S = {
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px 0 16px", height: "70px", background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid #151515", gap: "8px" },
  navHistory: { display: "flex", gap: "4px", flexShrink: 0 },
  historyBtn: { background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#c8960c", width: "32px", height: "32px", borderRadius: "8px", fontSize: "16px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" },
  logo: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", flexShrink: 0 },
  logoMark: { width: "32px", height: "32px", borderRadius: "8px", background: "#c8960c", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: "900", color: "#0a0a0a" },
  logoText: { fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "900", color: "#e0d8c8", letterSpacing: "3px", lineHeight: 1 },
  logoSub: { fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: "9px", color: "#444", letterSpacing: "2px", lineHeight: 1, marginTop: "2px" },
  navLinks: { display: "flex", gap: "1px", flex: 1, justifyContent: "center" },
  navBtn: { background: "none", border: "none", padding: "7px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "500", color: "#555", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" },
  navBtnActive: { color: "#c8960c", background: "rgba(200,150,12,0.08)" },
  navRight: { display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 },
  langToggle: { display: "flex", background: "#111", borderRadius: "20px", padding: "3px", gap: "2px", border: "1px solid #1a1a1a" },
  langBtn: { background: "none", border: "none", padding: "4px 8px", borderRadius: "16px", fontSize: "10px", fontWeight: "600", color: "#888", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  profileBtn: { width: "38px", height: "38px", borderRadius: "50%", background: "rgba(200,150,12,0.08)", border: "2px solid rgba(200,150,12,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 },
};

export default Navbar;