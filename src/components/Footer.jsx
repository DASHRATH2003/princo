import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/Mmin.png'

// Import your social icons (place them inside /src/assets/)
import twitterIcon from '../assets/twiter.png'
import facebookIcon from '../assets/Facebook.png'
import instagramIcon from '../assets/instagram.jpeg'
import youtubeIcon from '../assets/youtube.jpg'

const Footer = () => {
  return (
    <footer className="bg-[rgb(5,5,85)] text-white">
      <div className="container-responsive py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={logo} 
                alt="Company Logo" 
                className="w-18 h-20 object-contain"
              />
            </div>
            <p className="text-gray-400 mb-4 max-w-xs text-sm leading-relaxed">
              Your trusted partner for all printing needs, office supplies, and digital solutions. 
              We provide high-quality services to help your business grow.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://twitter.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition transform"
              >
                <img 
                  src={twitterIcon} 
                  alt="Twitter" 
                  className="w-8 h-8 rounded-full bg-white p-1 hover:opacity-80"
                />
              </a>

              <a 
                href="https://facebook.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition transform"
              >
                <img 
                  src={facebookIcon} 
                  alt="Facebook" 
                  className="w-8 h-8 rounded-full bg-white p-1 hover:opacity-80"
                />
              </a>

              <a 
                href="https://instagram.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition transform"
              >
                <img 
                  src={instagramIcon} 
                  alt="Instagram" 
                  className="w-8 h-8 rounded-full bg-white p-1 hover:opacity-80"
                />
              </a>

              <a 
                href="https://youtube.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition transform"
              >
                <img 
                  src={youtubeIcon} 
                  alt="YouTube" 
                  className="w-8 h-8 rounded-full bg-white p-1 hover:opacity-80"
                />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition hover:translate-x-1 inline-block">Home</Link></li>
              <li><Link to="/e-market" className="text-gray-400 hover:text-white transition hover:translate-x-1 inline-block">E-Market</Link></li>
              <li><Link to="/local-market" className="text-gray-400 hover:text-white transition hover:translate-x-1 inline-block">Local Market</Link></li>
              <li><Link to="/printing" className="text-gray-400 hover:text-white transition hover:translate-x-1 inline-block">Printing</Link></li>
              <li><Link to="/news-today" className="text-gray-400 hover:text-white transition hover:translate-x-1 inline-block">MARKET NEWS</Link></li>
            </ul>
          </div>

          {/* Terms & Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Terms & Policies</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition hover:translate-x-1 inline-block">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white transition hover:translate-x-1 inline-block">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="text-gray-400 hover:text-white transition hover:translate-x-1 inline-block">Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-400 hover:text-white transition hover:translate-x-1 inline-block">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center group">
                <svg className="w-5 h-5 mr-2 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="group-hover:text-white transition">+91 98804-44189</span>
              </div>

              <div className="flex items-center group">
                <svg className="w-5 h-5 mr-2 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="group-hover:text-white transition">info@lmart.in</span>
              </div>

              <div className="flex items-center group">
                <svg className="w-5 h-5 mr-2 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="group-hover:text-white transition">#56 Industrial Estate, SINDAGI - 586128</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-sm">&copy; 2024 E-Market. All rights reserved. | Since 2025</p>
            <div className="text-sm">
              <span>Building Trust Through Quality Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
