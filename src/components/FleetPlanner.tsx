import React from 'react';
import { Truck, CheckCircle, AlertTriangle, HelpCircle, Map, Compass } from 'lucide-react';
import { Vehicle, RouteInfo } from '../types';

interface FleetPlannerProps {
  vehicles: Vehicle[];
  routes: RouteInfo[];
  simulationActive: boolean;
  onSetVehicleMaintenance: (vehicleId: string) => void;
  onRestoreVehicleReady: (vehicleId: string) => void;
}

export default function FleetPlanner({
  vehicles,
  routes,
  simulationActive,
  onSetVehicleMaintenance,
  onRestoreVehicleReady
}: FleetPlannerProps) {
  return (
    <div id="fleet" className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      
      {/* Col 1: Available fleet tracking */}
      <div className="lg:col-span-5 bg-white neo-border neo-shadow p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center border-b-3 border-neutral-950 pb-2 mb-3">
            <h3 className="font-extrabold text-base uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              🚚 Active Fleet Dispatch
            </h3>
            <span className="font-mono text-xs font-black bg-[#DBF34D] px-2 py-0.5 neo-border">
              {vehicles.length} Trucks
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-semibold mb-4">
            Manage co-op trucks. Vehicles have high ground clearance to navigate monsoon flooding.
          </p>

          <div className="space-y-3">
            {vehicles.map((v) => {
              const statusColors = 
                v.status === 'Ready' ? 'bg-emerald-100 text-emerald-950 border-emerald-400' :
                v.status === 'Dispatched' ? 'bg-neutral-800 text-white border-neutral-950' :
                v.status === 'Stuck' ? 'bg-red-100 text-red-950 border-red-500 animate-pulse' :
                'bg-neutral-100 border-neutral-300';

              return (
                <div key={v.id} className="p-3 bg-neutral-50 hover:bg-neutral-100/80 transition-colors neo-border flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-neutral-900 border border-neutral-950 text-[#DBF34D] mt-0.5">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-neutral-900">{v.id}</span>
                        <span className={`px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase neo-border ${statusColors}`}>
                          {v.status}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-neutral-600">{v.type}</div>
                      <div className="text-[10px] text-neutral-500 font-mono font-bold">
                        Driver: {v.driverName} • {v.driverPhone}
                      </div>
                      <div className="text-[10px] text-neutral-600 font-mono mt-0.5">
                        Location: {v.currentLocation}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1">
                    {v.status === 'Ready' && (
                      <button
                        onClick={() => onSetVehicleMaintenance(v.id)}
                        className="text-[10px] font-bold uppercase py-1 px-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 neo-border"
                      >
                        Maint.
                      </button>
                    )}
                    {v.status === 'Maintenance' && (
                      <button
                        onClick={() => onRestoreVehicleReady(v.id)}
                        className="text-[10px] font-bold uppercase py-1 px-1.5 bg-[#DBF34D] hover:bg-lime-400 text-black neo-border"
                      >
                        Ready
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fleet guidelines */}
        <div className="mt-4 p-3 bg-orange-50 neo-border border-amber-600 text-[10px] font-mono leading-relaxed text-[#111] flex gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>VEHICLE CAPABILITIES:</strong> Ready trucks are fitted with air intake snorkels. Bolero pickups handle flooded dirt tracks, while heavier Tata trucks require concrete roads.
          </div>
        </div>
      </div>

      {/* Col 2: Route Planner (SVG Map) */}
      <div className="lg:col-span-7 bg-white neo-border neo-shadow p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center border-b-3 border-neutral-950 pb-2 mb-3">
            <h3 className="font-extrabold text-base uppercase tracking-wider text-neutral-950 flex items-center gap-2">
              🗺️ Route Network Bypass Map
            </h3>
            <span className="font-mono text-xs font-black bg-neutral-900 text-white px-2 py-0.5">
              Live Network Active
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-semibold mb-4">
            Schematic of connections between villages and the central storage silo.
          </p>

          {/* SVG Map Container */}
          <div className="w-full h-[260px] bg-neutral-50 neo-border relative overflow-hidden select-none flex flex-col justify-between p-3">
            
            {/* Interactive map layers rendered in high contrast */}
            <svg viewBox="0 0 600 240" className="w-full h-full">
              {/* Grid Lines */}
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E5E5E5" strokeWidth="1" />
                </pattern>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#111" />
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Connecting Routes */}
              {/* Route 1: Ramapuram to Central (RT-101) */}
              <path 
                d="M 80 180 Q 200 210, 320 120" 
                fill="none" 
                stroke={simulationActive ? "#EF4444" : "#111111"}
                strokeWidth={simulationActive ? "4" : "3"} 
                strokeDasharray={simulationActive ? "6,4" : "0"}
                className="transition-all duration-700"
              />

              {/* Route 2: Shaktigarh to Central (RT-102) */}
              <path 
                d="M 120 60 L 320 120" 
                fill="none" 
                stroke={simulationActive ? "#EF4444" : "#111111"}
                strokeWidth={simulationActive ? "4" : "3"} 
                strokeDasharray={simulationActive ? "4,4" : "0"}
                className="transition-all duration-700"
              />

              {/* Route 3: Kheri to Central (RT-103) */}
              <path 
                d="M 230 40 L 320 120" 
                fill="none" 
                stroke="#111111" 
                strokeWidth="3"
                className="transition-all duration-700"
              />

              {/* Route 4: Nabha to Central (RT-104) */}
              <path 
                d="M 520 80 Q 420 100, 320 120" 
                fill="none" 
                stroke="#111111" 
                strokeWidth="3" 
                className="transition-all duration-700"
              />

              {/* FLOOD OVERLAY BYPASS (Procedural Route highlight) */}
              {simulationActive && (
                <>
                  {/* Bypass Corridors - dotted neon green line */}
                  <path 
                    d="M 80 180 Q 140 100, 320 120" 
                    fill="none" 
                    stroke="#DBF34D" 
                    strokeWidth="5" 
                    className="animate-pulse"
                    strokeDasharray="4,4"
                  />
                  <path 
                    d="M 120 60 Q 220 170, 320 120" 
                    fill="none" 
                    stroke="#DBF34D" 
                    strokeWidth="5" 
                    className="animate-pulse"
                    strokeDasharray="4,4"
                  />
                  
                  {/* Danger Water Flash Indicator */}
                  <g transform="translate(180, 160)">
                    <circle r="14" fill="#EF4444" className="animate-ping opacity-45" />
                    <circle r="8" fill="#EF4444" stroke="#111" strokeWidth="2" />
                  </g>
                  <g transform="translate(195, 80)">
                    <circle r="14" fill="#EF4444" className="animate-ping opacity-45" />
                    <circle r="8" fill="#EF4444" stroke="#111" strokeWidth="2" />
                  </g>
                </>
              )}

              {/* Village Nodes on Map */}
              {/* Ramapuram */}
              <g transform="translate(80, 180)">
                <rect x="-35" y="-14" width="70" height="28" fill="white" stroke="#111" strokeWidth="2.5" />
                <rect x="-35" y="-14" width="70" height="28" fill="#111" className="translate-x-[2px] translate-y-[2px] -z-10" />
                <text y="4" textAnchor="middle" className="text-[10px] font-black uppercase font-mono tracking-tight">Ramapuram</text>
              </g>

              {/* Shaktigarh */}
              <g transform="translate(120, 60)">
                <rect x="-35" y="-14" width="70" height="28" fill="white" stroke="#111" strokeWidth="2.5" />
                <rect x="-35" y="-14" width="70" height="28" fill="#111" className="translate-x-[2px] translate-y-[2px] -z-10" />
                <text y="4" textAnchor="middle" className="text-[10px] font-black uppercase font-mono tracking-tight">Shaktigarh</text>
              </g>

              {/* Kheri */}
              <g transform="translate(230, 40)">
                <rect x="-24" y="-12" width="48" height="24" fill="white" stroke="#111" strokeWidth="2.5" />
                <text y="4" textAnchor="middle" className="text-[9px] font-bold uppercase font-mono tracking-tight">Kheri</text>
              </g>

              {/* Nabha */}
              <g transform="translate(520, 80)">
                <rect x="-24" y="-12" width="48" height="24" fill="white" stroke="#111" strokeWidth="2.5" />
                <text y="4" textAnchor="middle" className="text-[9px] font-bold uppercase font-mono tracking-tight">Nabha</text>
              </g>

              {/* Central Cooperative Silo Center */}
              <g transform="translate(320, 120)">
                <rect x="-45" y="-18" width="90" height="36" fill="#DBF34D" stroke="#111" strokeWidth="3" />
                <text y="5" textAnchor="middle" className="text-[11px] font-black uppercase tracking-wider font-sans">CENTRAL SILO</text>
              </g>
            </svg>

            {/* Legend Indicators */}
            <div className="flex justify-between items-center bg-white px-2.5 py-1.5 neo-border text-[9px] font-mono uppercase font-bold text-neutral-700">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-neutral-900 border" /> Standard Path</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#DBF34D] border" /> Bypass Route</span>
              {simulationActive ? (
                <span className="flex items-center gap-1 text-red-600 animate-pulse"><span className="w-2 h-2 rounded-full bg-red-600" /> Crisis Mode: Active Flooding</span>
              ) : (
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Clear</span>
              )}
            </div>

          </div>

          {/* Route details list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {routes.map((rt) => {
              const statusColors = 
                rt.status === 'Clear' ? 'bg-emerald-100 text-emerald-950 border-emerald-400' :
                rt.status === 'Rerouted' ? 'bg-[#DBF34D]/30 border-neutral-900' :
                'bg-red-50 text-red-900 border-red-500 font-bold';

              return (
                <div key={rt.id} className="p-2.5 bg-neutral-50 neo-border text-[11px] flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-extrabold text-neutral-900">{rt.id}: {rt.source} ➔ {rt.destination}</span>
                    <span className={`px-1 rounded-none text-[8px] font-mono font-black uppercase border ${statusColors}`}>
                      {rt.status}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono font-bold text-neutral-500 text-[10px]">
                    <span>Dist: {rt.distanceKm} km</span>
                    <span>Threat: {rt.currentRisk}%</span>
                  </div>
                  {rt.alternativeWay && rt.status !== 'Clear' && (
                    <div className="bg-white px-1.5 py-0.5 border border-dashed border-neutral-400 text-[9px] font-bold text-neutral-800 mt-1.5">
                      🔄 Detour: {rt.alternativeWay}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}
