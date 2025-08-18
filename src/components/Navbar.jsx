import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="bg-white shadow-sm">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-orange-300 rounded-full flex items-center justify-center bg-white relative overflow-hidden">
                {/* Main P letter in brown */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-amber-700 font-bold text-sm sm:text-lg">P</div>
                </div>
                {/* Light purple shape to the right of P */}
                <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2">
                  <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-purple-300 rounded-full"></div>
                </div>
                {/* Red vertical rectangle (like 'I') to the right */}
                <div className="absolute right-0.5 sm:right-1 top-1/2 transform -translate-y-1/2 w-0.5 h-1.5 sm:h-2 bg-red-500"></div>
                {/* Light blue and green text below - "ce. 20" */}
                <div className="absolute bottom-0.5 sm:bottom-1 left-1/2 transform -translate-x-1/2 text-xs">
                  <span className="text-blue-300">ce.</span>
                  <span className="text-green-300 ml-0.5">20</span>
                </div>
              </div>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-purple-800">printco</div>
          </div>

          {/* Contact and Icons - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-purple-800 font-semibold">Call US : 9880444189</div>
            <div className="flex space-x-3">
              {/* Circular icons with purple outline */}
              <button className="w-8 h-8 border border-purple-300 rounded-full flex items-center justify-center bg-white">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
              <button className="w-8 h-8 border border-purple-300 rounded-full flex items-center justify-center bg-white">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button className="w-8 h-8 border border-purple-300 rounded-full flex items-center justify-center bg-white">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Contact - Visible only on mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="text-sm text-purple-800 font-semibold">9880444189</div>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-yellow-400 rounded-md"
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Hamburger Menu - Hidden on desktop */}
            <div className="md:hidden"></div>

            {/* Navigation Links - Hidden on mobile, visible on desktop */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium">Home</Link>
              <Link to="/printing" className="text-gray-700 hover:text-purple-600 font-medium">Printing</Link>
              <Link to="/e-market" className="text-gray-700 hover:text-purple-600 font-medium">E-Market</Link>
              <Link to="/local-market" className="text-gray-700 hover:text-purple-600 font-medium">Local Market</Link>
              <Link to="/news-today" className="text-gray-700 hover:text-purple-600 font-medium">NEWS TODAY</Link>
            </nav>

            {/* Search and Actions - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Bar - White background */}
              <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
                <input
                  type="text"
                  placeholder="Search bar"
                  className="bg-transparent outline-none text-sm w-32 text-gray-500"
                />
                <button className="ml-2 p-1 bg-blue-400 text-white rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              <button className="text-gray-700 font-medium text-sm">Join US</button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-purple-600 font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/printing" 
                className="text-gray-700 hover:text-purple-600 font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Printing
              </Link>
              <Link 
                to="/e-market" 
                className="text-gray-700 hover:text-purple-600 font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                E-Market
              </Link>
              <Link 
                to="/local-market" 
                className="text-gray-700 hover:text-purple-600 font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Local Market
              </Link>
              <Link 
                to="/news-today" 
                className="text-gray-700 hover:text-purple-600 font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                NEWS TODAY
              </Link>
            </nav>

            {/* Mobile Search */}
            <div className="pt-4">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm flex-1 text-gray-500"
                />
                <button className="ml-2 p-1 bg-blue-400 text-white rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 space-y-2">
              <button className="w-full text-left text-gray-700 font-medium py-2">Join US</button>
              <div className="flex space-x-4 pt-2">
                <a href="#" className="flex items-center text-gray-700 hover:text-purple-600 text-sm">
                  <svg className="w-4 h-4 mr-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload files
                </a>
                <a href="#" className="flex items-center text-gray-700 hover:text-purple-600 text-sm">
                  <svg className="w-4 h-4 mr-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Actions - Below search bar as per image - Hidden on mobile */}
      <div className="hidden md:block border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end space-x-6 py-2">
            <a href="#" className="flex items-center text-gray-700 hover:text-purple-600 text-sm">
              <svg className="w-4 h-4 mr-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload files
            </a>
            <a href="#" className="flex items-center text-gray-700 hover:text-purple-600 text-sm">
              <svg className="w-4 h-4 mr-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
