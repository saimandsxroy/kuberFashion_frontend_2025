import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Mail, Phone, MapPin, CreditCard, Truck, Shield, RefreshCw, ArrowRight, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = [
  {
    label: 'Collection',
    links: [
      { title: 'New Arrivals', href: '/trending' },
      { title: 'Best Sellers', href: '/top-products' },
      { title: 'Recommended', href: '/interest-products' },
      { title: 'Mens Fashion', href: '/categories/mens-fashion' },
    ],
  },
  {
    label: 'Support',
    links: [
      { title: 'Track Order', href: '/orders' },
      { title: 'Shipping Policy', href: '/shipping-policy' },
      { title: 'Returns & Exchanges', href: '/return-policy' },
      { title: 'Chat on WhatsApp', href: 'https://wa.me/919179193970', external: true },
    ],
  },
  {
    label: 'Company',
    links: [
      { title: 'Our Story', href: '/about' },
      { title: 'Terms of Service', href: '/terms' },
      { title: 'Privacy Policy', href: '/privacy-policy' },
      { title: 'Refund Policy', href: '/refund-policy' },
    ],
  },
];

const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/kuberfashions_/', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/share/1GhdYhzpDY/', label: 'Facebook' },
  { icon: MapPin, href: 'https://maps.app.goo.gl/SXC5gYaQsDkqPbZLA?g_st=aw', label: 'Directions' },
];

const features = [
  { icon: Shield, title: 'Secure Payment', description: 'Encrypted and safe transactions' },
  { icon: CreditCard, title: 'Flexible Payment', description: 'UPI, Cards, and Net Banking' },
  { icon: Truck, title: 'Fast Shipping', description: 'Express delivery across India' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-white/10">
      {/* Features Banner - Minimalist */}
      <div className="border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 p-2 border border-white/20 rounded-full group-hover:border-white transition-colors duration-300">
                  <feature.icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-black uppercase tracking-[0.15em] text-white">
                Kuber Fashion
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-7 max-w-sm font-light">
              Your destination for premium fashion. Combining modern aesthetics with timeless comfort. Experience the new era of style.
            </p>

            <div className="space-y-4 pt-2">
              <a href="mailto:kuberfashionsvyasnagar@gmail.com" className="flex items-center space-x-3 text-sm text-gray-400 hover:text-white transition-colors group">
                <Mail className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                <span className="border-b border-transparent group-hover:border-white transition-all">kuberfashionsvyasnagar@gmail.com</span>
              </a>
              <a href="tel:+919179193970" className="flex items-center space-x-3 text-sm text-gray-400 hover:text-white transition-colors group">
                <Phone className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                <span className="border-b border-transparent group-hover:border-white transition-all">+91 9179193970</span>
              </a>
              <a href="https://maps.app.goo.gl/SXC5gYaQsDkqPbZLA?g_st=aw" target="_blank" rel="noopener noreferrer" className="flex items-start space-x-3 text-sm text-gray-400 hover:text-white transition-colors group">
                <MapPin className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors mt-1" />
                <span className="border-b border-transparent group-hover:border-white transition-all leading-relaxed">Nandeli, Pamgarh, Chhattisgarh, India</span>
              </a>
            </div>

            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12 lg:pl-12">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-8">
                  {section.label}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-400 hover:text-white transition-colors duration-300 flex items-center group w-fit"
                        >
                          <span className="border-b border-transparent group-hover:border-white transition-all pb-0.5">{link.title}</span>
                          <ArrowRight className="h-3 w-3 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-sm text-gray-400 hover:text-white transition-colors duration-300 flex items-center group w-fit"
                        >
                          <span className="border-b border-transparent group-hover:border-white transition-all pb-0.5">{link.title}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 uppercase tracking-wider">
          <p>&copy; {currentYear} Kuber Fashion. All rights reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
