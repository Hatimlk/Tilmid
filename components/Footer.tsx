
import React from 'react';
import { Instagram, Youtube, Mail, Phone, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants/images';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 pt-20 border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          
          {/* Brand */}
          <div className="space-y-8">
             <Link to="/" className="flex items-center gap-2">
              <img src={IMAGES.LOGOS.OFFICIAL} alt="Tilmid Logo" className="h-16 lg:h-20 w-auto object-contain" />
            </Link>
            <p className="text-gray-600 leading-relaxed text-lg font-medium">
              منصة واعدة تساعد التلاميذ في الرقي بمستواهم الدراسي نحو مرحلة متقدمة بعيداً عن الطرق التقليدية.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xl font-black text-gray-900 mb-8">عنـا</h4>
            <ul className="space-y-5">
              <li><Link to="/about" className="text-gray-600 hover:text-primary transition-colors text-lg font-medium">من نحن</Link></li>
              <li><Link to="/coaching-offer" className="text-gray-600 hover:text-primary transition-colors text-lg font-medium">عرض المواكبة</Link></li>
              <li><Link to="/student-area" className="text-gray-600 hover:text-primary transition-colors text-lg font-medium">مساحة الطالب</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-black text-gray-900 mb-8">تواصل معنا</h4>
            <ul className="space-y-5">
              <li>
                <a href="tel:+212778104220" className="flex items-center gap-4 text-gray-600 hover:text-primary transition-colors dir-ltr text-lg font-bold">
                  <Phone size={22} className="text-primary" />
                  <span dir="ltr">+2127 7810 4220</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@tilmide.ma" className="flex items-center gap-4 text-gray-600 hover:text-primary transition-colors text-lg font-bold">
                  <Mail size={22} className="text-primary" />
                  <span>contact@tilmide.ma</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-xl font-black text-gray-900 mb-8">مواقع التواصل</h4>
            <div className="flex gap-5">
              <a href="https://www.instagram.com/tilmid.official/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1" aria-label="Instagram">
                <Instagram size={24} />
              </a>
              <a href="https://www.tiktok.com/@tilmid.official?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1" aria-label="TikTok">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
              <a href="https://web.facebook.com/profile.php?id=61568646044886" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1" aria-label="Facebook">
                <Facebook size={24} />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1" aria-label="YouTube">
                <Youtube size={24} />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-200 py-10 flex flex-col md:flex-row justify-center items-center gap-8">
          <p className="text-gray-500 text-base font-medium">
            &copy; {new Date().getFullYear()} Tilmid. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="text-gray-500 text-base hover:text-primary transition-colors font-medium">
              سياسة الخصوصية
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/admin" className="text-gray-400 text-base hover:text-primary transition-colors font-medium">
              الإدارة
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
