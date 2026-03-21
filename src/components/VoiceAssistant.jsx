import { useState, useEffect, useRef } from "react";

const KNOWLEDGE = {
  navigation: {
    keywords: ["dashboard", "home", "journal", "mandi", "qr", "news", "policies", "crop journal", "qr trace", "डैशबोर्ड", "होम", "मंडी", "समाचार", "नीतियां"],
    handle: (text, setCurrentPage) => {
      const t = text.toLowerCase();
      if (t.includes("dashboard") || t.includes("डैशबोर्ड")) { setCurrentPage("dashboard"); return "Opening Dashboard"; }
      if (t.includes("crop journal") || t.includes("journal") || t.includes("फसल जर्नल")) { setCurrentPage("journal"); return "Opening Crop Journal"; }
      if (t.includes("mandi") || t.includes("मंडी")) { setCurrentPage("mandi"); return "Opening Mandi Intel"; }
      if (t.includes("news") || t.includes("समाचार")) { setCurrentPage("news"); return "Opening News & Trends"; }
      if (t.includes("polic") || t.includes("नीतियां")) { setCurrentPage("policies"); return "Opening Government Policies"; }
      if (t.includes("qr") || t.includes("trace")) { setCurrentPage("qr"); return "Opening QR Trace"; }
      if (t.includes("home") || t.includes("होम")) { setCurrentPage("home"); return "Going to Home"; }
      return null;
    }
  },
  disease: {
    keywords: ["disease", "bimari", "बीमारी", "rust", "blight", "aphid", "fungal", "pest", "रतुआ", "माहू", "झुलसा"],
    answers: {
      en: "For crop disease detection, go to Crop Journal and upload a photo. Our AI will diagnose the disease in 4 seconds and recommend the exact treatment with verified suppliers nearby.",
      hi: "फसल की बीमारी जानने के लिए Crop Journal में जाएं और फोटो अपलोड करें। हमारी AI 4 सेकंड में बीमारी पहचानेगी और नजदीकी सत्यापित दुकानदार से दवाई सुझाएगी।",
      pa: "ਫਸਲ ਦੀ ਬਿਮਾਰੀ ਜਾਣਨ ਲਈ Crop Journal ਵਿੱਚ ਜਾਓ ਅਤੇ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ।",
      mr: "पीक रोग जाणण्यासाठी Crop Journal मध्ये जा आणि फोटो अपलोड करा।",
    }
  },
  mandi: {
    keywords: ["price", "mandi", "sell", "wheat", "mustard", "rate", "bhav", "बेचना", "मंडी", "भाव", "गेहूं", "सरसों", "कब बेचें"],
    answers: {
      en: "Current mandi prices: Wheat INR 2,200 per quintal — up 7.8%. Mustard INR 5,800 — up 13.2%. AI recommends holding wheat for 11 more days to earn extra INR 12,960. Visit Mandi Intel for full analysis.",
      hi: "वर्तमान मंडी भाव: गेहूं INR 2,200 प्रति क्विंटल — 7.8% ऊपर। सरसों INR 5,800 — 13.2% ऊपर। AI सुझाव है कि गेहूं 11 दिन और रोकें, INR 12,960 अतिरिक्त मिलेंगे।",
      pa: "ਮੌਜੂਦਾ ਮੰਡੀ ਭਾਅ: ਕਣਕ INR 2,200 — 7.8% ਵੱਧ। ਸਰ੍ਹੋਂ INR 5,800 — 13.2% ਵੱਧ।",
      mr: "सध्याचे मंडई भाव: गहू INR 2,200 — 7.8% वर. मोहरी INR 5,800 — 13.2% वर.",
    }
  },
  policy: {
    keywords: ["policy", "scheme", "pmkisan", "kisan", "insurance", "loan", "subsidy", "pmfby", "नीति", "योजना", "किसान", "बीमा", "लोन", "सब्सिडी"],
    answers: {
      en: "Key government schemes: PM-KISAN gives INR 6,000 per year. Kisan Credit Card loan at just 4% interest. PMFBY crop insurance with only 1.5% premium. Visit Policies page for complete details and how to apply.",
      hi: "मुख्य सरकारी योजनाएं: PM-KISAN से प्रति वर्ष INR 6,000 मिलते हैं। किसान क्रेडिट कार्ड पर सिर्फ 4% ब्याज पर लोन। PMFBY फसल बीमा केवल 1.5% प्रीमियम पर। पूरी जानकारी के लिए Policies पेज पर जाएं।",
      pa: "ਮੁੱਖ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ: PM-KISAN ਤੋਂ ਸਾਲਾਨਾ INR 6,000। ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ 'ਤੇ ਸਿਰਫ਼ 4% ਵਿਆਜ।",
      mr: "मुख्य सरकारी योजना: PM-KISAN दरवर्षी INR 6,000. किसान क्रेडिट कार्डवर फक्त 4% व्याज.",
    }
  },
  weather: {
    keywords: ["weather", "rain", "monsoon", "irrigation", "water", "barish", "बारिश", "मौसम", "सिंचाई", "पानी"],
    answers: {
      en: "Current weather for Sikar: 34°C. Rain debt at 89mm — irrigation recommended tomorrow morning. IMD predicts above-normal monsoon this year at 106% of normal. Good season ahead.",
      hi: "सीकर का मौसम: 34°C। वर्षा कमी 89mm है — कल सुबह सिंचाई करें। IMD ने इस साल 106% सामान्य बारिश का अनुमान लगाया है। अच्छा सीजन आने वाला है।",
      pa: "ਸੀਕਰ ਦਾ ਮੌਸਮ: 34°C। ਵਰਖਾ ਘਾਟਾ 89mm — ਕੱਲ੍ਹ ਸਵੇਰੇ ਸਿੰਚਾਈ ਕਰੋ।",
      mr: "सीकरचे हवामान: 34°C. पाऊस कमतरता 89mm — उद्या सकाळी सिंचन करा.",
    }
  },
  fertilizer: {
    keywords: ["fertilizer", "urea", "dap", "nitrogen", "khad", "खाद", "यूरिया", "उर्वरक", "DAP"],
    answers: {
      en: "Current fertilizer prices: Urea INR 266 per bag (subsidized). DAP INR 1,350 per bag — subsidy just increased by INR 200. Always buy from licensed dealers with Aadhaar-linked PoS for subsidized prices.",
      hi: "वर्तमान खाद के भाव: यूरिया INR 266 प्रति बैग (सब्सिडाइज्ड)। DAP INR 1,350 प्रति बैग — सब्सिडी INR 200 बढ़ी। हमेशा Aadhaar-linked PoS से लाइसेंसी दुकान से खरीदें।",
      pa: "ਮੌਜੂਦਾ ਖਾਦ ਦੇ ਭਾਅ: ਯੂਰੀਆ INR 266 ਪ੍ਰਤੀ ਬੈਗ। DAP INR 1,350 — ਸਬਸਿਡੀ INR 200 ਵਧੀ।",
      mr: "सध्याचे खत भाव: युरिया INR 266 प्रति बॅग. DAP INR 1,350 — अनुदान INR 200 वाढले.",
    }
  },
  default: {
    en: "I can help you with crop diseases, mandi prices, government schemes, weather, fertilizers, and navigating VRDAN. Please ask me anything about farming.",
    hi: "मैं आपकी फसल बीमारियों, मंडी भाव, सरकारी योजनाओं, मौसम, खाद और VRDAN नेविगेशन में मदद कर सकता हूं। खेती के बारे में कुछ भी पूछें।",
    pa: "ਮੈਂ ਤੁਹਾਡੀ ਫਸਲ ਦੀਆਂ ਬਿਮਾਰੀਆਂ, ਮੰਡੀ ਭਾਅ, ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਅਤੇ VRDAN ਨੇਵੀਗੇਸ਼ਨ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।",
    mr: "मी तुम्हाला पीक रोग, मंडई भाव, सरकारी योजना आणि VRDAN नेव्हिगेशनमध्ये मदत करू शकतो.",
  }
};

