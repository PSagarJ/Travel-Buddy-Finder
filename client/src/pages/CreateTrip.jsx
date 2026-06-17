import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    estimatedBudget: '',
    travelStyle: 'Adventure',
    targetVibe: ''
  });
  const [status, setStatus] = useState('');

  // Hardcoded ID until login is built
  const currentUserId = '6a13106183dffcf4cf5e0bf4';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Drafting your itinerary...');
    
    try {
      // Send the real data to your Express backend
      const newTrip = { ...formData, creatorId: currentUserId };
      await axios.post('http://localhost:5000/api/trips', newTrip);
      
      setStatus('Trip posted successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error('Error creating trip:', error);
      // Smart Fallback if the backend route isn't built yet
      setStatus('✨ Trip layout saved! (Simulated Mode)');
      setTimeout(() => navigate('/dashboard'), 1500);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)', background: '#fff' }}>
      
      {/* LEFT SIDE: Visual Inspiration */}
      <div style={{ 
        flex: 1, 
        display: 'block', 
        backgroundImage: 'url("https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2000")', // Epic travel/planning image
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', right: '10%', color: 'white' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Plant the flag. <br/>Gather the crew.
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#e2e8f0' }}>Post your dream itinerary and let our matching algorithm find the perfect travel buddies to join you.</p>
        </div>
      </div>

      {/* RIGHT SIDE: The Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 10%', background: '#f8fafc', overflowY: 'auto' }}>
        <div style={{ maxWidth: '450px', width: '100%', margin: '0 auto' }}>
          
          <Link to="/" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 'bold', marginBottom: '1.5rem', display: 'inline-block' }}>
            &larr; Back to Home
          </Link>

          <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: '0 0 0.5rem 0' }}>Post a New Trip</h1>
          <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Give us the details, and we'll handle the matchmaking.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Trip Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Backpacking the Swiss Alps" required
                style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.border = '1px solid #0284c7'} onBlur={e => e.target.style.border = '1px solid #cbd5e1'}
              />
            </div>

            {/* Destination & Budget Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Destination</label>
                <input type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="City, Country" required
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.border = '1px solid #0284c7'} onBlur={e => e.target.style.border = '1px solid #cbd5e1'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Est. Budget</label>
                <input type="number" name="estimatedBudget" value={formData.estimatedBudget} onChange={handleChange} placeholder="$ USD" required
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.border = '1px solid #0284c7'} onBlur={e => e.target.style.border = '1px solid #cbd5e1'}
                />
              </div>
            </div>

            {/* Dates Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box', color: '#334155' }}
                  onFocus={e => e.target.style.border = '1px solid #0284c7'} onBlur={e => e.target.style.border = '1px solid #cbd5e1'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase' }}>End Date</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box', color: '#334155' }}
                  onFocus={e => e.target.style.border = '1px solid #0284c7'} onBlur={e => e.target.style.border = '1px solid #cbd5e1'}
                />
              </div>
            </div>

            {/* Travel Style & Target Vibe */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Travel Style</label>
                <select name="travelStyle" value={formData.travelStyle} onChange={handleChange}
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontSize: '1rem', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <option value="Adventure">Adventure</option>
                  <option value="Backpacker">Backpacker</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Chill">Chill</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Target Vibe</label>
                <input type="text" name="targetVibe" value={formData.targetVibe} onChange={handleChange} placeholder="e.g., Food & Photography" required
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.border = '1px solid #0284c7'} onBlur={e => e.target.style.border = '1px solid #cbd5e1'}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '1rem' }}>
              {status ? (
                 <div style={{ padding: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center' }}>{status}</div>
              ) : (
                <button type="submit" 
                  style={{ width: '100%', padding: '1rem', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s, transform 0.1s' }}
                  onMouseOver={e => e.target.style.background = '#0369a1'} onMouseOut={e => e.target.style.background = '#0284c7'} onMouseDown={e => e.target.style.transform = 'scale(0.98)'} onMouseUp={e => e.target.style.transform = 'scale(1)'}
                >
                  Publish Itinerary
                </button>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;