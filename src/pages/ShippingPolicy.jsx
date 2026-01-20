import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, Clock, Package, MapPin, Ban, Phone, Mail, AlertCircle } from 'lucide-react';

const ShippingPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">Shipping Policy</h1>
                    <p className="text-sm text-gray-500 mt-2">Last Updated: January 2026</p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <p className="text-gray-700">
                    At <strong>Kuber Fashions</strong>, we are committed to delivering your orders safely, securely, and within the promised time frame. Please read the shipping details carefully below.
                </p>

                {/* Shipping Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <Truck className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Free Shipping</h3>
                            <p className="text-sm text-gray-600">On orders above ₹5,000</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border flex items-start space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                            <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Fast Delivery</h3>
                            <p className="text-sm text-gray-600">5–7 business days</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border flex items-start space-x-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                            <Package className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Secure Packaging</h3>
                            <p className="text-sm text-gray-600">Quality-assured delivery</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border flex items-start space-x-3">
                        <div className="bg-orange-100 p-2 rounded-full">
                            <MapPin className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Chhattisgarh Only</h3>
                            <p className="text-sm text-gray-600">Pan India delivery currently not available</p>
                        </div>
                    </div>
                </div>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        📍 Shipping Coverage
                    </h2>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li><strong>Delivery Available in Chhattisgarh Only</strong></li>
                        <li><strong>Pan India Delivery is currently not available</strong></li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        Customers can enter their pin code on the product page to check delivery availability within Chhattisgarh.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        💰 Shipping Charges
                    </h2>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li><strong>Orders above ₹5,000:</strong> Free Shipping</li>
                        <li>Shipping charges (if applicable) may vary based on location and logistics requirements.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        ⏱ Estimated Delivery Time
                    </h2>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li><strong>Within Chhattisgarh:</strong> 5–7 business days</li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-2">
                        Delivery timelines are estimates and may vary due to weather conditions, public holidays, or logistical delays.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        📦 Order Processing
                    </h2>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li>Orders are processed within <strong>1–2 business days</strong> after payment confirmation.</li>
                        <li>Orders placed after <strong>3:00 PM</strong>, on weekends, or on public holidays are processed on the next business day.</li>
                        <li>Tracking details are shared once the order is dispatched.</li>
                    </ul>
                </section>

                <section className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Ban className="h-5 w-5 text-red-600" />
                        Cash on Delivery (COD)
                    </h2>
                    <p className="text-gray-700 mt-2">
                        <strong>COD is currently not available.</strong>
                    </p>
                </section>

                <section className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        Important Notes
                    </h2>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li>Please ensure accurate address details at checkout.</li>
                        <li>Delivery may be delayed due to customer unavailability or incorrect information.</li>
                        <li>Inspect the package upon delivery and report any issues immediately.</li>
                    </ul>
                </section>

                <section className="bg-gray-100 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        📞 Need Help?
                    </h2>
                    <p className="text-gray-700 mt-2">
                        For shipping-related queries, contact us at:
                    </p>
                    <div className="mt-4 space-y-2">
                        <p className="text-gray-700 flex items-center gap-2">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <strong>Email:</strong> <a href="mailto:kvisionbusinesssolution09@gmail.com" className="text-blue-600 hover:underline">kvisionbusinesssolution09@gmail.com</a>
                        </p>
                        <p className="text-gray-700 flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-600" />
                            <strong>Phone:</strong> <a href="tel:+919179193970" className="text-blue-600 hover:underline">+91 9179193970</a>
                        </p>
                    </div>
                </section>

                <div className="flex flex-wrap gap-4 pt-4">
                    <Link to="/return-policy" className="text-blue-600 hover:underline">View Return Policy →</Link>
                    <Link to="/refund-policy" className="text-blue-600 hover:underline">View Refund Policy →</Link>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
