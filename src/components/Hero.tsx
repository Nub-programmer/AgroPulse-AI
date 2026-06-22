import React from 'react';
import { RefreshCw, Flame, Navigation, AlertOctagon } from 'lucide-react';

interface HeroProps {
  simulationActive: boolean;
  onToggleSimulation: () => void;
  onResetData: () => void;
}

export default function Hero({ simulationActive, onToggleSimulation, onResetData }: HeroProps) {
  return (
    <div className="w-full neo-border bg-white neo-shadow-lg p-6 mb-8 flex flex-col md:flex-row items-stretch justify-between gap-6 relative overflow-hidden">
      {/* Decorative background grid node spacing */}
      <div className="absolute right-0 top-0 w-24 h-24 bg-[#DBF34D]/20 -skew-x-12 translate-x-8 -translate-y-8 neo-border border-dashed pointer-events-none"></div>

      {/* Hero Core Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <span className="inline-block bg-neutral-900 text-[#DBF34D] font-mono text-xs uppercase font-extrabold tracking-widest px-2.5 py-1 mb-3 neo-border">
            AgroPulse UI // Build 1.0.4
          </span>
          <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-neutral-900 leading-none mb-3">
            Cooperative Harvest Dispatch & Risk Advisory Engine
          </h1>
          <p className="text-sm md:text-base text-neutral-700 leading-relaxed max-w-2xl font-medium">
            Route bulk crops, calculate weather-induced spoilage hazard, and dispatch trucks during heavy monsoon events.
          </p>
          <div className="mt-2 text-xs font-mono font-bold text-neutral-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neutral-950"></span>
            <span>Made by Atharv Singh Negi, JPS Noida</span>
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#requests"
            className="px-5 py-3 bg-[#DBF34D] text-black font-black uppercase text-sm flex items-center gap-2 neo-border neo-shadow-sm neo-btn-press hover:bg-lime-400"
          >
            <Navigation className="w-4 h-4" />
            <span>Open Intake Desk</span>
          </a>

          <button
            onClick={onResetData}
            title="Restore default database preset values"
            className="px-4 py-3 bg-white text-black font-bold uppercase text-sm flex items-center gap-2 neo-border neo-shadow-sm neo-btn-press hover:bg-neutral-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Database Preset</span>
          </button>
        </div>

        <p className="mt-4 text-[11px] font-medium text-neutral-500 font-mono">
          * Note: Helps operators manage vehicle volume, bypass road water traps, and complete safe reroutings.
        </p>
      </div>

      {/* Simulator Quick Box */}
      <div className={`md:w-[340px] flex flex-col justify-between p-5 neo-border relative transition-colors ${
        simulationActive ? 'bg-red-50 text-red-950 border-red-600' : 'bg-neutral-50 border-neutral-950'
      }`}>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            {simulationActive ? (
              <Flame className="w-6 h-[#111] text-red-600 animate-bounce" />
            ) : (
              <AlertOctagon className="w-5 h-5 text-neutral-700" />
            )}
            <h3 className="font-extrabold text-base uppercase font-sans tracking-wide">
              {simulationActive ? 'STATUS: MONSOON DELUGE' : 'CLIMATE SHOCK CONTROL'}
            </h3>
          </div>
          <p className="text-xs leading-relaxed font-semibold text-neutral-600">
            {simulationActive
              ? 'Heavy monsoon active. Multiple roads are flooded, spoilage hazard has peaked, and trucks are being routed to bypass paths.'
              : 'Toggle a mock monsoonal deluge to test how the routing model handles flooded highways, crop decay spikes, and vehicle rerouting.'}
          </p>
        </div>

        <button
          onClick={onToggleSimulation}
          className={`w-full py-3 neo-border neo-shadow-sm font-black uppercase text-sm text-center tracking-wider neo-btn-press ${
            simulationActive
              ? 'bg-red-600 text-white hover:bg-red-500 border-red-900 shadow-red-900'
              : 'bg-black text-[#DBF34D] hover:bg-neutral-800'
          }`}
        >
          {simulationActive ? '🛑 Disable Monsoon Shock' : '☔ Simulate Monsoon Shock'}
        </button>
      </div>
    </div>
  );
}
