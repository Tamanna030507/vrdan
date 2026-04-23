import { useEffect } from "react";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिं" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "mr", label: "मराठी" },
];

export default function GoogleTranslate() {
  useEffect(() => {
    const addScript = () => {
      if (document.getElementById("gt-script")) return;
      window.googleTranslateElementInit = () => {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "hi,pa,mr,ta,te,gu,en",
              autoDisplay: false,
            },
            "google_translate_element"
          );
        } catch (e) {}
      };
      const script = document.createElement("script");
      script.id = "gt-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.onerror = () => {};
      document.body.appendChild(script);
    };
    addScript();
  }, []);

  const translatePage = (langCode) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    } else {
      const iframe = document.querySelector(".goog-te-banner-frame");
      if (!iframe) {
        const el = document.getElementById("google_translate_element");
        if (el) {
          const sel = el.querySelector("select");
          if (sel) {
            sel.value = langCode;
            sel.dispatchEvent(new Event("change"));
          }
        }
      }
    }
  };

  return (
    <>
      <style>{`
        #google_translate_element { display: none; }
        .goog-te-banner-frame { display: none !important; }
        .skiptranslate { display: none !important; }
        body { top: 0 !important; }
        .goog-te-gadget { display: none !important; }
      `}</style>
      <div id="google_translate_element" style={{ display: "none" }} />
      <div style={{ display: "flex", background: "#111", borderRadius: "20px", padding: "3px", gap: "2px", border: "1px solid #1a1a1a" }}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => translatePage(lang.code)}
            style={{
              background: "none", border: "none",
              padding: "4px 10px", borderRadius: "16px",
              fontSize: "11px", fontWeight: "600",
              color: "#666", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#c8960c"; e.currentTarget.style.background = "#1a1a1a"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#666"; e.currentTarget.style.background = "none"; }}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </>
  );
}