import { useState } from 'react';
import { mockEvents, eventCategories } from '../data/mockEvents';
import { FaSearch, FaFilter } from 'react-icons/fa';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';

const BrowseEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const filteredEvents = mockEvents
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'price') return a.price - b.price;
      return 0;
    });

  return (
    <div className="bg-[#F5EEDC] min-h-[80vh]">
      <Navbar/>
      {/* Search and Filter Section */}
      <div className="bg-gradient-to-r from-[#27548A] to-[#183B4E] py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-[#F5EEDC] mb-8 text-center select-none cursor-auto">Browse Events</h1>
          <div className="flex flex-col md:flex-row justify-center gap-4 max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="md:w-1/2 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#27548A]" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853] focus:ring-2 focus:ring-[#DDA853]/20 transition-all duration-200 outline-none text-[#183B4E]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-4">
              <div className="relative">
                <select
                  className="appearance-none bg-[#F5EEDC] pl-4 pr-10 py-3 rounded-lg border-2 border-transparent focus:border-[#DDA853] focus:ring-2 focus:ring-[#DDA853]/20 transition-all duration-200 outline-none text-[#183B4E] cursor-pointer"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {eventCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-[#27548A] pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  className="appearance-none bg-[#F5EEDC] pl-4 pr-10 py-3 rounded-lg border-2 border-transparent focus:border-[#DDA853] focus:ring-2 focus:ring-[#DDA853]/20 transition-all duration-200 outline-none text-[#183B4E] cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="price">Sort by Price</option>
                </select>
                <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-[#27548A] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-6 py-12">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-[#27548A] text-6xl mb-4">
              <FaSearch className="inline-block" />
            </div>
            <h3 className="text-2xl font-semibold text-[#183B4E] mb-2">No Events Found</h3>
            <p className="text-[#183B4E]/70">
              We couldn't find any events matching your search criteria. Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseEvents;