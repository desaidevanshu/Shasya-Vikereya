# 🌾 KrishiClear v2.5 — Autonomous Agricultural Clearinghouse & Logistics Telemetry Engine

> *Ministry of Consumer Affairs, Food & Public Distribution (DoCA)*  
> *"Multiple intermediaries reduce farmers' earnings and increase consumer prices."*

---

## 📌 Executive Summary

**Core Architectural Thesis:** *Marketplace is the interface; Algorithmic Clearinghouse & Delivered Economics is the product.*

Traditional agricultural apps focus only on bilateral bulletin boards (connecting a farmer to a buyer). This fundamentally fails perishable horticulture because it ignores transport economics, road bruising, auction closing deadlines, and quality disputes.

**KrishiClear** operates as an algorithmic clearinghouse that coordinates:
1. **Delivered vehicle economics** (diesel, tolls, driver compensation).
2. **Perishable biological kinetics** ($Q_{10}$ temperature decay curves & road vibration bruising).
3. **Statutory Maharashtra APMC compliance** (Section 5D Direct Marketing exemption & Rule 21(A) market cess waiver).
4. **Fractional cargo pooling & real-time mid-transit arbitrage**.

---

## 🚀 5 Breakthrough Supply Chain Innovations

### 1. 🥛 Smallholder Milk-Run Cargo Pooling (*"UberPool for Perishables"*)
* **Problem:** Farmers with $<500\text{ kg}$ (10–25 crates) cannot afford to hire a solo Bolero Maxi truck (₹3,500 spot rate). Local middlemen exploit this by paying distress village-gate rates (₹12–14/kg).
* **Solution:** Route-clustering algorithm pools 4 marginal farmers (65 crates / 1,625 kg) along the Nashik belt into 1 vehicle.
* **Impact:** Prorated freight of **₹60.51/crate** saves **+₹10,366.72** collectively (+₹2,591.68 extra profit per farmer).

### 2. ⏱️ Auction Clock & Mid-Transit Distress Rerouter
* **Problem:** Vashi APMC wholesale auctions close strictly at **07:30 AM**. If a truck gets delayed by 60 minutes in Kasara Ghat traffic, missing the auction triggers a **35% distress markdown** (-₹9.45/kg).
* **Solution:** Real-time ETA monitoring against statutory APMC auction schedules (Vashi 07:30 AM, Kalyan 09:30 AM, Bhiwandi 24/7). Mid-transit trigger autonomously diverts cargo to Kalyan APMC (ETA 07:40 AM) before the 09:30 AM cutoff.
* **Impact:** Salvages **+₹15,120.00** in produce value per 1.6-tonne consignment.

### 3. 🛡️ Dispatch-Proof QA Manifest & Cryptographic Escrow
* **Problem:** Commission agents at terminal docks invent arbitrary verbal quality cuts (*"20% daagi hai, ₹5/kg kaat ke denge"*). Farmers 200 km away have zero recourse.
* **Solution:** Nashik hub optical grading (58.4 mm caliber, 78.2% breaker blush, 0.0% soft rot, 4.35 kg/cm² firmness) sealed with an immutable **SHA-256 cryptographic hash**.
* **Impact:** Smart contract escrow automatically releases 100% payment (₹36,562.50) to farmer UPI after 30 minutes unless verified photo proof is submitted.

### 4. 🍅 Glut-Shock Industrial Processing Rescue
* **Problem:** During bumper harvests, wholesale prices crash below ₹4–5/kg (far below the ₹14.50/kg break-even cultivation cost), forcing farmers to dump crops on highways.
* **Solution:** Algorithmic Agmarknet crash detector triggers automated 10-Tonne Consignment consolidation across 8 Nashik FPOs, diverting freight directly to **Sahyadri Mega Food Park (Dindori)** at a guaranteed **₹18.50/kg** industrial processing floor.
* **Impact:** Generates **₹185,000.00** gross payout, salvaging **+₹169,500.00** in net wealth from highway dumping.

### 5. 📱 Zero-Click WhatsApp & Native Voice Dispatch Simulator
* **Problem:** Marginal rural farmers struggle with complex English SaaS dashboards and app store downloads.
* **Solution:** WhatsApp Cloud API automated dispatch payload delivering:
  * **16-Second Native Marathi Voice Note:** Playable audio message with pickup time, crate count, and rate lock.
  * **Verifiable QR Gate Pass:** Printable APMC Section 5D digital pass for RTO/police checkposts.
  * **One-Touch Actions:** Call driver (`+91 98220 14921`) and live GPS truck tracker.

