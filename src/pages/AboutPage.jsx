import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Truck, Award } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white">
                <div className="absolute inset-0">
                    <img
                        className="w-full h-full object-cover opacity-30"
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Fashion background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
                            Our Story
                        </h1>
                        <p className="mt-6 text-xl max-w-3xl text-gray-300">
                            Redefining fashion for the modern individual. At KuberFashion, we believe style is more than just what you wear—it's how you express yourself to the world.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-16 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
                                    Crafting Confidence Through Style
                                </h2>
                                <div className="prose prose-lg text-gray-500 space-y-6">
                                    <p>
                                        Founded in 2025, KuberFashion started with a simple mission: to make high-quality, trendsetting fashion accessible to everyone. We scour the globe for the finest fabrics and latest designs to bring you collections that inspire.
                                    </p>
                                    <p>
                                        Our journey began in a small studio in Chhattisgarh, driven by a passion for textiles and a vision for a brand that honors tradition while embracing modernity. Today, we are proud to serve customers across the nation, delivering not just clothes, but confidence.
                                    </p>
                                    <p>
                                        We are committed to sustainability and ethical practices. Every piece you buy is a testament to our dedication to quality craftsmanship and responsible fashion.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                        <div className="mt-12 lg:mt-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="rounded-2xl shadow-xl overflow-hidden"
                            >
                                <img
                                    className="w-full h-full object-cover"
                                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                    alt="Fashion Design"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Why Choose Us</h2>
                        <p className="mt-4 text-lg text-gray-500">The pillars that define the KuberFashion experience.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                icon: ShoppingBag,
                                title: 'Trendsetting Designs',
                                description: 'Curated collections that keep you ahead of the curve.',
                            },
                            {
                                icon: Star,
                                title: 'Premium Quality',
                                description: 'Uncompromising attention to detail and fabric quality.',
                            },
                            {
                                icon: Truck,
                                title: 'Fast Shipping',
                                description: 'Quick and reliable delivery to your doorstep.',
                            },
                            {
                                icon: Award,
                                title: 'Customer First',
                                description: 'Dedicated support to ensure your satisfaction.',
                            },
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
                                    <value.icon className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-500">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
