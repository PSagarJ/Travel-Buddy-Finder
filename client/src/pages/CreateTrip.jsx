import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateTrip = () => {
  // We temporarily hardcode your ID as the creator until we build the Login system
  const currentUserId = '6a13106183dffcf4cf5e0bf4';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    estimatedBudget: '',
    travelStyle: 'Adventure',
    targetVibe: 'Nature & Hiking'
  });

  const [status, setStatus] = useState({ message: '', isError: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: 'Posting your trip...', isError: false });

    try {
      // We bundle the form data along with the creator's ID
      const tripData = { ...formData, creatorId: currentUserId };
      
      await axios.post('http://localhost:5000/api/trips', tripData);
      
      setStatus({ message: 'Trip created successfully! Redirecting...', isError: false });
      
      // Send them back to the home page after 1.5 seconds
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      setStatus({ 
        message: error.response?.data?.message || 'Failed to create trip', 
        isError: true 
      });
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', padding: '0 1rem' }}>
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#333' }}>Plan a New Trip</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>Post your itinerary and find the perfect travel buddy.</p>
        
        {status.message && (
          <div style={{ 
            padding: '0.75rem', 
            marginBottom: '1rem', 
            borderRadius: '8px', 
            background: status.isError ? '#fee2e2' : '#dcfce7',
            color: status.isError ? '#991b1b' : '#166534',
            textAlign: 'center'
          }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', color: '#666' }}>Trip Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g., Backpacking the Himalayas"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', color: '#666' }}>Destination</label>
            <input type="text" name="destination" value={formData.destination} onChange={handleChange} required placeholder="e.g., Manali, India"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: '#666' }}>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: '#666' }}>End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', color: '#666' }}>Estimated Budget (USD)</label>
            <input type="number" name="estimatedBudget" value={formData.estimatedBudget} onChange={handleChange} required placeholder="e.g., 500"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: '#666' }}>Travel Style</label>
              <select name="travelStyle" value={formData.travelStyle} onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: 'white' }}>
                <option value="Adventure">Adventure</option>
                <option value="Backpacker">Backpacker</option>
                <option value="Budget">Budget</option>
                <option value="Chill">Chill</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: '#666' }}>Target Vibe</label>
              <select name="targetVibe" value={formData.targetVibe} onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: 'white' }}>
                <option value="Nature & Hiking">Nature & Hiking</option>
                <option value="Party & Nightlife">Party & Nightlife</option>
                <option value="Historical & Cultural">Historical & Cultural</option>
                <option value="Foodie Tour">Foodie Tour</option>
              </select>
            </div>
          </div>

          <button type="submit" style={{ 
              marginTop: '1rem', padding: '0.75rem', backgroundColor: '#0284c7', color: 'white', 
              border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' 
            }}>
            Post Trip
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;