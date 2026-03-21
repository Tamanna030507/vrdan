const Navbar = ({ currentPage, setCurrentPage, canGoBack, canGoForward, goBack, goForward }) => {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "dashboard", label: "Dashboard" },
    { id: "cropwar", label: "Crop Intel" },
    { id: "journal", label: "Crop Journal" },
    { id: "mandi", label: "Mandi Intel" },
    { id: "news", label: "News & Trends" },
    { id: "policies", label: "Policies" },
    { id: "qr", label: "QR Trace" },
   
  ];

  const handleTranslate = (lang) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    } else {
      // Fallback — use Google Translate URL
      const url = `https://translate.google.com/translate?sl=en&tl=${lang}&u=${window.location.href}`;
      window.open(url, "_blank");
    }
  };

  const langs = [
    { code: "hi", label: "हिं" },
    { code: "pa", label: "ਪੰਜਾਬੀ" },
    { code: "mr", label: "मराठी" },
    { code: "en", label: "EN" },
  ];

  return (
    <nav style={S.nav}>
      {/* Back / Forward */}
      <div style={S.navHistory}>
        <button style={{ ...S.historyBtn, opacity: canGoBack ? 1 : 0.3 }} onClick={goBack} disabled={!canGoBack}>←</button>
        <button style={{ ...S.historyBtn, opacity: canGoForward ? 1 : 0.3 }} onClick={goForward} disabled={!canGoForward}>→</button>
      </div>

      {/* Logo */}
      <div style={S.logo} onClick={() => setCurrentPage("home")}>
        <div style={S.logoMark}>V</div>
        <div>
          <div style={S.logoText}>VRDAN</div>
          <div style={S.logoSub}>वरदान</div>
        </div>
      </div>

      {/* Nav Links */}
      <div style={S.navLinks}>
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setCurrentPage(item.id)}
            style={{ ...S.navBtn, ...(currentPage === item.id ? S.navBtnActive : {}) }}>
            {item.label}
          </button>
        ))}
      </div>

      {/* Right */}
      <div style={S.navRight}>
        {/* Language buttons */}
        <div style={S.langToggle}>
          {langs.map((l) => (
            <button key={l.code} style={S.langBtn} onClick={() => handleTranslate(l.code)} title={`Translate to ${l.label}`}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Google Translate hidden widget */}
        <div id="google_translate_element" style={{ display: "none" }} />

        <button style={S.ctaBtn} onClick={() => setCurrentPage("journal")}>
          Detect Disease
        </button>
      </div>
    </nav>
  );
};

// Inject Google Translate script once
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
  navBtn: { background: "none", border: "none", padding: "7px 11px", borderRadius: "8px", fontSize: "11px", fontWeight: "500", color: "#555", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" },
  navBtnActive: { color: "#c8960c", background: "rgba(200,150,12,0.08)" },
  navRight: { display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 },
  langToggle: { display: "flex", background: "#111", borderRadius: "20px", padding: "3px", gap: "2px", border: "1px solid #1a1a1a" },
  langBtn: { background: "none", border: "none", padding: "4px 10px", borderRadius: "16px", fontSize: "11px", fontWeight: "600", color: "#888", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  ctaBtn: { background: "#c8960c", color: "#0a0a0a", border: "none", padding: "9px 18px", borderRadius: "25px", fontSize: "12px", fontWeight: "800", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" },
};

export default Navbar;