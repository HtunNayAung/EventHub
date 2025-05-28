import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import BrowseEvents from './pages/BrowseEvents';
import EventDetail from './pages/EventDetail';
import UserDashboard from './pages/AttendeeDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BecomeOrganizer from './pages/BecomeOrganizer';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AttendeeDashboard from './pages/AttendeeDashboard';
import './App.css';
import PaymentPage from './pages/PaymentPage';
// import AdminDashboard from './pages/AdminDashboard';

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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/organizer" element={<Signup isOrganizer={true} />} />
          <Route path="/organizer/:id/dashboard" element={<OrganizerDashboard />} />
          <Route path="/attendee/:id/dashboard" element={<AttendeeDashboard />} />
          <Route path="/payment/:registrationId" element={<PaymentPage />} />
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;