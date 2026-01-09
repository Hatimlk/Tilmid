
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
        <div className={`relative group ${mobile ? 'w-full' : ''}`}>
          <button
            onClick={() => toggleDropdown(item.label)}
            className={`flex items-center gap-1 font-bold text-slate-800 transition-all duration-300
              ${mobile
                ? 'w-full py-4 px-6 hover:bg-slate-50 text-lg border-b border-slate-100 justify-between'
                : 'hover:text-primary'
              }`}
          >
            {item.label}
            <ChevronDown size={16} className={`transition-transform duration-300 ${dropdownOpen === item.label ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
          </button>

          {/* Desktop Dropdown */}
          {!mobile && (
            <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
              <div className="w-56 bg-white shadow-xl rounded-2xl p-2 border border-slate-100/60 ring-1 ring-black/5">
                {item.subItems?.map((sub) => (
                  <Link
                    key={sub.label}
                    to={sub.href}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors mb-1 last:mb-0"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Dropdown */}
          {mobile && dropdownOpen === item.label && (
            <div className="bg-slate-50/50 py-2 animate-in slide-in-from-top-2 duration-200">
              {item.subItems?.map((sub) => (
                <Link
                  key={sub.label}
                  to={sub.href}
                  onClick={() => {
                    setDropdownOpen(null);
                    setIsOpen(false);
                  }}
                  className="block px-10 py-3 text-base text-slate-600 hover:text-primary font-medium"
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
            relative overflow-hidden group
            ${mobile ? 'block w-full text-center mt-6 py-4 mx-6 w-[calc(100%-3rem)]' : 'px-8 py-3.5'} 
            bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/25 
            hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300
          `}
        >
          <span className="relative z-10">{item.label}</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </Link>
      );
    }

    return (
      <Link
        to={item.href}
        onClick={() => mobile && setIsOpen(false)}
        className={`
          relative font-bold transition-colors duration-300
          ${mobile
            ? 'block py-4 px-6 hover:bg-slate-50 text-lg border-b border-slate-100 text-slate-800'
            : 'text-slate-600 hover:text-primary py-2'
          }
          ${isActive && !mobile ? 'text-primary' : ''}
          group
        `}
      >
        {item.label}
        {!mobile && !item.isButton && (
          <span className={`
            absolute -bottom-1 right-0 h-0.5 bg-primary rounded-full transition-all duration-300
            ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
          `} />
        )}
      </Link>
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-[0_2px_20px_-12px_rgba(0,0,0,0.06)] z-50 border-b border-white/50 supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">

            {/* Logo */}
            <Link to="/" className="flex items-center transition-transform hover:scale-105 duration-300">
              <img
                src={IMAGES.LOGOS.OFFICIAL}
                alt="Tilmid Logo"
                className="h-10 lg:h-12 w-auto object-contain"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-12">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.label} item={item} />
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2.5 text-slate-800 hover:bg-slate-100/50 rounded-xl transition-all active:scale-95"
              onClick={toggleMenu}
              aria-label="القائمة"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`
          fixed top-0 right-0 w-[80%] max-w-sm h-full bg-white z-50 md:hidden 
          shadow-2xl transition-transform duration-300 ease-out flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <img
            src={IMAGES.LOGOS.OFFICIAL}
            alt="Tilmid"
            className="h-8 w-auto"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.label} item={item} mobile />
          ))}
        </nav>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Tilmid. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};
