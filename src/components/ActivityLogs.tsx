import React, { useState } from 'react';
import { Terminal, Shield, Route, Layers, CheckCircle } from 'lucide-react';
import { SystemLog } from '../types';

interface ActivityLogsProps {
  logs: SystemLog[];
  onClearLogs: () => void;
}

type LogCategoryFilter = 'All' | 'Alerts' | 'Routing' | 'System' | 'Workflow';

export default function ActivityLogs({ logs, onClearLogs }: ActivityLogsProps) {
  const [filter, setFilter] = useState<LogCategoryFilter>('All');

  const filteredLogs = logs.filter(log => {
    if (filter === 'All') return true;
    if (filter === 'Workflow' && log.category === 'Workflow') return true;
    if (filter === 'Routing' && log.category === 'Routing') return true;
    if (filter === 'System' && log.category === 'System') return true;
    if (filter === 'Alerts' && log.category === 'Alerts') return true;
    return false;
  });

  const getLogStyle = (type: SystemLog['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-600 bg-red-50/50 border-red-200';
      case 'warning':
        return 'text-amber-600 bg-amber-50/50 border-amber-200';
      case 'success':
        return 'text-emerald-700 bg-emerald-50/50 border-emerald-200';
      default:
        return 'text-neutral-800 bg-neutral-100/30 border-neutral-200';
    }
  };

  return (
    <div className="p-5 bg-white neo-border neo-shadow h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b-3 border-neutral-950 pb-2 mb-3">
          <h3 className="font-extrabold text-base uppercase tracking-wider text-neutral-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-neutral-900" />
            Operational Event Log
          </h3>
          <button
            onClick={onClearLogs}
            className="text-[10px] font-bold uppercase px-2 py-0.5 hover:bg-neutral-100 neo-border"
          >
            Clear logs
          </button>
        </div>

        {/* Filter categories tabs */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {(['All', 'Alerts', 'Routing', 'System', 'Workflow'] as LogCategoryFilter[]).map((cat) => {
            const isSelected = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2 py-1 text-[10px] font-bold uppercase neo-border transition-all ${
                  isSelected 
                    ? 'bg-neutral-900 text-white shadow-none' 
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Chronological events ledger */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 select-text">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 font-mono text-[11px] font-bold">
              No events found for this filter.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div 
                key={log.id} 
                className={`p-2.5 neo-border border-dashed font-mono text-[11px] flex justify-between gap-3 ${getLogStyle(log.type)}`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] text-neutral-400 font-black">[{log.timestamp}]</span>
                    <span className="font-extrabold uppercase text-[9px] tracking-wide bg-white px-1 border border-neutral-400">
                      {log.category}
                    </span>
                  </div>
                  <span className="font-semibold">{log.message}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-dashed border-neutral-200 flex items-center justify-between text-[10px] font-mono font-bold text-neutral-500">
        <span>COOPERATIVE RADIO: ACTIVE</span>
        <span>SYS_STATUS: ONLINE</span>
      </div>
    </div>
  );
}
