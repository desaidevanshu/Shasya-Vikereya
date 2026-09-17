"""
Automated unit & integration tests for the 5 breakthrough supply chain innovations:
1. Milk-Run Smallholder Cargo Pooling
2. Auction Clock Distress Arbitrage
3. Dispatch-Proof QA Manifest & Escrow
4. Glut-Shock Industrial Processing Rescue
5. Zero-Click WhatsApp & Audio Dispatch
"""

import sys
import json
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

def test_innovations():
    print("Testing 5 Breakthrough Supply Chain Innovations...")

    # 1. Milk-Run Cargo Pooling
    req = urllib.request.Request("http://127.0.0.1:8000/api/milkrun/manifest")
    res = json.loads(urllib.request.urlopen(req, timeout=5).read().decode('utf-8'))
    assert res["status"] == "success"
    assert len(res["farmers"]) == 4
    assert res["trip_summary"]["collective_farmer_savings"] > 5000
    print("✓ Test 1 Passed: Milk-Run Smallholder Pooling (Saved ₹" + str(res["trip_summary"]["collective_farmer_savings"]) + ")")

    # 2. Auction Clock Arbitrage
    req = urllib.request.Request("http://127.0.0.1:8000/api/arbitrage/clocks")
    res = json.loads(urllib.request.urlopen(req, timeout=5).read().decode('utf-8'))
    assert len(res["terminals"]) >= 3
    print("✓ Test 2a Passed: Live Market Auction Clocks active")

    data = json.dumps({"delay_minutes": 90.0, "commodity": "Tomato", "quantity_kg": 1350.0}).encode('utf-8')
    req = urllib.request.Request("http://127.0.0.1:8000/api/arbitrage/evaluate-reroute", data=data, headers={"Content-Type": "application/json"})
    res = json.loads(urllib.request.urlopen(req, timeout=5).read().decode('utf-8'))
    assert res["status"] == "DIVERSION_RECOMMENDED"
    assert "Kalyan" in res["financial_impact"]["recommended_reroute"]["terminal_name"] or "Bhiwandi" in res["financial_impact"]["recommended_reroute"]["terminal_name"]
    print("✓ Test 2b Passed: Mid-Transit Delay Arbitrage Reroute Triggered (Preserved " + res["financial_impact"]["net_farmer_value_preserved"] + ")")

    # 3. QA Manifest & Escrow
    data = json.dumps({"batch_id": "BATCH-MH-20260912-001", "commodity": "Tomato (Hybrid Red Grade A)", "total_crates": 54, "total_weight_kg": 1350.0}).encode('utf-8')
    req = urllib.request.Request("http://127.0.0.1:8000/api/qa/generate-manifest", data=data, headers={"Content-Type": "application/json"})
    res = json.loads(urllib.request.urlopen(req, timeout=5).read().decode('utf-8'))
    assert len(res["cryptographic_seal"]["hash"]) == 64
    assert res["metrics"]["size_grading"]["grade_a_pct"] > 90
    print("✓ Test 3 Passed: Cryptographic QA Manifest Generated (SHA-256: " + res["cryptographic_seal"]["hash"][:12] + "...)")

    # 4. Glut Rescue
    data = json.dumps({"commodity": "Tomato", "simulated_crash_price": 4.00, "collective_volume_kg": 10000.0}).encode('utf-8')
    req = urllib.request.Request("http://127.0.0.1:8000/api/glut/activate-rescue", data=data, headers={"Content-Type": "application/json"})
    res = json.loads(urllib.request.urlopen(req, timeout=5).read().decode('utf-8'))
    assert res["status"] == "INDUSTRIAL_RESCUE_ACTIVE"
    assert len(res["fpo_allocations"]) == 8
    print("✓ Test 4 Passed: Glut-Shock Industrial Processing Rescue (Salvaged " + res["financial_salvage_ledger"]["collective_wealth_salvaged"] + ")")

    # 5. WhatsApp & Audio Dispatch
    data = json.dumps({"batch_id": "BATCH-MH-20260912-001", "farmer_name": "Tukaram G. Jadhav", "lang": "mr"}).encode('utf-8')
    req = urllib.request.Request("http://127.0.0.1:8000/api/whatsapp/dispatch-preview", data=data, headers={"Content-Type": "application/json"})
    res = json.loads(urllib.request.urlopen(req, timeout=5).read().decode('utf-8'))
    assert "interactive" in res["whatsapp_payload"]
    assert "GP-MSAMB-2026" in res["direct_links"]["qr_gate_pass"]
    print("✓ Test 5 Passed: WhatsApp Cloud API & Voice Note Payload Generated")

    print("\nALL 5 INNOVATION SERVICES VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    test_innovations()
