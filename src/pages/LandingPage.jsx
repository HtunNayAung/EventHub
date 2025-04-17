import { motion } from 'framer-motion';
import { FaCalendar, FaTicketAlt, FaChartLine, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <main className="flex-grow">
      <Navbar/>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#27548A] to-[#183B4E] text-[#F5EEDC] py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-7xl font-bold mb-6 select-none">
              Your Ultimate Event Management Solution
            </h1>
            <p className="text-xl md:text-2xl mb-12 opacity-90 select-none">
              Create, manage, and discover amazing events all in one place
            </p>
            <div className="flex justify-center gap-4">
              <button 
                className="bg-[#F5EEDC] text-[#183B4E] px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 text-lg"
                onClick={() => navigate('/events')}
              >
                Browse Events
              </button>
              <button 
                className="border-2 border-[#F5EEDC] px-8 py-4 rounded-lg font-semibold hover:bg-[#F5EEDC] hover:text-[#183B4E] text-lg"
                onClick={() => navigate('/register')}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-20 bg-[#F5EEDC]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 select-none">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              whileHover={{ y: -5 }}
              className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer"
            >
              <img 
                src="https://media.self.com/photos/5e70f72443731c000882cfe7/4:3/w_2560%2Cc_limit/GettyImages-125112134.jpg" 
                alt="Music Events" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#183B4E] to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-[#F5EEDC]">
                <h3 className="text-2xl font-bold mb-2">Music & Concerts</h3>
                <p className="text-sm opacity-90">Live performances, festivals, and musical events</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer"
            >
              <img 
                src="https://www.ku.ac.ae/wp-content/uploads/2020/10/Bootcamp-pic-jpeg.jpg" 
                alt="Tech Events" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#183B4E] to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-[#F5EEDC]">
                <h3 className="text-2xl font-bold mb-2">Tech & Innovation</h3>
                <p className="text-sm opacity-90">Conferences, workshops, and networking events</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer"
            >
              <img 
                src="https://miro.medium.com/v2/resize:fit:960/1*8NSCzeT91w52QfFSpMYaVw.jpeg" 
                alt="Cultural Events" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#183B4E] to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-[#F5EEDC]">
                <h3 className="text-2xl font-bold mb-2">Arts & Culture</h3>
                <p className="text-sm opacity-90">Exhibitions, performances, and cultural celebrations</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="py-20 bg-[#27548A] text-[#F5EEDC]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of successful event organizers today</p>
          <button className="bg-[#F5EEDC] text-[#27548A] px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90">
            Sign Up Now
          </button>
        </div>
      </section> */}
    </main>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="text-3xl text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default LandingPage;