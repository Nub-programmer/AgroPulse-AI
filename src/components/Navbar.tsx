import React from 'react';
import { ShieldAlert, Github, ExternalLink, Cpu, User } from 'lucide-react';

interface NavbarProps {
  simulationActive: boolean;
}

export default function Navbar({ simulationActive }: NavbarProps) {
  return (
    <header className="w-full neo-border bg-white neo-shadow p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Logo, Version, and Status */}
      <div className="flex items-center gap-4 flex-wrap select-none">
        <div className="bg-[#DBF34D] text-black px-4 py-2 neo-border neo-shadow-sm font-black text-xl tracking-tight flex items-center gap-2">
          <Cpu className="w-6 h-6 animate-pulse" />
          <span>AGROPULSE <span className="font-light">AI</span></span>
        </div>

        {/* Version Pill */}
        <span className="bg-neutral-900 text-[#DBF34D] text-xs font-black px-2.5 py-1.5 neo-border font-mono">
          Version 1.04
        </span>
        
        {simulationActive ? (
          <div className="bg-red-500 text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 neo-border flex items-center gap-1.5 animate-bounce">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            <span>CRITICAL FLOOD ALERT: SIMULATION ON</span>
          </div>
        ) : (
          <div className="bg-[#DBF34D] text-black font-bold text-xs uppercase tracking-wider px-3 py-1.5 neo-border flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>MONSOON SYSTEM STABLE</span>
          </div>
        )}

        {/* Clean Author Line */}
        <div className="bg-white text-black text-xs font-bold px-3 py-1.5 neo-border flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-neutral-700" />
          <span>Made by Atharv Singh Negi, JPS Noida</span>
        </div>
      </div>

      {/* Navigation Quick Info & Operations Badges */}
      <div className="flex items-center gap-3 font-medium text-sm flex-wrap">
        <a href="#dashboard" className="px-3 py-1 bg-white hover:bg-neutral-100 cursor-pointer neo-border neo-shadow-sm font-bold text-xs uppercase">
          Live Desk
        </a>
        <a href="#requests" className="px-3 py-1 bg-white hover:bg-neutral-100 cursor-pointer neo-border neo-shadow-sm font-bold text-xs uppercase">
          Intake Desk
        </a>
        <a href="#fleet" className="px-3 py-1 bg-white hover:bg-neutral-100 cursor-pointer neo-border neo-shadow-sm font-bold text-xs uppercase">
          Fleet & Spatial Route
        </a>
        <a href="#advisory" className="px-3 py-1 bg-white hover:bg-neutral-100 cursor-pointer neo-border neo-shadow-sm font-bold text-xs uppercase">
          AI Advisory
        </a>

        <div className="h-6 w-[2px] bg-neutral-950 hidden sm:block mx-1"></div>

        {/* Action buttons on the right */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Nub-programmer/AgroPulse-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-neutral-900 text-white px-3 py-1.5 neo-border neo-shadow-sm text-xs font-bold uppercase transition-all hover:bg-neutral-800"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <button
            onClick={() => alert("System is fully initialized and operational.")}
            className="flex items-center gap-1 bg-[#DBF34D] text-black px-3 py-1.5 neo-border neo-shadow-sm text-xs font-bold uppercase transition-all hover:bg-lime-400"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Deploy</span>
          </button>
        </div>
      </div>
    </header>
  );
}
