"""
KrishiClear: Minimal Gemini API Key Health Check Script.
Tests connectivity, authentication, and model availability.
"""
import os
import sys
import json
import urllib.request
import urllib.error
from dotenv import load_dotenv

# Ensure utf-8 output on Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Load .env file
load_dotenv()

key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY", "")

print("=" * 60)
print("🌾 KrishiClear Gemini API Key Verification")
print("=" * 60)

if not key:
    print("❌ ERROR: GEMINI_API_KEY not found in environment or backend/.env")
    print("Please add GEMINI_API_KEY=<your_key> to backend/.env")
    sys.exit(1)

masked = f"{key[:8]}...{key[-4:]}" if len(key) > 12 else "***"
print(f"🔑 Key Detected: {masked} (length: {len(key)} chars)")
print("📡 Connecting to Google Generative Language API...")

candidate_models = ["gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-flash-latest"]
success = False

for model in candidate_models:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
    payload = {
        "contents": [{
            "parts": [{
                "text": "KrishiClear farmer check: reply with 'OK: KrishiClear AI ready' only."
            }]
        }]
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})

    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            ans = json.loads(res.read().decode("utf-8"))
            reply = ans["candidates"][0]["content"]["parts"][0]["text"].strip()
            print(f"✅ SUCCESS! Model: '{model}'")
            print(f"💬 Model Response: \"{reply}\"")
            print("=" * 60)
            print("🎉 KEY IS 100% OPERATIONAL AND READY FOR KRISHICLEAR!")
            print("=" * 60)
            success = True
            break
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="ignore")
        if e.code in [400, 403]:
            print(f"❌ Authentication Rejected (HTTP {e.code}): {err_body}")
            sys.exit(1)
        # Otherwise model might be busy or unavailable, try next
        continue
    except Exception as e:
        print(f"⚠️ Connection issue on {model}: {e}")
        continue

if not success:
    print("❌ FAILED: Could not complete ping with any tested model.")
    sys.exit(1)
