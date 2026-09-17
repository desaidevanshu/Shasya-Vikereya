export type Language = 'en' | 'hi' | 'mr';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    app_title: "Shasya Vikreya",
    app_tagline: "Algorithmic Agricultural Clearinghouse & Direct Supply Operations",
    sih_badge: "SIH 2026 | PS 26033 | DoCA & MoAFW",
    live_feed: "Live data.gov.in Feed Active • 13,629 APMC Records",
    
    // Portals
    role_mandi: "Live Mandi",
    role_marketplace: "B2B Market",
    role_fpo: "Farmer & FPO",
    role_clearing: "Clearinghouse",
    role_simulation: "Digital Twin",
    role_ledger: "Value Chain",
    role_gis: "Smart Route",
    
    // Core KPIs
    farmer_realization: "Farmer Net Realization",
    logistics_cost: "Delivered Transport Cost",
    freshness_score: "Remaining Freshness",
    money_recovered: "Margin Recaptured by Optimization",
    apmc_benchmark: "Mandi Benchmark Rate",
    buyer_savings: "Direct Buyer Savings",
    
    // Actions
    btn_solve_clearing: "Execute Algorithmic Clearing",
    btn_reclear_dropout: "Simulate Dropout & Auto-Reclear",
    btn_run_simulation: "Run Environmental Stress Test",
    btn_reset_demo: "Reset Defaults",
    btn_open_mcp: "⚡ Model Context Protocol (MCP)",
    btn_open_gate_pass: "📜 Section 5D Gate Pass",
    
    // Badges & Labels
    status_safe: "OPTIMAL (Direct Route)",
    status_watch: "CAUTION (Delay Risk)",
    status_critical: "CRITICAL (Spoilage Threat)",
    clearing_batch: "Clearinghouse Batch Object",
    price_corridor: "Statutory Price Corridor Guardrails",
    counterfactual_proof: "Disintermediation Audit Proof",
    profit_maximizer_winner: "Profit-Maximizing Winning Route",
    thermal_decay: "Perishable Thermal Decay Curve",
    diesel_rate: "Diesel Fuel Benchmark (₹94.20/L)",
    vibration_bruising: "Road Vibration Bruising Loss"
  },
  hi: {
    app_title: "शस्य विक्रेय (Shasya Vikreya)",
    app_tagline: "एल्गोरिद्मिक कृषि क्लीयरिंगहाउस एवं सीधी आपूर्ति प्रणाली",
    sih_badge: "SIH 2026 | समस्या विवरण 26033 | DoCA",
    live_feed: "data.gov.in लाइव डेटा सक्रिय • 13,629 मंडी रिकॉर्ड",
    
    // Portals
    role_mandi: "मंडी भाव",
    role_marketplace: "B2B बाजार",
    role_fpo: "किसान व एफपीओ",
    role_clearing: "क्लीयरिंगहाउस",
    role_simulation: "डिजिटल ट्विन",
    role_ledger: "वैल्यू चेन",
    role_gis: "स्मार्ट रूट",
    
    // Core KPIs
    farmer_realization: "किसान शुद्ध आय (प्रति किग्रा)",
    logistics_cost: "वितरण एवं ईंधन लागत",
    freshness_score: "शेष ताज़गी सूचकांक",
    money_recovered: "ऑप्टिमाइज़ेशन द्वारा अतिरिक्त लाभ",
    apmc_benchmark: "पारंपरिक मंडी बेंचमार्क दर",
    buyer_savings: "उपभोक्ता सीधी बचत",
    
    // Actions
    btn_solve_clearing: "क्लीयरिंग बैच निष्पादित करें",
    btn_reclear_dropout: "किसान निरस्तीकरण व स्वतः पुनर्वाटप",
    btn_run_simulation: "पर्यावरणीय तनाव परीक्षण करें",
    btn_reset_demo: "डिफ़ॉल्ट रीसेट करें",
    btn_open_mcp: "⚡ मॉडल कॉन्टेक्स्ट प्रोटोकॉल (MCP)",
    btn_open_gate_pass: "📜 धारा 5D डिजिटल गेट पास",
    
    // Badges & Labels
    status_safe: "सुरक्षित (इष्टतम)",
    status_watch: "निगरानी (सतर्क)",
    status_critical: "अति-संवेदनशील (रेस्क्यू)",
    clearing_batch: "क्लीयरिंग बैच ऑब्जेक्ट",
    price_corridor: "किसान न्यूनतम - खरीदार अधिकतम गलियारा",
    counterfactual_proof: "तुलनात्मक लाभ प्रमाण",
    profit_maximizer_winner: "शुद्ध लाभ-अधिकतम विजेता मार्ग",
    thermal_decay: "तापमान एवं ताज़गी गिरावट वक्र",
    diesel_rate: "डीजल ईंधन दर (₹94.20/ली)",
    vibration_bruising: "सड़क कंपन व खरोंच क्षति"
  },
  mr: {
    app_title: "शस्य विक्रेय (Shasya Vikreya)",
    app_tagline: "अल्गोरिदम आधारित कृषी क्लिअरिंगहाउस व थेट पुरवठा प्रणाली",
    sih_badge: "SIH 2026 | PS 26033 | DoCA",
    live_feed: "data.gov.in थेट जोडणी सक्रिय • 13,629 बाजारभाव",
    
    // Portals
    role_mandi: "बाजारभाव",
    role_marketplace: "B2B बाजार",
    role_fpo: "शेतकरी व एफपीओ",
    role_clearing: "क्लिअरिंगहाउस",
    role_simulation: "डिजिटल ट्विन",
    role_ledger: "मूल्य साखळी",
    role_gis: "स्मार्ट मार्ग",
    
    // Core KPIs
    farmer_realization: "शेतकरी निव्वळ नफा (प्रतिकिलो)",
    logistics_cost: "वाहतूक व इंधन खर्च",
    freshness_score: "उर्वरित ताजेपणा निर्देशांक",
    money_recovered: "ऑप्टिमायझेशनमुळे मिळवलेला जादा नफा",
    apmc_benchmark: "पारंपारिक बाजार समिती दर",
    buyer_savings: "थेट खरेदीदार बचत",
    
    // Actions
    btn_solve_clearing: "क्लिअरिंग बॅच प्रक्रिया चालवा",
    btn_reclear_dropout: "शेतकरी रद्दबातल व पुनर्वाटप",
    btn_run_simulation: "पर्यावरणीय ताण चाचणी चालवा",
    btn_reset_demo: "मूळ स्थिती रीसेट करा",
    btn_open_mcp: "⚡ मॉडेल कॉन्टेक्स्ट प्रोटोकॉल (MCP)",
    btn_open_gate_pass: "📜 कलम 5D डिजिटल गेट पास",
    
    // Badges & Labels
    status_safe: "सुरक्षित (थेट मार्ग)",
    status_watch: "दक्षता (उशीर धोका)",
    status_critical: "गंभीर (नासाडी धोका)",
    clearing_batch: "क्लिअरिंग बॅच ऑब्जेक्ट",
    price_corridor: "किमान शेतकरी - कमाल खरेदीदार मर्यादा",
    counterfactual_proof: "नफा पडताळणी पुरावा",
    profit_maximizer_winner: "सर्वाधिक शेतकरी नफा विजेता मार्ग",
    thermal_decay: "तापमान व नाशवंत घसरण आलेख",
    diesel_rate: "डिझेल इंधन दर (₹94.20/ली)",
    vibration_bruising: "रस्त्यावरील हादरे व डाग नुकसान"
  }
};
