import React, { useState } from 'react';
import { Truck, Check, AlertCircle, RefreshCw, XCircle, FileText } from 'lucide-react';
import { DispatchRequest, Vehicle, RouteInfo } from '../types';

interface DispatchQueueProps {
  queue: DispatchRequest[];
  vehicles: Vehicle[];
  routes: RouteInfo[];
  simulationActive: boolean;
  onUpdateRequestStatus: (requestId: string, status: DispatchRequest['status']) => void;
  onAssignVehicle: (requestId: string, vehicleId: string, routeId: string) => void;
}

export default function DispatchQueue({
  queue,
  vehicles,
  routes,
  simulationActive,
  onUpdateRequestStatus,
  onAssignVehicle
}: DispatchQueueProps) {
  // Modal state for trigger vehicle assignment dropdown
  const [assigningRequestId, setAssigningRequestId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState('');

  const readyVehicles = vehicles.filter(v => v.status === 'Ready');

  const startAssigning = (requestId: string) => {
    setAssigningRequestId(requestId);
    const firstReady = readyVehicles[0]?.id || '';
    setSelectedVehicleId(firstReady);
    setSelectedRouteId(routes[0]?.id || '');
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assigningRequestId && selectedVehicleId && selectedRouteId) {
      onAssignVehicle(assigningRequestId, selectedVehicleId, selectedRouteId);
      setAssigningRequestId(null);
    }
  };

  // Helper colors for status badges
  const getStatusStyle = (status: DispatchRequest['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-950 border-amber-400';
      case 'Assigned':
        return 'bg-blue-100 text-blue-950 border-blue-400';
      case 'In Transit':
        return 'bg-[#DBF34D]/20 text-neutral-900 border-[#DBF34D]';
      case 'Rescued':
        return 'bg-emerald-100 text-emerald-950 border-emerald-400';
      case 'Completed':
        return 'bg-neutral-800 text-white border-neutral-950';
      case 'Spoiled':
        return 'bg-red-100 text-red-950 border-red-500';
      default:
        return 'bg-neutral-100 border-neutral-300';
    }
  };

  return (
    <div id="dashboard" className="p-5 bg-white neo-border neo-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-neutral-950 pb-3 mb-4">
        <div>
          <h3 className="font-extrabold text-lg uppercase tracking-wider text-neutral-900 flex items-center gap-2">
            📋 Active Dispatch Queue
          </h3>
          <p className="text-xs font-semibold text-neutral-500 font-mono mt-0.5">
            Real-time queue tracking crop decay risk, routes, and assigned vehicles.
          </p>
        </div>
        
        <div className="flex items-center gap-1.5 self-start text-[11px] font-mono font-bold bg-neutral-100 px-2 py-1 neo-border">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>MANUAL OVERRIDES ONLINE</span>
        </div>
      </div>

      {assigningRequestId && (
        <div className="mb-6 p-4 bg-[#DBF34D]/10 neo-border border-neutral-950 neo-shadow-sm">
          <h4 className="font-black text-sm uppercase mb-3 flex items-center gap-2 text-neutral-900">
            <Truck className="w-5 h-5 text-neutral-900" />
            Assign Truck & Route
          </h4>
          
          <form onSubmit={handleAssignSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-neutral-600 mb-1">
                Select Available Truck
              </label>
              {readyVehicles.length === 0 ? (
                <div className="text-xs text-red-600 font-bold p-2.5 bg-neutral-50 neo-border">
                  🔴 No trucks ready (dispatched or stuck).
                </div>
              ) : (
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full p-2.5 bg-white neo-border text-xs font-extrabold focus:outline-none"
                >
                  {readyVehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.type} ({v.id}) - driver {v.driverName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-neutral-600 mb-1">
                Assign Logistics Route
              </label>
              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="w-full p-2.5 bg-white neo-border text-xs font-extrabold focus:outline-none"
              >
                {routes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.source} ➔ {r.destination} {simulationActive && r.status === 'Flooded / Blocked' ? '⚠️ FLOODED' : `(Risk: ${r.currentRisk}%)`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={readyVehicles.length === 0}
                className="flex-1 py-2 bg-[#DBF34D] text-black  disabled:opacity-50 text-xs font-black uppercase neo-border neo-shadow-sm neo-btn-press hover:bg-lime-400"
              >
                Create Dispatch
              </button>
              <button
                type="button"
                onClick={() => setAssigningRequestId(null)}
                className="py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold uppercase neo-border"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left neo-border border-collapse text-xs">
          <thead>
            <tr className="bg-neutral-900 text-white font-mono uppercase tracking-wider neo-border border-neutral-900 border-b-2">
              <th className="p-3 font-bold border-r border-neutral-800">Farmer / ID</th>
              <th className="p-3 font-bold border-r border-neutral-800">Origin Village</th>
              <th className="p-3 font-bold border-r border-neutral-800">Crop / Quantity</th>
              <th className="p-3 font-bold border-r border-neutral-800 text-center">Priority</th>
              <th className="p-3 font-bold border-r border-neutral-800 text-center">Spoilage Risk</th>
              <th className="p-3 font-bold border-r border-neutral-800">Status / Vehicle</th>
              <th className="p-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-950 font-medium">
            {queue.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center font-bold text-neutral-500 bg-neutral-50 font-mono">
                  Queue is empty. Click "Reset Database Preset" or add a new request above.
                </td>
              </tr>
            ) : (
              queue.map((req) => {
                const urgencyColor = 
                  req.urgency === 'CRITICAL' ? 'bg-red-500 text-white border-red-700' :
                  req.urgency === 'High' ? 'bg-orange-500 text-white border-orange-600' : 
                  'bg-neutral-100 text-neutral-700 border-neutral-300';

                return (
                  <tr key={req.id} className="hover:bg-neutral-50/50 transition-colors">
                    {/* Farmer Name */}
                    <td className="p-3 border-r border-neutral-950 font-sans font-bold text-neutral-900">
                      <div>{req.farmerName}</div>
                      <div className="text-[10px] text-neutral-400 font-mono font-semibold">ID: {req.id}</div>
                    </td>

                    {/* Village Location */}
                    <td className="p-3 border-r border-neutral-950 font-sans text-neutral-800 font-bold">
                      {req.village}
                    </td>

                    {/* Crop info */}
                    <td className="p-3 border-r border-neutral-950 font-sans text-neutral-800">
                      <div className="font-extrabold">{req.cropType}</div>
                      <div className="font-mono text-neutral-500 font-bold text-[10px]">{req.quantity} Tons</div>
                    </td>

                    {/* Urgency Badge */}
                    <td className="p-3 border-r border-neutral-950 text-center">
                      <span className={`px-2 py-1 rounded-none font-black uppercase text-[10px] neo-border ${urgencyColor}`}>
                        {req.urgency}
                      </span>
                    </td>

                    {/* Spoilage Decay Index */}
                    <td className="p-3 border-r border-neutral-950 text-center">
                      <div className="font-mono font-black text-sm flex flex-col items-center justify-center">
                        <span className={req.riskPercent >= 70 ? 'text-red-600 animate-pulse' : req.riskPercent >= 40 ? 'text-orange-500' : 'text-neutral-800'}>
                          {req.riskPercent}%
                        </span>
                        
                        {/* Tiny dynamic warning progress track */}
                        <div className="w-16 h-1.5 bg-neutral-100 neo-border-sm mt-1 overflow-hidden">
                          <div 
                            className={`h-full ${req.riskPercent >= 70 ? 'bg-red-500' : req.riskPercent >= 40 ? 'bg-orange-500' : 'bg-[#DBF34D]'}`} 
                            style={{ width: `${req.riskPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Current Assigned Vessel / Route */}
                    <td className="p-3 border-r border-neutral-950 font-sans">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 text-[10px] font-bold uppercase neo-border ${getStatusStyle(req.status)}`}>
                            {req.status}
                          </span>
                        </div>
                        {req.assignedVehicleId ? (
                          <div className="text-[10px] font-mono leading-tight font-bold text-neutral-600">
                            🚚 <span className="text-neutral-900">{req.assignedVehicleId}</span>
                            <br />
                            📍 Route: {req.assignedRoute || 'Direct Bypass Path'}
                          </div>
                        ) : (
                          <div className="text-[10px] font-mono text-neutral-400 font-bold font-bold">Unassigned</div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1.5">
                        {req.status === 'Pending' && (
                          <button
                            onClick={() => startAssigning(req.id)}
                            className="bg-[#DBF34D] hover:bg-lime-400 text-black px-2 py-1.5 neo-border neo-shadow-sm neo-btn-press font-black uppercase text-[10px] flex items-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Assign Truck/Route</span>
                          </button>
                        )}

                        {req.status === 'Assigned' && (
                          <button
                            onClick={() => onUpdateRequestStatus(req.id, 'In Transit')}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-1.5 neo-border neo-shadow-sm neo-btn-press font-black uppercase text-[10px] flex items-center gap-1"
                          >
                            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                            <span>Send Dispatch</span>
                          </button>
                        )}

                        {req.status === 'In Transit' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => onUpdateRequestStatus(req.id, 'Completed')}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1.5 neo-border neo-shadow-sm neo-btn-press font-black uppercase text-[10px] flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Silo Dropoff</span>
                            </button>
                            {simulationActive && (
                              <button
                                onClick={() => onUpdateRequestStatus(req.id, 'Rescued')}
                                className="bg-amber-500 hover:bg-amber-400 text-black px-2 py-1.5 neo-border neo-shadow-sm neo-btn-press font-black uppercase text-[10px] flex items-center gap-1"
                              >
                                <span>Rescue Cargo</span>
                              </button>
                            )}
                          </div>
                        )}

                        {(req.status === 'Completed' || req.status === 'Rescued' || req.status === 'Spoiled') && (
                          <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#111] bg-neutral-100 border-dashed border px-2 py-1">
                            <span>✅ Completed</span>
                          </div>
                        )}

                        {req.status === 'Pending' && (
                          <button
                            onClick={() => onUpdateRequestStatus(req.id, 'Spoiled')}
                            className="text-red-600 hover:bg-red-50 px-2 py-1 neo-border border-red-600 font-bold uppercase text-[10px]"
                          >
                            Mark Spoiled
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
