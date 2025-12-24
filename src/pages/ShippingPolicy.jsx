import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, Clock, Package, MapPin } from 'lucide-react';

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
                    <p className="text-sm text-gray-500 mt-2">Last Updated: December 2024</p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <p className="text-gray-700">
                    At Kuberfashions, we are committed to delivering your orders in a timely and secure manner. Please review our shipping policy for complete details.
                </p>

                {/* Shipping Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <Truck className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Free Shipping</h3>
                            <p className="text-sm text-gray-600">On orders above ₹999</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border flex items-start space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                            <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Fast Delivery</h3>
                            <p className="text-sm text-gray-600">5-7 business days</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border flex items-start space-x-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                            <Package className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Secure Packaging</h3>
                            <p className="text-sm text-gray-600">Quality assured delivery</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border flex items-start space-x-3">
                        <div className="bg-orange-100 p-2 rounded-full">
                            <MapPin className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Pan India Delivery</h3>
                            <p className="text-sm text-gray-600">Across all serviceable pin codes</p>
                        </div>
                    </div>
                </div>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Shipping Coverage</h2>
                    <p className="text-gray-700 mt-2">
                        We currently ship to all serviceable pin codes across India. Enter your pin code on the product page to check delivery availability and estimated delivery time.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Shipping Charges</h2>
                    <div className="overflow-x-auto mt-2">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Order Value</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Shipping Charge</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="px-4 py-3 text-gray-700">Above ₹999</td>
                                    <td className="px-4 py-3 text-green-600 font-medium">FREE</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-gray-700">₹500 - ₹999</td>
                                    <td className="px-4 py-3 text-gray-700">₹49</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-gray-700">Below ₹500</td>
                                    <td className="px-4 py-3 text-gray-700">₹79</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        *Shipping charges for remote or special zones may vary.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Estimated Delivery Time</h2>
                    <div className="overflow-x-auto mt-2">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Location</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Delivery Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="px-4 py-3 text-gray-700">Metro Cities (Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata)</td>
                                    <td className="px-4 py-3 text-gray-700">3-5 business days</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-gray-700">Tier 2 Cities</td>
                                    <td className="px-4 py-3 text-gray-700">5-7 business days</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-gray-700">Other Locations</td>
                                    <td className="px-4 py-3 text-gray-700">7-10 business days</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-gray-700">Remote Areas / North-East</td>
                                    <td className="px-4 py-3 text-gray-700">10-15 business days</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        *Delivery times are estimates and may vary due to external factors like weather, public holidays, or logistic disruptions.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Order Processing</h2>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li>Orders are processed within 1-2 business days after payment confirmation</li>
                        <li>Orders placed after 3:00 PM or on weekends/holidays are processed the next business day</li>
                        <li>You will receive an email with tracking details once the order is dispatched</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Order Tracking</h2>
                    <p className="text-gray-700 mt-2">
                        Track your order using any of the following methods:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li>Login to your Kuberfashions account and go to "My Orders"</li>
                        <li>Use the tracking link sent to your registered email/SMS</li>
                        <li>Contact our customer support with your order ID</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Cash on Delivery (COD)</h2>
                    <p className="text-gray-700 mt-2">
                        COD is available for most serviceable pin codes. Additional COD charges may apply:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li><strong>COD Charge:</strong> ₹50 (for orders below ₹999)</li>
                        <li><strong>Free COD:</strong> On orders above ₹999</li>
                    </ul>
                </section>

                <section className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <h2 className="text-lg font-semibold text-gray-900">Important Notes</h2>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li>Delivery attempts are made 2-3 times. Failed attempts may result in order return.</li>
                        <li>Ensure someone is available at the delivery address to receive the package.</li>
                        <li>Verify the package before accepting; report any damage immediately.</li>
                        <li>We are not responsible for delays due to incorrect address or customer unavailability.</li>
                    </ul>
                </section>

                <section className="bg-gray-100 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900">Need Help?</h2>
                    <p className="text-gray-700 mt-2">
                        For shipping-related queries, contact:
                    </p>
                    <div className="mt-4 space-y-2">
                        <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:kvisionbusinesssolution09@gmail.com" className="text-blue-600 hover:underline">kvisionbusinesssolution09@gmail.com</a></p>
                        <p className="text-gray-700"><strong>Phone:</strong> <a href="tel:+919179193970" className="text-blue-600 hover:underline">+91 9179193970</a></p>
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
