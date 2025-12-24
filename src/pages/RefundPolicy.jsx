import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const RefundPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">Refund Policy</h1>
                    <p className="text-sm text-gray-500 mt-2">Last Updated: December 2024</p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <p className="text-gray-700">
                    At Kuberfashions, we strive to ensure your complete satisfaction with every purchase. This Refund Policy outlines the conditions under which refunds are processed.
                </p>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Eligibility for Refund</h2>
                    <p className="text-gray-700 mt-2">Refunds may be issued under the following circumstances:</p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li>Product received is damaged or defective</li>
                        <li>Wrong product delivered (different from what was ordered)</li>
                        <li>Product does not match the description on the website</li>
                        <li>Product is missing from the delivered package</li>
                        <li>Order cancelled before dispatch</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Refund Timeline</h2>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-2">
                        <ul className="text-gray-700 space-y-2">
                            <li><strong>Inspection Period:</strong> 3-5 business days after receiving the returned product</li>
                            <li><strong>Refund Processing:</strong> 5-7 business days after approval</li>
                            <li><strong>Bank Credit:</strong> May take additional 5-10 business days depending on your bank</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Refund Methods</h2>
                    <p className="text-gray-700 mt-2">Refunds will be processed through the same payment method used for the original purchase:</p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li><strong>Credit/Debit Card:</strong> Amount credited to the original card</li>
                        <li><strong>UPI:</strong> Amount credited to the linked bank account</li>
                        <li><strong>Net Banking:</strong> Amount credited to the bank account</li>
                        <li><strong>Wallet:</strong> Credited back to the wallet or as store credit</li>
                        <li><strong>COD (Cash on Delivery):</strong> Refund via bank transfer (NEFT/IMPS)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Non-Refundable Items</h2>
                    <p className="text-gray-700 mt-2">The following items are not eligible for refund:</p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li>Items marked as "Final Sale" or "Non-Returnable"</li>
                        <li>Innerwear, lingerie, and swimwear (for hygiene reasons)</li>
                        <li>Customized or personalized products</li>
                        <li>Products with removed tags or altered condition</li>
                        <li>Items returned after the return window expires</li>
                        <li>Free gifts or promotional items</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Partial Refunds</h2>
                    <p className="text-gray-700 mt-2">
                        In some cases, we may issue partial refunds if the product shows signs of use, has missing accessories, or is not in its original condition.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Order Cancellation Refunds</h2>
                    <p className="text-gray-700 mt-2">
                        If you cancel your order before it is dispatched, you will receive a full refund within 5-7 business days. Orders already dispatched cannot be cancelled and must follow the return process.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">How to Request a Refund</h2>
                    <ol className="list-decimal pl-6 text-gray-700 mt-2 space-y-2">
                        <li>Log in to your Kuberfashions account</li>
                        <li>Go to "My Orders" and select the order</li>
                        <li>Click on "Return/Refund" and select the reason</li>
                        <li>Upload photos of the product if applicable</li>
                        <li>Submit the request and wait for confirmation</li>
                    </ol>
                    <p className="text-gray-700 mt-2">
                        Alternatively, you can email us at <a href="mailto:kvisionbusinesssolution09@gmail.com" className="text-blue-600 hover:underline">kvisionbusinesssolution09@gmail.com</a> with your order details.
                    </p>
                </section>

                <section className="bg-gray-100 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
                    <p className="text-gray-700 mt-2">
                        For refund-related queries, please contact:
                    </p>
                    <div className="mt-4 space-y-2">
                        <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:kvisionbusinesssolution09@gmail.com" className="text-blue-600 hover:underline">kvisionbusinesssolution09@gmail.com</a></p>
                        <p className="text-gray-700"><strong>Phone:</strong> <a href="tel:+919179193970" className="text-blue-600 hover:underline">+91 9179193970</a></p>
                        <p className="text-gray-700"><strong>Address:</strong> Nandeli, Chowk Vyasnagar Nariyara, Pamgarh, Janjgir-Champa, Chhattisgarh – 495554</p>
                    </div>
                </section>

                <div className="flex flex-wrap gap-4 pt-4">
                    <Link to="/return-policy" className="text-blue-600 hover:underline">View Return Policy →</Link>
                    <Link to="/shipping-policy" className="text-blue-600 hover:underline">View Shipping Policy →</Link>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
