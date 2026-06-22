import React from 'react';
import { ShieldAlert, Truck, Timer, Route, CheckCircle, CloudSun, MapPin } from 'lucide-react';
import { DashboardMetrics, WeatherInfo } from '../types';

interface AnalyticsPanelProps {
  metrics: DashboardMetrics;
  simulationActive: boolean;
  totalRequests: number;
  assignedRequests: number;
  weather: WeatherInfo;
}

export default function AnalyticsPanel({ metrics, simulationActive, totalRequests, assignedRequests, weather }: AnalyticsPanelProps) {
  return (
    <div className="w-full mb-8">
      <h2 className="text-xl font-black uppercase tracking-wider mb-4 inline-block bg-neutral-900 text-white px-3 py-1 neo-border">
        📊 Real-Time Operations Analytics
      </h2>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Card 1: Spoilage Risk index */}
        <div className={`p-4 bg-white neo-border neo-shadow flex flex-col justify-between transition-all ${
          metrics.spoilageRisk > 50 ? 'border-red-600 bg-red-50/30' : 'border-neutral-950'
        }`}>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs uppercase font-mono font-bold text-neutral-500">Spoilage Index</span>
              <ShieldAlert className={`w-5 h-5 ${metrics.spoilageRisk > 50 ? 'text-red-600 animate-pulse' : 'text-neutral-700'}`} />
            </div>
            <div className="text-3xl font-black font-sans leading-none flex items-baseline gap-1">
              <span className={metrics.spoilageRisk > 50 ? 'text-red-600' : 'text-neutral-900'}>
                {metrics.spoilageRisk}%
              </span>
              <span className="text-xs text-neutral-400 font-mono">avg</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-neutral-600 mt-2 font-sans">
            {simulationActive 
              ? '🚨 CRITICAL - Severe water threat to tomato & onion crops.' 
              : '✅ NORMAL - Safe atmospheric moisture index.'}
          </p>
        </div>

        {/* Card 2: Fleet Utilization */}
        <div className="p-4 bg-white neo-border neo-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs uppercase font-mono font-bold text-neutral-500">Active Trucks</span>
              <Truck className="w-5 h-5 text-neutral-700" />
            </div>
            <div className="text-3xl font-black font-sans leading-none flex items-baseline gap-1">
              <span>{metrics.fleetUtilization}%</span>
              <span className="text-xs text-neutral-400 font-mono">cap</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-neutral-600 mt-2">
            {assignedRequests} tracked vehicles dispatched to route segments.
          </p>
        </div>

        {/* Card 3: Pending Requests */}
        <div className="p-4 bg-white neo-border neo-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs uppercase font-mono font-bold text-neutral-500">Queue Volume</span>
              <Timer className="w-5 h-5 text-neutral-700" />
            </div>
            <div className="text-3xl font-black font-sans leading-none flex items-baseline gap-1">
              <span>{metrics.pendingDispatches}</span>
              <span className="text-xs text-neutral-400 font-mono">requests</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-neutral-600 mt-2">
            Remaining unfulfilled active farmer harvest requests.
          </p>
        </div>

        {/* Card 4: Safe Reroutes */}
        <div className="p-4 bg-[#DBF34D]/10 neo-border border-neutral-950 neo-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs uppercase font-mono font-bold text-neutral-500">Bypasses Managed</span>
              <Route className="w-5 h-5 text-neutral-700" />
            </div>
            <div className="text-3xl font-black font-sans leading-none flex items-baseline gap-1">
              <span className="text-neutral-900">{metrics.safeReroutes}</span>
              <span className="text-xs text-neutral-700 font-mono">reroutes</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-neutral-800 mt-2">
            Vehicles successfully bypass-routed away from flood blockages.
          </p>
        </div>

      </div>

      {/* Custom Neo-Brutalist Visual Progress Tracker Bento Row */}
      <div className="p-5 bg-white neo-border neo-shadow grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Bento Column 1: Spoilage Threat Breakdown */}
        <div className="flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-dashed border-neutral-200 pb-5 lg:pb-0 lg:pr-5">
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-wider mb-3 text-neutral-900 border-b-2 border-dashed border-neutral-300 pb-1.5 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-neutral-900 block rounded-full"></span>
              Commodity Vulnerability Index
            </h4>
            
            <div className="space-y-3">
              {/* Tomato Spoilage Gauge */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase mb-1 font-mono">
                  <span>Tomatoes (Sensitive)</span>
                  <span className={simulationActive ? "text-red-600" : "text-neutral-700"}>
                    {simulationActive ? "92% Threat" : "28% Safe"}
                  </span>
                </div>
                <div className="w-full h-4 bg-neutral-100 neo-border rounded-none overflow-hidden relative">
                  <div 
                    className={`h-full neo-border-r transition-all duration-700 ${simulationActive ? 'bg-red-500' : 'bg-[#DBF34D]'}`}
                    style={{ width: simulationActive ? '92%' : '28%' }}
                  ></div>
                </div>
              </div>

              {/* Onion Spoilage Gauge */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase mb-1 font-mono">
                  <span>Onions (Humidity Rot)</span>
                  <span className={simulationActive ? "text-red-500" : "text-neutral-700"}>
                    {simulationActive ? "74% Danger" : "18% Safe"}
                  </span>
                </div>
                <div className="w-full h-4 bg-neutral-100 neo-border rounded-none overflow-hidden relative">
                  <div 
                    className={`h-full neo-border-r transition-all duration-700 ${simulationActive ? 'bg-orange-500' : 'bg-lime-400'}`}
                    style={{ width: simulationActive ? '74%' : '18%' }}
                  ></div>
                </div>
              </div>

              {/* Rice/Wheat Spoilage Gauge */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase mb-1 font-mono">
                  <span>Grain Silo Buffer</span>
                  <span>{simulationActive ? "41% Storage Influx" : "10% Standard"}</span>
                </div>
                <div className="w-full h-4 bg-neutral-100 neo-border rounded-none overflow-hidden relative">
                  <div 
                    className="h-full bg-neutral-800 neo-border-r transition-all duration-700"
                    style={{ width: simulationActive ? '41%' : '10%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Column 2: Live Meteorological Intelligence (Open-Meteo API) */}
        <div className="flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-dashed border-neutral-200 pb-5 lg:pb-0 lg:pr-5">
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-wider mb-2.5 text-neutral-900 border-b-2 border-dashed border-neutral-300 pb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CloudSun className="w-4 h-4 text-neutral-900" />
                Live Hub Weather
              </span>
              <span className="inline-block bg-[#DBF34D] text-black font-mono text-[9px] font-black px-1.5 py-0.5 neo-border">
                {weather.isLive ? "● LIVE STATION" : "● AUTO SYNC"}
              </span>
            </h4>

            <div className="space-y-1.5 text-xs text-neutral-700 font-semibold">
              <div className="flex items-center gap-1 text-xs text-neutral-900 uppercase font-bold tracking-tight mb-1">
                <MapPin className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                <span>Noida Region Hub (IN)</span>
              </div>
              <div className="bg-neutral-50 p-2 neo-border">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Atmosphere</span>
                  <span className="font-mono text-[10px] tracking-wide text-neutral-900 p-0.5 px-1 bg-white neo-border">{weather.condition}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mt-1">
                  <div className="bg-white p-1 neo-border">
                    <span className="block font-mono text-[8.5px] text-neutral-400 font-semibold uppercase leading-tight">Temp</span>
                    <span className="font-bold text-neutral-900 text-sm leading-tight">{weather.temperature}°C</span>
                  </div>
                  <div className="bg-white p-1 neo-border">
                    <span className="block font-mono text-[8.5px] text-neutral-400 font-semibold uppercase leading-tight">Humid</span>
                    <span className="font-bold text-neutral-900 text-sm leading-tight">{weather.humidity}%</span>
                  </div>
                  <div className="bg-white p-1 neo-border">
                    <span className="block font-mono text-[8.5px] text-neutral-400 font-semibold uppercase leading-tight">Rain</span>
                    <span className="font-bold text-neutral-900 text-sm leading-tight">{weather.precipitation}mm</span>
                  </div>
                </div>
              </div>
              <p className="text-[10.5px] font-medium leading-relaxed my-1.5 text-neutral-500 italic">
                * Noida telemetry directly tunes spoilage parameters.
              </p>
            </div>
          </div>
        </div>

        {/* Bento Column 3: High-intensity Neo-Brutalist Vector Infographic */}
        <div className="p-4 bg-neutral-900 text-white flex flex-col justify-between h-full min-h-[170px] relative border-3 border-neutral-950">
          
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-10 text-white font-mono text-xs p-2 uppercase select-none">
            AGP-DECISION-MATRIX
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#DBF34D] bg-neutral-850 px-1.5 py-0.5 uppercase mb-1.5 inline-block neo-border">
              Vessel Distribution Matrix
            </span>
            <h5 className="font-black text-sm uppercase text-white mb-1">
              {simulationActive ? "⚡ SHIFT RESILIENCY ENGAGED" : "🌱 OPERATIONS UNDER CONTROL"}
            </h5>
            <p className="text-xs text-neutral-300 leading-relaxed font-semibold">
              {simulationActive
                ? `System operating at 85% emergency rerouting response speed. Critical grain silo reserves are protected under shelter directives. Alternate village express bypass route nodes are mapped.`
                : `Logistics network executing standard delivery loops. Farmer queues are processed within an average 2.4-hour window from pickup to silo delivery.`}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-800">
            <CheckCircle className="w-4 h-4 text-[#DBF34D]" />
            <span className="text-[11px] font-mono font-bold uppercase text-neutral-300">
              {simulationActive ? "AUTOMATED LOGISTICS FAILSAFE ONLINE" : "OPTIMAL DISPATCH FLUIDITY CAP"}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
