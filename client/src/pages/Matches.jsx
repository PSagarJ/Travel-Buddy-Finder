import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded current user ID until login is built
  const currentUserId = '6a13106183dffcf4cf5e0bf4';

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/matches/${currentUserId}`);
        
        // If the database returns an empty array, trigger the fallback data for testing
        if (response.data.length === 0) {
          throw new Error("No matches found in DB, using fallback");
        }
        
        setMatches(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Matches fetch failed:", error.message);
        console.log("Using fallback data for matches...");
        
        // SMART FALLBACK
        setMatches([
          {
            user: { _id: 'user-amit', name: 'Amit Patil', travelStyle: 'Adventure', vibeBadges: ['⛰️ Mountain Goat', '📸 Photographer'] },
            matchScore: 98,
            sharedDestinations: ['Manali, India', 'Swiss Alps']
          },
          {
            user: { _id: 'user-sneha', name: 'Sneha Kulkarni', travelStyle: 'Backpacker', vibeBadges: ['🍕 Foodie', '🎒 Light Packer'] },
            matchScore: 94,
            sharedDestinations: ['Kyoto, Japan']
          },
          {
            user: { _id: 'user-rahul', name: 'Rahul Desai', travelStyle: 'Luxury', vibeBadges: ['🍷 Wine Connoisseur', '🏖️ Beach Bum'] },
            matchScore: 78,
            sharedDestinations: ['Ubud, Bali']
          }
        ]);
        setLoading(false);
      }
    };
    fetchMatches();
  }, [currentUserId]);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '4rem', color: '#666' }}>Finding your travel buddies...</h2>;

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Your Top Matches</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Based on your travel style, budget, and saved destinations.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {matches.map((match, index) => (
          <div key={index} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Top Row: Name and Score */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.4rem' }}>
                  <Link to={`/profile/${match.user?._id}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                    {match.user?.name || 'Travel Buddy'}
                  </Link>
                </h2>
                <span style={{ fontSize: '0.85rem', color: '#0369a1', background: '#e0f2fe', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                  {match.user?.travelStyle || 'Explorer'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#ecfdf5', padding: '0.5rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>
                  {match.matchScore || match.matchPercentage || 0}%
                </span>
                <span style={{ fontSize: '0.7rem', color: '#047857', textTransform: 'uppercase', fontWeight: 'bold' }}>Match</span>
              </div>
            </div>

            {/* Middle Row: Vibes and Destinations with Optional Chaining */}
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase' }}>Top Vibes</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {match.user?.vibeBadges?.map((badge, i) => (
                  <span key={i} style={{ fontSize: '0.8rem', background: '#fef3c7', color: '#b45309', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                    {badge}
                  </span>
                ))}
                {(!match.user?.vibeBadges || match.user.vibeBadges.length === 0) && (
                   <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>No badges yet</span>
                )}
              </div>

              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase' }}>Shared Destinations</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', fontWeight: '500' }}>
                📍 {match.sharedDestinations?.join(' • ') || 'Ready to explore'}
              </p>
            </div>

            {/* Bottom Row: View Profile Button */}
            <Link 
              to={`/profile/${match.user?._id}`} 
              style={{ marginTop: 'auto', textAlign: 'center', background: '#f8fafc', color: '#0284c7', padding: '0.75rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', border: '1px solid #bae6fd', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.target.style.background = '#e0f2fe'}
              onMouseOut={(e) => e.target.style.background = '#f8fafc'}
            >
              View Full Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;