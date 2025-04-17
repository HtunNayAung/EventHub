const Footer = () => {
  return (
    <footer className="bg-[#183B4E] text-white py-8">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4">
          <p className="text-[#F5EEDC]">
            We acknowledge the Traditional Custodians of the land on which we operate, 
            and pay our respects to their Elders past, present and emerging.
          </p>
          <div className="border-t border-[#27548A] mt-6 pt-6">
            <p className="text-[#F5EEDC]/80">&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;