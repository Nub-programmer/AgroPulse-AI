export type UrgencyLevel = 'Normal' | 'High' | 'CRITICAL';
export type DispatchStatus = 'Pending' | 'Assigned' | 'In Transit' | 'Rescued' | 'Completed' | 'Spoiled';

export interface DispatchRequest {
  id: string;
  farmerName: string;
  village: string;
  cropType: string;
  quantity: number; // in tons
  urgency: UrgencyLevel;
  pickupTime: string;
  status: DispatchStatus;
  riskPercent: number;
  assignedVehicleId?: string;
  assignedRoute?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  type: string; // e.g., '6-Ton Tata Truck', '4-Ton Mahindra PickUp', '8-Ton Eicher'
  capacity: number; // in tons
  driverName: string;
  driverPhone: string;
  status: 'Ready' | 'Dispatched' | 'Maintenance' | 'Stuck';
  currentLocation: string;
}

export interface RouteInfo {
  id: string;
  source: string;
  destination: string;
  distanceKm: number;
  baseRisk: number; // percentage
  currentRisk: number; // percentage (updates during monsoon shock)
  status: 'Clear' | 'Heavy Rain' | 'Flooded / Blocked' | 'Rerouted';
  alternativeWay?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  category: 'System' | 'Alerts' | 'Routing' | 'Workflow';
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface DashboardMetrics {
  spoilageRisk: number;
  fleetUtilization: number;
  pendingDispatches: number;
  safeReroutes: number;
}

export interface WeatherInfo {
  temperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  condition: string;
  locationName: string;
  isLive: boolean;
}

