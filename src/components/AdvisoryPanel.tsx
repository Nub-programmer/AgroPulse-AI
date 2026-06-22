import React, { useState } from 'react';
import { Cpu, RefreshCcw, Clipboard, CheckCircle, HelpCircle } from 'lucide-react';
import { DashboardMetrics, DispatchRequest, RouteInfo } from '../types';

interface AdvisoryPanelProps {
  metrics: DashboardMetrics;
  queue: DispatchRequest[];
  routes: RouteInfo[];
  simulationActive: boolean;
}

export default function AdvisoryPanel({ metrics, queue, routes, simulationActive }: AdvisoryPanelProps) {
  const [loading, setLoading] = useState(false);
  const [advisoryText, setAdvisoryText] = useState<string | null>(null);
  const [engineSource, setEngineSource] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateAdvisory = async () => {
    setLoading(true);
    setAdvisoryText(null);
    setEngineSource(null);
    setCopied(false);

    try {
      const response = await fetch('/api/advisory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics,
          activeQueueSize: queue.filter(q => q.status === 'Pending' || q.status === 'Assigned' || q.status === 'In Transit').length,
          routes,
          simulationActive
        })
      });

      const data = await response.json();
      setAdvisoryText(data.advisory);
      setEngineSource(data.source);
    } catch (error) {
      console.error("Advisory error occurred", error);
      setAdvisoryText("[COMMUNICATIONS FAILURE] Could not reach the central AI controller. Emergency procedural directives suggest redirecting all vehicles away from major low-lying road networks.");
      setEngineSource("local-emergency-routine");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyClipboard = () => {
    if (advisoryText) {
      navigator.clipboard.writeText(advisoryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="advisory" className="bg-white neo-border neo-shadow p-5 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-3 border-neutral-950 pb-3 mb-4">
        <div>
          <span className="inline-block bg-neutral-900 text-[#DBF34D] font-mono text-[10px] font-black uppercase px-1.5 py-0.5 neo-border mb-1">
            Gemini Integration
          </span>
          <h3 className="font-extrabold text-base uppercase tracking-wider text-neutral-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-neutral-900" />
            Executive Advisor Insight Console
          </h3>
          <p className="text-xs font-semibold text-neutral-500 font-mono mt-0.5">
            Query the Gemini API with current stats to generate actionable dispatch advice.
          </p>
        </div>

        <button
          onClick={generateAdvisory}
          disabled={loading}
          className="px-4 py-2.5 bg-[#DBF34D] text-black font-black uppercase text-xs tracking-wider flex items-center gap-2 neo-border neo-shadow-sm neo-btn-press hover:bg-lime-400 disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Consulting Gemini...' : 'Generate New Advisory'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Col: State Payload representation */}
        <div className="lg:col-span-4 bg-neutral-50 p-4 neo-border flex flex-col justify-between">
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-neutral-800">
              Active State Properties
            </h4>
            <p className="text-[11px] leading-relaxed text-neutral-600 font-semibold">
              This structured JSON bundle represents current metrics forwarded to the model for inference.
            </p>

            <div className="bg-white p-2.5 neo-border font-mono text-[9px] text-neutral-500 space-y-1 select-all h-[100px] overflow-y-auto">
              <div>{"{"}</div>
              <div className="pl-3">"activeMetrics": {"{"}</div>
              <div className="pl-6">"spoilageRiskRating": {metrics.spoilageRisk},</div>
              <div className="pl-6">"fleetUtilizationCap": {metrics.fleetUtilization}</div>
              <div className="pl-3">{"},"}</div>
              <div className="pl-3">"dispatchedCargoSize": {queue.length},</div>
              <div className="pl-3">"simulatedClimateDisruption": {simulationActive ? "true" : "false"}</div>
              <div>{"}"}</div>
            </div>
          </div>

          <div className="mt-3 text-[10px] text-neutral-500 font-mono font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            STATE SCHEMATIC VALIDATED
          </div>
        </div>

        {/* Right Col: Response box */}
        <div className="lg:col-span-8 flex flex-col justify-between p-4 bg-neutral-900 border-3 border-neutral-950 neo-shadow text-white relative">
          
          {/* Subtle decoration */}
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-15 text-white font-mono text-xs p-2 uppercase select-none">
            AGP-DECISION-MATRIX
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 pb-1 border-b border-neutral-800">
              <span className="font-mono text-[10px] font-bold text-neutral-400">
                API RESPONSE // {engineSource ? engineSource.toUpperCase() : 'IDLE'}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold">READY</span>
              </div>
            </div>

            {loading ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full border-4 border-dashed border-[#DBF34D] animate-spin"></div>
                <p className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
                  Calling Gemini API...
                </p>
              </div>
            ) : advisoryText ? (
              <p className="text-sm font-semibold leading-relaxed font-sans text-neutral-100 pr-4 italic">
                "{advisoryText}"
              </p>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <Cpu className="w-10 h-10 text-neutral-600 mb-2 animate-pulse" />
                <p className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest max-w-md">
                  Awaiting input. Click 'Generate New Advisory' to get a logistical brief based on current metrics.
                </p>
              </div>
            )}
          </div>

          {advisoryText && !loading && (
            <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-neutral-400">
                gemini-3.5-flash // API key secured server-side
              </span>

              <button
                onClick={handleCopyClipboard}
                className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-neutral-900 font-bold uppercase text-[10px] neo-border flex items-center gap-1"
              >
                <Clipboard className="w-3 h-3" />
                <span>{copied ? 'Copied' : 'Copy Advisory'}</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
