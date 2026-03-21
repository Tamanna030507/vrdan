import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "hi,pa,mr,ta,te,gu,kn,en",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <style>{`
        #google_translate_element {
          display: inline-block;
        }
        .goog-te-gadget {
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0 !important;
        }
        .goog-te-gadget select {
          background: #1a1a1a !important;
          color: #c8960c !important;
          border: 1px solid #2a2a2a !important;
          border-radius: 20px !important;
          padding: 5px 12px !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          outline: none !important;
          font-family: 'DM Sans', sans-serif !important;
          -webkit-appearance: none;
          appearance: none;
        }
        .goog-te-gadget .goog-te-gadget-simple {
          border: none !important;
          background: transparent !important;
        }
        .goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .skiptranslate {
          display: none !important;
        }
      `}</style>
      <div id="google_translate_element" />
    </>
  );
}