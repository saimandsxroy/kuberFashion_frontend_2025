import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ReturnPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">Return Policy</h1>
                    <p className="text-sm text-gray-500 mt-2">Last Updated: December 2024</p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <p className="text-gray-700">
                    At Kuberfashions, we want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help with our hassle-free return policy.
                </p>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Return Window</h2>
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mt-2">
                        <p className="text-gray-700">
                            <strong>7 Days Return Policy:</strong> You can initiate a return within 7 days from the date of delivery.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Conditions for Return</h2>
                    <p className="text-gray-700 mt-2">To be eligible for a return, the product must:</p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li>Be unused and in the same condition as received</li>
                        <li>Have all original tags and labels attached</li>
                        <li>Be in the original packaging with all accessories</li>
                        <li>Include the invoice or order confirmation</li>
                        <li>Not be washed, altered, or damaged by the customer</li>
                    </ul>
                </section>

               

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">How to Initiate a Return</h2>
                    <ol className="list-decimal pl-6 text-gray-700 mt-2 space-y-2">
                        <li><strong>Log in</strong> to your Kuberfashions account</li>
                        <li>Navigate to <strong>"My Orders"</strong></li>
                        <li>Select the order containing the item you wish to return</li>
                        <li>Click on <strong>"Return"</strong> and select the reason</li>
                        <li>Upload clear photos of the product (if applicable)</li>
                        <li>Choose your preferred resolution (refund or exchange)</li>
                        <li>Submit the return request</li>
                    </ol>
                    <p className="text-gray-700 mt-4">
                        You will receive a confirmation email with next steps within 24-48 hours.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Return Pickup</h2>
                    <p className="text-gray-700 mt-2">
                        Once your return is approved, we will arrange a pickup from your registered address. Please ensure the product is packed securely.
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li><strong>Pickup Attempt:</strong> Within 3-5 business days of approval</li>
                        <li><strong>Self-Ship Option:</strong> Available for remote locations (shipping cost reimbursed)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Return Processing</h2>
                    <div className="overflow-x-auto mt-2">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stage</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Timeline</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="px-4 py-3 text-gray-700">Return Request Approval</td>
                                    <td className="px-4 py-3 text-gray-700">24-48 hours</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-gray-700">Pickup Scheduling</td>
                                    <td className="px-4 py-3 text-gray-700">3-5 business days</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-gray-700">Quality Check</td>
                                    <td className="px-4 py-3 text-gray-700">3-5 business days after receipt</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-gray-700">Refund/Exchange Processing</td>
                                    <td className="px-4 py-3 text-gray-700">5-7 business days</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Exchange Policy</h2>
                    <p className="text-gray-700 mt-2">
                        We offer exchanges for size and color variations subject to availability. If the requested size/color is unavailable, you can opt for a refund or store credit.
                    </p>
                </section>

                <section className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <h2 className="text-lg font-semibold text-gray-900">Important Notes</h2>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li>Original shipping charges are non-refundable</li>
                        <li>Promotional discounts may be adjusted in the refund amount</li>
                        <li>Multiple failed pickup attempts may result in return cancellation</li>
                    </ul>
                </section>

                <section className="bg-gray-100 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900">Need Help?</h2>
                    <p className="text-gray-700 mt-2">
                        For return-related assistance, contact our support team:
                    </p>
                    <div className="mt-4 space-y-2">
                        <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:kvisionbusinesssolution09@gmail.com" className="text-blue-600 hover:underline">kvisionbusinesssolution09@gmail.com</a></p>
                        <p className="text-gray-700"><strong>Phone:</strong> <a href="tel:+919179193970" className="text-blue-600 hover:underline">+91 9179193970</a></p>
                    </div>
                </section>

                <div className="flex flex-wrap gap-4 pt-4">
                    <Link to="/refund-policy" className="text-blue-600 hover:underline">View Refund Policy →</Link>
                    <Link to="/shipping-policy" className="text-blue-600 hover:underline">View Shipping Policy →</Link>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicy;
