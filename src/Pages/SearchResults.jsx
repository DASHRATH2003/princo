import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchProducts } from '../services/productService';

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const q = query.get('q') || '';

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await searchProducts(q);
        const list = res?.data || (Array.isArray(res) ? res : res?.products) || [];
        setProducts(list);
      } catch (err) {
        setError('Search failed. Try again.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [q]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Removed internal search bar to keep only Navbar search */}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 mb-4">{error}</div>
        )}

        {!loading && !error && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Results for "{q}" ({products.length})</h2>
            {products.length === 0 ? (
              <p className="text-gray-600">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-white">
                      <img
                        src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={product.name}
                        className="w-full h-44 object-contain cursor-pointer"
                        onClick={() => navigate(`/product/${product._id}`)}
                        onError={(e) => { e.target.src = '/no-image.svg'; }}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-xs text-gray-600">{product.description}</p>
                      <p className="text-sm font-bold text-purple-600 mt-1">₹{Number(product.price || 0).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;