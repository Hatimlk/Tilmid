
import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { NavItem } from '../types';
import { Link, useLocation } from 'react-router-dom';
import { IMAGES } from '../constants/images';

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
            className={`flex items-center gap-1 w-full font-black text-slate-950 ${mobile ? 'py-4 px-6 hover:bg-gray-50 text-lg' : 'hover:text-primary transition-colors'}`}
          >
            {item.label}
            <ChevronDown size={16} className={`transition-transform ${dropdownOpen === item.label ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen === item.label && (
            <div className={`${mobile ? 'bg-gray-50 pl-4' : 'absolute top-full right-0 mt-2 w-48 bg-white shadow-xl rounded-2xl py-2 border border-gray-100 z-50'}`}>
              {item.subItems?.map((sub) => (
                <Link
                  key={sub.label}
                  to={sub.href}
                  onClick={() => {
                    setDropdownOpen(null);
                    if (mobile) setIsOpen(false);
                  }}
                  className="block px-6 py-3 text-sm hover:bg-blue-50 hover:text-primary transition-colors text-slate-800 font-black"
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
            ${mobile ? 'block w-full text-center mt-6 py-4' : 'px-8 py-3.5'} 
            bg-primary text-white rounded-full font-black hover:bg-blue-600 transition-all shadow-lg hover:shadow-primary/20
          `}
        >
          {item.label}
        </Link>
      );
    }

    return (
      <Link
        to={item.href}
        onClick={() => mobile && setIsOpen(false)}
        className={`block font-black transition-all ${mobile ? 'py-4 px-6 hover:bg-gray-50 text-lg' : 'hover:text-primary'} ${isActive ? 'text-primary' : 'text-slate-950'}`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-sm z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-24 lg:h-28">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={IMAGES.LOGOS.OFFICIAL} 
              alt="Tilmid Logo" 
              className="h-14 lg:h-18 w-auto object-contain" 
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.label} item={item} />
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-3 text-slate-950 hover:bg-blue-50 rounded-2xl transition-all"
            onClick={toggleMenu}
            aria-label="القائمة"
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-24 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl min-h-screen p-6 animate-in slide-in-from-top duration-300">
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
