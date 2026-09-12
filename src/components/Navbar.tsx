
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search, User } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { NavItem } from '../types';
import { Link, useLocation } from 'react-router-dom';
import { IMAGES } from '../constants/images';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { GlobalSearch } from './GlobalSearch';
import { Button } from './ui/Button';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Desktop command-search shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (label: string) => {
    if (dropdownOpen === label) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(label);
    }
  };

  const NavLink: React.FC<{ item: NavItem; mobile?: boolean }> = ({ item, mobile }) => {
    const { t } = useTranslation();
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
            {t(item.label)}
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
                    {t(sub.label)}
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
                  {t(sub.label)}
                </Link>
              ))}
            </div>
          )}
        </div>
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
        {t(item.label)}
        {!mobile && (
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
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_4px_24px_-8px_rgba(15,23,42,0.1)] border-slate-100'
          : 'bg-white/70 backdrop-blur-md shadow-none border-transparent'
          } supports-[backdrop-filter]:bg-white/80`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? 'h-[76px] lg:h-[84px]' : 'h-20 lg:h-[92px]'}`}>

            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0 transition-transform hover:scale-105 duration-300">
              <img
                src={IMAGES.LOGOS.OFFICIAL}
                alt="Tilmid Logo"
                className="h-16 lg:h-20 w-auto object-contain"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-9">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.label} item={item} />
              ))}
            </nav>

            {/* Right cluster */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4 shrink-0">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 h-10 px-3.5 lg:px-4 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all ring-1 ring-slate-200"
                aria-label={t('search.ariaLabel')}
              >
                <Search size={17} />
                <span className="hidden lg:inline text-sm font-bold">{t('search.trigger')}</span>
                <kbd className="hidden lg:inline text-[10px] font-black text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5 ms-1">⌘K</kbd>
              </button>

              <Link
                to="/student-area"
                className="w-10 h-10 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all ring-1 ring-slate-200"
                aria-label={t('nav.studentArea')}
                title={t('nav.studentArea')}
              >
                <User size={18} />
              </Link>

              <span className="w-px h-6 bg-slate-200" aria-hidden="true" />
              <LanguageSwitcher />

              <Button to="/tawjih" size="md" className="shadow-primary/25">
                {t('nav.primaryCta')}
              </Button>
            </div>

            {/* Mobile controls */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-slate-600 hover:bg-slate-100/50 rounded-xl transition-all active:scale-95"
                aria-label={t('search.ariaLabel')}
              >
                <Search size={22} />
              </button>
              <button
                className="p-2.5 text-slate-800 hover:bg-slate-100/50 rounded-xl transition-all active:scale-95"
                onClick={toggleMenu}
                aria-label={t('nav.menu')}
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

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
            className="h-12 w-auto"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <Link
            to="/student-area"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-100/80 rounded-full px-4 py-2 ring-1 ring-slate-200"
          >
            <User size={16} className="text-primary" />
            {t('nav.studentArea')}
          </Link>
          <LanguageSwitcher />
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.label} item={item} mobile />
          ))}
        </nav>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <Button to="/tawjih" fullWidth size="lg" onClick={() => setIsOpen(false)}>
            {t('nav.primaryCta')}
          </Button>
        </div>
      </div>
    </>
  );
};
