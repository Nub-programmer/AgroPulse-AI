import React, { useState } from 'react';
import { Download, Clipboard, CheckSquare, Shield, HelpCircle } from 'lucide-react';
import { DispatchRequest, Vehicle, RouteInfo } from '../types';

interface DataSummaryExportProps {
  queue: DispatchRequest[];
  vehicles: Vehicle[];
  routes: RouteInfo[];
  simulationActive: boolean;
}

export default function DataSummaryExport({ queue, vehicles, routes, simulationActive }: DataSummaryExportProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generates CSV of current state and triggers dynamic download
  const handleExportCSV = () => {
    setDownloading(true);
    try {
      const headers = ['Request ID', 'Farmer Name', 'Village Corridor', 'Crop Type', 'Quantity (Tons)', 'Urgency', 'Pickup Time', 'Status', 'Spoilage Risk %'];
      const rows = queue.map(r => [
        r.id,
        `"${r.farmerName.replace(/"/g, '""')}"`,
        `"${r.village}"`,
        `"${r.cropType}"`,
        r.quantity,
        r.urgency,
        `"${r.pickupTime}"`,
        r.status,
        r.riskPercent
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `agropulse_dispatch_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  // Copies condensed text summary to clipboard
  const handleCopySummary = () => {
    try {
      const totalTons = queue.reduce((acc, q) => acc + q.quantity, 0).toFixed(1);
      const activePending = queue.filter(q => q.status === 'Pending').length;
      
      const summaryText = `=== AGROPULSE AI DISPATCH SUMMARY ===
Monsoon Shock Mode: ${simulationActive ? 'CRITICAL DISRUPTION ACTIVE' : 'STANDARD SAFE MODE'}
Total Harvest Registered: ${totalTons} Metric Tons
Active Request Volume: ${queue.length} items (${activePending} pending dispatch)
Fleet Status: ${vehicles.filter(v => v.status === 'Ready').length} Trucks Standing By
=============================
Generated on AgroPulse operational node at ${new Date().toLocaleString()}`;

      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white neo-border neo-shadow p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="bg-[#DBF34D] p-2.5 border-2 border-neutral-950 text-black hidden sm:block shrink-0 shadow-sm">
          <CheckSquare className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-extrabold text-sm uppercase text-neutral-900 tracking-wider">
            Export & Generate Reports
          </h4>
          <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
            Download CSV spreadsheets or copy dispatch summaries to share with drivers.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <button
          onClick={handleExportCSV}
          disabled={downloading}
          className="flex-1 md:flex-none px-4 py-2.5 bg-neutral-900 text-white font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 neo-border neo-shadow-sm neo-btn-press hover:bg-neutral-800"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloading ? 'Compiling...' : 'Export CSV Report'}</span>
        </button>

        <button
          onClick={handleCopySummary}
          className="flex-1 md:flex-none px-4 py-2.5 bg-white text-neutral-900 font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 neo-border neo-shadow-sm neo-btn-press hover:bg-neutral-100"
        >
          <Clipboard className="w-3.5 h-3.5" />
          <span>{copied ? 'Summary Copied!' : 'Copy Summary'}</span>
        </button>
      </div>
    </div>
  );
}
