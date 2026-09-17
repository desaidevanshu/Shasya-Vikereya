import React, { useState, useEffect } from 'react';
import { PlusCircle, ShoppingCart, CheckCircle, PackageCheck, Thermometer } from 'lucide-react';
import { FarmerLot, BuyerDemand } from '../../types.ts';
import { apiClient } from '../../api/client.ts';
import { OrderBoard } from './OrderBoard.tsx';

interface MarketplaceViewProps {
  role?: 'buyer' | 'farmer' | 'fpo';
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ role = 'buyer' }) => {
  const [lots, setLots] = useState<FarmerLot[]>([]);
  const [demands, setDemands] = useState<BuyerDemand[]>([]);
  const [activeForm, setActiveForm] = useState<'farmer' | 'buyer'>('farmer');

  // Farmer form state
  const [farmerName, setFarmerName] = useState('');
  const [location, setLocation] = useState('Niphad, Nashik');
  const [commodity, setCommodity] = useState('Red Onion Export Bulbs');
  const [grade, setGrade] = useState('Export Class 1');
  const [quantityKg, setQuantityKg] = useState(12000);
  const [askPrice, setAskPrice] = useState(25.5);
  const [isRefrigerated, setIsRefrigerated] = useState(false);

  // Buyer form state
  const [buyerName, setBuyerName] = useState('');
  const [buyerType, setBuyerType] = useState<'INSTITUTIONAL' | 'RETAIL_CHAIN' | 'EXPORTER' | 'PROCESSOR'>('RETAIL_CHAIN');
  const [destination, setDestination] = useState('Vashi Cold Storage, Navi Mumbai');
  const [demandCommodity, setDemandCommodity] = useState('Red Onion Export Bulbs');
  const [requiredKg, setRequiredKg] = useState(12000);
  const [maxCeilingBid, setMaxCeilingBid] = useState(32.0);

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const state = await apiClient.getClearingState();
    setLots(state.unmatchedLots.concat(state.matches.map((m) => ({
      id: m.lotId,
      fpoRef: m.fpoRef,
      farmerName: 'Verified FPO Producer',
      location: m.transitOrigin,
      state: 'Maharashtra',
      lat: 19.2,
      lng: 74.1,
      commodity: m.commodity,
      grade: 'High-Purity Verified',
      quantityKg: m.volumeKg,
      askPricePerKg: m.farmGateAsk,
      harvestDate: '2026-09-13',
      isRefrigerated: true,
      status: 'MATCHED',
      bidsCount: 4,
      qualityScore: 98.6,
    }))));
    setDemands(state.openDemands);
  };

  const handleFarmerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName) {
      alert('Please specify farmer / FPO name');
      return;
    }
    const newLot = await apiClient.listProduce({
      farmerName,
      location,
      state: 'Maharashtra',
      lat: 19.1,
      lng: 73.9,
      commodity,
      grade,
      quantityKg,
      askPricePerKg: askPrice,
      harvestDate: new Date().toISOString().split('T')[0],
      isRefrigerated,
    });
    setLots([newLot, ...lots]);
    setFarmerName('');
    setNotification(`Produce lot #${newLot.fpoRef} registered successfully! Algorithmic matching queue armed.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName) {
      alert('Please specify buyer name');
      return;
    }
    const newDemand = await apiClient.createDemand({
      buyerName,
      buyerType,
      destination,
      lat: 18.9,
      lng: 72.8,
      commodity: demandCommodity,
      gradeSpec: 'Export Grade Spec',
      requiredKg,
      maxCeilingBidPerKg: maxCeilingBid,
      deliveryDeadline: '2026-09-14 18:00 UTC',
    });
    setDemands([newDemand, ...demands]);
    setBuyerName('');
    setNotification(`Demand RFQ #${newDemand.id} broadcasted across 42 FPO pools!`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="font-headline-sm text-lg sm:text-xl font-bold text-primary">
            FARMER &amp; BUYER BILATERAL MARKETPLACE
          </div>
          <p className="font-body-md text-sm text-on-surface-variant">
            Direct farmer produce listing with cold-chain provenance &amp; institutional demand RFQ matching.
          </p>
        </div>

        {/* Toggle between Farmer & Buyer Registration */}
        <div className="flex items-center gap-1.5 bg-surface-container-lowest dark:bg-surface-container-lowest p-1.5 rounded-full border border-outline-variant/20">
          <button
            onClick={() => setActiveForm('farmer')}
            className={`px-4 py-1.5 rounded-full text-xs font-label-lg transition-all flex items-center gap-1.5 ${
              activeForm === 'farmer'
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>List Farm Produce</span>
          </button>

          <button
            onClick={() => setActiveForm('buyer')}
            className={`px-4 py-1.5 rounded-full text-xs font-label-lg transition-all flex items-center gap-1.5 ${
              activeForm === 'buyer'
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Institutional RFQ</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-secondary-fixed/10 border border-secondary-fixed/30 rounded-xl flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle className="w-5 h-5 text-secondary-fixed shrink-0" />
          <div className="text-xs font-body-md text-on-surface font-semibold">
            {notification}
          </div>
        </div>
      )}

      {/* Form & Orderbook Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Panel */}
        <div className="lg:col-span-5 bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30">
          {activeForm === 'farmer' ? (
            <form onSubmit={handleFarmerSubmit} className="space-y-4">
              <div className="font-headline-sm text-base font-bold text-primary flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-secondary-fixed" />
                <span>Register Harvest Batch (FPO / Farmer)</span>
              </div>

              <div>
                <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                  Farmer / FPO Producer Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kadam (Niphad FPO)"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                    Commodity
                  </label>
                  <select
                    value={commodity}
                    onChange={(e) => setCommodity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
                  >
                    <option value="Red Onion Export Bulbs">Red Onion Export Bulbs</option>
                    <option value="Pomegranate A-Grade">Pomegranate A-Grade</option>
                    <option value="High-Altitude Tomato">High-Altitude Tomato</option>
                    <option value="Seedless Grapes (Thompson)">Thompson Seedless Grapes</option>
                    <option value="Green Chili Polyhouse G4">Green Chili Polyhouse G4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                    Quality Grade
                  </label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                    Quantity (Kg)
                  </label>
                  <input
                    type="number"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(+e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary-fixed font-label-numeric"
                  />
                </div>

                <div>
                  <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                    Ask Price (₹/Kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={askPrice}
                    onChange={(e) => setAskPrice(+e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary-fixed font-label-numeric font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                  Farm Village &amp; District
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container dark:bg-surface-container border border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-secondary-fixed" />
                  <span className="text-xs font-label-micro font-medium text-primary">
                    Cold-Storage Pre-Cooled Reefer
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isRefrigerated}
                  onChange={(e) => setIsRefrigerated(e.target.checked)}
                  className="w-4 h-4 accent-secondary-fixed rounded cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-lg font-bold text-xs hover:opacity-90 transition-opacity"
              >
                SUBMIT HARVEST LOT TO CLEARINGHOUSE
              </button>
            </form>
          ) : (
            <form onSubmit={handleBuyerSubmit} className="space-y-4">
              <div className="font-headline-sm text-base font-bold text-primary flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-secondary-fixed" />
                <span>Create Institutional Demand RFQ</span>
              </div>

              <div>
                <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                  Buyer Company / Entity Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blinkit Fresh Hub / Dubai Cargo"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                    Buyer Category
                  </label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
                  >
                    <option value="RETAIL_CHAIN">Quick Commerce / Retail</option>
                    <option value="EXPORTER">Air Cargo Exporter</option>
                    <option value="INSTITUTIONAL">Institutional / Dairy</option>
                    <option value="PROCESSOR">Food Processor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                    Required Crop
                  </label>
                  <select
                    value={demandCommodity}
                    onChange={(e) => setDemandCommodity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
                  >
                    <option value="Red Onion Export Bulbs">Red Onion Export Bulbs</option>
                    <option value="Pomegranate A-Grade">Pomegranate A-Grade</option>
                    <option value="High-Altitude Tomato">High-Altitude Tomato</option>
                    <option value="Seedless Grapes (Thompson)">Thompson Seedless Grapes</option>
                    <option value="Green Chili Polyhouse G4">Green Chili Polyhouse G4</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                    Demand Volume (Kg)
                  </label>
                  <input
                    type="number"
                    value={requiredKg}
                    onChange={(e) => setRequiredKg(+e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary-fixed font-label-numeric"
                  />
                </div>

                <div>
                  <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                    Ceiling Bid (₹/Kg Max)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={maxCeilingBid}
                    onChange={(e) => setMaxCeilingBid(+e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary-fixed font-label-numeric font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-micro text-outline uppercase mb-1">
                  Delivery Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-headline-sm font-bold text-xs hover:opacity-90 transition-opacity"
              >
                BROADCAST INSTITUTIONAL RFQ
              </button>
            </form>
          )}
        </div>

        {/* Live Lots Directory */}
        <div className="lg:col-span-7 bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30">
          <div className="flex items-center justify-between mb-4">
            <div className="font-headline-sm text-base font-bold text-primary">
              Live Produce Lots in Pool
            </div>
            <span className="text-xs font-label-micro text-outline">
              {lots.length} Aggregated Lots
            </span>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {lots.map((lot) => (
              <div
                key={lot.id}
                className="bg-surface-container-lowest dark:bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 hover:border-secondary-fixed/40 transition-colors"
              >
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15 text-xs font-label-micro">
                  <div className="flex items-center gap-2">
                    <span className="font-label-numeric font-bold text-secondary-fixed">{lot.fpoRef}</span>
                    <span className="text-outline">•</span>
                    <span className="text-primary font-medium">{lot.farmerName}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      lot.status === 'MATCHED'
                        ? 'bg-secondary-fixed/15 text-secondary-fixed'
                        : 'bg-primary-container/15 text-primary-container'
                    }`}
                  >
                    {lot.status}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between my-2 gap-2">
                  <div>
                    <div className="font-headline-sm text-sm font-bold text-primary">
                      {lot.commodity}
                    </div>
                    <div className="text-xs text-outline">{lot.grade} — {lot.location}</div>
                  </div>

                  <div className="text-right">
                    <div className="font-label-numeric font-bold text-secondary-fixed text-sm">
                      ₹{lot.askPricePerKg.toFixed(2)} /kg
                    </div>
                    <div className="font-label-numeric text-xs text-on-surface font-medium">
                      {lot.quantityKg.toLocaleString()} KG
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-label-micro text-outline pt-2 border-t border-outline-variant/15">
                  <span>Harvested: {lot.harvestDate}</span>
                  <span className="text-secondary-fixed font-bold">NIR Quality Score: {lot.qualityScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <OrderBoard role={role} title={role === 'buyer' ? 'My orders & payment' : 'Demand reaching this producer pool'} />
    </div>
  );
};
