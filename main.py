from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# import joblib  <--- Uncomment this when you have your trained ML model!
# import pandas as pd 

app = FastAPI(title="AMR-Predict Backend")

# Allowing CORS for frontend requests
# Note: ["*"] allows all connections. Before final submission, you can replace "*" with your Vercel URL!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 🧠 MACHINE LEARNING MODEL LOADING SECTION
# ==========================================
# When you finish training your Random Forest/XGBoost model, save it using joblib.
# Then, uncomment the code below to load it when the server starts.

# try:
#     amr_model = joblib.load("my_trained_model.pkl")
#     print("Model loaded successfully!")
# except Exception as e:
#     print(f"No model found or error loading: {e}")


# ==========================================
# 📊 DATA MODELS (Pydantic)
# ==========================================
class PredictRequest(BaseModel):
    species: str
    origin: str
    genes: List[str]

class PredictResponse(BaseModel):
    susceptibility_status: str
    predicted_resistant: List[str]
    recommended_susceptible: List[str]


# ==========================================
# 🚀 API ENDPOINTS
# ==========================================

@app.get("/")
def read_root():
    """This prevents the 404 error on the homepage and shows the server is awake."""
    return {"message": "✅ AMR-Predict Backend API is running successfully!"}

@app.post("/api/predict", response_model=PredictResponse)
def predict(data: PredictRequest):
    """
    Receives patient/isolate data and returns resistance predictions.
    Currently uses simulated logic. Replace with actual model.predict() later.
    """
    predicted_resistant = []
    recommended_susceptible = []
    status = "Low Resistance Risk"
    
    # ---------------------------------------------------------
    # REPLACE THIS BLOCK WITH YOUR ACTUAL MODEL LOGIC LATER:
    # input_df = pd.DataFrame([data.dict()])
    # prediction = amr_model.predict(input_df)
    # ---------------------------------------------------------

    if data.species == "S. aureus" and "mecA" in data.genes:
        predicted_resistant = ["Penicillin", "Methicillin", "Oxacillin"]
        recommended_susceptible = ["Vancomycin", "Linezolid", "Daptomycin"]
        status = "High Resistance Risk"
    elif data.species == "E. coli" and "blaCTX-M" in data.genes:
        predicted_resistant = ["Amoxicillin", "Ceftriaxone", "Cefotaxime"]
        recommended_susceptible = ["Meropenem", "Imipenem", "Amikacin"]
        status = "High Resistance Risk"
    elif "NDM-1" in data.genes:
        predicted_resistant = ["Meropenem", "Imipenem", "Ceftriaxone", "Cefepime"]
        recommended_susceptible = ["Colistin", "Tigecycline"]
        status = "Critical Resistance Risk"
    elif "vanA" in data.genes:
        predicted_resistant = ["Vancomycin", "Teicoplanin"]
        recommended_susceptible = ["Linezolid", "Daptomycin"]
        status = "High Resistance Risk"
    else:
        # Default fallback for unhandled or less dangerous mock input
        if data.species == "K. pneumoniae":
             predicted_resistant = ["Ampicillin"]
             recommended_susceptible = ["Ceftriaxone", "Ciprofloxacin", "Meropenem"]
        else:
             predicted_resistant = ["None primarily predicted"]
             recommended_susceptible = ["Standard empirical therapy"]

    return PredictResponse(
        susceptibility_status=status,
        predicted_resistant=predicted_resistant,
        recommended_susceptible=recommended_susceptible
    )

@app.get("/api/analytics")
def get_analytics(species: str = "All"):
    """
    Returns data for the frontend Recharts visualizations.
    """
    # Feature Importance (mocked)
    feature_importance = [
        {"name": "Species", "value": 0.40},
        {"name": "Gene: NDM-1", "value": 0.30},
        {"name": "Sample Origin", "value": 0.15},
        {"name": "Gene: blaCTX-M", "value": 0.10},
        {"name": "Gene: mecA", "value": 0.05},
    ]
    
    # Resistance Network (mocked bipartite graph data)
    network_nodes = [
        {"id": "strain", "label": species if species != "All" else "Selected Strain", "group": "bacteria"},
        {"id": "Amoxicillin", "label": "Amoxicillin", "group": "antibiotic"},
        {"id": "Meropenem", "label": "Meropenem", "group": "antibiotic"},
        {"id": "Vancomycin", "label": "Vancomycin", "group": "antibiotic"},
        {"id": "Penicillin", "label": "Penicillin", "group": "antibiotic"},
    ]
    
    network_edges = [
        {"source": "strain", "target": "Amoxicillin", "value": "resistant"},
        {"source": "strain", "target": "Penicillin", "value": "resistant"},
        {"source": "strain", "target": "Meropenem", "value": "susceptible"},
        {"source": "strain", "target": "Vancomycin", "value": "susceptible"},
    ]

    return {
        "feature_importance": feature_importance,
        "network": {
            "nodes": network_nodes,
            "edges": network_edges
        }
    }