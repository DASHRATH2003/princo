import React, { createContext, useContext, useEffect, useReducer } from 'react'

const WishlistContext = createContext()

const ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  LOAD: 'LOAD',
  CLEAR: 'CLEAR'
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD: {
      const item = action.payload
      const id = item._id || item.id
      if (!id) return state
      const exists = state.items.some(p => (p._id || p.id) === id)
      const items = exists ? state.items : [...state.items, { ...item }]
      return { ...state, items }
    }
    case ACTIONS.REMOVE: {
      const id = action.payload
      return { ...state, items: state.items.filter(p => (p._id || p.id) !== id) }
    }
    case ACTIONS.LOAD:
      return { ...state, items: Array.isArray(action.payload) ? action.payload : [] }
    case ACTIONS.CLEAR:
      return { ...state, items: [] }
    default:
      return state
  }
}

const initialState = { items: [] }

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const raw = localStorage.getItem('wishlist')
    if (raw) {
      try {
        const data = JSON.parse(raw)
        dispatch({ type: ACTIONS.LOAD, payload: data })
      } catch (e) {
        localStorage.removeItem('wishlist')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.items))
  }, [state.items])

  const addToWishlist = (product) => {
    if (!product) return
    dispatch({ type: ACTIONS.ADD, payload: product })
  }
  const removeFromWishlist = (id) => dispatch({ type: ACTIONS.REMOVE, payload: id })
  const clearWishlist = () => {
    dispatch({ type: ACTIONS.CLEAR })
    localStorage.removeItem('wishlist')
  }
  const isWishlisted = (id) => state.items.some(p => (p._id || p.id) === id)
  const getWishlistCount = () => state.items.length

  const value = {
    items: state.items,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isWishlisted,
    getWishlistCount
  }
  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

export default WishlistContext