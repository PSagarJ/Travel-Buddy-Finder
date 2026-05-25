import { Link } from 'react-router-dom';

const Home = () => {
  // Dummy data for our beautiful destination cards
  const destinations = [
    {
      id: 1,
      title: "Ubud, Bali",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      snippet: "Lush rice terraces and rich spiritual culture.",
      budget: "$50 - $80 / day",
      food: "Nasi Goreng, Babi Guling",
      lodging: "Bamboo villas & affordable hostels"
    },
    {
      id: 2,
      title: "Kyoto, Japan",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
      snippet: "Historic temples, bamboo forests, and traditional tea houses.",
      budget: "$100 - $150 / day",
      food: "Kaiseki, Matcha, Ramen",
      lodging: "Traditional Ryokans & business hotels"
    },
    {
      id: 3,
      title: "Swiss Alps, Switzerland",
      image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99",
      snippet: "World-class skiing, hiking, and breathtaking mountain vistas.",
      budget: "$150 - $250 / day",
      food: "Cheese Fondue, Rösti",
      lodging: "Alpine chalets & luxury resorts"
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '1rem' }}>
          Find Your Next Adventure
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Explore breathtaking destinations and connect with the perfect travel buddy to share the journey.
        </p>
      </div>

      {/* Destination Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem' 
      }}>
        {destinations.map((dest) => (
          <div key={dest.id} style={{ 
            background: 'white', 
            borderRadius: '16px', 
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s ease-in-out',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Image Container */}
            <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
              <img 
                src={dest.image} 
                alt={dest.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Card Content */}
            <div style={{ padding: '1.5rem' }}>
              <h2 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>{dest.title}</h2>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {dest.snippet}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', color: '#4b5563' }}>
                  <strong style={{ width: '70px' }}>Budget:</strong> {dest.budget}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#4b5563' }}>
                  <strong style={{ width: '70px' }}>Food:</strong> {dest.food}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#4b5563' }}>
                  <strong style={{ width: '70px' }}>Lodging:</strong> {dest.lodging}
                </div>
              </div>

              {/* View More Button - We will wire this to a full details page later! */}
              <Link to={`/destination/${dest.id}`} style={{
                display: 'block',
                textAlign: 'center',
                padding: '0.75rem',
                backgroundColor: '#f3f4f6',
                color: '#0284c7',
                textDecoration: 'none',
                fontWeight: 'bold',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}>
                View Full Guide
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;