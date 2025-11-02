import { useState, useEffect } from "react";


const BACKEND_URL = import.meta.env.VITE_CRUD_BACKEND_URL;


export default function ItineraryListPage({ userEmail, switchToForm, viewItinerary }) {
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userEmail) {
            fetchItineraries();
        }
    }, [userEmail]);

    async function fetchItineraries() {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams({ email: userEmail });
        const url = `${BACKEND_URL}/get_all_itineraries?${params.toString()}`;

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "Failed to fetch itineraries.");
            }

            const data = await response.json();
            setItineraries(data);

        } catch (err) {
            console.error("Fetch Itineraries Error:", err);
            setError(err.message || "Could not load saved itineraries.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading saved itineraries...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                Saved Itineraries for {userEmail}
            </h2>

            {itineraries.length === 0 ? (
                <>
                    <p style={{ textAlign: 'center' }}>You haven't saved any itineraries yet.</p>
                    <div style={{textAlign: 'center'}}>
                        <button onClick={switchToForm} style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Go to Generator
                        </button>
                    </div>
                </>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {itineraries.map((item) => (
                        <li 
                            key={item.itinerary_id} 
                            style={{ 
                                padding: '15px', 
                                border: '1px solid #ddd', 
                                marginBottom: '10px', 
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ fontWeight: 'bold' }}>{item.itinerary_name}</span>
                            <button 
                                onClick={() => viewItinerary(item.itinerary_data)}
                                style={{ padding: '8px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                View Details
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}