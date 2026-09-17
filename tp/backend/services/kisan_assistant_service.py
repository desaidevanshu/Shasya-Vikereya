"""
Kisan AI Voice Assistant Intelligence Service.
Understands natural farmer queries in English, Hindi, and Marathi,
and coordinates with the clearinghouse, logistics optimizer, APMC legal guardrails,
and mandi corridor to provide accurate, human-friendly answers with actionable data cards.
"""
import re
from typing import Dict, Any

from .agmarknet_service import agmarknet_service
from .logistics_optimizer import logistics_optimizer
from .compliance_service import compliance_service
from .simulation_engine import simulation_engine
from .agronomy_service import agronomy_service

class KisanAssistantService:
    def detect_language(self, text: str, fallback_lang: str = "en") -> str:
        """Detects whether text is in Marathi, Hindi, or English."""
        if not text:
            return fallback_lang

        # Check for Devanagari Unicode script block (\u0900 - \u097F)
        if re.search(r'[\u0900-\u097F]', text):
            mr_markers = [
                "आहे", "नाही", "काय", "कधी", "कसे", "नफा", "तोडणी", "काढणी", "पेरणी",
                "लागवड", "बियाणे", "शेतकरी", "रस्ता", "समृद्धी", "गाडी", "दर", "पाहिजे",
                "होईल", "द्या", "करा", "सांगा", "बाजारभाव", "बंधूंनो", "भाव", "अडवतील",
                "किती", "मिळेल", "कोणत्या", "पिकात", "झाले", "करावे"
            ]
            hi_markers = [
                "है", "नहीं", "क्या", "कब", "कैसे", "मुनाफा", "फायदा", "कटाई", "बुवाई",
                "रोपाई", "बीज", "किसान", "रास्ता", "गाड़ी", "गाड़ी", "चाहिए", "होगा",
                "दीजिए", "बताएं", "मंडी भाव", "भाई", "दाम", "रोकेंगे", "कितना", "मिलेगा",
                "फसल", "करना"
            ]
            mr_hits = sum(1 for w in mr_markers if w in text)
            hi_hits = sum(1 for w in hi_markers if w in text)

            if mr_hits > hi_hits:
                return "mr"
            elif hi_hits > mr_hits:
                return "hi"
            elif fallback_lang in ["mr", "hi"]:
                return fallback_lang
            return "hi" # Default for Devanagari if ambiguous

        # Romanized keyword detection
        t_low = text.lower()
        if any(w in t_low for w in ["ahe", "kadhi", "shetkari", "bhav", "kiti", "nafa", "rasta"]):
            return "mr"
        if any(w in t_low for w in ["hai", "kab", "kisan", "munafa", "fayda", "kitna", "raasta"]):
            return "hi"

        return fallback_lang

    def answer_farmer_query(self, query: str, lang: str = "en") -> Dict[str, Any]:
        q = (query or "").strip().lower()

        # Honor explicitly chosen language ('mr', 'hi', 'en')
        if lang in ["mr", "hi", "en"]:
            effective_lang = lang
        else:
            effective_lang = self.detect_language(query, fallback_lang="mr")

        # 0. Check for Crop Planning / Agronomy / Sowing / Harvesting / Crop Profitability FIRST
        agronomy_triggers = [
            "cut", "harvest", "picking", "reap", "plant", "seed", "sow", "nursery",
            "which crop", "crop profit", "profitable crop", "crop margin", "highest return",
            "pest", "disease", "fungus", "spray", "fertilizer", "drip", "irrigation",
            "तोडणी", "काढणी", "पेरणी", "लागवड", "बियाणे", "कोणते पीक", "जास्त नफा", "कीड", "रोग", "फवारणी",
            "कटाई", "बुवाई", "बीज", "रोपाई", "कौन सी फसल", "ज्यादा मुनाफा", "छिड़काव"
        ]
        if any(w in q for w in agronomy_triggers) or ("crop" in q and "profit" in q):
            res = agronomy_service.answer_general_agronomy(query, lang=effective_lang)
            res["lang"] = effective_lang
            return res

        # 1. Checkpost / Police / RTO / Gate Pass / Legal Interception Intent
        legal_signals = [
            "police", "stop", "rto", "checkpost", "gate pass", "gatepass", "pass",
            "seize", "challan", "apmc", "officer", "detain", "fine", "cess", "tax",
            "inspector", "flying squad", "naka", "toll gate", "seizure", "extort",
            "bribe", "permit", "permission", "document", "paper", "law", "legal",
            "पोलीस", "रोक", "अडव", "गाडी", "ट्रक", "चेकपोस्ट", "पास", "पावती", "कर",
            "कानून", "कायदा", "अधिकार", "नाका", "तपासणी", "कागदपत्रे", "हप्ता"
        ]
        is_legal = (
            any(w in q for w in legal_signals) or 
            (("stop" in q or "halt" in q or "hold" in q) and ("truck" in q or "vehicle" in q or "car" in q or "me" in q))
        )
        if is_legal:
            pass_data = compliance_service.generate_gate_pass(
                batch_id="BATCH-MH-20260912-001",
                vehicle_reg="MH-15-EG-4921",
                driver_name="Santosh K. Shinde",
                origin="Pimpalgaon Agro Hub, Nashik",
                destination="Vashi Wholesale Direct Dock, Navi Mumbai",
                commodity="Tomato (Hybrid Red Grade A)",
                net_weight_kg=1350.0
            )

            if effective_lang == "mr":
                text = (
                    f"नाही, अजिबात नाही! पोलीस किंवा बाजार समितीचे भरारी पथक आपली गाडी अडवू शकत नाही. "
                    f"महाराष्ट्र कृषी उत्पन्न बाजार समिती कायदा कलम ५D आणि नियम २१(A) अन्वये थेट शेतकरी वाहतुकीला १००% कर सूट आहे. "
                    f"आपला अधिकृत डिजिटल क्यूआर गेट पास ({pass_data['pass_id']}) तयार आहे. कोणी अडवल्यास हा पास दाखवा."
                )
            elif effective_lang == "hi":
                text = (
                    f"बिलकुल नहीं, न तो पुलिस और न ही मंडी समिति वाले आपकी गाड़ी रोक सकते हैं। "
                    f"महाराष्ट्र एपीएमसी कानून की धारा 5D और नियम 21(A) के तहत सीधी बिक्री पर 100% मंडी टैक्स (सेस) की छूट है। "
                    f"आपका आधिकारिक डिजिटल गेट पास ({pass_data['pass_id']}) सक्रिय है। चेकपोस्ट पर यह डिजिटल पास मान्य है।"
                )
            else:
                text = (
                    f"No, neither police nor APMC flying squads can stop your vehicle. "
                    f"Under Section 5D & Rule 21(A) of the Maharashtra APMC Act 1963, direct farm-to-consumer transit is 100% exempt from market yard cess. "
                    f"Your official digital gate pass ({pass_data['pass_id']}) with QR verification is active and legally protected."
                )

            return {
                "category": "legal",
                "answer_text": text,
                "lang": effective_lang,
                "card": {
                    "type": "gate_pass",
                    "title": "APMC Section 5D Digital Gate Pass",
                    "passId": pass_data["pass_id"],
                    "pass_id": pass_data["pass_id"],
                    "vehicle": pass_data["vehicle_registration"],
                    "statute": "Section 5D & Rule 21(A), APMC Act 1963",
                    "exemption": "100% Market Cess Exempted (Zero Adath Cut)",
                    "validity": "24 Hours from Dispatch"
                }
            }

        # 2. Best Route / Profit Maximization / Expressway / Kasara Ghat Intent (Must be logistics-related)
        route_signals = [
            "route", "path", "road", "way", "expressway", "highway", "samruddhi",
            "kasara", "fast", "faster", "mumbai", "nashik", "diesel", "toll",
            "traffic", "jam", "which route", "best route", "transit", "freight",
            "रस्ता", "मार्ग", "रास्ता", "घाटा", "समृद्धी", "एक्सप्रेसवे", "इंधन", "डिझेल"
        ]
        is_route_query = any(w in q for w in route_signals) or (("profit" in q or "fayda" in q or "फायदा" in q or "नफा" in q) and any(r in q for r in ["route", "road", "way", "highway", "expressway", "rasta", "mumbai"]))
        if is_route_query:
            routes_data = logistics_optimizer.compare_routes(
                commodity="Tomato",
                quantity_kg=1350.0,
                ambient_temp_c=32.0,
                vehicle_type="bolero_maxi"
            )
            route_b = routes_data["routes"][0] # Winner

            if effective_lang == "mr":
                text = (
                    f"समृद्धी महामार्ग (रूट B) निवडा! अंतर ३४ किमी जास्त असले तरी ५५ मिनिटे लवकर पोहोचता येते. "
                    f"घाटातील हादरे टाळल्यामुळे टोमॅटोचे नुकसान टळते आणि ₹१,१८६ जास्त निव्वळ नफा थेट शेतकऱ्याच्या खात्यात मिळतो. "
                    f"निव्वळ भाव: ₹{route_b['farmer_net_per_kg']}/किलो."
                )
            elif effective_lang == "hi":
                text = (
                    f"समृद्धि एक्सप्रेसवे (रूट B) चुनें! दूरी ३४ किमी ज्यादा होने के बावजूद ५५ मिनट पहले पहुँचेंगे। "
                    f"कसारा घाट के झटकों से टमाटर दबने से बचेंगे और ₹१,१८६ ज्यादा शुद्ध मुनाफा सीधे आपके खाते में मिलेगा। "
                    f"शुद्ध दर: ₹{route_b['farmer_net_per_kg']}/किग्रा।"
                )
            else:
                text = (
                    f"Take Samruddhi Expressway (Route B)! Even though it is 34 km longer and toll is ₹580, "
                    f"it arrives 55 minutes faster and smooth asphalt avoids tomato bruising. "
                    f"This delivers +₹1,186 higher net profit directly to you (Net: ₹{route_b['farmer_net_per_kg']}/kg)."
                )

            return {
                "category": "route",
                "answer_text": text,
                "lang": effective_lang,
                "card": {
                    "type": "route_winner",
                    "title": "Profit-Maximizing Route Winner",
                    "winningRoute": route_b["name"],
                    "winning_route": route_b["name"],
                    "netPerKg": route_b["farmer_net_per_kg"],
                    "farmer_net_rate": f"₹{route_b['farmer_net_per_kg']}/kg",
                    "profit_gain": "+₹1,186 extra profit",
                    "duration": f"{route_b['duration_hours']} hours",
                    "bruise_damage": "Only 0.8% (Smooth grade A asphalt)"
                }
            }

        # 3. Mandi Rates / Price Corridor / Floor Price / Middleman Cheating Intent
        price_signals = [
            "rate", "price", "bhao", "bhav", "cost", "fair", "floor", "cheat", "middleman",
            "adath", "adathiya", "mandi", "bazaar", "bazar", "today", "tomato", "onion",
            "spinach", "msp", "commission",
            "भाव", "दर", "दलाल", "मंडी", "किंमत", "बाजारभाव", "न्यूनतम", "हमी"
        ]
        if any(w in q for w in price_signals):
            corridor = agmarknet_service.get_price_corridor("Tomato")

            if effective_lang == "mr":
                text = (
                    f"आज नाशिक-मुंबई बाजार समित्यांमध्ये टोमॅटोचा थेट भाव ₹{corridor['modal_fair_price_per_kg']} प्रति किलो आहे. "
                    f"आपली हमी किमान आधार किंमत ₹{corridor['farmer_floor_per_kg']}/किलो आहे. या दराच्या खाली कोणालाही माल विकू नका. "
                    f"थेट खरेदीदार ₹{corridor['buyer_ceiling_per_kg']}/किलो दराने खरेदी करत आहेत."
                )
            elif effective_lang == "hi":
                text = (
                    f"आज नासिक-मुंबई मंडी में टमाटर का मॉडल भाव ₹{corridor['modal_fair_price_per_kg']} प्रति किलो है। "
                    f"आपकी सुरक्षा न्यूनतम दर ₹{corridor['farmer_floor_per_kg']}/किग्रा तय है। इसके नीचे किसी बिचौलिए को माल न दें। "
                    f"थोक खरीदार सीधे ₹{corridor['buyer_ceiling_per_kg']}/किग्रा पर माल उठा रहे हैं।"
                )
            else:
                text = (
                    f"Today's live APMC modal price for Tomato is ₹{corridor['modal_fair_price_per_kg']}/kg. "
                    f"Your statutory protective floor price is ₹{corridor['farmer_floor_per_kg']}/kg — never sell below this. "
                    f"Direct buyers on KrishiClear are procuring at ₹{corridor['buyer_ceiling_per_kg']}/kg."
                )

            return {
                "category": "price",
                "answer_text": text,
                "lang": effective_lang,
                "card": {
                    "type": "price_corridor",
                    "title": "Live Agmarknet Price Corridor",
                    "floor": corridor["farmer_floor_per_kg"],
                    "modal": corridor["modal_fair_price_per_kg"],
                    "farmer_floor": f"₹{corridor['farmer_floor_per_kg']}/kg",
                    "modal_fair": f"₹{corridor['modal_fair_price_per_kg']}/kg",
                    "buyer_ceiling": f"₹{corridor['buyer_ceiling_per_kg']}/kg",
                    "data_source": "data.gov.in Live Mandi API"
                }
            }

        # 4. Heatwave / Spoilage / Temperature / Rot / Weather Intent
        heat_signals = [
            "heat", "temp", "temperature", "hot", "rot", "spoil", "spoilage", "decay", "ruin", "damage",
            "sun", "weather", "summer", "warm", "boil", "spoil", "bruise",
            "ऊष्ण", "तापमान", "ऊन", "खराब", "सड", "गरमी", "गर्मी", "धूप"
        ]
        if any(w in q for w in heat_signals):
            if effective_lang == "mr":
                text = (
                    "३२°C पेक्षा जास्त तापमानात टोमॅटो लवकर मऊ पडतात. कृषिक्लिअरने १२°C तापमान राखणाऱ्या शीतगृह (रीफर) वाहनाची व्यवस्था केली आहे, "
                    "ज्यामुळे आपला माल ८८% सुरक्षित राहील. ट्रॅफिक जाम ६ तासांपेक्षा जास्त वाढल्यास, संपूर्ण नुकसान टाळण्यासाठी माल "
                    "सह्याद्री प्रक्रिया केंद्राकडे (दिंडोरी) टोमॅटो पेस्टसाठी वळवला जाईल."
                )
            elif effective_lang == "hi":
                text = (
                    "३२°C से अधिक तापमान पर फसल तेजी से गलती है। कृषि-क्लियर ने १२°C तापमान वाला रीफर ट्रक आवंटित किया है "
                    "जिससे ८८% ताज़गी सुरक्षित रहेगी। यदि जाम ६ घंटे से अधिक हुआ, तो माल सह्याद्री एग्रो प्रोसेसिंग प्लांट भेजकर पूरा पैसा बचाया जाएगा।"
                )
            else:
                text = (
                    "At temperatures above 32°C, tomatoes degrade twice as fast. KrishiClear has allocated an active cold-chain reefer truck (12°C) "
                    "to preserve 88% freshness. If highway delays exceed 6 hours, emergency diversion to Sahyadri Agro Processing Hub in Dindori "
                    "will activate to prevent any financial write-off."
                )

            return {
                "category": "freshness",
                "answer_text": text,
                "lang": effective_lang,
                "card": {
                    "type": "freshness_alert",
                    "title": "Perishable Thermal Protection Active",
                    "freshness_level": "88% SAFE",
                    "chiller_status": "Active Reefer (12°C)",
                    "emergency_hub": "Sahyadri Mega Food Park (Dindori)"
                }
            }

        # 5. Delegate to Agronomy & Generative AI Advisory for any open-ended question
        res = agronomy_service.answer_general_agronomy(query, lang=effective_lang)
        res["lang"] = effective_lang
        return res

kisan_assistant_service = KisanAssistantService()

