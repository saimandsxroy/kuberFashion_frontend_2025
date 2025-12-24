import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">Privacy Policy</h1>
                    <p className="text-sm text-gray-500 mt-2">Last Updated: December 2024</p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <p className="text-gray-700">
                    This Privacy Policy describes how Kuberfashions ("we", "us", or "our") collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from https://kuberfashions.in (the "Site") or otherwise interact with us (collectively, the "Services").
                </p>

                <p className="text-gray-700">
                    Kuberfashions.in is owned, operated, and managed by <strong>Kvision Business Solution Private Limited</strong>, an Indian private limited company.
                </p>

                <p className="text-gray-700">
                    For the purposes of this Privacy Policy, "you" and "your" refer to the user of the Services, whether you are a customer, website visitor, or any other individual whose information we collect.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-gray-700">
                        By accessing or using our Services, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree, please do not use the Services.
                    </p>
                </div>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Changes to This Privacy Policy</h2>
                    <p className="text-gray-700 mt-2">
                        We may update this Privacy Policy from time to time to reflect changes in our business practices, legal requirements, or operational reasons. Any changes will be posted on this page with an updated "Last Updated" date.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">How We Collect and Use Your Personal Information</h2>
                    <p className="text-gray-700 mt-2">
                        We collect limited personal information from various sources to provide and improve our Services. The information collected depends on how you interact with our Site, whether online through kuberfashions.in or at our physical retail stores.
                    </p>
                    <p className="text-gray-700 mt-2">We use your information to:</p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li>Provide products and services</li>
                        <li>Process payments and orders</li>
                        <li>Communicate with you</li>
                        <li>Comply with legal obligations</li>
                        <li>Prevent fraud and misuse</li>
                        <li>Improve customer experience</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Personal Information We Collect</h2>

                    <h3 className="text-lg font-medium text-gray-800 mt-4">Information You Provide Directly</h3>
                    <p className="text-gray-700 mt-2">This includes:</p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li>Name, phone number, email address</li>
                        <li>Billing and shipping address</li>
                        <li>Order and transaction details</li>
                        <li>Items viewed, added to cart, or wishlisted</li>
                        <li>Communications with customer support</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        Providing certain information is necessary to use specific features of the Services. Choosing not to provide this information may limit your access.
                    </p>

                    <h3 className="text-lg font-medium text-gray-800 mt-4">Information Collected from Third Parties</h3>
                    <p className="text-gray-700 mt-2">We may receive information from trusted third parties, such as:</p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li>Payment gateways and processors (to complete transactions)</li>
                        <li>Logistics and delivery partners</li>
                        <li>Website hosting, analytics, and technical service providers</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        All such information is handled in accordance with this Privacy Policy. We are not responsible for the privacy practices of third-party services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">How We Use Your Personal Information</h2>

                    <h3 className="text-lg font-medium text-gray-800 mt-4">1. Providing Products and Services</h3>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li>Process orders and payments</li>
                        <li>Deliver products</li>
                        <li>Handle returns, exchanges, and refunds</li>
                        <li>Send order confirmations and updates</li>
                    </ul>

                    <h3 className="text-lg font-medium text-gray-800 mt-4">2. Marketing and Promotions</h3>
                    <p className="text-gray-700 mt-2">
                        With your consent, we may send promotional messages via email, SMS, WhatsApp, or other channels. You can opt out anytime.
                    </p>

                    <h3 className="text-lg font-medium text-gray-800 mt-4">3. Security and Fraud Prevention</h3>
                    <p className="text-gray-700 mt-2">
                        To protect our business and customers from fraud, misuse, or unauthorized access.
                    </p>

                    <h3 className="text-lg font-medium text-gray-800 mt-4">4. Customer Support</h3>
                    <p className="text-gray-700 mt-2">
                        To respond to queries, complaints, and service requests efficiently.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Disclosure of Personal Information</h2>
                    <p className="text-gray-700 mt-2">We may share your personal information only when necessary, including:</p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li>With service providers (payment, logistics, IT support)</li>
                        <li>To comply with legal obligations</li>
                        <li>With your explicit consent</li>
                    </ul>
                    <p className="text-gray-700 mt-2 font-medium">
                        We do not sell your personal information to third parties.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Data Security</h2>
                    <p className="text-gray-700 mt-2">
                        We take reasonable technical and organizational measures to protect your personal information. However, no online platform is completely secure, and we cannot guarantee absolute security.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Your Rights</h2>
                    <p className="text-gray-700 mt-2">You have the right to:</p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                        <li>Access your personal data</li>
                        <li>Request correction or deletion</li>
                        <li>Withdraw consent for marketing communications</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        You may contact us using the details below to exercise these rights.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Third-Party Links</h2>
                    <p className="text-gray-700 mt-2">
                        Our Site may contain links to third-party websites. We are not responsible for their privacy practices or content.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900">Children's Privacy</h2>
                    <p className="text-gray-700 mt-2">
                        Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal data from minors.
                    </p>
                </section>

                <section className="bg-gray-100 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
                    <p className="text-gray-700 mt-2">
                        For any questions or concerns regarding this Privacy Policy, please contact:
                    </p>
                    <div className="mt-4 space-y-2">
                        <p className="text-gray-700"><strong>Company:</strong> Kvision Business Solution Private Limited</p>
                        <p className="text-gray-700"><strong>Operating Brand:</strong> Kuberfashions</p>
                        <p className="text-gray-700"><strong>Website:</strong> <a href="https://kuberfashions.in" className="text-blue-600 hover:underline">https://kuberfashions.in</a></p>
                        <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:kvisionbusinesssolution09@gmail.com" className="text-blue-600 hover:underline">kvisionbusinesssolution09@gmail.com</a></p>
                        <p className="text-gray-700"><strong>Address:</strong> Nandeli, Chowk Vyasnagar Nariyara, Pamgarh, Janjgir-Champa, Chhattisgarh – 495554</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