---

## 🗺️ GIS Smart Routing & Delivered Profit Maximization Engine

Distance minimization alone is flawed for perishable cargo. KrishiClear compares three concrete freight corridors between Nashik and Mumbai:

| Corridor | Distance | Time | Fuel + Toll | Road Quality & Bruising | Farmer Net Payout |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Route B: Samruddhi Expressway** *(Winner)* | 212 km | **3.2 h** | ₹1,422 + ₹580 | **0.8% bruising** (Smooth asphalt) | **₹30,378.58 (₹22.50/kg)** 🏆 |
| **Route A: NH-160 via Kasara Ghat** | 178 km | 4.1 h | ₹1,196 + ₹320 | 3.8% bruising (Sharp hairpins) | ₹29,695.41 (₹22.00/kg) |
| **Route C: SH-44 via Junnar / Malshej** | 195 km | 6.4 h | ₹1,667 + ₹0 | 9.4% bruising (Potholes & bumps) | ₹27,080.00 (₹20.05/kg) ❌ |

> **Why the longer Expressway wins:** Saving 0.9 hours of thermal exposure and avoiding sharp Kasara Ghat hairpins preserves 40.5 kg of produce from vibration damage, yielding an extra **+₹683.17 to +₹3,298.00** in farmer net earnings.

---

## 📜 APMC Mandi Legal Compliance Suite

Built on the statutory foundation of the **Maharashtra Agricultural Produce Marketing (Development & Regulation) Act, 1963**:
- **Section 5D:** Direct Marketing License exemption authorizing FPOs and clearinghouses to sell directly to bulk buyers outside mandi yards without commission agent (*adath*) deductions.
- **Section 32B:** Legal recognition of Electronic Trading Platforms.
- **Rule 21(A):** 100% waiver of APMC market committee cess (1.25% savings passed to farmers).
- **Section 31(2):** Mandatory 24-hour electronic settlement directly into farmer bank accounts.
- **Digital Gate Pass (`GP-MSAMB-2026-B340E4BE`):** Verifiable digital transit gate pass with QR code, vehicle registration, and statutory exemption text for checkpost police.

---

## 🤖 Model Context Protocol (MCP) Server

Adheres strictly to Anthropic JSON-RPC 2.0 specifications (`backend/mcp_server.py` & `.agents/mcp_config.json`):
- `get_live_mandi_rates`: Fetches live Agmarknet prices across 13,629 APMCs.
- `calculate_clearing_corridor`: Dynamic statutory price corridor calculation.
- `optimize_logistics_route`: Profit-maximizing route evaluation with thermal decay.
- `verify_apmc_compliance`: Maharashtra APMC Section 5D audit.
- `run_digital_twin_simulation`: Multi-shock stress testing.

---

## 🎙️ Kisan AI Voice Assistant (Multilingual Speech-to-Speech)

- Native Web Speech API integration supporting **Marathi (मराठी)**, **Hindi (हिन्दी)**, and **English**.
- **Checkpost Legal Guarantee:** Direct citation of Section 5D & Rule 21(A) when asked *"Will police stop my truck?"*.
- **ICAR/MPKV Agronomic Guidance:** Advises on tomato breaker harvest staging, onion curing, and crop profitability rankings.
- Fallback integration with **Google Gemini API**.

---

## 💻 Tech Stack & Architecture

- **Backend:** Python 3.10+, FastAPI, Uvicorn, Pydantic, PuLP (Simplex LP Clearing Solver), NumPy.
- **Frontend:** React 19, TypeScript, Vite, Vanilla CSS Design System (Obsidian Slate & Precision Titanium, zero neon slop), Lucide React, Leaflet GIS.
- **Data Feeds:** Open Government Data (data.gov.in) Resource `9ef84268-d588-465a-a308-a864a43d0070`.
- **Standards:** MCP JSON-RPC 2.0, SHA-256 Cryptographic Hashing.

---

## ⚡ Quickstart Guide

### 1. Clone & Setup
```bash
git clone https://github.com/Arhaan1609/tp.git
cd tp
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install fastapi uvicorn pydantic requests pulp numpy
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
* Backend API: `http://127.0.0.1:8000`
* Interactive API Docs: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
* Web Application: `http://localhost:5173`

---
