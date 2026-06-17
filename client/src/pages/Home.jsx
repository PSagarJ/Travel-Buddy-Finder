import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [isSolo, setIsSolo] = useState(false);
  
  // Real state to hold our database trips
  const [communityTrips, setCommunityTrips] = useState([]);
  // State to track what the user types in the search bar
  const [searchTerm, setSearchTerm] = useState('');

  const groupImage = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021";
  const soloImage = "https://images.unsplash.com/photo-1526491109672-74740652b963?q=80&w=2000"; 

  const curatedTrips = [
    { _id: 'dest-1', title: 'The Ultimate Bali Escape', location: 'Bali, Indonesia', days: 7, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4' },
    { _id: 'dest-2', title: 'Kyoto Temple Tour', location: 'Kyoto, Japan', days: 10, img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e' }
  ];

  // Fetch real trips from the backend when the page loads
  useEffect(() => {
    const fetchCommunityTrips = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/trips');
        setCommunityTrips(response.data);
      } catch (error) {
        console.error("Error fetching community trips:", error);
      }
    };
    fetchCommunityTrips();
  }, []);

  // 💥 NEW: Filter the trips based on the search term
  const filteredTrips = communityTrips.filter(trip => {
    const searchLower = searchTerm.toLowerCase();
    return (
      trip.title.toLowerCase().includes(searchLower) ||
      trip.destination.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div style={{ paddingBottom: '4rem', background: '#f8fafc' }}>
      
      {/* HERO SECTION */}
      <div style={{ 
        position: 'relative', height: '600px', backgroundImage: `url("${isSolo ? soloImage : groupImage}")`,
        backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center', padding: '0 2rem',
        transition: 'background-image 0.6s ease-in-out' 
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1, transition: 'background-color 0.6s' }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem', textShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            {isSolo ? "Find Yourself." : "Never Travel"} <span style={{ color: isSolo ? '#10b981' : '#38bdf8', transition: 'color 0.4s' }}>{isSolo ? "Out There." : "Alone."}</span>
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', color: '#e2e8f0', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {isSolo ? "Grab an expert-crafted itinerary and explore the world at your own pace." : "Discover curated itineraries and find your perfect travel buddies."}
          </p>

          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '0.5rem', borderRadius: '30px', marginBottom: '2rem', position: 'relative' }}>
            <button onClick={() => setIsSolo(false)} style={{ padding: '0.75rem 2rem', border: 'none', borderRadius: '25px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease', background: !isSolo ? '#0284c7' : 'transparent', color: !isSolo ? 'white' : '#cbd5e1', transform: !isSolo ? 'scale(1.05)' : 'scale(1)' }}>
              Group Travel
            </button>
            <button onClick={() => setIsSolo(true)} style={{ padding: '0.75rem 2rem', border: 'none', borderRadius: '25px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease', background: isSolo ? '#10b981' : 'transparent', color: isSolo ? 'white' : '#cbd5e1', transform: isSolo ? 'scale(1.05)' : 'scale(1)' }}>
              Solo Adventure
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '-40px auto 0', position: 'relative', zIndex: 3, padding: '0 1rem' }}>
        
        {/* CURATED TRIPS */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#0f172a', margin: 0 }}>Curated Experiences</h2>
            <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Verified Routes</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {curatedTrips.map(trip => (
              <div key={trip._id} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', transition: 'transform 0.2s', cursor: 'pointer', background: 'white' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ height: '200px', backgroundImage: `url(${trip.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{trip.title}</h3>
                  <p style={{ margin: '0 0 1.5rem 0', color: '#64748b' }}>📍 {trip.location} • ⏳ {trip.days} Days</p>
                  
                  <Link to={`/destination/${trip._id}`} state={{ mode: isSolo ? 'solo' : 'group' }} style={{ display: 'block', textAlign: 'center', padding: '0.75rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', transition: 'all 0.3s ease', background: isSolo ? '#ecfdf5' : '#f0f9ff', color: isSolo ? '#047857' : '#0369a1', border: `1px solid ${isSolo ? '#a7f3d0' : '#bae6fd'}` }}>
                    {isSolo ? 'Grab Solo Itinerary' : 'Find a Group to Join'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMMUNITY TRIPS WITH LIVE SEARCH */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#0f172a', margin: 0 }}>Community Board</h2>
            <Link to="/create-trip" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 'bold' }}>+ Post a Trip</Link>
          </div>

          {/* 💥 NEW: The Search Bar UI */}
          <div style={{ marginBottom: '2rem' }}>
            <input 
              type="text" 
              placeholder="🔍 Search destinations or trips (e.g., 'Goa' or 'Alps')..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '1rem 1.5rem', borderRadius: '30px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', transition: 'border 0.2s' }}
              onFocus={e => e.target.style.border = '1px solid #0284c7'}
              onBlur={e => e.target.style.border = '1px solid #cbd5e1'}
            />
          </div>

          {/* Fallback if database is empty or search yields no results */}
          {filteredTrips.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
              <h3>No trips found!</h3>
              <p>{communityTrips.length === 0 ? "Be the first to gather a crew." : "Try adjusting your search terms."}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
              {/* Note how we map over filteredTrips now! */}
              {filteredTrips.map(trip => (
                <div key={trip._id} style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e293b', fontSize: '1.1rem' }}>{trip.title}</h4>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      <span style={{ fontWeight: 'bold', color: '#0369a1' }}>Traveler</span> is going to {trip.destination}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                      📅 {new Date(trip.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Link to={`/destination/${trip._id}`} style={{ background: 'white', border: '1px solid #cbd5e1', color: '#334155', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold', textDecoration: 'none', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Home;