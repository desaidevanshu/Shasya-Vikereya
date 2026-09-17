"""
Unit and Integration Tests for KrishiClear Backend Services.
"""
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_mandi_overview():
    res = client.get("/api/mandi/overview")
    assert res.status_code == 200
    data = res.json()
    assert len(data["mandis"]) > 0
    assert "data_integrity_hash" in data

def test_price_corridor():
    res = client.get("/api/mandi/corridor?commodity=Tomato")
    assert res.status_code == 200
    data = res.json()
    assert data["farmer_floor_per_kg"] < data["modal_fair_price_per_kg"] < data["buyer_ceiling_per_kg"]

def test_clearing_solve():
    res = client.post("/api/clearing/solve", json={"ambient_temp_c": 31.0, "traffic_delay_pct": 0.0})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ["OPTIMALLY-CLEARED", "AUTO-RECLEARED"]
    assert data["cleared_quantity_kg"] > 0
    assert data["route_plan"]["total_logistics_cost_rs"] > 0
    assert data["freshness_audit"]["freshness_pct"] > 0
    assert "hundred_rupee_breakdown" in data["ledger"]

def test_reclear_dropout():
    res = client.post("/api/clearing/reclear", json={"dropped_farmer_id": "FARM-01"})
    assert res.status_code == 200
    data = res.json()
    assert data["is_recleared"] is True
    # Ensure FARM-01 is not in allocated_suppliers
    supplier_ids = [s["farmer_id"] for s in data["allocated_suppliers"]]
    assert "FARM-01" not in supplier_ids
    assert "FARM-03-BACKUP" in supplier_ids

def test_simulation_studio():
    res = client.post("/api/simulation/run", json={
        "scenario_name": "heatwave_traffic",
        "traffic_delay_pct": 40.0,
        "temperature_spike_c": 8.0,
        "fuel_price_delta_rs": 10.0,
        "simulate_dropout_farmer_id": "FARM-01"
    })
    assert res.status_code == 200
    data = res.json()
    assert len(data["autonomous_actions"]) > 0
    assert "baseline" in data
    assert "simulated" in data

def test_fpo_analytics():
    res = client.get("/api/fpo/analytics")
    assert res.status_code == 200
    data = res.json()
    assert data["kpis"]["money_recovered_by_optimization_rs"] > 0

def test_compare_routes():
    res = client.get("/api/logistics/compare-routes?commodity=Tomato&quantity_kg=1350&ambient_temp_c=31.0")
    assert res.status_code == 200
    data = res.json()
    assert len(data["routes"]) == 3
    assert data["winning_route_id"] == "route_b"
    assert "profit_maximization_justification" in data

def test_gate_pass():
    res = client.get("/api/compliance/gate-pass?batch_id=BATCH-TEST-001")
    assert res.status_code == 200
    data = res.json()
    assert "GP-MSAMB-2026-" in data["pass_id"]
    assert "digital_signature_hash" in data

if __name__ == "__main__":
    print("Running KrishiClear test suite...")
    test_health()
    test_mandi_overview()
    test_price_corridor()
    test_clearing_solve()
    test_reclear_dropout()
    test_simulation_studio()
    test_fpo_analytics()
    test_compare_routes()
    test_gate_pass()
    print("ALL TESTS PASSED! (9/9 Passed)")

