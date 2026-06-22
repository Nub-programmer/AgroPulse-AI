import React, { useState } from 'react';
import { PlusCircle, Info, Landmark } from 'lucide-react';
import { UrgencyLevel, DispatchRequest } from '../types';

interface IntakeFormProps {
  onAddRequest: (request: Omit<DispatchRequest, 'id' | 'status' | 'riskPercent' | 'createdAt'>) => void;
}

const INDIAN_VILLAGES = [
  'Ramapuram Sector 2',
  'Shaktigarh Cross',
  'Kheri Delta',
  'Nabha West',
  'Fatehgarh Silo Link',
  'Rayagada Border Road',
  'Amravati Cooperative'
];

const VEGETABLES_GRAINS = [
  'Tomatoes (Sensitive)',
  'Onions (Bulk Bulb)',
  'Basmati Rice (Grain)',
  'Organic Chillies',
  'Kharif Cotton Bales',
  'Potatoes (Cold Store)'
];

export default function IntakeForm({ onAddRequest }: IntakeFormProps) {
  const [farmerName, setFarmerName] = useState('');
  const [village, setVillage] = useState(INDIAN_VILLAGES[0]);
  const [cropType, setCropType] = useState(VEGETABLES_GRAINS[0]);
  const [quantity, setQuantity] = useState('5.0');
  const [urgency, setUrgency] = useState<UrgencyLevel>('Normal');
  const [pickupTime, setPickupTime] = useState('10:30 Today');

  const [formAlert, setFormAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim()) {
      alert("Please provide the target Farmer Name to establish dispatch credentials.");
      return;
    }
    const parsedQty = parseFloat(quantity) || 1.0;
    
    onAddRequest({
      farmerName: farmerName.trim(),
      village,
      cropType,
      quantity: parsedQty,
      urgency,
      pickupTime
    });

    // Reset simple inputs
    setFarmerName('');
    setQuantity('5.0');
    setUrgency('Normal');
    
    // Quick success animation trigger
    setFormAlert(true);
    setTimeout(() => setFormAlert(false), 2500);
  };

  return (
    <div id="requests" className="p-5 bg-white neo-border neo-shadow h-full flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 border-b-3 border-neutral-950 pb-2 mb-2">
          <Landmark className="w-5 h-5 text-neutral-800" />
          <h3 className="font-extrabold text-base uppercase tracking-wider text-neutral-900">
            🌾 Farmer Dispatch Registration
          </h3>
        </div>

        {formAlert && (
          <div className="bg-[#DBF34D] text-black text-xs font-bold font-mono px-3 py-2 neo-border neo-shadow-sm text-center">
            ✔ Request added to the active queue!
          </div>
        )}

        {/* Farmer Name */}
        <div>
          <label className="block text-xs font-black uppercase text-neutral-800 mb-1 font-mono">
            Farmer Name / Registered ID
          </label>
          <input
            type="text"
            required
            value={farmerName}
            onChange={(e) => setFarmerName(e.target.value)}
            placeholder="e.g., Rajesh Prasad Sen"
            className="w-full p-2.5 bg-neutral-50 neo-border focus:bg-white focus:outline-none text-sm font-bold placeholder-neutral-400"
          />
        </div>

        {/* Grid: Village & Crop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-black uppercase text-neutral-800 mb-1 font-mono">
              Farmer Village / Depot Node
            </label>
            <select
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 neo-border text-sm font-extrabold focus:outline-none focus:bg-white"
            >
              {INDIAN_VILLAGES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-neutral-800 mb-1 font-mono">
              Harvest Crop Type
            </label>
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 neo-border text-sm font-extrabold focus:outline-none focus:bg-white"
            >
              {VEGETABLES_GRAINS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid: Quantity & Pickup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-black uppercase text-neutral-800 mb-1 font-mono">
              Harvest Yield Volume (Tons)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="100.0"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 bg-neutral-50 neo-border text-sm font-extrabold focus:outline-none focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-neutral-800 mb-1 font-mono">
              Requested Pickup Window
            </label>
            <input
              type="text"
              required
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              placeholder="e.g., 11:30 Tomorrow"
              className="w-full p-2 bg-neutral-50 neo-border text-sm font-bold placeholder-neutral-400 focus:outline-none focus:bg-white"
            />
          </div>
        </div>

        {/* Danger Urgency Multi-select */}
        <div>
          <label className="block text-xs font-black uppercase text-neutral-800 mb-1.5 font-mono">
            Logistics Priority & Spoilage Urgency
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Normal', 'High', 'CRITICAL'] as UrgencyLevel[]).map((level) => {
              const activeColor = 
                level === 'CRITICAL' ? 'bg-red-500 text-white' : 
                level === 'High' ? 'bg-orange-500 text-white' : 'bg-neutral-800 text-white';
              const isSelected = urgency === level;

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setUrgency(level)}
                  className={`py-2 text-xs font-black uppercase neo-border neo-btn-press text-center transition-all ${
                    isSelected 
                      ? `${activeColor} neo-shadow-sm scale-[1.02]` 
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {level === 'CRITICAL' ? '🚨 ' : ''}{level}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-[#DBF34D] text-black font-black uppercase text-sm neo-border neo-shadow-sm neo-btn-press hover:bg-lime-400 flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          <span>Add to Active Dispatch Queue</span>
        </button>
      </form>

      {/* Village Depot Policy */}
      <div className="mt-4 p-3.5 bg-neutral-50 hover:bg-neutral-100 transition-colors neo-border border-dashed border-neutral-300 text-[11px] font-mono leading-relaxed text-neutral-600 flex items-start gap-2.5">
        <Info className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-neutral-900 block mb-0.5">VILLAGE DEPOT POLICY:</strong>
          Entering requests sets priority weights in the route solver. Normal loads dispatch within 12h. Critical entries bypass normal queues and alert drivers immediately.
        </div>
      </div>
    </div>
  );
}
