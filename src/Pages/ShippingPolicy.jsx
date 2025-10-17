import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-responsive">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
            
          </div>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                At L-Mart and L-mart, we aim to deliver your products quickly and safely. This Shipping Policy
                outlines our processing times, delivery options, and tracking procedures for our e-commerce platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Order Processing</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Orders are processed within 24–48 hours on business days (Mon–Sat).</li>
                <li>Custom/printed items may require 2–4 additional days for production.</li>
                <li>Orders placed on Sundays or public holidays are processed on the next business day.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Shipping Methods & Timelines</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Standard Delivery</h3>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    <li>3–7 business days for metro cities</li>
                    <li>5–10 business days for non-metro locations</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Express Delivery</h3>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    <li>1–3 business days (subject to availability)</li>
                    <li>Additional charges may apply</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Shipping Charges</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Shipping fees are calculated at checkout based on product weight, dimensions, destination,
                and delivery speed. Promotional free shipping offers, where applicable, will be applied automatically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Tracking Your Order</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Once shipped, you will receive an email/SMS with the courier details and tracking number.
                You can also view tracking information from the <strong>My Orders</strong> section.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. International Shipping</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                International delivery is available for select products. Duties, taxes, and fees imposed by the destination country
                are the customer’s responsibility.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Address Changes & Delivery Attempts</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Address changes are possible before dispatch. Contact support promptly.</li>
                <li>Couriers typically make 1–3 delivery attempts. Unsuccessful deliveries may be returned.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Lost or Damaged Packages</h2>
              <p className="text-gray-700 leading-relaxed">
                If your package is lost or arrives damaged, contact our support within 48 hours of delivery attempt with photos
                and the order ID. We will coordinate with the courier and provide a suitable resolution.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                For shipping-related queries, reach us at <strong>info@lmart.in</strong> or call <strong>+91 98804-44189</strong>.
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

export default ShippingPolicy;