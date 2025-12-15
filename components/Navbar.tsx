import React, { useState } from 'react';
    import { Menu, X } from 'lucide-react';
    import { RESUME_DATA } from '../constants';
    
    const Navbar: React.FC = () => {
      const [isOpen, setIsOpen] = useState(false);
    
      const navLinks = [
        { name: 'About', href: '#about' },
        { name: 'Work', href: '#projects' },
        { name: 'Posts', href: '#linkedin' },
        { name: 'BTS', href: '#bts' },
        { name: 'Contact', href: '#contact' },
      ];
    
      return (
        <nav className="fixed w-full z-40 top-0 left-0 pt-6 px-6 md:px-12 mix-blend-difference text-white">
          <div className="flex justify-between items-start">
            <a href="#" className="font-serif text-2xl font-bold tracking-tight">
              Akshat S.
            </a>
    
            <div className="hidden md:flex flex-col items-end space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm uppercase tracking-widest hover:line-through decoration-white transition-all"
                >
                  {link.name}
                </a>
              ))}
            </div>
    
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-white/20 backdrop-blur-sm"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
    
          {/* Mobile Overlay */}
          {isOpen && (
            <div className="fixed inset-0 bg-[#1C1C1C] text-[#F4F4F0] z-50 flex flex-col items-center justify-center space-y-8">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2"
              >
                <X size={32} />
              </button>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="font-serif text-4xl hover:italic transition-all"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </nav>
      );
    };
    
    export default Navbar;
    