import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-responsive">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund & Return Policy</h1>
           
          </div>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                We want you to be fully satisfied with your purchase from Lmart and L-mart.
                This policy outlines the conditions under which returns, refunds, and replacements are accepted for our e-commerce platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Eligibility for Returns</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Products can be returned within <strong>7 days</strong> of delivery.</li>
                <li>Items must be in unused, original condition with packaging intact.</li>
                <li>Custom-printed or personalized items are <strong>non-returnable</strong> unless damaged or defective.</li>
                <li>Software licenses and digital goods are non-returnable once delivered/activated.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Damaged or Defective Items</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you receive a damaged or defective product, contact us within <strong>48 hours</strong> of delivery with photos and your order ID.
                We will offer a <strong>replacement</strong> or <strong>full refund</strong> after verification.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Refund Timelines</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Approved refunds are initiated within <strong>3–7 business days</strong>.</li>
                <li>Refunds are processed to the original payment method.</li>
                <li>Bank processing times may vary by provider.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Return Shipping</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Customers are responsible for return shipping costs unless the item is defective or incorrect.
                For eligible cases, we may provide a prepaid return label.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Order Cancellations</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Orders can be cancelled before dispatch by contacting support. Custom orders may not be cancellable once production begins.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Non-Refundable Items</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Personalized or custom-printed products (unless defective)</li>
                <li>Opened software licenses and digital products</li>
                <li>Gift cards and promotional vouchers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. How to Initiate a Return</h2>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Go to the <strong>My Orders</strong> section and select the order.</li>
                <li>Click <strong>Request Return</strong> and provide details with photos if applicable.</li>
                <li>Ship the item using the provided instructions (if approved).</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                For refund-related queries, reach us at <strong>info@lmart.in</strong> or call <strong>+91 98804-44189</strong>.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;