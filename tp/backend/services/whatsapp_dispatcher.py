"""
Zero-Click WhatsApp & Audio Dispatch Simulator for KrishiClear.
Bridges the rural adoption gap by generating interactive WhatsApp Cloud API cards,
one-tap checkpost gate passes, live Google Maps links, and native voice notes for farmers and drivers.
"""

from typing import Dict, Any

class WhatsAppDispatcher:
    def generate_dispatch_card(
        self,
        batch_id: str = "BATCH-MH-20260912-001",
        farmer_name: str = "Tukaram G. Jadhav",
        farmer_phone: str = "+91 98224 81920",
        driver_name: str = "Santosh K. Shinde",
        driver_phone: str = "+91 98231 44921",
        vehicle_reg: str = "MH-15-EG-4921",
        commodity: str = "Tomato (Hybrid Red Grade A)",
        quantity_kg: float = 1350.0,
        expected_net_payout: float = 30378.58,
        gate_pass_id: str = "GP-MSAMB-2026-B340E4BE",
        lang: str = "mr"
    ) -> Dict[str, Any]:
        """
        Generates structured WhatsApp Cloud API message payload and human-readable preview.
        """
        # Voice note script for text-to-speech audio
        if lang == "mr":
            audio_script = (
                f"नमस्कार {farmer_name} शेतकरी बंधू! आपला {quantity_kg:.0f} किलो टोमॅटो माल गाडी क्रमांक {vehicle_reg} द्वारे "
                f"समृद्धी महामार्गाने मुंबईसाठी रवाना झाला आहे. अंदाजे निव्वळ रक्कम ₹{expected_net_payout:,.2f} थेट आपल्या बँक खात्यात जमा होईल. "
                f"पोलीस किंवा चेकपोस्टवर दाखवण्यासाठी डिजिटल गेट पास सोबत जोडला आहे."
            )
            greeting = f"नमस्कार {farmer_name} जी,"
            tagline = "कृषिक्लिअर थेट शेतकरी वाहतूक अधिकृत सूचना"
        elif lang == "hi":
            audio_script = (
                f"नमस्ते {farmer_name} किसान भाई! आपका {quantity_kg:.0f} किलो टमाटर गाड़ी नंबर {vehicle_reg} से "
                f"समृद्धि एक्सप्रेसवे के रास्ते मुंबई के लिए रवाना हो गया है। लगभग ₹{expected_net_payout:,.2f} शुद्ध भुगतान सीधे आपके खाते में जमा होगा। "
                f"चेकपोस्ट पर दिखाने के लिए डिजिटल गेट पास संलग्न है।"
            )
            greeting = f"नमस्ते {farmer_name} जी,"
            tagline = "कृषि-क्लियर सीधी किसान परिवहन सूचना"
        else:
            audio_script = (
                f"Hello {farmer_name}! Your consignment of {quantity_kg:.0f} kg tomato has been dispatched via vehicle {vehicle_reg} "
                f"along Samruddhi Expressway to Mumbai. Your projected net payout of ₹{expected_net_payout:,.2f} will be settled via direct escrow. "
                f"Official statutory APMC Section 5D transit gate pass is attached."
            )
            greeting = f"Hello {farmer_name},"
            tagline = "KrishiClear Official Farmer Dispatch Notification"

        # WhatsApp Interactive Message Template
        whatsapp_message_body = (
            f"🟢 *{tagline}*\n\n"
            f"{greeting}\n"
            f"आपला कृषी माल थेट मुंबई गोदीकडे यशस्वीपणे रवाना झाला आहे.\n\n"
            f"📦 *तपशील / Consignment:*\n"
            f"• माल: *{commodity}*\n"
            f"• वजन: *{quantity_kg:,.0f} kg (54 Crates)*\n"
            f"• गाडी क्रमांक: *{vehicle_reg}* ({driver_name})\n"
            f"• निवडलेला मार्ग: *समृद्धी महामार्ग (Route B - ५५ मिनिटे जलद)*\n\n"
            f"📜 *कायदेशीर गेट पास:*\n"
            f"• पास क्र: *{gate_pass_id}*\n"
            f"• कलम ५D व नियम २१(A) अन्वये १००% बाजार सेस सूट\n\n"
            f"💰 *अपेक्षित थेट जमा रक्कम:* *₹{expected_net_payout:,.2f}*\n"
            f"_(मध्यस्थ व दलालांची शून्य कपात • UPI Escrow Protected)_\n\n"
            f"👇 *खालील बटणे दाबून थेट ट्रॅक करा:*"
        )

        return {
            "recipient": {
                "farmer_name": farmer_name,
                "phone": farmer_phone,
                "driver_name": driver_name,
                "driver_phone": driver_phone
            },
            "whatsapp_payload": {
                "messaging_product": "whatsapp",
                "to": farmer_phone,
                "type": "interactive",
                "interactive": {
                    "type": "button",
                    "header": {
                        "type": "text",
                        "text": "KRISHICLEAR VERIFIED DISPATCH"
                    },
                    "body": {
                        "text": whatsapp_message_body
                    },
                    "action": {
                        "buttons": [
                            {"type": "reply", "reply": {"id": "btn_gatepass", "title": "📄 View Gate Pass"}},
                            {"type": "reply", "reply": {"id": "btn_livetrack", "title": "🗺️ Live GPS Tracking"}},
                            {"type": "reply", "reply": {"id": "btn_call_driver", "title": "📞 Call Driver"}}
                        ]
                    }
                }
            },
            "voice_note": {
                "language": lang,
                "duration_seconds": 16,
                "audio_script": audio_script,
                "audio_file": "dispatch_voice_note_mr.mp3"
            },
            "direct_links": {
                "qr_gate_pass": f"https://krishiclear.org/pass/{gate_pass_id}",
                "google_maps_route": "https://maps.google.com/?daddr=Vashi+APMC+Direct+Dock,+Navi+Mumbai&saddr=Pimpalgaon+Baswant,+Nashik&dirflg=d",
                "upi_escrow_tracker": f"https://krishiclear.org/escrow/{batch_id}"
            }
        }

whatsapp_dispatcher = WhatsAppDispatcher()
