import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '1rem 2rem', 
      backgroundColor: '#0284c7', 
      color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>🌍 BuddyFinder</Link>
      </h2>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
        <Link to="/matches" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Matches</Link>
        <Link to="/register" style={{ 
          backgroundColor: 'white', 
          color: '#0284c7', 
          padding: '0.5rem 1rem', 
          borderRadius: '20px', 
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;