import React, { useState } from 'react';
import { Menu, X, ChevronDown, GraduationCap } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { NavItem } from '../types';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (label: string) => {
    if (dropdownOpen === label) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(label);
    }
  };

  const NavLink: React.FC<{ item: NavItem; mobile?: boolean }> = ({ item, mobile }) => {
    const isDropdown = !!item.subItems;
    const isActive = location.pathname === item.href;

    if (isDropdown) {
      return (
        <div className={`relative ${mobile ? 'w-full' : ''}`}>
          <button
            onClick={() => toggleDropdown(item.label)}
            className={`flex items-center gap-1 w-full ${mobile ? 'py-3 px-4 hover:bg-gray-50' : 'hover:text-primary transition-colors'}`}
          >
            {item.label}
            <ChevronDown size={16} className={`transition-transform ${dropdownOpen === item.label ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen === item.label && (
            <div className={`${mobile ? 'bg-gray-50 pl-4' : 'absolute top-full right-0 mt-2 w-48 bg-white shadow-xl rounded-lg py-2 border border-gray-100 z-50'}`}>
              {item.subItems?.map((sub) => (
                <Link
                  key={sub.label}
                  to={sub.href}
                  onClick={() => {
                    setDropdownOpen(null);
                    if (mobile) setIsOpen(false);
                  }}
                  className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-primary transition-colors text-gray-700"
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (item.isButton) {
      return (
        <Link
          to={item.href}
          onClick={() => mobile && setIsOpen(false)}
          className={`
            ${mobile ? 'block w-full text-center mt-4' : ''} 
            px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-blue-600 transition-all shadow-md hover:shadow-lg
          `}
        >
          {item.label}
        </Link>
      );
    }

    // Handle hash links on homepage differently
    if (item.href.startsWith('/#')) {
       return (
        <a
          href={item.href.substring(1)}
          onClick={() => mobile && setIsOpen(false)}
           className={`block ${mobile ? 'py-3 px-4 hover:bg-gray-50' : 'hover:text-primary transition-colors'} ${isActive ? 'text-primary font-bold' : 'text-gray-700'}`}
        >
           {item.label}
        </a>
       )
    }

    return (
      <Link
        to={item.href}
        onClick={() => mobile && setIsOpen(false)}
        className={`block ${mobile ? 'py-3 px-4 hover:bg-gray-50' : 'hover:text-primary transition-colors'} ${isActive ? 'text-primary font-bold' : 'text-gray-700'}`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl text-white">
               <GraduationCap size={28} />
            </div>
            <span className="text-2xl font-bold text-primary tracking-tight">تلميـذ</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.label} item={item} />
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-t border-gray-100 shadow-xl min-h-screen p-4">
          <nav className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.label} item={item} mobile />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};