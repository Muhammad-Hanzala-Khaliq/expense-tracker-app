import React, { useState } from 'react';
// import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';


const AIInsights = ({ userId,title }) => {
    const [insight, setInsight] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const cleanText = insight.replace(/\*/g, ""); // Sab `*` ko remove karega


    const fetchAllInsights = async () => {
        setLoading(true);
        setError(null);  // Reset error before new request
        try {
            const response = await axios.get(`http://localhost:8000/ai-insights/${userId}`);
            setInsight(response.data.insight);
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching AI insights:", error);
            setError("Error retrieving insights. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px",paddingBottom:"20px" }}>
            <button 
            className='bg-primary'
                onClick={fetchAllInsights} 
                disabled={loading} 
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: loading ? "not-allowed" : "pointer",
                    // backgroundColor: loading ? "#ddd" : "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "5px"
                }}
            >
                {loading ? "Analyzing..." : "Get AI Insights"}
            </button>

            {loading && <p style={{ marginTop: "10px", color: "#007BFF" }}>Processing data...</p>}

            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

            {insight && (
                <div style={{ 
                    marginTop: "20px", 
                    padding: "15px", 
                    border: "1px solid #ddd", 
                    borderRadius: "5px", 
                    backgroundColor: "#f9f9f9", 
                }}>
                    <h3>AI {title} Insights:</h3>
                    <p>{cleanText}</p>
                </div>
            )}
        </div>
    );
};

export default AIInsights;
