import { useState, useEffect } from "react";
import Form from "./Form";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import ItineraryListPage from "./ItineraryListPage";

export default function App() {
  // State for the currently authenticated user's email
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  
  // State for the current view: 'login', 'signup', 'form', or 'list'
  const [currentView, setCurrentView] = useState('login'); 
  
  // State to hold data when viewing a saved itinerary
  const [currentItineraryData, setCurrentItineraryData] = useState(null); 

  // --- Session Persistence ---
  useEffect(() => {
    // Check local storage for a previously saved session
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setCurrentUserEmail(storedEmail);
      setCurrentView('list'); // Default to list view after login/load
    }
  }, []);

  // --- Authentication Handlers ---

  const handleLoginSuccess = (customerId, email) => {
    // Save email to state and local storage for persistence
    setCurrentUserEmail(email);
    localStorage.setItem('userEmail', email);
    
    // Switch to the list of saved itineraries
    setCurrentView('list'); 
    console.log(`User ${email} logged in successfully. ID: ${customerId}`);
  };

  const handleLogout = () => {
    // Clear state and local storage
    setCurrentUserEmail(null);
    localStorage.removeItem('userEmail');
    
    // Reset view and any viewing data
    setCurrentView('login');
    setCurrentItineraryData(null); 
  };

  // --- Itinerary Handlers ---

  // Function to load saved itinerary data for viewing in the Form component
  const viewSavedItinerary = (data) => {
      setCurrentItineraryData(data); // Set the full data object
      setCurrentView('form'); // Switch to the form view
  }

  // --- Rendering Logic ---

  const renderContent = () => {
    // Header component displayed when logged in (list or form view)
    const Header = () => (
      <div style={{ textAlign: 'right', padding: '10px 20px', backgroundColor: '#f4f4f4', borderBottom: '1px solid #ddd' }}>
          
          <button 
            onClick={() => {
                setCurrentItineraryData(null); // Clear old data
                setCurrentView(currentView === 'form' ? 'list' : 'form');
            }} 
            style={{ padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
          >
            {currentView === 'form' ? 'View Saved Itineraries' : '+ Generate New Itinerary'}
          </button>

          <span style={{ marginRight: '20px', fontWeight: 'bold' }}>Logged in as: {currentUserEmail}</span>
          
          <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Logout
          </button>
      </div>
    );

    switch (currentView) {
      case 'signup':
        return <SignUpPage switchToLogin={() => setCurrentView('login')} />;

      case 'login':
        return (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess} 
            switchToSignup={() => setCurrentView('signup')} 
          />
        );

      case 'list':
        return (
          <>
            <Header />
            <ItineraryListPage 
                userEmail={currentUserEmail} 
                switchToForm={() => {
                    setCurrentItineraryData(null); // Clear old data when switching to new form
                    setCurrentView('form');
                }}
                viewItinerary={viewSavedItinerary} 
            />
          </>
        );
        
      case 'form':
        return (
          <>
            <Header />
            <Form 
                userEmail={currentUserEmail} 
                initialItineraryData={currentItineraryData}
            /> 
          </>
        );

      default:
        return <LoginPage onLoginSuccess={handleLoginSuccess} switchToSignup={() => setCurrentView('signup')} />;
    }
  };

  return (
    <div className="App">
      {renderContent()}
    </div>
  );
}