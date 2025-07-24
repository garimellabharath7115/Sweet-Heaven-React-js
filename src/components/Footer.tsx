import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  Home, 
  Package, 
  ShoppingCart, 
  User, 
  Settings, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';

export function Footer() {
  const { currentUser, isAdmin } = useAuth();

  const quickLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Orders', href: '/orders', icon: Package },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
    { 
      name: currentUser ? 'Profile' : 'Sign Up/Login', 
      href: currentUser ? '/profile' : '/auth', 
      icon: User 
    },
  ];

  if (isAdmin) {
    quickLinks.push({ name: 'Admin Panel', href: '/admin', icon: Settings });
  }

  const supportInfo = [
    { label: 'Email', value: 'support@sweetheaven.com', icon: Mail, href: 'mailto:support@sweetheaven.com' },
    { label: 'Phone', value: '+1 (555) 123-4567', icon: Phone, href: 'tel:+15551234567' },
    { label: 'Address', value: '123 Sweet Street, Dessert City, DC 12345', icon: MapPin, href: '#' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/sweetheaven', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/sweetheaven', color: 'hover:text-pink-600' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/sweetheaven', color: 'hover:text-blue-400' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-rose-500 fill-current" />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
                Sweet-Heaven
              </span>
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Indulge in our heavenly collection of handcrafted sweets, cakes, and desserts. 
              Made with love and the finest ingredients for your sweetest moments.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 bg-gray-800 rounded-full transition-all duration-200 hover:bg-gray-700 transform hover:scale-110 ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-rose-400">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="flex items-center space-x-2 text-gray-300 hover:text-rose-400 transition-colors duration-200 group text-sm sm:text-base"
                    >
                      <Icon className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-rose-400">Support</h3>
            <ul className="space-y-3 sm:space-y-4">
              {supportInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <li key={info.label}>
                    <a
                      href={info.href}
                      className="flex items-start space-x-2 sm:space-x-3 text-gray-300 hover:text-rose-400 transition-colors duration-200 group"
                    >
                      <Icon className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-400">{info.label}</div>
                        <div className="text-xs sm:text-sm break-words">{info.value}</div>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-rose-400">Company</h3>
            <ul className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
              <li>
                <Link to="/about" className="hover:text-rose-400 transition-colors duration-200 block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-rose-400 transition-colors duration-200 block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-rose-400 transition-colors duration-200 block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-rose-400 transition-colors duration-200 block">
                  Careers
                </Link>
              </li>
            </ul>
            
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-rose-900/20 to-amber-900/20 rounded-lg border border-rose-800/30">
              <h4 className="text-xs sm:text-sm font-semibold text-rose-400 mb-2">Business Hours</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <div>Mon - Fri: 8:00 AM - 10:00 PM</div>
                <div>Sat - Sun: 9:00 AM - 11:00 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 lg:space-y-0 text-center lg:text-left">
            <div className="text-xs sm:text-sm text-gray-400">
              © {new Date().getFullYear()} Sweet-Heaven. All rights reserved. Made with{' '}
              <Heart className="inline h-3 w-3 sm:h-4 sm:w-4 text-rose-500 fill-current mx-1" />
              for sweet lovers everywhere.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Online</span>
              </span>
              <span className="whitespace-nowrap">🍰 Fresh Daily</span>
              <span className="whitespace-nowrap">🚚 Free Delivery Over ₹50</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}