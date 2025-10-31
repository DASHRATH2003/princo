import React from 'react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

const Wishlist = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart, setSelected } = useCart()
  const navigate = useNavigate()

  const handleBuyNow = (p) => {
    const effectivePrice = (p.offerPrice !== null && p.offerPrice !== undefined && Number(p.offerPrice) > 0) ? Number(p.offerPrice) : Number(p.price || 0)
    addToCart({ ...p, id: p._id || p.id, price: effectivePrice, quantity: 1 })
    setSelected([p._id || p.id])
    navigate('/checkout')
  }

  if (!items || items.length === 0) {
    return (
      <div className="container-responsive py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Wishlist</h2>
        <p className="text-gray-600">Your wishlist is empty.</p>
      </div>
    )
  }

  return (
    <div className="container-responsive py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Wishlist</h2>
        <button onClick={clearWishlist} className="px-3 py-2 bg-red-600 text-white rounded">Clear All</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p) => (
          <div key={p._id || p.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative">
              <img src={p.image || '/no-image.svg'} alt={p.name} className="w-full h-40 object-contain bg-white" onError={(e)=>{e.currentTarget.src='/no-image.svg'}} />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2">{p.name}</h3>
              <p className="text-lg font-semibold text-gray-900 mb-3">₹ {((p.offerPrice !== null && p.offerPrice !== undefined && Number(p.offerPrice) > 0) ? Number(p.offerPrice) : Number(p.price || 0))}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => handleBuyNow(p)} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">Buy Now</button>
                <button onClick={() => removeFromWishlist(p._id || p.id)} className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist