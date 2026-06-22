# -*- coding: utf-8 -*-
"""
AgroPulse AI - Machine Learning Pipeline
Part 3: Production Inference Pipeline & Logistical Decision Optimizers
Author: Atharv Singh Negi, JPS Noida
Version: 1.04
"""

import os
import sys
import numpy as np
import pandas as pd
import joblib

class AgroPulseInferencePipeline:
    def __init__(self, models_dir=None):
        if models_dir is None:
            models_dir = os.path.dirname(os.path.abspath(__file__))
            
        self.delay_classifier_path = os.path.join(models_dir, 'pickup_delay_classifier.pkl')
        self.spoil_classifier_path = os.path.join(models_dir, 'spoil_risk_classifier.pkl')
        self.delay_regressor_path = os.path.join(models_dir, 'pickup_delay_regressor.pkl')
        
        self.has_real_models = (
            os.path.exists(self.delay_classifier_path) and
            os.path.exists(self.spoil_classifier_path) and
            os.path.exists(self.delay_regressor_path)
        )
        
        if self.has_real_models:
            try:
                self.delay_clf = joblib.load(self.delay_classifier_path)
                self.spoil_clf = joblib.load(self.spoil_classifier_path)
                self.delay_reg = joblib.load(self.delay_regressor_path)
                print("[AgroPulse ML Inference] Success: Loaded real scikit-learn models from pkl files.")
            except Exception as e:
                print(f"[AgroPulse ML Inference] Warning: Erred while loading joblib model dumps ({e}). Falling back onto deterministic heuristics optimizer.")
                self.has_real_models = False
        else:
            print("[AgroPulse ML Inference] Note: Pre-trained pkl models not found. Running high-precision mathematical model heuristic pipeline.")

    def run_prediction_and_optimization(self, input_features: dict) -> dict:
        """
        Accepts farmer request input features and calculates delay hours, spoilage risk,
        feature explainability levels, and optimized logistical suggestions.
        """
        # Feature extraction
        crop_type = input_features.get('crop_type', 'Tomatoes (Sensitive)')
        vehicle_type = input_features.get('vehicle_type', '6-Ton Tata Truck')
        distance_km = float(input_features.get('distance_km', 28.0))
        temperature_c = float(input_features.get('temperature_c', 32.4))
        humidity_percent = float(input_features.get('humidity_percent', 82.0))
        precipitation_mm = float(input_features.get('precipitation_mm', 140.0 if input_features.get('monsoon_sim', False) else 0.0))
        road_accessibility = float(input_features.get('road_accessibility_score', 0.15 if precipitation_mm > 50 else 0.95))
        historical_delay_rate = float(input_features.get('historical_delay_rate', 0.08))
        quantity_tons = float(input_features.get('quantity_tons', 4.5))
        
        # 1. Prediction execution
        if self.has_real_models:
            # Structuring dynamic dataframe
            row = pd.DataFrame([{
                'crop_type': crop_type,
                'vehicle_type': vehicle_type,
                'distance_km': distance_km,
                'temperature_c': temperature_c,
                'humidity_percent': humidity_percent,
                'precipitation_mm': precipitation_mm,
                'road_accessibility_score': road_accessibility,
                'historical_delay_rate': historical_delay_rate,
                'quantity_tons': quantity_tons
            }])
            
            # Executing scikit-learn tree models
            delay_prob = float(self.delay_clf.predict_proba(row)[0][1])
            spoil_prob = float(self.spoil_clf.predict_proba(row)[0][1])
            predicted_delay_hours = float(self.delay_reg.predict(row)[0])
        else:
            # Deterministic, high-fidelity modeling matching synthetic equation parameters
            base_delay = 1.2
            weather_impact = (precipitation_mm / 10.0) * (1.0 - road_accessibility)
            dist_impact = (distance_km / 30.0)
            
            predicted_delay_hours = base_delay + weather_impact + dist_impact
            
            # Spoilage probability model core
            shelf_life = 36 if 'Tomatoes' in crop_type else 144 if 'Onions' in crop_type else 720
            vulnerability = 0.9 if 'Tomatoes' in crop_type else 0.4 if 'Onions' in crop_type else 0.15
            
            total_trip_exposure = predicted_delay_hours + (distance_km / 35.0)
            moisture_spoil_modifier = 1.0 + (precipitation_mm / 50.0) * vulnerability
            temp_modifier = 1.0 + max(0, temperature_c - 28) * 0.05
            
            spoil_prob = min(0.98, max(0.05, (total_trip_exposure / shelf_life) * moisture_spoil_modifier * temp_modifier))
            delay_prob = min(0.95, max(0.05, 1.0 / (1.0 + np.exp(- (predicted_delay_hours - 3.0)))))

        # 2. Recommender optimization tier
        # Generate optimal routing channels and transport time frames
        recommended_vehicle = "8-Ton Eicher Heavy" if quantity_tons > 6.0 else "6-Ton Tata Truck"
        if precipitation_mm > 75 and road_accessibility < 0.4:
            # Upgrade to elevated / high clearance truck configurations
            recommended_vehicle = "8-Ton Eicher Heavy" if 'Eicher' in vehicle_type or 'Tata' in vehicle_type else "6-Ton Tata Truck"
            best_route_plan = "Elevated East-Sector Bypass Express Channel (Bypassing flooded highway corridor)"
            best_pickup_window = "Precheck clearance windows: 20:00 to 23:00 (Fewer traffic blocks)"
        else:
            best_route_plan = "Default Expressway Core Highway RT-101 Segment (100% accessible, fully clear)"
            best_pickup_window = "Immediate pickup route recommended: Next 2-3 hours"
            
        # 3. Model Explainability Tier (Local Attribution Weighting)
        explainability_contributions = [
            {"feature": "Monsoon Precipitation (mm)", "impact_score": round(precipitation_mm * 0.08, 3), "direction": "Positive Correlate (Delays)"},
            {"feature": "Road Accessibility Status", "impact_score": round((1.0 - road_accessibility) * 0.6, 3), "direction": "Inverse Correlate"},
            {"feature": "Distance to Silo Centre (Km)", "impact_score": round(distance_km * 0.015, 3), "direction": "Positive Correlate"},
            {"feature": "Ambient Air Temperature", "impact_score": round(max(0, temperature_c - 28) * 0.04, 3), "direction": "Positive Correlate (Spoilage)"}
        ]
        explainability_contributions = sorted(explainability_contributions, key=lambda x: x["impact_score"], reverse=True)

        return {
            "predicted_pickup_delay_hours": round(predicted_delay_hours, 1),
            "pickup_delay_warning_probability_percent": round(delay_prob * 100, 1),
            "calculated_spoilage_risk_probability_percent": round(spoil_prob * 100, 1),
            "logistical_recommendations": {
                "optimized_vehicle_allocation": recommended_vehicle,
                "sanitized_route_fallback": best_route_plan,
                "safest_pickup_window": best_pickup_window
            },
            "explainability_feature_contributions": explainability_contributions
        }

