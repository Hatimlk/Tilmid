
import React, { useEffect, useState } from 'react';
import { Instagram, Youtube, Mail, Phone, Facebook, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants/images';
import { useTranslation } from 'react-i18next';
import { dataManager } from '../utils/dataManager';
import { PlatformSettings } from '../types';

// Hardcoded fallback — used until /api/settings resolves, and if it fails,
// so the footer is never blank. Kept in sync with the admin "Paramètres" module.
const FALLBACK_SETTINGS: PlatformSettings = {
  contact_phone: '+2127 7810 4220',
  contact_email: 'contact@tilmide.ma',
  whatsapp_number: 'https://wa.me/message/GN4XKUOMHNHGO1',
  instagram_url: 'https://www.instagram.com/tilmid.official/',
  tiktok_url: 'https://www.tiktok.com/@tilmid.official?is_from_webapp=1&sender_device=pc',
  facebook_url: 'https://web.facebook.com/profile.php?id=61568646044886',
  youtube_url: 'https://www.youtube.com/@tilmid.official',
};

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<PlatformSettings>(FALLBACK_SETTINGS);

  useEffect(() => {
    dataManager.getSettings()
      .then((s) => setSettings({ ...FALLBACK_SETTINGS, ...s }))
      .catch(() => { /* keep fallback */ });
  }, []);

  return (
    <footer className="bg-white pt-24 border-t border-slate-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 xl:gap-16 mb-20">

          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src={IMAGES.LOGOS.OFFICIAL}
                alt="Tilmid Logo"
                className="h-16 lg:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-slate-500 leading-relaxed text-base font-medium max-w-sm">
              {t('footer.tagline')}
            </p>
            <p className="text-slate-400 leading-relaxed text-sm font-medium max-w-sm">
              {t('footer.description')}
            </p>
          </div>

          {/* Tilmid */}
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              {t('footer.about')}
            </h4>
            <ul className="space-y-4">
              {[
                { label: t('footer.aboutUs'), href: '/about' },
                { label: t('nav.tawjih'), href: '/tawjih' },
                { label: t('footer.coachingOffer'), href: '/coaching-offer' },
                { label: t('footer.bacSimulator'), href: '/bac-simulator' },
                { label: t('footer.studentArea'), href: '/student-area' }
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-slate-500 hover:text-primary transition-all duration-300 text-lg font-medium hover:translate-x-1 rtl:hover:-translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              {t('footer.contactUs')}
            </h4>
            <ul className="space-y-6">
              <li>
                <a href={`tel:${settings.contact_phone}`} className="group flex items-center gap-4 text-slate-500 hover:text-primary transition-colors dir-ltr text-lg font-bold">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Phone size={18} />
                  </div>
                  <span dir="ltr">{settings.contact_phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.contact_email}`} className="group flex items-center gap-4 text-slate-500 hover:text-primary transition-colors text-lg font-bold">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Mail size={18} />
                  </div>
                  <span className="truncate">{settings.contact_email}</span>
                </a>
              </li>
              <li>
                <a href={settings.whatsapp_number} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 text-slate-500 hover:text-primary transition-colors text-lg font-bold">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <MessageCircle size={18} />
                  </div>
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              {t('footer.socialMedia')}
            </h4>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: settings.instagram_url, label: 'Instagram' },
                {
                  icon: ({ size }: { size: number }) => (
                    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
                  ), href: settings.tiktok_url, label: 'TikTok'
                },
                { icon: Facebook, href: settings.facebook_url, label: 'Facebook' },
                { icon: Youtube, href: settings.youtube_url, label: 'YouTube' }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:shadow-lg hover:shadow-primary/15 hover:-translate-y-1 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon size={22} />
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="border-t border-slate-100 py-10 flex flex-col md:flex-row justify-center items-center gap-6 text-center">
          <p className="text-slate-400 text-sm font-medium">
            {t('footer.rights', { year: new Date().getFullYear() })}
          </p>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-200" />
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="text-slate-400 text-sm hover:text-primary transition-colors font-medium">
              {t('footer.privacyPolicy')}
            </Link>
            <span className="text-slate-200">|</span>
            <Link to="/admin" className="text-slate-400 text-sm hover:text-primary transition-colors font-medium">
              {t('footer.admin')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
