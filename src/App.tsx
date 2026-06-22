import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Layers, Compass, HelpCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnalyticsPanel from './components/AnalyticsPanel';
import IntakeForm from './components/IntakeForm';
import DispatchQueue from './components/DispatchQueue';
import FleetPlanner from './components/FleetPlanner';
import AdvisoryPanel from './components/AdvisoryPanel';
import ActivityLogs from './components/ActivityLogs';
import DataSummaryExport from './components/DataSummaryExport';
import { DispatchRequest, Vehicle, RouteInfo, SystemLog, DashboardMetrics, WeatherInfo } from './types';

// Default static presets for sandbox deployment preview
const DEFAULT_REQUESTS: DispatchRequest[] = [
  {
    id: "REQ-4401",
    farmerName: "Rajesh Prasad Sen",
    village: "Ramapuram Sector 2",
    cropType: "Tomatoes (Sensitive)",
    quantity: 4.5,
    urgency: "CRITICAL",
    pickupTime: "15:30 Today",
    status: "Pending",
    riskPercent: 32,
    createdAt: "14:15:02"
  },
  {
    id: "REQ-9210",
    farmerName: "Smt. Sunita Rao",
    village: "Shaktigarh Cross",
    cropType: "Onions (Bulk Bulb)",
    quantity: 8.0,
    urgency: "High",
    pickupTime: "17:00 Today",
    status: "Assigned",
    riskPercent: 24,
    assignedVehicleId: "FL-091",
    assignedRoute: "RT-102: Shaktigarh to CENTRAL SILO",
    createdAt: "13:40:11"
  },
  {
    id: "REQ-1012",
    farmerName: "Devinder Singh Gill",
    village: "Kheri Delta",
    cropType: "Basmati Rice (Grain)",
    quantity: 12.0,
    urgency: "Normal",
    pickupTime: "09:00 Tomorrow",
    status: "In Transit",
    riskPercent: 12,
    assignedVehicleId: "FL-402",
    assignedRoute: "RT-103: Kheri Delta to CENTRAL SILO",
    createdAt: "11:20:59"
  },
  {
    id: "REQ-3004",
    farmerName: "Amrit Gill",
    village: "Nabha West",
    cropType: "Kharif Cotton Bales",
    quantity: 5.5,
    urgency: "Normal",
    pickupTime: "11:00 Tomorrow",
    status: "Rescued",
    riskPercent: 10,
    assignedVehicleId: "FL-883",
    assignedRoute: "Bypass Central Corridor",
    createdAt: "10:00:30"
  }
];

const DEFAULT_VEHICLES: Vehicle[] = [
  {
    id: "FL-091",
    type: "6-Ton Tata Truck",
    capacity: 6.0,
    driverName: "Gurcharan Singh",
    driverPhone: "+91 98765 43210",
    status: "Dispatched",
    currentLocation: "RT-102 Corridor"
  },
  {
    id: "FL-402",
    type: "4-Ton Mahindra PickUp",
    capacity: 4.0,
    driverName: "Rajesh Kumar",
    driverPhone: "+91 94451 88902",
    status: "Dispatched",
    currentLocation: "RT-103 Corridor"
  },
  {
    id: "FL-883",
    type: "8-Ton Eicher Heavy",
    capacity: 8.0,
    driverName: "Bikramjit Singh",
    driverPhone: "+91 91234 56789",
    status: "Ready",
    currentLocation: "Central Silo Hub"
  },
  {
    id: "FL-112",
    type: "3-Ton Bolero Camper",
    capacity: 3.0,
    driverName: "Amit Sharma",
    driverPhone: "+91 99887 76655",
    status: "Ready",
    currentLocation: "Substation East Sector"
  }
];

const DEFAULT_ROUTES: RouteInfo[] = [
  {
    id: "RT-101",
    source: "Ramapuram Sector 2",
    destination: "CENTRAL SILO",
    distanceKm: 28,
    baseRisk: 15,
    currentRisk: 15,
    status: "Clear"
  },
  {
    id: "RT-102",
    source: "Shaktigarh Cross",
    destination: "CENTRAL SILO",
    distanceKm: 45,
    baseRisk: 30,
    currentRisk: 30,
    status: "Clear",
    alternativeWay: "Highway 9 Bypass Corridor"
  },
  {
    id: "RT-103",
    source: "Kheri Delta",
    destination: "CENTRAL SILO",
    distanceKm: 60,
    baseRisk: 20,
    currentRisk: 20,
    status: "Clear"
  },
  {
    id: "RT-104",
    source: "Nabha West",
    destination: "CENTRAL SILO",
    distanceKm: 15,
    baseRisk: 10,
    currentRisk: 10,
    status: "Clear"
  }
];

