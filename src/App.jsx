import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import BrowseEvents from './pages/BrowseEvents';
import EventDetail from './pages/EventDetail';
import BecomeOrganizer from './pages/BecomeOrganizer';
import "./App.css";
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/events" element={<BrowseEvents />} />
          <Route path="/become-organizer" element={<BecomeOrganizer />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;