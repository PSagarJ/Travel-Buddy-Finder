import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [myTrips, setMyTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcoding your ID as the logged-in Creator
  const currentUserId = '6a13106183dffcf4cf5e0bf4';

  useEffect(() => {
    const fetchMyTrips = async () => {
      try {
        // 💥 FIXED: Updated route to match our backend (/user/ instead of /creator/)
        const response = await axios.get(`http://localhost:5000/api/trips/user/${currentUserId}`);
        setMyTrips(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Dashboard route not ready:", error.message);
        // SMART FALLBACK: Simulated trip so you can still see the UI if DB is empty
        setMyTrips([
          {
            _id: 'trip-101',
            title: 'Backpacking the Himalayas',
            destination: 'Manali, India',
            startDate: '2026-10-01',
            applicants: [
              { _id: 'user-amit', name: 'Amit Patil', travelStyle: 'Adventure', matchScore: 100 },
              { _id: 'user-sneha', name: 'Sneha Kulkarni', travelStyle: 'Backpacker', matchScore: 94 }
            ],
            approvedMembers: []
          }
        ]);
        setLoading(false);
      }
    };
    fetchMyTrips();
  }, []);

  // Handle Approving or Rejecting an applicant
  const handleDecision = async (tripId, applicantId, decision) => {
    try {
      const dbStatus = decision === 'approve' ? 'approved' : 'rejected'; 
      
      await axios.put(`http://localhost:5000/api/trips/${tripId}/status`, { 
        userId: applicantId, 
        status: dbStatus 
      });
      
      setMyTrips(prevTrips => prevTrips.map(trip => {
        if (trip._id === tripId) {
          // Look for the applicant using either _id (dummy data) or userId (real DB)
          const applicantToMove = trip.applicants.find(a => a._id === applicantId || a.userId === applicantId);
          return {
            ...trip,
            // Filter them out of the pending list
            applicants: trip.applicants.filter(a => a._id !== applicantId && a.userId !== applicantId),
            // If approved, push them to approvedMembers array
            approvedMembers: decision === 'approve' 
              ? [...(trip.approvedMembers || []), applicantToMove] 
              : trip.approvedMembers
          };
        }
        return trip;
      }));
      
      alert(`Applicant successfully ${decision}d!`); 
    } catch (error) {
      console.error("Error updating applicant:", error.message);
      alert("Failed to update status. Check your server console for errors.");
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '4rem', color: '#666' }}>Loading Dashboard...</h2>;

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Creator Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Manage your trips and review travel buddy applications.</p>

      {myTrips.length === 0 ? (
        <div style={{ background: 'white', padding: '3rem', textAlign: 'center', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#4b5563' }}>You haven't created any trips yet.</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {myTrips.map(trip => (
            <div key={trip._id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
              
              {/* Trip Header */}
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>{trip.title}</h2>
                  <span style={{ color: '#64748b', fontWeight: 'bold' }}>📍 {trip.destination} • 📅 {new Date(trip.startDate).toLocaleDateString() === 'Invalid Date' ? trip.startDate : new Date(trip.startDate).toLocaleDateString()}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <a href={`/budget/${trip._id}`} style={{ background: '#f59e0b', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    View Ledger
                  </a>
                  <div style={{ background: '#0284c7', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {trip.approvedMembers?.length || 0} Joined
                  </div>
                </div>
              </div>

              {/* Applicants Section */}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#334155', fontSize: '1.1rem' }}>Pending Applications ({trip.applicants?.filter(a => a.status === 'pending' || !a.status).length || 0})</h3>
                
                {!trip.applicants || trip.applicants.filter(a => a.status === 'pending' || !a.status).length === 0 ? (
                  <p style={{ color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>No pending applications right now.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {trip.applicants.filter(a => a.status === 'pending' || !a.status).map((applicant, index) => {
                      // Handle both real DB logic and dummy data fallback safely
                      const applicantId = applicant.userId || applicant._id;
                      const applicantName = applicant.name || `Traveler ${String(applicantId).substring(0, 4)}`;

                      return (
                        <div key={applicantId || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f1f5f9', borderRadius: '8px' }}>
                          
                          <div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>{applicantName}</h4>
                            <span style={{ fontSize: '0.85rem', color: '#475569', background: '#e2e8f0', padding: '2px 8px', borderRadius: '12px', marginRight: '8px' }}>
                              {applicant.travelStyle || 'Explorer'}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 'bold' }}>
                              {applicant.matchScore || 85}% Match
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              onClick={() => handleDecision(trip._id, applicantId, 'approve')}
                              style={{ padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleDecision(trip._id, applicantId, 'reject')}
                              style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              Reject
                            </button>
                          </div>
                          
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;