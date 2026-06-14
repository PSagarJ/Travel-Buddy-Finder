import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import Dashboard from './pages/Dashboard';
import ChatRoom from './pages/ChatRoom';
import BudgetSplitter from './pages/BudgetSplitter';
import UserProfile from './pages/UserProfile'; // Fixed typo in import path
import Matches from './pages/Matches';

function App() {
  return (
    <div>
      <Navbar /> 
      
      {/* The Routes decide which page content to load based on the URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/profile/:userId" element={<UserProfile />} />        
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/destination/:id" element={<TripDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat/:tripId" element={<ChatRoom />} />
        <Route path="/budget/:tripId" element={<BudgetSplitter />} />
      </Routes>
    </div>
  );
}

export default App;