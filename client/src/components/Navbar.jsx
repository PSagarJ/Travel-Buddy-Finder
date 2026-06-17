import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 💥 Triggers a re-check whenever the route changes
  
  const [isOpen, setIsOpen] = useState(false); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Track logged-in user state
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check localStorage for a logged-in user on every page change
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      setUser(null);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsOpen(false); 
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location]); // 💥 Listens to page changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsOpen(false);
    alert("Logged out successfully. See you on the next adventure!");
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid #e2e8f0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* LOGO */}
        <Link to="/" style={{ textDecoration: 'none', color: '#0284c7', fontSize: '1.4rem', fontWeight: 'bold' }}>
          ✈️ TravelBuddy
        </Link>

        {/* DESKTOP MENU */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#334155', fontWeight: '600' }}>Home</Link>
            
            {user ? (
              <>
                {/* Links visible ONLY when logged in */}
                <Link to="/dashboard" style={{ textDecoration: 'none', color: '#334155', fontWeight: '600' }}>Dashboard</Link>
                <Link to="/create-trip" style={{ textDecoration: 'none', color: '#334155', fontWeight: '600' }}>Post a Trip</Link>
                
                <span style={{ color: '#0369a1', fontWeight: 'bold', background: '#e0f2fe', padding: '0.4rem 0.8rem', borderRadius: '15px', fontSize: '0.9rem' }}>
                  👤 {user.name}
                </span>
                
                <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '0.4rem 1rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.target.style.background = '#ef4444'; e.target.style.color = 'white'; }} onMouseOut={e => { e.target.style.background = 'none'; e.target.style.color = '#ef4444'; }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Links visible ONLY when logged out */}
                <Link to="/login" style={{ textDecoration: 'none', color: '#334155', fontWeight: '600' }}>Log In</Link>
                <Link to="/register" style={{ textDecoration: 'none', background: '#0284c7', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '8px', fontWeight: 'bold' }}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}

        {/* MOBILE HAMBURGER BUTTON */}
        {isMobile && (
          <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', fontSize: '1.8rem', color: '#334155', cursor: 'pointer', outline: 'none' }}>
            {isOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isMobile && isOpen && (
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '0.5rem 1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <Link to="/" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: '#334155', fontWeight: '600', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>Home</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: '#334155', fontWeight: '600', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>Dashboard</Link>
              <Link to="/create-trip" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: '#334155', fontWeight: '600', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>Post a Trip</Link>
              <div style={{ color: '#0369a1', fontWeight: 'bold', padding: '0.5rem 0' }}>👤 {user.name}</div>
              <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: '#334155', fontWeight: '600', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>Log In</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', background: '#0284c7', color: 'white', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center' }}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;