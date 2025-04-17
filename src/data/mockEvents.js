export const mockEvents = [
    {
      id: 1,
      title: "Tech Conference 2025",
      shortDescription: "Featuring the latest innovations in tech",
      description: "Join top industry leaders at the Tech Conference 2024 to explore the newest trends in AI, cloud computing, cybersecurity, and emerging technologies. With keynote speakers from global tech firms, interactive panels, and networking sessions, this event is ideal for developers, entrepreneurs, and innovators looking to stay ahead in the tech landscape.",
      date: "2025-06-15",
      time: "09:00 AM",
      location: "Sydney Convention Center",
      category: "Conference",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=60",
      tickets: {
        general: { price: 299.99, available: 200 },
        vip: { price: 499.99, available: 50 }
      }
    },
    {
      id: 2,
      title: "Summer Music Festival",
      shortDescription: "Three days of unforgettable live music",
      description: "Experience an electrifying atmosphere at the Summer Music Festival, featuring top local and international artists across multiple genres. From indie rock to electronic dance music, enjoy performances on multiple stages, food trucks, art installations, and beachside entertainment. A perfect getaway for music lovers of all ages.",
      date: "2025-07-20",
      time: "02:00 PM",
      location: "Beachfront Park",
      category: "Music",
      price: 150.00,
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=60",
      tickets: {
        general: { price: 150.00, available: 1000 },
        vip: { price: 300.00, available: 100 }
      }
    },
    {
      id: 3,
      title: "Business Networking Mixer",
      shortDescription: "Meet and connect with industry professionals",
      description: "The Business Networking Mixer provides a relaxed yet professional environment for entrepreneurs, business owners, and corporate professionals to exchange ideas, build relationships, and explore collaboration opportunities. Enjoy light refreshments while engaging in meaningful conversations that could shape your career or business.",
      date: "2025-05-30",
      time: "06:00 PM",
      location: "Grand Hotel",
      category: "Networking",
      price: 50.00,
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=60",
      tickets: {
        general: { price: 50.00, available: 150 }
      }
    },
    {
      id: 4,
      title: "Creative Writing Workshop",
      shortDescription: "Unlock your creativity with expert writers",
      description: "This hands-on workshop is designed for aspiring writers who want to develop their storytelling skills. Led by published authors and editors, the session covers writing techniques, character development, narrative structure, and getting published. Ideal for beginners and intermediate writers alike.",
      date: "2025-08-10",
      time: "10:00 AM",
      location: "Downtown Library",
      category: "Workshop",
      price: 75.00,
      image: "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=800&q=60",
      tickets: {
        general: { price: 75.00, available: 80 }
      }
    },
    {
      id: 5,
      title: "Startup Pitch Night",
      shortDescription: "See rising startups pitch to investors",
      description: "Watch innovative startups take the stage to pitch their groundbreaking ideas to a panel of investors and mentors. This exciting event is a golden opportunity for founders to gain visibility, feedback, and funding. Audience members will also get insights into emerging trends in the startup world.",
      date: "2024-09-01",
      time: "06:30 PM",
      location: "Innovation Hub",
      category: "Networking",
      price: 30.00,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60",
      tickets: {
        general: { price: 30.00, available: 200 }
      }
    },
    {
      id: 6,
      title: "City Marathon 2025",
      shortDescription: "Run through the heart of the city",
      description: "Join thousands of runners in one of the biggest urban marathons of the year. Whether you're aiming for a personal best or running for charity, the City Marathon offers scenic routes, hydration stations, and cheering crowds. Participants receive a finisher’s medal, t-shirt, and access to recovery zones post-race.",
      date: "2025-10-05",
      time: "07:00 AM",
      location: "City Center",
      category: "Sports",
      price: 40.00,
      image: "https://images.unsplash.com/photo-1599058917212-d750089bc190?auto=format&fit=crop&w=800&q=60",
      tickets: {
        general: { price: 40.00, available: 500 }
      }
    },
    {
      id: 7,
      title: "Cultural Food Fair",
      shortDescription: "Taste dishes from around the world",
      description: "Celebrate global cultures through food, music, and art at the Cultural Food Fair. Local chefs and vendors will serve authentic cuisine from Asia, Africa, Europe, and the Americas. Enjoy traditional performances, cooking demos, and cultural exhibits in a vibrant, family-friendly environment.",
      date: "2025-08-25",
      time: "11:00 AM",
      location: "Civic Plaza",
      category: "Cultural",
      price: 20.00,
      image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f54?auto=format&fit=crop&w=800&q=60",
      tickets: {
        general: { price: 20.00, available: 300 }
      }
    },
    {
      id: 8,
      title: "Jazz Under the Stars",
      shortDescription: "An open-air night of smooth jazz",
      description: "Relax under the night sky with live jazz performances from top musicians. Jazz Under the Stars is a magical evening of soulful music, wine tastings, and gourmet food trucks. Bring a blanket or reserve VIP seating for a romantic and unforgettable experience.",
      date: "2025-07-12",
      time: "08:00 PM",
      location: "Riverbank Amphitheatre",
      category: "Music",
      price: 60.00,
      image: "https://images.unsplash.com/photo-1525286116112-b59af11adad1?auto=format&fit=crop&w=800&q=60",
      tickets: {
        general: { price: 60.00, available: 250 },
        vip: { price: 120.00, available: 40 }
      }
    },
    {
      id: 9,
      title: "AI & Machine Learning Summit",
      shortDescription: "Explore the future of AI and ML",
      description: "The AI & ML Summit gathers researchers, developers, and tech executives for a deep dive into artificial intelligence. Learn from expert speakers about neural networks, NLP, ethical AI, and more. Attend workshops, demos, and network with top minds shaping tomorrow’s technology.",
      date: "2025-11-15",
      time: "09:00 AM",
      location: "TechPark Auditorium",
      category: "Conference",
      price: 349.00,
      image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800&q=60",
      tickets: {
        general: { price: 349.00, available: 300 },
        vip: { price: 599.00, available: 75 }
      }
    },
    {
      id: 10,
      title: "Photography Bootcamp",
      shortDescription: "Master your photography in one day",
      description: "The Photography Bootcamp is a one-day crash course in capturing stunning photos. Led by professional photographers, you'll learn about composition, lighting, editing, and gear. Whether you're using a DSLR or smartphone, this workshop will elevate your skills and confidence.",
      date: "2024-09-18",
      time: "09:30 AM",
      location: "Art District Studio",
      category: "Workshop",
      price: 120.00,
      image: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=800&q=60",
      tickets: {
        general: { price: 120.00, available: 60 }
      }
    }
  ];
  
  

export const eventCategories = [
  "All",
  "Conference",
  "Music",
  "Networking",
  "Workshop",
  "Sports",
  "Cultural"
];