const getLangKey = (language) => {
  if (language === "हिं") return "hi";
  if (language === "ਪੰਜਾਬੀ") return "pa";
  if (language === "मराठी") return "mr";
  return "en";
};

const getAnswer = (text, language, setCurrentPage) => {
  const t = text.toLowerCase();
  const langKey = getLangKey(language);

  const navResult = KNOWLEDGE.navigation.handle(text, setCurrentPage);
  if (navResult) return navResult;

  for (const [topic, data] of Object.entries(KNOWLEDGE)) {
    if (topic === "navigation" || topic === "default") continue;
    if (data.keywords.some(k => t.includes(k.toLowerCase()))) {
      return data.answers[langKey] || data.answers.en;
    }
  }
  return KNOWLEDGE.default[langKey] || KNOWLEDGE.default.en;
};

const PLACEHOLDER = {
  EN: "Ask anything about farming...",
  "हिं": "खेती के बारे में कुछ भी पूछें...",
  "ਪੰਜਾਬੀ": "ਖੇਤੀ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ...",
  "मराठी": "शेतीबद्दल काहीही विचारा...",
};

const MIC_LABEL = {
  EN: "Speak now...",
  "हिं": "बोलिए...",
  "ਪੰਜਾਬੀ": "ਬੋਲੋ...",
  "मराठी": "बोला...",
};

