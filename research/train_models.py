# -*- coding: utf-8 -*-
"""
AgroPulse AI - Machine Learning Pipeline
Part 2: Predictive Modeling and Model-Explainability Suite (Scikit-Learn Implementation)
Author: Atharv Singh Negi, JPS Noida
Version: 1.04
"""

import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import classification_report, f1_score, roc_auc_score, mean_absolute_error, r2_score
import joblib

def load_and_split_data(csv_path):
    """
    Loads historic dataset and partitions train/test datasets for parallel ML models.
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}. Run synthetic_data_generator.py first.")
    
    df = pd.read_csv(csv_path)
    
    # Feature columns (Input Vector X)
    feature_cols = [
        'crop_type', 'vehicle_type', 'distance_km', 'temperature_c', 
        'humidity_percent', 'precipitation_mm', 'road_accessibility_score', 
        'historical_delay_rate', 'quantity_tons'
    ]
    
    X = df[feature_cols]
    
    # Binary Classification targets
    y_delay = df['is_pickup_delayed']
    y_spoil = df['has_spoilage_incident']
    
    # Regression targets
    y_delay_hours = df['actual_pickup_delay_hours']
    y_spoil_prob = df['spoilage_risk_probability']
    
    return train_test_split(
        X, y_delay, y_spoil, y_delay_hours, y_spoil_prob, 
        test_size=0.2, random_state=42
    )

def build_preprocessing_pipeline():
    """
    Creates robust preprocessors for mixed categorical and numeric inputs.
    """
    numeric_features = [
        'distance_km', 'temperature_c', 'humidity_percent', 
        'precipitation_mm', 'road_accessibility_score', 
        'historical_delay_rate', 'quantity_tons'
    ]
    categorical_features = ['crop_type', 'vehicle_type']
    
    numeric_transformer = Pipeline(steps=[
        ('scaler', StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    
    return preprocessor

def train_dispatch_ml_system():
    current_dir = os.path.dirname(os.path.abspath(__file__)) if '__file__' in locals() else './'
    csv_path = os.path.join(current_dir, "cooperative_harvest_logistics.csv")
    
    print("\n=== Parsing & Engineering AgroPulse ML Dataset ===")
    (X_train, X_test, 
     y_train_delay, y_test_delay, 
     y_train_spoil, y_test_spoil,
     y_train_delay_hours, y_test_delay_hours,
     y_train_spoil_prob, y_test_spoil_prob) = load_and_split_data(csv_path)
    
    print(f"Train Dataset Volume: {X_train.shape[0]} records")
    print(f"Test Evaluation Volume: {X_test.shape[0]} records")
    
    preprocessor = build_preprocessing_pipeline()
    
    # ==========================================
    # 1. TRAIN MODEL A: PICKUP DELAY CLASSIFIER
    # ==========================================
    print("\n[Training Model A]: Pickup Delay Classifier (Random Forest)...")
    model_delay_clf = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42))
    ])
    
    model_delay_clf.fit(X_train, y_train_delay)
    delay_preds = model_delay_clf.predict(X_test)
    delay_pred_probs = model_delay_clf.predict_proba(X_test)[:, 1]
    
    f1 = f1_score(y_test_delay, delay_preds)
    auc = roc_auc_score(y_test_delay, delay_pred_probs)
    print(f"--> Delay classification report (Test Partition):")
    print(f"    - Macro F1-Score: {f1:.4f}")
    print(f"    - ROC-AUC Score:  {auc:.4f}")
    
    # Compare with Baseline random model
    rand_preds = np.random.choice([0, 1], size=len(y_test_delay), p=[0.75, 0.25])
    baseline_f1 = f1_score(y_test_delay, rand_preds)
    print(f"    - Baseline Random Model F1-Score: {baseline_f1:.4f} (AgroPulse ML Improvement: +{(f1 - baseline_f1)*100:.1f}%)")
    
    # ==========================================
    # 2. TRAIN MODEL B: SPOILAGE INCIDENT CLASSIFIER
    # ==========================================
    print("\n[Training Model B]: Spoilage Incident Classifier (Random Forest)...")
    model_spoil_clf = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=120, max_depth=12, random_state=42))
    ])
    
    model_spoil_clf.fit(X_train, y_train_spoil)
    spoil_preds = model_spoil_clf.predict(X_test)
    spoil_pred_probs = model_spoil_clf.predict_proba(X_test)[:, 1]
    
    s_f1 = f1_score(y_test_spoil, spoil_preds)
    s_auc = roc_auc_score(y_test_spoil, spoil_pred_probs)
    print(f"--> Spoilage risk classification report (Test Partition):")
    print(f"    - Macro F1-Score: {s_f1:.4f}")
    print(f"    - ROC-AUC Score:  {s_auc:.4f}")
    
    # ==========================================
    # 3. EXTRA REGRESSORS (For Continuous Metric Scores)
    # ==========================================
    print("\n[Training Model C]: Continuos Pickup Delay Regressor...")
    model_delay_reg = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42))
    ])
    model_delay_reg.fit(X_train, y_train_delay_hours)
    delay_reg_preds = model_delay_reg.predict(X_test)
    delay_mae = mean_absolute_error(y_test_delay_hours, delay_reg_preds)
    print(f"    - MAE Prediction Error Deviation: {delay_mae:.2f} hours")
    
    # Save artifacts for real operations packaging
    joblib.dump(model_delay_clf, os.path.join(current_dir, 'pickup_delay_classifier.pkl'))
    joblib.dump(model_spoil_clf, os.path.join(current_dir, 'spoil_risk_classifier.pkl'))
    joblib.dump(model_delay_reg, os.path.join(current_dir, 'pickup_delay_regressor.pkl'))
    
    # ==========================================
    # 4. EXPLAINABILITY MATRIX: FEATURE IMPORTANCE
    # ==========================================
    print("\n[Explainability Insight] Feature Contribution Strengths:")
    clf_model = model_delay_clf.named_steps['classifier']
    cat_encoder = model_delay_clf.named_steps['preprocessor'].named_transformers_['cat'].named_steps['onehot']
    
    # Recover exact feature names
    cat_columns = list(cat_encoder.get_feature_names_out(['crop_type', 'vehicle_type']))
    numeric_features = [
        'distance_km', 'temperature_c', 'humidity_percent', 
        'precipitation_mm', 'road_accessibility_score', 
        'historical_delay_rate', 'quantity_tons'
    ]
    all_feature_names = numeric_features + cat_columns
    
    importances = clf_model.feature_importances_
    sorted_idx = np.argsort(importances)[::-1]
    
    for rank, idx in enumerate(sorted_idx[:8]):
        print(f"    {rank+1}. Feature: {all_feature_names[idx]:<35} | Correlation weight: {importances[idx]:.4f}")
        
    print("\nSuccess! Models successfully saved into research directory folder artifacts.")

if __name__ == "__main__":
    train_dispatch_ml_system()