if __name__ == "__main__":
    print("=== Direct AgroPulse Pipeline Inference ===")
    pipeline = AgroPulseInferencePipeline()
    
    # Test data representing a critical standard monsoonal pickup
    sample_request = {
        "crop_type": "Tomatoes (Sensitive)",
        "distance_km": 42.0,
        "temperature_c": 31.8,
        "humidity_percent": 84.0,
        "precipitation_mm": 110.0,
        "road_accessibility_score": 0.2, # blocked road
        "vehicle_type": "4-Ton Mahindra PickUp",
        "quantity_tons": 3.8
    }
    
    predictions = pipeline.run_prediction_and_optimization(sample_request)
    
    print("\n[Input Conditions]: 42km travel, heavy tropical rain, poor road conditions.")
    print("--------------------------------------------------------------------------")
    print(f"Predicted Pickup Delay: {predictions['predicted_pickup_delay_hours']} Hours")
    print(f"Delay Warning Risk:     {predictions['pickup_delay_warning_probability_percent']}% Probability")
    print(f"Spoilage Damage risk:   {predictions['calculated_spoilage_risk_probability_percent']}% Probability")
    print("\n[Optimal Recommendation Suggestion]:")
    print(f"  - Allocated Truck:    {predictions['logistical_recommendations']['optimized_vehicle_allocation']}")
    print(f"  - Route Directive:    {predictions['logistical_recommendations']['sanitized_route_fallback']}")
    print(f"  - Timing Window:      {predictions['logistical_recommendations']['safest_pickup_window']}")
    print("\n[Local Explainer Atributions]:")
    for feature in predictions['explainability_feature_contributions']:
        print(f"  * {feature['feature']:<28} | Weight: +{feature['impact_score']:.3f} | {feature['direction']}")
