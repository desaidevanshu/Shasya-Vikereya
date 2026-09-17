"""
KrishiClear Model Context Protocol (MCP) Server.
Implements JSON-RPC 2.0 specifications for exposing agricultural clearinghouse
and logistics optimization tools to autonomous AI agents (Claude, Gemini, ONDC Bots).
"""
import sys
import json
import os
from typing import Dict, Any, List

# Ensure services can be imported whether run from root or backend
sys.path.insert(0, os.path.dirname(__file__))

from services.agmarknet_service import agmarknet_service
from services.clearing_engine import clearing_engine
from services.logistics_optimizer import logistics_optimizer
from services.compliance_service import compliance_service
from services.simulation_engine import simulation_engine

MCP_TOOLS = [
    {
        "name": "get_live_mandi_rates",
        "description": "Fetch real-time APMC arrivals, modal prices, and mandi corridors from data.gov.in (Resource 9ef84268-d588-465a-a308-a864a43d0070).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "commodity": {"type": "string", "description": "Agricultural commodity name (e.g., Tomato, Onion, Potato)", "default": "Tomato"},
                "state": {"type": "string", "description": "State filter (default: Maharashtra)", "default": "Maharashtra"}
            },
            "required": ["commodity"]
        }
    },
    {
        "name": "calculate_clearing_corridor",
        "description": "Computes dynamic statutory price corridor (Farmer Floor Price, Modal Fair Price, Buyer Ceiling Price) to prevent predatory pricing.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "commodity": {"type": "string", "description": "Commodity name", "default": "Tomato"}
            },
            "required": ["commodity"]
        }
    },
    {
        "name": "optimize_logistics_route",
        "description": "Evaluates delivered economics across multiple freight corridors (NH-160 Kasara Ghat, Samruddhi Expressway, SH-44 Rural) to maximize net farmer realization subject to diesel fuel, tolls, and thermal perishability.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "commodity": {"type": "string", "description": "Perishable commodity", "default": "Tomato"},
                "quantity_kg": {"type": "number", "description": "Total batch weight in kg", "default": 1350.0},
                "ambient_temp_c": {"type": "number", "description": "Ambient transit temperature in Celsius", "default": 31.0},
                "diesel_price": {"type": "number", "description": "Current diesel price in INR/liter", "default": 94.20},
                "vehicle_type": {"type": "string", "description": "Vehicle fleet type (tata_ace, bolero_maxi, eicher_reefer)", "default": "bolero_maxi"},
                "is_refrigerated": {"type": "boolean", "description": "Active cold-chain refrigeration enabled", "default": False}
            },
            "required": ["commodity", "quantity_kg"]
        }
    },
    {
        "name": "verify_apmc_compliance",
        "description": "Audits agricultural trade against Maharashtra APMC Act 1963 Section 5D & Rule 21(A) for direct marketing license exemption and 0% mandi cess qualification.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "origin_district": {"type": "string", "description": "Origin district (e.g. Nashik)", "default": "Nashik"},
                "destination_district": {"type": "string", "description": "Destination district (e.g. Mumbai)", "default": "Mumbai"},
                "commodity": {"type": "string", "description": "Commodity traded", "default": "Tomato"},
                "gross_value_rs": {"type": "number", "description": "Total invoice trade value in INR", "default": 35775.0}
            },
            "required": ["origin_district", "destination_district", "commodity"]
        }
    },
    {
        "name": "run_digital_twin_simulation",
        "description": "Executes multi-shock sensitivity simulation (traffic delays, heatwaves, diesel price spikes, supplier dropouts) to verify algorithmic clearinghouse auto-recovery.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "scenario_name": {"type": "string", "description": "Scenario identifier", "default": "heatwave_stress"},
                "traffic_delay_pct": {"type": "number", "description": "Traffic delay percentage (0-100%)", "default": 30.0},
                "temperature_spike_c": {"type": "number", "description": "Ambient temperature increase in Celsius", "default": 6.0},
                "fuel_price_delta_rs": {"type": "number", "description": "Diesel price delta in INR/liter", "default": 5.0}
            }
        }
    }
]

def handle_mcp_request(request: Dict[str, Any]) -> Dict[str, Any]:
    """Processes incoming JSON-RPC 2.0 MCP request."""
    method = request.get("method")
    req_id = request.get("id", 1)

    if method == "tools/list":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "tools": MCP_TOOLS
            }
        }

    elif method == "tools/call":
        params = request.get("params", {})
        tool_name = params.get("name")
        args = params.get("arguments", {})

        try:
            if tool_name == "get_live_mandi_rates":
                comm = args.get("commodity", "Tomato")
                st = args.get("state", "Maharashtra")
                records = agmarknet_service.fetch_live_records(state=st, commodity=comm, limit=10)
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "content": [
                            {"type": "text", "text": json.dumps(records, indent=2)}
                        ]
                    }
                }

            elif tool_name == "calculate_clearing_corridor":
                comm = args.get("commodity", "Tomato")
                corridor = agmarknet_service.get_price_corridor(comm)
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "content": [
                            {"type": "text", "text": json.dumps(corridor, indent=2)}
                        ]
                    }
                }

            elif tool_name == "optimize_logistics_route":
                res = logistics_optimizer.compare_routes(
                    commodity=args.get("commodity", "Tomato"),
                    quantity_kg=float(args.get("quantity_kg", 1350.0)),
                    ambient_temp_c=float(args.get("ambient_temp_c", 31.0)),
                    diesel_price=float(args.get("diesel_price", 94.20)),
                    vehicle_type=args.get("vehicle_type", "bolero_maxi"),
                    is_refrigerated=bool(args.get("is_refrigerated", False))
                )
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "content": [
                            {"type": "text", "text": json.dumps(res, indent=2)}
                        ]
                    }
                }

            elif tool_name == "verify_apmc_compliance":
                comp = compliance_service.verify_trade_compliance(
                    origin_district=args.get("origin_district", "Nashik"),
                    destination_district=args.get("destination_district", "Mumbai"),
                    commodity=args.get("commodity", "Tomato"),
                    gross_trade_value_rs=float(args.get("gross_value_rs", 35775.0))
                )
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "content": [
                            {"type": "text", "text": json.dumps(comp, indent=2)}
                        ]
                    }
                }

            elif tool_name == "run_digital_twin_simulation":
                sim = simulation_engine.run_scenario(
                    scenario_name=args.get("scenario_name", "heatwave_stress"),
                    traffic_delay_pct=float(args.get("traffic_delay_pct", 30.0)),
                    temperature_spike_c=float(args.get("temperature_spike_c", 6.0)),
                    fuel_price_delta_rs=float(args.get("fuel_price_delta_rs", 5.0))
                )
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "content": [
                            {"type": "text", "text": json.dumps(sim, indent=2)}
                        ]
                    }
                }

            else:
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "error": {"code": -32601, "message": f"Unknown tool: {tool_name}"}
                }

        except Exception as e:
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {"code": -32000, "message": str(e)}
            }

    elif method == "initialize":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {}},
                "serverInfo": {
                    "name": "krishiclear-mcp-server",
                    "version": "2.0.0"
                }
            }
        }

    else:
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "error": {"code": -32601, "message": f"Method not found: {method}"}
        }

def run_stdio():
    """Runs stdio loop for external MCP clients."""
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
            res = handle_mcp_request(req)
            sys.stdout.write(json.dumps(res) + "\n")
            sys.stdout.flush()
        except Exception as e:
            err = {"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": str(e)}}
            sys.stdout.write(json.dumps(err) + "\n")
            sys.stdout.flush()

if __name__ == "__main__":
    run_stdio()
