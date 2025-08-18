import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './Pages/Home'
import Printing from './Pages/Printing'
import EMarket from './Pages/EMarket'
import LocalMarket from './Pages/LocalMarket'
import NewsToday from './Pages/NewsToday'
import NotFound from './Pages/NotFound'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/printing" element={<Printing />} />
            <Route path="/e-market" element={<EMarket />} />
            <Route path="/local-market" element={<LocalMarket />} />
            <Route path="/news-today" element={<NewsToday />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App