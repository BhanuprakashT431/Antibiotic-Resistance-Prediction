import axios from 'axios';

// Added /api to the end of the URL
const API_BASE_URL = "https://antibiotic-resistance-prediction.onrender.com/api";


export interface PredictRequest {
    species: string;
    origin: string;
    genes: string[];
}

export interface PredictResponse {
    susceptibility_status: string;
    predicted_resistant: string[];
    recommended_susceptible: string[];
}

export interface AnalyticsResponse {
    feature_importance: { name: string, value: number }[];
    network: {
        nodes: { id: string, label: string, group: string }[];
        edges: { source: string, target: string, value: string }[];
    }
}

export const fetchPrediction = async (data: PredictRequest): Promise<PredictResponse> => {
    // This now correctly calls https://...onrender.com/api/predict
    const response = await axios.post(`${API_BASE_URL}/predict`, data);
    return response.data;
}

export const fetchAnalytics = async (species: string): Promise<AnalyticsResponse> => {
    // This now correctly calls https://...onrender.com/api/analytics
    const response = await axios.get(`${API_BASE_URL}/analytics`, { params: { species } });
    return response.data;
}