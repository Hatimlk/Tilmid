
import React from 'react';
import { GraduationCap, Instagram, Youtube, Mail, Phone, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 pt-16 border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-6">
             <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl text-white">
                <GraduationCap size={24} />
              </div>
              <span className="text-2xl font-bold text-primary">تلميـذ</span>
            </Link>
            <p className="text-gray-600 leading-relaxed">
              منصة واعدة تساعد التلاميذ في الرقي بمستواهم الدراسي نحو مرحلة متقدمة بعيداً عن الطرق التقليدية.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-6">عنـا</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-600 hover:text-primary transition-colors">من نحن</Link></li>
              <li><Link to="/coaching-offer" className="text-gray-600 hover:text-primary transition-colors">عرض المواكبة</Link></li>
              <li><Link to="/student-area" className="text-gray-600 hover:text-primary transition-colors">مساحة الطالب</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-6">تواصل معنا</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+212778104220" className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors dir-ltr">
                  <Phone size={18} />
                  <span dir="ltr">+2127 7810 4220</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@tilmide.ma" className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors">
                  <Mail size={18} />
                  <span>contact@tilmide.ma</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-6">مواقع التواصل</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/tilmid.official/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://www.tiktok.com/@tilmid.official?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all" aria-label="TikTok">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
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
              <a href="https://web.facebook.com/profile.php?id=61568646044886" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-200 py-8 flex flex-col md:flex-row justify-center items-center gap-6">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Tilmid. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="text-gray-500 text-sm hover:text-primary transition-colors">
              سياسة الخصوصية
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/admin" className="text-gray-400 text-sm hover:text-primary transition-colors">
              الإدارة
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