const DEFAULT_LOGS: SystemLog[] = [
  {
    id: "L-1",
    timestamp: "14:48:10",
    category: "System",
    message: "System initialized.",
    type: "success"
  },
  {
    id: "L-2",
    timestamp: "14:49:02",
    category: "Routing",
    message: "Checked road humidity. Routes are dry.",
    type: "info"
  },
  {
    id: "L-3",
    timestamp: "14:50:45",
    category: "Workflow",
    message: "Logged new registration for Rajesh Prasad Sen (REQ-4401).",
    type: "warning"
  }
];

export default function App() {
  // Master states loaded lazily from standard localStorage
  const [queue, setQueue] = useState<DispatchRequest[]>(() => {
    const raw = localStorage.getItem('agropulse_queue');
    return raw ? JSON.parse(raw) : DEFAULT_REQUESTS;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const raw = localStorage.getItem('agropulse_vehicles');
    return raw ? JSON.parse(raw) : DEFAULT_VEHICLES;
  });

  const [routes, setRoutes] = useState<RouteInfo[]>(() => {
    const raw = localStorage.getItem('agropulse_routes');
    return raw ? JSON.parse(raw) : DEFAULT_ROUTES;
  });

  const [logs, setLogs] = useState<SystemLog[]>(() => {
    const raw = localStorage.getItem('agropulse_logs');
    return raw ? JSON.parse(raw) : DEFAULT_LOGS;
  });

  const [simulationActive, setSimulationActive] = useState<boolean>(() => {
    const raw = localStorage.getItem('agropulse_sim_active');
    return raw ? JSON.parse(raw) === 'true' : false;
  });

  const [weather, setWeather] = useState<WeatherInfo>(() => {
    try {
      const raw = localStorage.getItem('agropulse_weather');
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      temperature: 32.4,
      humidity: 82,
      precipitation: 0.0,
      weatherCode: 3,
      condition: "Partly Cloudy",
      locationName: "Noida Hub",
      isLive: false
    };
  });

  // Keep metrics calculated reactively based on queue and simulation active
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    spoilageRisk: 14,
    fleetUtilization: 45,
    pendingDispatches: 3,
    safeReroutes: 2
  });

  // Sync state variables with Local Storage
  useEffect(() => {
    localStorage.setItem('agropulse_queue', JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem('agropulse_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('agropulse_routes', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('agropulse_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('agropulse_sim_active', String(simulationActive));
  }, [simulationActive]);

  useEffect(() => {
    localStorage.setItem('agropulse_weather', JSON.stringify(weather));
  }, [weather]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=28.5355&longitude=77.3910&current=temperature_2m,relative_humidity_2m,precipitation,weather_code");
        if (!res.ok) throw new Error("Status failed");
        const data = await res.json();
        
        const current = data?.current;
        if (current) {
          const temp = current.temperature_2m;
          const humid = current.relative_humidity_2m;
          const precip = current.precipitation;
          const code = current.weather_code;
          
          let cond = "High Cloud Density";
          if (code === 0) cond = "Clear Sky";
          else if (code >= 1 && code <= 3) cond = "Partly Cloudy";
          else if (code === 45 || code === 48) cond = "Foggy Weather";
          else if (code >= 51 && code <= 55) cond = "Light Tropical Drizzle";
          else if (code >= 61 && code <= 65) cond = "Heavy Monsoon Rain";
          else if (code >= 80 && code <= 82) cond = "Active Monsoon Showers";
          else if (code >= 95) cond = "Thunderstorm Disruption Alert";
          
          const newWeather: WeatherInfo = {
            temperature: temp,
            humidity: humid,
            precipitation: precip,
            weatherCode: code,
            condition: cond,
            locationName: "Noida Hub",
            isLive: true
          };
          setWeather(newWeather);
          addSystemLog('System', `Synced live weather: ${temp}°C, ${humid}% humidity, ${cond}.`, 'success');
        }
      } catch (err) {
        console.warn("Could not fetch meteorological data from Open-Meteo API.", err);
      }
    };
    
    fetchWeather();
  }, []);

  // Recalculate metrics when state elements adapt
  useEffect(() => {
    const pendingCount = queue.filter(q => q.status === 'Pending').length;
    const assignedCount = queue.filter(q => q.status === 'Assigned' || q.status === 'In Transit').length;
    
    // Base defaults
    let sRisk = simulationActive ? 79 : 14;
    let utilization = assignedCount > 0 ? Math.min(Math.round((assignedCount / vehicles.length) * 100), 100) : 10;
    if (simulationActive) {
      utilization = Math.min(utilization + 30, 95);
    }
    const safeReroutesCount = queue.filter(q => q.status === 'Rescued' || q.status === 'Completed').length + (simulationActive ? 12 : 2);

    setMetrics({
      spoilageRisk: sRisk,
      fleetUtilization: utilization,
      pendingDispatches: pendingCount,
      safeReroutes: safeReroutesCount
    });
  }, [queue, vehicles, simulationActive]);

  // Utility to obtain current timestamp formatted easily
  const getFormattedTime = () => {
    const d = new Date();
    return d.toTimeString().split(' ')[0];
  };

  // Helper log registrar
  const addSystemLog = (category: SystemLog['category'], message: string, type: SystemLog['type'] = 'info') => {
    const newLog: SystemLog = {
      id: `L-${Date.now()}`,
      timestamp: getFormattedTime(),
      category,
      message,
      type
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // ☔ Toggle monsoon deluge simulation shock
  const handleToggleSimulation = () => {
    const nextSimActive = !simulationActive;
    setSimulationActive(nextSimActive);

    if (nextSimActive) {
      // Activating Heavy Monsoon weather
      addSystemLog('Alerts', "☔ Monsoon shock active: 140mm rainfall simulated.", 'error');
      addSystemLog('Routing', "⚠️ Road alert: RT-101 and RT-102 reported flooded. Rerouting.", 'warning');
      addSystemLog('System', "💡 Computing detour routes through dry bypass corridors.", 'info');

      // Update route conditions
      setRoutes(prev => prev.map(r => {
        if (r.id === 'RT-101' || r.id === 'RT-102') {
          return { ...r, currentRisk: 92, status: 'Flooded / Blocked' };
        }
        return { ...r, currentRisk: Math.min(r.baseRisk + 35, 90) };
      }));

      // Elevate spoilage values on open items
      setQueue(prev => prev.map(q => {
        if (q.status === 'Pending' || q.status === 'Assigned') {
          return { ...q, riskPercent: Math.min(q.riskPercent + 45, 95) };
        }
        return q;
      }));

      // Trigger vehicle block stuck sequence
      setVehicles(prev => prev.map(v => {
        if (v.id === 'FL-112') {
          return { ...v, status: 'Stuck', currentLocation: 'RT-101 Sector A Blocked' };
        }
        return v;
      }));
      addSystemLog('Alerts', "🚚 Status alert: Bolero FL-112 is reporting deep water. Status: Stuck.", 'error');

    } else {
      // De-activating simulation (returning to normal)
      addSystemLog('System', "❇️ Skies cleared. Standard route parameters restored.", 'success');
      addSystemLog('Routing', "❇️ Roadways clear. Standard lanes reopen.", 'success');

      // Reset routes to normal base levels
      setRoutes(DEFAULT_ROUTES);

      // Restore base risk parameters
      setQueue(prev => prev.map(q => ({
        ...q,
        riskPercent: q.urgency === 'CRITICAL' ? 32 : q.urgency === 'High' ? 24 : 12
      })));

      // Recover stuck vehicles
      setVehicles(prev => prev.map(v => {
        if (v.status === 'Stuck') {
          return { ...v, status: 'Ready', currentLocation: 'Central Silo Hub' };
        }
        return v;
      }));
    }
  };

  // Add new request intake form
  const handleAddRequest = (reqData: Omit<DispatchRequest, 'id' | 'status' | 'riskPercent' | 'createdAt'>) => {
    const id = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const baseRisk = reqData.urgency === 'CRITICAL' ? 65 : reqData.urgency === 'High' ? 35 : 15;
    const finalRisk = simulationActive ? Math.min(baseRisk + 30, 95) : baseRisk;

    const newReq: DispatchRequest = {
      ...reqData,
      id,
      status: 'Pending',
      riskPercent: finalRisk,
      createdAt: getFormattedTime()
    };

    setQueue(prev => [newReq, ...prev]);
    addSystemLog('Workflow', `Logged registration for ${reqData.farmerName} (${reqData.cropType}) - ${reqData.quantity} tons.`, 'success');
  };

  // Update dispatch status
  const handleUpdateRequestStatus = (requestId: string, status: DispatchRequest['status']) => {
    setQueue(prev => prev.map(q => {
      if (q.id === requestId) {
        addSystemLog('Workflow', `Order [${requestId}] moved to status: ${status}.`, 'info');
        
        // Free up trucks on dropoff
        if ((status === 'Completed' || status === 'Rescued') && q.assignedVehicleId) {
          setVehicles(vPrev => vPrev.map(v => {
            if (v.id === q.assignedVehicleId) {
              return { ...v, status: 'Ready', currentLocation: 'Central Silo Hub' };
            }
            return v;
          }));
          addSystemLog('System', `Truck ${q.assignedVehicleId} finished dropoff and returned to pool.`, 'success');
        }

        return { ...q, status };
      }
      return q;
    }));
  };

  // Assign vehicle and route
  const handleAssignVehicle = (requestId: string, vehicleId: string, routeId: string) => {
    const targetRoute = routes.find(r => r.id === routeId);
    const routeText = targetRoute ? `${targetRoute.id}: ${targetRoute.source} to ${targetRoute.destination}` : 'Bypass Route';

    setQueue(prev => prev.map(q => {
      if (q.id === requestId) {
        return {
          ...q,
          status: 'Assigned',
          assignedVehicleId: vehicleId,
          assignedRoute: routeText
        };
      }
      return q;
    }));

    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        return { ...v, status: 'Dispatched', currentLocation: `Transit on ${routeId}` };
      }
      return v;
    }));

    addSystemLog('Routing', `Assigned truck ${vehicleId} to [${requestId}] via ${routeId}.`, 'success');
  };

  // Flag truck for maintenance
  const handleSetVehicleMaintenance = (vehicleId: string) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        addSystemLog('System', `Truck ${vehicleId} flagged for maintenance window.`, 'warning');
        return { ...v, status: 'Maintenance', currentLocation: 'Workshops Sector 5' };
      }
      return v;
    }));
  };

  // Return truck to ready pool
  const handleRestoreVehicleReady = (vehicleId: string) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        addSystemLog('System', `Truck ${vehicleId} cleared service check. Return to standby.`, 'success');
        return { ...v, status: 'Ready', currentLocation: 'Central Silo Hub' };
      }
      return v;
    }));
  };

  // Wipe state and restart
  const handleResetData = () => {
    if (confirm("Reset all queue history and restore defaults?")) {
      setQueue(DEFAULT_REQUESTS);
      setVehicles(DEFAULT_VEHICLES);
      setRoutes(DEFAULT_ROUTES);
      setLogs(DEFAULT_LOGS);
      setSimulationActive(false);
      localStorage.clear();
      addSystemLog('System', "Silo database reset to baseline presets.", 'success');
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-neutral-900 pb-16">
      
      {/* 1. Navbar */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <Navbar simulationActive={simulationActive} />
      </div>

      {/* Primary Grid Layout */}
      <main className="max-w-7xl mx-auto px-4">
        
        {/* 2. Hero Section */}
        <Hero 
          simulationActive={simulationActive} 
          onToggleSimulation={handleToggleSimulation} 
          onResetData={handleResetData} 
        />

        {/* 3. Metrics Overview Card Row */}
        <AnalyticsPanel 
          metrics={metrics} 
          simulationActive={simulationActive} 
          totalRequests={queue.length}
          assignedRequests={queue.filter(q => q.status === 'Assigned' || q.status === 'In Transit').length}
          weather={weather}
        />

        {/* 4. Advisory Column */}
        <AdvisoryPanel 
          metrics={metrics} 
          queue={queue} 
          routes={routes} 
          simulationActive={simulationActive} 
        />

        {/* 5. Split Command desks: Intake Left, System Logs Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <IntakeForm onAddRequest={handleAddRequest} />
          <ActivityLogs logs={logs} onClearLogs={handleClearLogs} />
        </div>

        {/* 6. Active dispatch commands desk */}
        <div className="mb-8">
          <DispatchQueue 
            queue={queue} 
            vehicles={vehicles} 
            routes={routes} 
            simulationActive={simulationActive} 
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onAssignVehicle={handleAssignVehicle}
          />
        </div>

        {/* 7. Fleet management dashboard & interactive SVG road map */}
        <FleetPlanner 
          vehicles={vehicles} 
          routes={routes} 
          simulationActive={simulationActive} 
          onSetVehicleMaintenance={handleSetVehicleMaintenance}
          onRestoreVehicleReady={handleRestoreVehicleReady}
        />

        {/* 8. Export metrics ledger section */}
        <DataSummaryExport 
          queue={queue} 
          vehicles={vehicles} 
          routes={routes} 
          simulationActive={simulationActive} 
        />

      </main>

      {/* Compact footer */}
      <footer className="text-center font-mono text-[10px] text-neutral-400 max-w-7xl mx-auto border-t border-dashed border-neutral-300 pt-6 px-4">
        AGROPULSE OPERATIONS GATEWAY // RURAL LOGISTICS AUTOMATION COOPERATIVE DESK CENTRAL • UTC 2026
      </footer>

    </div>
  );
}
