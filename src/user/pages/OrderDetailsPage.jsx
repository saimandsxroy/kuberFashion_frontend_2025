import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Truck, CheckCircle, Clock, XCircle, ShoppingBag } from 'lucide-react';
import { Button } from '../../components/Button';
import { ordersAPI } from '../../services/api';
import { cn } from '../../lib/utils';

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await ordersAPI.getOrderById(orderId);
                if (response.data?.success) {
                    setOrder(response.data.data);
                } else {
                    setError('Order not found');
                }
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const getStatusIcon = (status) => {
        switch (status?.toUpperCase()) {
            case 'DELIVERED':
                return <CheckCircle className="h-6 w-6 text-green-500" />;
            case 'SHIPPED':
                return <Truck className="h-6 w-6 text-blue-500" />;
            case 'CONFIRMED':
                return <Package className="h-6 w-6 text-purple-500" />;
            case 'CANCELLED':
                return <XCircle className="h-6 w-6 text-red-500" />;
            default:
                return <Clock className="h-6 w-6 text-yellow-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'SHIPPED':
                return 'bg-blue-100 text-blue-800';
            case 'CONFIRMED':
                return 'bg-purple-100 text-purple-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'Unable to load order details'}</p>
                    <Button onClick={() => navigate('/orders')} className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-full">
                        Back to Orders
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-gray-100">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <Button
                            onClick={() => navigate('/orders')}
                            variant="ghost"
                            className="group flex items-center space-x-2 text-gray-500 hover:text-black transition-colors -ml-2"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-widest">Back to Orders</span>
                        </Button>
                        <h1 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tighter">
                            Order #{order.orderNumber || order.id}
                        </h1>
                        <div className="w-20" />
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Order Items & Shipping */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Status */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {getStatusIcon(order.status)}
                                    <div>
                                        <h2 className="text-lg font-bold text-black uppercase">{order.status}</h2>
                                        <p className="text-sm text-gray-500">
                                            {order.status === 'DELIVERED'
                                                ? `Delivered on ${new Date(order.deliveredAt || order.updatedAt).toLocaleDateString()}`
                                                : `Last updated ${new Date(order.updatedAt || order.createdAt).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                </div>
                                <span className={cn("px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider", getStatusColor(order.status))}>
                                    {order.status}
                                </span>
                            </div>
                        </motion.div>

                        {/* Order Items */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center">
                                <Package className="w-5 h-5 mr-2" />
                                Order Items ({order.totalItems || order.orderItems?.length || 0})
                            </h2>
                            <div className="space-y-4">
                                {(order.orderItems || []).map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                                    >
                                        <div className="w-20 h-24 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                            <img
                                                src={item.product?.image || '/placeholder.jpg'}
                                                alt={item.product?.name || 'Product'}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-black truncate">{item.product?.name || 'Product'}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Qty: {item.quantity}
                                                {item.selectedSize && ` • Size: ${item.selectedSize}`}
                                                {item.selectedColor && ` • Color: ${item.selectedColor}`}
                                            </p>
                                            <p className="text-sm font-medium text-gray-700 mt-1">₹{item.unitPrice} each</p>
                                        </div>
                                        <p className="font-bold text-black">₹{(item.unitPrice * item.quantity).toFixed(0)}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Shipping Address */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2" />
                                Shipping Address
                            </h2>
                            <div className="p-6 bg-gray-50 rounded-xl">
                                <p className="font-bold text-black">
                                    {order.shippingFirstName} {order.shippingLastName}
                                </p>
                                <p className="text-gray-600 mt-1">{order.shippingAddressLine1}</p>
                                {order.shippingAddressLine2 && <p className="text-gray-600">{order.shippingAddressLine2}</p>}
                                <p className="text-gray-600">
                                    {order.shippingCity}, {order.shippingState} - {order.shippingPostalCode}
                                </p>
                                <p className="text-gray-600">{order.shippingCountry}</p>
                                {order.shippingPhone && <p className="text-gray-500 mt-2">📞 {order.shippingPhone}</p>}
                            </div>
                        </motion.section>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gray-50 rounded-2xl p-6 sticky top-8"
                        >
                            <h2 className="text-lg font-black uppercase tracking-tight mb-6">Order Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Order Date</span>
                                    <span className="font-medium text-black flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Payment Method</span>
                                    <span className="font-medium text-black flex items-center">
                                        <CreditCard className="w-4 h-4 mr-1" />
                                        {order.paymentMethod === 'PHONEPE' ? 'PhonePe' : 'Cash on Delivery'}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Payment Status</span>
                                    <span className={cn(
                                        "px-2 py-1 rounded text-xs font-medium",
                                        order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    )}>
                                        {order.paymentStatus}
                                    </span>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-medium text-black">₹{Number(order.subtotal).toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className="font-medium text-black">₹{Number(order.shippingAmount).toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Tax (5% GST)</span>
                                        <span className="font-medium text-black">₹{Number(order.taxAmount).toFixed(0)}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                                    <span className="font-black text-black uppercase tracking-tight">Total</span>
                                    <span className="text-2xl font-black text-black">₹{Number(order.totalAmount).toFixed(0)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 space-y-3">
                                <Button
                                    onClick={() => navigate('/')}
                                    className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-full font-bold uppercase tracking-widest text-sm"
                                >
                                    Continue Shopping
                                </Button>
                                {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                                    <Button
                                        variant="outline"
                                        className="w-full border-red-500 text-red-500 hover:bg-red-50 py-3 rounded-full font-bold uppercase tracking-widest text-sm"
                                    >
                                        Cancel Order
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
