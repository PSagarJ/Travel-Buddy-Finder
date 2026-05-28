import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import Dashboard from './pages/Dashboard';
import ChatRoom from './pages/ChatRoom';
import BudgetSplitter from './pages/BudgetSplitter';
import { useState, useEffect } from 'react';
import axios from 'axios';


// const Register = () => (
//   <div style={{ textAlign: 'center', padding: '3rem' }}>
//     <h2>Registration Form Coming Soon!</h2>
//   </div>
// );
// -------------------------

// --- Your Matches Component (Moved from old App.jsx) ---
const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcoding Pratap's ID for our initial test
  const currentUserId = '6a13106183dffcf4cf5e0bf4';

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/matches/${currentUserId}`);
        setMatches(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <p style={{ marginTop: '1rem', color: '#666', marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
        Your Top Travel Matches
      </p>

      {loading ? (
        <p style={{ fontSize: '1.2rem', color: '#888' }}>Calculating Cosine Similarity...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {matches.map((match) => (
            <div 
              key={match.user._id} 
              style={{ 
                background: '#fff', 
                padding: '1.5rem', 
                borderRadius: '12px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #eee'
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: 0, color: '#333', fontSize: '1.2rem' }}>
                  {match.user.name}
                </h3>
                <span style={{ 
                  display: 'inline-block',
                  marginTop: '0.5rem',
                  background: '#e0f2fe', 
                  color: '#0284c7', 
                  padding: '4px 10px', 
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}>
                  {match.user.travelStyle}
                </span>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: match.matchPercentage > 80 ? '#10b981' : '#f59e0b' }}>
                  {match.matchPercentage}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#999' }}>Match Score</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
// -------------------------------------------------------

function App() {
  return (
    <div>
      <Navbar /> 
      
      {/* The Routes decide which page content to load based on the URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/destination/:id" element={<TripDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat/:tripId" element={<ChatRoom />} />
        <Route path="/budget" element={<BudgetSplitter />} />
      </Routes>
    </div>
  );
}

export default App;