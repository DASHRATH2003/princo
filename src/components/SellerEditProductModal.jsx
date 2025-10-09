// src/components/SellerEditProductModal.jsx
import React from 'react';

const SellerEditProductModal = ({ product, onClose, onUpdate }) => {
  return (
    <div className="modal">
      <h2>Edit Product</h2>
      {/* Add your edit form here */}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default SellerEditProductModal;