export default function VoiceAssistant({ setCurrentPage }) {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const [textInput, setTextInput] = useState("");
  const recognitionRef = useRef(null);
  const language = "EN";

  const langCode = { EN: "en-IN", "हिं": "hi-IN", "ਪੰਜਾਬੀ": "pa-IN", "मराठी": "mr-IN" };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setAnswer("Voice recognition not supported in this browser. Please use Chrome.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = langCode[language] || "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (e) => {
      const heard = e.results[0][0].transcript;
      setTranscript(heard);
      const ans = getAnswer(heard, language, setCurrentPage);
      setAnswer(ans);
      setHistory(h => [...h, { q: heard, a: ans }].slice(-5));
      speak(ans);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode[language] || "en-IN";
    utterance.rate = 1.6;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    const ans = getAnswer(textInput, language, setCurrentPage);
    setTranscript(textInput);
    setAnswer(ans);
    setHistory(h => [...h, { q: textInput, a: ans }].slice(-5));
    speak(ans);
    setTextInput("");
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        style={{ ...S.fab, background: listening ? "#c4622d" : open ? "#1a1a1a" : "#c8960c", boxShadow: listening ? "0 0 0 8px rgba(196,98,45,0.2)" : "0 4px 20px rgba(200,150,12,0.3)" }}
        onClick={() => { if (listening) stopListening(); else setOpen(o => !o); }}
        title="Voice Assistant"
      >
        {listening ? "◉" : "◎"}
      </button>

      {/* Panel */}
      {open && (
        <div style={S.panel}>
          <div style={S.panelHeader}>
            <div>
              <div style={S.panelTitle}>VRDAN Assistant</div>
              <div style={S.panelSub}>{language === "EN" ? "Speak or type in any language" : "किसी भी भाषा में बोलें या टाइप करें"}</div>
            </div>
            <button style={S.closeBtn} onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* History */}
          <div style={S.historyBox}>
            {history.length === 0 && (
              <div style={S.emptyState}>
                <div style={{ fontSize: "24px", marginBottom: "8px", opacity: 0.3 }}>◎</div>
                <div style={{ fontSize: "12px", color: "#444" }}>{PLACEHOLDER[language]}</div>
              </div>
            )}
            {history.map((item, i) => (
              <div key={i} style={{ marginBottom: "14px" }}>
                <div style={S.questionBubble}>{item.q}</div>
                <div style={S.answerBubble}>{item.a}</div>
              </div>
            ))}
            {listening && (
              <div style={S.listeningIndicator}>
                <div style={S.listenDot} />
                <div style={S.listenDot} />
                <div style={S.listenDot} />
                <span style={{ fontSize: "12px", color: "#c8960c", marginLeft: "8px" }}>{MIC_LABEL[language]}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={S.actions}>
            <button
              style={{ ...S.micBtn, background: listening ? "#c4622d" : "#c8960c", boxShadow: listening ? "0 0 0 6px rgba(196,98,45,0.2)" : "none" }}
              onClick={listening ? stopListening : startListening}
            >
              {listening ? "Stop" : "◎ Speak"}
            </button>
          </div>

          {/* Text input */}
          <div style={S.inputRow}>
            <input
              style={S.textInput}
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleTextSubmit()}
              placeholder={PLACEHOLDER[language]}
            />
            <button style={S.sendBtn} onClick={handleTextSubmit}>→</button>
          </div>

          {/* Quick commands */}
          <div style={S.quickCommands}>
            {["Mandi prices", "Crop disease", "PM-KISAN", "Weather today"].map(cmd => (
              <button key={cmd} style={S.quickBtn} onClick={() => {
                const ans = getAnswer(cmd, language, setCurrentPage);
                setTranscript(cmd);
                setAnswer(ans);
                setHistory(h => [...h, { q: cmd, a: ans }].slice(-5));
                speak(ans);
              }}>{cmd}</button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

const S = {
  fab: { position: "fixed", bottom: "24px", right: "24px", zIndex: 1100, width: "52px", height: "52px", borderRadius: "50%", border: "none", color: "#0a0a0a", fontSize: "20px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" },
  panel: { position: "fixed", bottom: "88px", right: "24px", zIndex: 1099, width: "340px", background: "#111", borderRadius: "16px", border: "1px solid #2a2a2a", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", overflow: "hidden", animation: "fadeUp 0.3s ease" },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 18px", borderBottom: "1px solid #1a1a1a", background: "#0d0d0d" },
  panelTitle: { fontSize: "14px", fontWeight: "800", color: "#c8960c", fontFamily: "'Playfair Display', serif" },
  panelSub: { fontSize: "10px", color: "#555", marginTop: "2px" },
  closeBtn: { background: "none", border: "none", color: "#555", fontSize: "14px", cursor: "pointer", padding: "2px 6px" },
  historyBox: { padding: "14px", maxHeight: "240px", overflowY: "auto", minHeight: "80px" },
  emptyState: { textAlign: "center", padding: "20px 0" },
  questionBubble: { background: "rgba(200,150,12,0.08)", border: "1px solid rgba(200,150,12,0.15)", borderRadius: "10px 10px 2px 10px", padding: "8px 12px", fontSize: "12px", color: "#c8960c", marginBottom: "6px", display: "inline-block", maxWidth: "90%", float: "right", clear: "both" },
  answerBubble: { background: "#1a1a1a", borderRadius: "2px 10px 10px 10px", padding: "10px 12px", fontSize: "12px", color: "#888", lineHeight: 1.6, clear: "both" },
  listeningIndicator: { display: "flex", alignItems: "center", padding: "10px 0" },
  listenDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#c8960c", margin: "0 2px", animation: "pulse 0.8s ease-in-out infinite" },
  actions: { padding: "0 14px 10px", display: "flex", justifyContent: "center" },
  micBtn: { border: "none", color: "#0a0a0a", padding: "10px 28px", borderRadius: "50px", fontSize: "13px", fontWeight: "800", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  inputRow: { display: "flex", gap: "6px", padding: "0 14px 10px" },
  textInput: { flex: 1, background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "9px 12px", color: "#e0d8c8", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", outline: "none" },
  sendBtn: { background: "#c8960c", border: "none", color: "#0a0a0a", borderRadius: "8px", padding: "9px 14px", fontSize: "14px", fontWeight: "700", cursor: "pointer" },
  quickCommands: { display: "flex", gap: "6px", flexWrap: "wrap", padding: "0 14px 14px" },
  quickBtn: { background: "#0d0d0d", border: "1px solid #2a2a2a", color: "#555", padding: "5px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
};