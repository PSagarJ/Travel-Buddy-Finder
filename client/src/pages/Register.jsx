import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  // 1. Set up state to hold our form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    travelStyle: 'Adventure' // Default dropdown value
  });

  // State for showing error or success messages
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  
  // React Router tool to redirect the user after they sign up
  const navigate = useNavigate();

  // 2. Handle typing in the input boxes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle clicking the Submit button
const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMessage('Creating account...');
    setIsError(false);

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      
      // Use the response data to personalize the message!
      setMessage(`Welcome to BuddyFinder, ${response.data.name}! Redirecting...`);
      
      setTimeout(() => {
        navigate('/matches');
      }, 1500);

    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Join BuddyFinder</h2>
        
        {/* Status Message Display */}
        {message && (
          <div style={{ 
            padding: '0.75rem', 
            marginBottom: '1rem', 
            borderRadius: '8px', 
            background: isError ? '#fee2e2' : '#dcfce7',
            color: isError ? '#991b1b' : '#166534',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', color: '#666' }}>Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', color: '#666' }}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', color: '#666' }}>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', color: '#666' }}>Travel Style</label>
            <select 
              name="travelStyle" 
              value={formData.travelStyle} 
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: 'white' }}
            >
              <option value="Adventure">Adventure</option>
              <option value="Backpacker">Backpacker</option>
              <option value="Budget">Budget</option>
              <option value="Chill">Chill</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          <button 
            type="submit" 
            style={{ 
              marginTop: '0.5rem',
              padding: '0.75rem', 
              backgroundColor: '#0284c7', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;