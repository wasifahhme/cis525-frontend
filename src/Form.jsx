import { useState, useEffect } from "react";

// The base URL for the generation service (different from CRUD backend)
const GENERATION_BASE_URL = import.meta.env.VITE_GENERATION_BASE_URL;
const CRUD_BACKEND_URL = import.meta.env.VITE_CRUD_BACKEND_URL;

export default function Form({ userEmail, initialItineraryData }) {
  // result is initialized by the prop (for viewing saved data) or starts null (for new generation)
  const [result, setResult] = useState(initialItineraryData); 
  const [loading, setLoading] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [saving, setSaving] = useState(false);

  // States for form inputs, used for generation and auto-naming
  const [startingCity, setStartingCity] = useState("");
  const [endingCity, setEndingCity] = useState("");
  const [itineraryName, setItineraryName] = useState("");

  // Sync state when the initial data prop changes (for viewing a saved itinerary)
  useEffect(() => {
      setResult(initialItineraryData);
  }, [initialItineraryData]);
  
  // If viewing saved data, we don't need to define handleSubmit, but we'll keep the function signature.

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const params = new URLSearchParams({
      starting_city: startingCity.trim(),
      ending_city: endingCity.trim(),
      number_of_people: e.target.number_of_people.value.trim(),
      age_group: e.target.age_group.value.trim(),
      trip_type: e.target.trip_type.value.trim(),
      number_of_days: e.target.number_of_days.value.trim(),
      others: e.target.others.value.trim(),
    });

    const url = `${GENERATION_BASE_URL}?${params.toString()}`;

    try {
      const response = await fetch(url);
      const data = await response.text();
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch {
        parsed = { error: "Invalid JSON format", raw: data };
      }
      setResult(parsed);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!userEmail || !result || !result.itinerary) {
      alert("No itinerary data available to save or user is not logged in.");
      return;
    }

    setSaving(true);

    // --- AUTO-GENERATION LOGIC ---
    const userId = userEmail.split('@')[0];
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace('T', '-').replace(/:/g, '-');
    
    // Replace spaces with underscores for clean database keys
    const cleanStartCity = startingCity.trim().replace(/\s/g, '_') || 'N/A';
    const cleanEndCity = endingCity.trim().replace(/\s/g, '_') || 'N/A';
    
    const autoName = `${userId}-${cleanStartCity}-${cleanEndCity}-${timestamp}`;
    
    // Use the custom name if the user entered one, otherwise use the auto-generated name
    const finalName = itineraryName.trim() || autoName;
    // -------------------------------
    
    const formData = new FormData();
    formData.append("email", userEmail);
    formData.append("itinerary_name", finalName);
    formData.append("itinerary_data", JSON.stringify(result));

    try {
      const response = await fetch(`${CRUD_BACKEND_URL}/save_itinerary`, {
          method: "POST",
          body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to save itinerary");
      }

      const data = await response.json();
      alert(data.message);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  // Determine if we are viewing a saved itinerary
  const isViewingSaved = !!initialItineraryData;

  return (
    <div className="container" style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        {isViewingSaved ? `Viewing Itinerary: ${initialItineraryData.itinerary_name}` : "AI Itinerary Generator"}
      </h2>

      {/* Generation Form is only shown if not viewing saved data */}
      {!isViewingSaved && (
        <form id="itinerary-form" onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          
          <div className="form-group">
            <label htmlFor="starting_city">Starting City</label>
            <input type="text" id="starting_city" name="starting_city" value={startingCity} onChange={(e) => setStartingCity(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="ending_city">Ending City</label>
            <input type="text" id="ending_city" name="ending_city" value={endingCity} onChange={(e) => setEndingCity(e.target.value)} required />
          </div>

          {/* ... (Other required form fields: number_of_people, age_group, trip_type, number_of_days, others) ... */}

          <div className="form-group">
            <label htmlFor="number_of_people">Number of People</label>
            <input type="text" id="number_of_people" name="number_of_people" required />
          </div>

          <div className="form-group">
            <label htmlFor="age_group">Age Group</label>
            <input type="text" id="age_group" name="age_group" placeholder="e.g., 25-30" required />
          </div>

          <div className="form-group">
            <label htmlFor="trip_type">Trip Type</label>
            <input type="text" id="trip_type" name="trip_type" placeholder="e.g., family, friends" required />
          </div>

          <div className="form-group">
            <label htmlFor="number_of_days">Number of Days</label>
            <input type="text" id="number_of_days" name="number_of_days" required />
          </div>

          <div className="form-group">
            <label htmlFor="others">Other Preferences</label>
            <textarea id="others" name="others" rows="3" placeholder="e.g., Avoid bars, Include museums"></textarea>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Itinerary"}
          </button>
        </form>
      )}

      {result && (
        <div>
          <button
            onClick={() => setShowRaw(!showRaw)}
            style={{ marginBottom: "1rem", padding: "6px 12px", borderRadius: "6px", border: "none", background: "#2563eb", color: "white", cursor: "pointer" }}
          >
            {showRaw ? "Show Formatted View" : "Show Raw JSON"}
          </button>

          {showRaw ? (
            <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "8px", whiteSpace: "pre-wrap" }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          ) : result.itinerary ? (
            <div className="itinerary">
              {result.itinerary.map((day) => (
                <div key={day.day} className="day-card" style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
                  <h3>Day {day.day}</h3>
                  <p>
                    <strong>Drive:</strong> {day.driving_summary.start} →{" "}
                    {day.driving_summary.end} ({day.driving_summary.estimated_time})
                  </p>

                  <h4>Activities</h4>
                  <ul>
                    {day.activities.map((act, i) => (
                      <li key={i}>
                        <strong>{act.name}</strong>: {act.description}
                      </li>
                    ))}
                  </ul>

                  <h4>Food Suggestions</h4>
                  <ul>
                    {day.food_suggestions.map((food, i) => (
                      <li key={i}>
                        <strong>{food.name}</strong>: {food.description}
                      </li>
                    ))}
                  </ul>

                  <h4>Overnight</h4>
                  <p>
                    <strong>{day.overnight_lodging_suggestion.location}</strong>{" "}
                    — {day.overnight_lodging_suggestion.description}
                  </p>
                </div>
              ))}

              {/* Save Section is hidden if we are viewing an itinerary that was already saved */}
              {!isViewingSaved && (
                <div
                  style={{ marginTop: "2rem", padding: "1rem", borderTop: "1px solid #ddd" }}
                >
                  <h4>Save Your Itinerary (as {userEmail})</h4>
                  <input
                    type="text"
                    placeholder={`Itinerary name (optional, defaults to e.g., ${userEmail.split('@')[0]}-...`}
                    value={itineraryName}
                    onChange={(e) => setItineraryName(e.target.value)}
                    style={{ marginRight: "10px", padding: "6px" }}
                  />
                  <button onClick={handleSave} disabled={saving} style={{ padding: "6px 12px", borderRadius: "6px", border: "none", background: "#16a34a", color: "white", cursor: "pointer" }}>
                    {saving ? "Saving..." : "Save Itinerary"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}