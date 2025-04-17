import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BecomeOrganizer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Organizer application submitted:', formData);
    // In a real app, you would send this to your backend
    navigate('/dashboard');
  };

  return (
    <div className="bg-[#F5EEDC] min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-[#27548A] to-[#183B4E] rounded-t-lg p-8">
            <h1 className="text-3xl font-bold text-[#F5EEDC] mb-2">Become an Event Organizer</h1>
            <p className="text-[#F5EEDC]/80">Create and manage your own events on our platform</p>
          </div>
          
          <div className="bg-white rounded-b-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#183B4E] mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#183B4E] mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#183B4E] mb-2">Organization Name</label>
                <input
                  type="text"
                  name="organization"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                  value={formData.organization}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#183B4E] mb-2">Tell us about your events</label>
                <textarea
                  name="description"
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg bg-[#F5EEDC] border-2 border-transparent focus:border-[#DDA853]"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-[#27548A] text-[#F5EEDC] py-3 rounded-lg font-medium hover:bg-[#183B4E] transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeOrganizer;