import React, { useEffect } from 'react'
import { useCart } from '../context/CartContext'

const CartNotification = () => {
  const { notification, hideNotification } = useCart()

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        hideNotification()
      }, 3000) // Hide after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [notification.show, hideNotification])

  if (!notification.show) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
        </svg>
        <span className="font-medium">{notification.message}</span>
        <button 
          onClick={hideNotification}
          className="ml-2 text-white hover:text-gray-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default CartNotification