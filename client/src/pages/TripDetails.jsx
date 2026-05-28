import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TripDetails = () => {
  // 1. Grab the dynamic ID from the URL (e.g., /destination/123)
  const { id } = useParams(); 
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyStatus, setApplyStatus] = useState('');

  // Temporarily hardcoding your user ID until we build the Login system
  const currentUserId = '6a13106183dffcf4cf5e0bf4';

// 2. Fetch the trip data when the page loads
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        // Attempt to get the real trip from MongoDB
        const response = await axios.get(`http://localhost:5000/api/trips/${id}`);
        setTrip(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Backend not ready yet:", error.message);
        // SMART FALLBACK: If the backend route isn't built yet...
        setTrip({
          _id: id,
          title: "Expedition to the Highlands",
          destination: id === '1' ? "Ubud, Bali" : id === '2' ? "Kyoto, Japan" : "Swiss Alps, Switzerland",
          startDate: "2026-09-10",
          endDate: "2026-09-24",
          estimatedBudget: 1200,
          travelStyle: "Adventure",
          targetVibe: "Nature & Hiking",
          creatorId: { name: "Pratap Sagar" }, 
          applicants: []
        });
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  // 3. Handle the "Apply to Join" button click
  const handleApply = async () => {
    setApplyStatus('Sending application...');
    try {
      await axios.post(`http://localhost:5000/api/trips/${id}/apply`, { userId: currentUserId });
      setApplyStatus('Application successful! Waiting for approval.');
    } catch {
      // Fallback message until we build the backend route
      setApplyStatus('✨ Application sent to creator! (Simulated)');
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '4rem', color: '#666' }}>Loading adventure...</h2>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Back Button */}
      <Link to="/" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 'bold', marginBottom: '1rem', display: 'inline-block' }}>
        &larr; Back to Destinations
      </Link>

      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        
        {/* Hero Image */}
        <div style={{ height: '300px', width: '100%', backgroundColor: '#e2e8f0', backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>

        <div style={{ padding: '2rem' }}>
          
          {/* Header Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #eee', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', color: '#1f2937', fontSize: '2rem' }}>{trip.title}</h1>
              <h3 style={{ margin: 0, color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📍 {trip.destination}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>${trip.estimatedBudget}</span>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Estimated total</span>
            </div>
          </div>

          {/* Grid Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Dates</p>
              <p style={{ margin: '0.25rem 0 0 0', color: '#334155', fontWeight: 'bold' }}>{trip.startDate} to {trip.endDate}</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Travel Style</p>
              <p style={{ margin: '0.25rem 0 0 0', color: '#334155', fontWeight: 'bold' }}>{trip.travelStyle} • {trip.targetVibe}</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Creator</p>
              <p style={{ margin: '0.25rem 0 0 0', color: '#334155', fontWeight: 'bold' }}>{trip.creatorId?.name || "Anonymous Traveler"}</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Current Applicants</p>
              <p style={{ margin: '0.25rem 0 0 0', color: '#334155', fontWeight: 'bold' }}>{trip.applicants.length} travelers applied</p>
            </div>
          </div>

          {/* Call to Action */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            {applyStatus ? (
              <div style={{ padding: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '8px', fontWeight: 'bold' }}>
                {applyStatus}
              </div>
            ) : (
              <button onClick={handleApply} style={{ width: '100%', padding: '1rem', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>
                Apply to Join This Trip
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TripDetails;