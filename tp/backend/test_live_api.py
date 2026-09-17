import urllib.request
import json
import ssl
import urllib.parse
from typing import Optional, List, Dict, Any

API_KEY = "YOUR_AGMARKNET_API_KEY"
RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070"
BASE_URL = f"https://api.data.gov.in/resource/{RESOURCE_ID}"

def fetch_live_mandi_data(state: Optional[str] = "Maharashtra", commodity: Optional[str] = None, limit: int = 100) -> Dict[str, Any]:
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    params = [
        ("api-key", API_KEY),
        ("format", "json"),
        ("limit", str(limit))
    ]
    if state:
        params.append(("filters[state]", state))
    if commodity:
        params.append(("filters[commodity]", commodity))

    query_str = urllib.parse.urlencode(params)
    url = f"{BASE_URL}?{query_str}"
    print(f"Requesting: {url[:80]}...")

    req = urllib.request.Request(url, headers={"User-Agent": "KrishiClear/2.0 (SIH 26033)"})
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        data = json.loads(resp.read().decode())
        return data

if __name__ == "__main__":
    result = fetch_live_mandi_data(state="Maharashtra", commodity=None, limit=20)
    print("Status:", result.get("status"))
    print("Total:", result.get("total"))
    records = result.get("records", [])
    print(f"Fetched {len(records)} records.")
    for r in records[:5]:
        print(f"  {r.get('commodity')} - {r.get('market')} ({r.get('district')}, {r.get('state')}): Modal Rs {r.get('modal_price')}/qtl (Arrival: {r.get('arrival_date')})")
