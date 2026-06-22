# -*- coding: utf-8 -*-
"""
AgroPulse AI - Machine Learning Pipeline
Part 1: Synthetic Dataset Generator for Cooperative Harvest Logistics Prototyping
Author: Atharv Singh Negi, JPS Noida
Version: 1.04
"""

import os
import random
import numpy as np
import pandas as pd

def generate_synthetic_harvest_data(num_records=5000, seed=42):
    """
    Generates a realistic dataset representing historical harvest dispatch records.
    Features model variables representing weather state, crop characteristics,
    vehicle types, and historical hazards to predict pickup delays and spoilage.
    """
    np.random.seed(seed)
    random.seed(seed)
    
    # 1. Feature Dimensions
    crops = {
        'Tomatoes (Sensitive)': {'vulerability': 0.9, 'shelf_life_hours': 36},
        'Onions (Bulk Bulb)': {'vulerability': 0.4, 'shelf_life_hours': 144},
        'Basmati Rice (Grain)': {'vulerability': 0.15, 'shelf_life_hours': 720},
        'Kharif Cotton Bales': {'vulerability': 0.1, 'shelf_life_hours': 1200}
    }
    
    vehicles = {
        '6-Ton Tata Truck': {'capacity': 6.0, 'reliability_index': 0.95},
        '4-Ton Mahindra PickUp': {'capacity': 4.0, 'reliability_index': 0.90},
        '8-Ton Eicher Heavy': {'capacity': 8.0, 'reliability_index': 0.92},
        '3-Ton Bolero Camper': {'capacity': 3.0, 'reliability_index': 0.85}
    }
    
    cities_corridors = [
        'Ramapuram Sector 2',
        'Shaktigarh Cross',
        'Kheri Delta',
        'Nabha West'
    ]
    
    data = []
    
    for i in range(num_records):
        crop = random.choice(list(crops.keys()))
        vehicle = random.choice(list(vehicles.keys()))
        village = random.choice(cities_corridors)
        
        # Environmental and Weather conditions
        temperature = round(float(np.random.normal(31.0, 4.0)), 1)
        humidity = round(float(np.random.normal(78.0, 10.0)), 1)
        humidity = max(10.0, min(100.0, humidity)) # clamp values
        
        # Rainfall / Monsoon precipitation (mm)
        is_monsoon_disrupted = random.random() < 0.35 # 35% probability of monsoon crisis
        if is_monsoon_disrupted:
            precipitation = round(float(np.random.normal(110.0, 25.0)), 1)
            precipitation = max(50.0, precipitation)
            road_accessibility = round(float(np.random.uniform(0.1, 0.45)), 2) # heavily blocked
        else:
            precipitation = round(float(np.random.exponential(15.0)), 1)
            road_accessibility = round(float(np.random.uniform(0.7, 1.0)), 2) # clear road access
            
        distance_km = round(float(np.random.uniform(10.0, 75.0)), 1)
        quantity_tons = round(float(np.random.uniform(2.0, 15.0)), 1)
        
        # Historical vehicle delay rate (percentage of tardiness records)
        historical_delay_rate = round(float(np.random.normal(0.12, 0.05) if 'Mahindra' in vehicle else np.random.normal(0.08, 0.03)), 3)
        historical_delay_rate = max(0.01, historical_delay_rate)
        
        # 2. Latent Calculation Functions (Real ML target generation with noise)
        # Target A: Actual Pickup Delay (Hours)
        base_delay = 1.2
        weather_delay_factor = (precipitation / 12.0) * (1.0 - road_accessibility)
        distance_delay_factor = (distance_km / 25.0)
        vehicle_delay_factor = (1.0 - vehicles[vehicle]['reliability_index']) * 10
        noise_delay = np.random.normal(0.0, 0.4)
        
        actual_pickup_delay_hours = max(0.0, base_delay + weather_delay_factor + distance_delay_factor + vehicle_delay_factor + noise_delay)
        
        # Convert actual delay to binary classification flag for delay warning (Delay > 3 hours)
        is_pickup_delayed = 1 if actual_pickup_delay_hours > 3.0 else 0
        
        # Target B: Spoilage Risk Probability (%)
        shelf_life = crops[crop]['shelf_life_hours']
        vulnerability = crops[crop]['vulerability']
        
        # Exposure duration before secure silo delivery
        total_exposure_hours = actual_pickup_delay_hours + (distance_km / 35.0) # assuming average 35km/h speed
        
        # Rain exposure elevates humidity/wetness spoilage rapidly for sensitive crops
        moisture_spoil_modifier = 1.0 + (precipitation / 50.0) * vulnerability
        temp_modifier = 1.0 + max(0, temperature - 28) * 0.05
        
        spoilage_index = (total_exposure_hours / shelf_life) * moisture_spoil_modifier * temp_modifier
        spoilage_prob = min(1.0, max(0.0, spoilage_index))
        
        # Binary Classification Target: Spoilage Risk Flag (Risk Prob > 0.40)
        has_spoilage_incident = 1 if (spoilage_prob + np.random.normal(0.0, 0.08)) > 0.40 else 0
        
        data.append({
            'record_id': f"REC-{100000+i}",
            'farmer_village': village,
            'crop_type': crop,
            'quantity_tons': quantity_tons,
            'distance_km': distance_km,
            'temperature_c': temperature,
            'humidity_percent': humidity,
            'precipitation_mm': precipitation,
            'road_accessibility_score': road_accessibility,
            'vehicle_type': vehicle,
            'historical_delay_rate': historical_delay_rate,
            'actual_pickup_delay_hours': round(actual_pickup_delay_hours, 2),
            'is_pickup_delayed': is_pickup_delayed,
            'spoilage_risk_probability': round(spoilage_prob * 100, 1),
            'has_spoilage_incident': has_spoilage_incident
        })
        
    df = pd.DataFrame(data)
    return df

if __name__ == "__main__":
    print("=== AgroPulse AI Synthetic Data Engine ===")
    out_dir = os.path.dirname(os.path.abspath(__file__)) if '__file__' in locals() else './'
    os.makedirs(out_dir, exist_ok=True)
    
    csv_path = os.path.join(out_dir, "cooperative_harvest_logistics.csv")
    print(f"Generating 5,000 highly structured research-grade simulation records...")
    df = generate_synthetic_harvest_data(5000)
    df.to_csv(csv_path, index=False)
    
    print(f"Success! Historical ML dataset saved to: {csv_path}")
    print(df.head(4))
