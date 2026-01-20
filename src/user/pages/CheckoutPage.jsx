import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Plus, CreditCard, Truck, Check, ShoppingBag, X, ChevronRight, Shield, Lock, Sparkles, Users } from 'lucide-react';
import { Button } from '../../components/Button';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { addressesAPI, ordersAPI, paymentsAPI, referralAPI } from '../../services/api';
import { cn } from '../../lib/utils';

const PremiumInput = ({ label, ...props }) => (
    <div className="space-y-1.5">
        {label && <label className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</label>}
        <input
            {...props}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
        />
    </div>
);

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('PHONEPE');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [referralCode, setReferralCode] = useState('');
    const [isMember, setIsMember] = useState(true); // Assume member until checked
    const [purchaseMode, setPurchaseMode] = useState('ONLINE'); // 'ONLINE' or 'OFFLINE' for KVision

    // Verification state
    const [verifying, setVerifying] = useState(false);
    const [verificationState, setVerificationState] = useState({
        valid: false,
        message: '',
        name: ''
    });

    const [newAddress, setNewAddress] = useState({
        label: 'Home',
        firstName: '',
        lastName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India'
    });

    // Stable callback for address form fields - prevents focus loss
    const handleAddressChange = useCallback((field) => (e) => {
        const value = e.target.value;
        setNewAddress(prev => ({ ...prev, [field]: value }));
    }, []);

    useEffect(() => {
        fetchAddresses();
        checkMembership();
    }, []);

    // Check if cart has KVision products
    const hasKvisionProducts = cart.items.some(item =>
        item.category?.toLowerCase() === 'kvision' ||
        item.categorySlug?.toLowerCase() === 'kvision' ||
        item.category?.slug?.toLowerCase() === 'kvision'
    );

    const checkMembership = async () => {
        try {
            const response = await referralAPI.getMembership();
            setIsMember(response.data?.data?.isMember || false);
        } catch (error) {
            // If error, assume not a member for KVision products
            setIsMember(false);
        }
    };

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await addressesAPI.getAll();
            if (response.data?.success) {
                const addrs = response.data.data || [];
                setAddresses(addrs);
                const defaultAddr = addrs.find(a => a.default || a.isDefault);
                if (defaultAddr) {
                    setSelectedAddressId(defaultAddr.id);
                } else if (addrs.length > 0) {
                    setSelectedAddressId(addrs[0].id);
                }
            }
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const response = await addressesAPI.create(newAddress);
            if (response.data?.success) {
                const created = response.data.data;
                setAddresses([...addresses, created]);
                setSelectedAddressId(created.id);
                setShowAddressForm(false);
                setNewAddress({
                    label: 'Home', firstName: '', lastName: '', phone: '',
                    addressLine1: '', addressLine2: '', city: '', state: '',
                    postalCode: '', country: 'India'
                });
            }
        } catch (error) {
            console.error('Failed to add address:', error);
            alert('Failed to add address. Please try again.');
        }
    };

    const handleCheckout = async () => {
        if (!selectedAddressId) {
            alert('Please select a shipping address');
            return;
        }
        if (cart.items.length === 0) {
            alert('Your cart is empty');
            return;
        }

        // Strict KVision Purchase Validation
        if (hasKvisionProducts && !isMember) {
            if (!verificationState.valid) {
                alert("Please enter and verify a valid referral code to purchase KVision products and join the membership.");
                return;
            }
        }

        setProcessing(true);
        try {
            const cartItems = cart.items.map(item => ({
                productId: item.productId || item.id,
                quantity: item.quantity,
                selectedSize: item.size || null,
                selectedColor: item.color || null
            }));
            const orderResponse = await ordersAPI.createOrder({
                cartItems,
                addressId: selectedAddressId,
                paymentMethod,
                referralCode: referralCode || null,
                purchaseMode: hasKvisionProducts ? purchaseMode : 'ONLINE'
            });
            if (orderResponse.data?.success) {
                const order = orderResponse.data.data;
                if (paymentMethod === 'PHONEPE') {
                    const paymentResponse = await paymentsAPI.initiate(order.id);
                    if (paymentResponse.data?.success) {
                        const { redirectUrl, merchantOrderId } = paymentResponse.data.data;
                        localStorage.setItem('pendingPayment', JSON.stringify({
                            merchantOrderId,
                            orderId: order.id
                        }));
                        // Cart will be cleared after successful payment confirmation in PaymentStatusPage
                        window.location.href = redirectUrl;
                    } else {
                        alert('Payment initiation failed. Please try again.');
                    }
                } else {
                    clearCart();
                    navigate('/orders', {
                        state: {
                            success: true,
                            message: 'Order placed successfully! Pay on delivery.'
                        }
                    });
                }
            } else {
                alert('Failed to create order. Please try again.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Checkout failed. Please try again.';
            alert(errorMessage);
        } finally {
            setProcessing(false);
        }
    };

    const subtotal = cart.totalAmount || 0;
    // Tiered shipping: <500: ₹79, 500-999: ₹59, >999: ₹49
    // For KVision OFFLINE purchases, shipping is FREE
    const isOfflineKvision = hasKvisionProducts && purchaseMode === 'OFFLINE';
    const shipping = isOfflineKvision ? 0 : (subtotal > 999 ? 49 : (subtotal >= 500 ? 59 : 79));
    const tax = 0; // No GST
    const total = subtotal + shipping;

    // --- Premium Input Component Removed (Moved outside) ---

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col justify-center items-center py-12 px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8">Add some items to continue to checkout.</p>
                    <Button onClick={() => navigate('/')} className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm">
                        Continue Shopping
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-gray-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <Button
                            onClick={() => navigate('/cart')}
                            variant="ghost"
                            className="group flex items-center space-x-2 text-gray-500 hover:text-black transition-colors -ml-2"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
                        </Button>
                        <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tighter">Checkout</h1>
                        <div className="w-20" /> {/* Spacer for centering */}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                    {/* Left Column - Address & Payment */}
                    <div className="flex-1 space-y-10">

                        {/* --- Shipping Address Section --- */}
                        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-black uppercase tracking-tight flex items-center">
                                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
                                    Shipping Address
                                </h2>
                                <button
                                    onClick={() => setShowAddressForm(!showAddressForm)}
                                    className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black flex items-center transition-colors"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add New
                                </button>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="animate-pulse p-5 border border-gray-200 rounded-xl">
                                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                                            <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {addresses.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {addresses.map((addr) => (
                                                <motion.div
                                                    key={addr.id}
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={() => setSelectedAddressId(addr.id)}
                                                    className={cn(
                                                        "relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-300",
                                                        selectedAddressId === addr.id
                                                            ? 'border-black bg-gray-50 shadow-sm'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    )}
                                                >
                                                    {selectedAddressId === addr.id && (
                                                        <div className="absolute top-3 right-3 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                                                            <Check className="h-3.5 w-3.5 text-white" />
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-bold text-sm text-black">{addr.firstName} {addr.lastName}</span>
                                                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                                            {addr.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{addr.phone}</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {addr.city}, {addr.state} - {addr.postalCode}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                                            <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 text-sm">No saved addresses. Add one to continue.</p>
                                        </div>
                                    )}

                                    {/* Add Address Form */}
                                    <AnimatePresence>
                                        {showAddressForm && (
                                            <motion.form
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                onSubmit={handleAddAddress}
                                                className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
                                            >
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="font-bold text-sm uppercase tracking-widest">New Address</h3>
                                                    <button type="button" onClick={() => setShowAddressForm(false)} className="text-gray-400 hover:text-black">
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <PremiumInput label="First Name" placeholder="John" value={newAddress.firstName} onChange={handleAddressChange('firstName')} required />
                                                    <PremiumInput label="Last Name" placeholder="Doe" value={newAddress.lastName} onChange={handleAddressChange('lastName')} required />
                                                    <div className="md:col-span-2">
                                                        <PremiumInput label="Phone" type="tel" placeholder="10-digit mobile number" value={newAddress.phone} onChange={handleAddressChange('phone')} pattern="[0-9]{10}" required />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <PremiumInput label="Address Line 1" placeholder="Street address, P.O. box" value={newAddress.addressLine1} onChange={handleAddressChange('addressLine1')} required />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <PremiumInput label="Address Line 2 (Optional)" placeholder="Apartment, suite, unit, building, floor" value={newAddress.addressLine2} onChange={handleAddressChange('addressLine2')} />
                                                    </div>
                                                    <PremiumInput label="City" placeholder="City" value={newAddress.city} onChange={handleAddressChange('city')} required />
                                                    <PremiumInput label="State" placeholder="State" value={newAddress.state} onChange={handleAddressChange('state')} required />
                                                    <PremiumInput label="Postal Code" placeholder="6-digit PIN" value={newAddress.postalCode} onChange={handleAddressChange('postalCode')} required />
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Address Type</label>
                                                        <select value={newAddress.label} onChange={handleAddressChange('label')} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all">
                                                            <option value="Home">Home</option>
                                                            <option value="Office">Office</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 mt-6">
                                                    <Button type="submit" className="bg-black text-white hover:bg-gray-800 px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-xs">
                                                        Save Address
                                                    </Button>
                                                    <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)} className="border-gray-300 text-gray-600 hover:bg-gray-100 px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-xs">
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </motion.form>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </motion.section>

                        {/* --- Payment Method Section --- */}
                        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <h2 className="text-lg font-black uppercase tracking-tight flex items-center mb-6">
                                <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
                                Payment Method
                            </h2>
                            <div className="space-y-3">
                                {/* PhonePe */}
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => setPaymentMethod('PHONEPE')}
                                    className={cn(
                                        "relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-300",
                                        paymentMethod === 'PHONEPE'
                                            ? 'border-black bg-gray-50 shadow-sm'
                                            : 'border-gray-200 hover:border-gray-300'
                                    )}
                                >
                                    {paymentMethod === 'PHONEPE' && (
                                        <div className="absolute top-4 right-4 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                                            <Check className="h-3.5 w-3.5 text-white" />
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center mr-4 shadow-md">
                                            <CreditCard className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-black">Pay Online</p>
                                            <p className="text-xs text-gray-500">UPI, Cards, Net Banking via PhonePe</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.section>

                        {/* --- KVision Purchase Mode Selection (Online vs Offline) --- */}
                        {hasKvisionProducts && (
                            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
                                <h2 className="text-lg font-black uppercase tracking-tight flex items-center mb-6">
                                    <span className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                                        <Truck className="h-4 w-4" />
                                    </span>
                                    Delivery Option
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Online - With Shipping */}
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setPurchaseMode('ONLINE')}
                                        className={cn(
                                            "relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-300",
                                            purchaseMode === 'ONLINE'
                                                ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300'
                                        )}
                                    >
                                        {purchaseMode === 'ONLINE' && (
                                            <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                                                <Check className="h-3.5 w-3.5 text-white" />
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                                                <Truck className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-black">Online Delivery</p>
                                                <p className="text-xs text-gray-500">Get it delivered to your address</p>
                                                <p className="text-xs text-blue-600 font-medium mt-1">Shipping charges apply</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Offline - Shop Pickup */}
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setPurchaseMode('OFFLINE')}
                                        className={cn(
                                            "relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-300",
                                            purchaseMode === 'OFFLINE'
                                                ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300'
                                        )}
                                    >
                                        {purchaseMode === 'OFFLINE' && (
                                            <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                                                <Check className="h-3.5 w-3.5 text-white" />
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                                                <MapPin className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-black">Shop Pickup</p>
                                                <p className="text-xs text-gray-500">Pick up from our shop</p>
                                                <p className="text-xs text-green-600 font-medium mt-1">FREE - No shipping charges</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.section>
                        )}

                        {/* --- KVision Membership Section (for Footwear) --- */}
                        {hasKvisionProducts && !isMember && (
                            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                                <h2 className="text-lg font-black uppercase tracking-tight flex items-center mb-6">
                                    <span className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-full flex items-center justify-center text-sm mr-3">
                                        <Sparkles className="h-4 w-4" />
                                    </span>
                                    Join KVision
                                </h2>
                                <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                            <Users className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-black">Become a KVision Member</h3>
                                            <p className="text-sm text-gray-600">To purchase KVision (Footwear) products, you need to be a member. Enter a referral code to join!</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-purple-700">Referral Code *</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={referralCode}
                                                onChange={(e) => {
                                                    setReferralCode(e.target.value);
                                                    setVerificationState({ valid: false, message: '', name: '' });
                                                }}
                                                placeholder="Enter 10-digit phone number"
                                                className={cn(
                                                    "flex-1 px-4 py-3 bg-white border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all",
                                                    verificationState.valid
                                                        ? "border-green-500 focus:border-green-500"
                                                        : verificationState.message && !verificationState.valid
                                                            ? "border-red-500 focus:border-red-500"
                                                            : "border-purple-300 focus:border-purple-500"
                                                )}
                                                required
                                            />
                                            <Button
                                                type="button"
                                                onClick={async () => {
                                                    if (!referralCode.trim()) return;
                                                    setVerifying(true);
                                                    try {
                                                        const response = await referralAPI.validate(referralCode);
                                                        const { valid, message, name } = response.data?.data || {};
                                                        setVerificationState({
                                                            valid,
                                                            message: message || (valid ? 'Verified!' : 'Invalid'),
                                                            name
                                                        });
                                                    } catch (error) {
                                                        setVerificationState({ valid: false, message: 'Validation failed', name: '' });
                                                    } finally {
                                                        setVerifying(false);
                                                    }
                                                }}
                                                disabled={verifying || !referralCode.trim() || verificationState.valid}
                                                className={cn(
                                                    "whitespace-nowrap px-6",
                                                    verificationState.valid ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"
                                                )}
                                            >
                                                {verifying ? '...' : verificationState.valid ? 'Verified' : 'Verify'}
                                            </Button>
                                        </div>

                                        {/* Validation Feedback */}
                                        {verificationState.message && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className={cn(
                                                    "text-xs flex items-center gap-1.5 font-medium mt-1",
                                                    verificationState.valid ? "text-green-600" : "text-red-500"
                                                )}
                                            >
                                                {verificationState.valid ? (
                                                    <>
                                                        <Check className="w-3.5 h-3.5" />
                                                        <span>Referrer: {verificationState.name}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <X className="w-3.5 h-3.5" />
                                                        <span>{verificationState.message}</span>
                                                    </>
                                                )}
                                            </motion.div>
                                        )}
                                    </div>
                                    <p className="text-xs text-purple-600 mt-2">* Required for KVision purchases</p>
                                </div>
                            </motion.section>
                        )}
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:w-[400px]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gray-50 rounded-2xl p-6 lg:p-8 sticky top-8 border border-gray-100"
                        >
                            <h2 className="text-lg font-black uppercase tracking-tight mb-6">Order Summary</h2>

                            {/* Items */}
                            <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-2 -mr-2">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="w-16 h-20 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                            <img
                                                src={item.image || '/placeholder.jpg'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-black truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-sm">₹{(item.price * item.quantity).toFixed(0)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium text-black">₹{subtotal.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className={cn("font-medium", shipping === 0 ? 'text-green-600' : 'text-black')}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tax (5% GST)</span>
                                    <span className="font-medium text-black">₹{tax.toFixed(0)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                                    <span className="font-black text-black uppercase tracking-tight">Total</span>
                                    <span className="text-2xl font-black text-black">₹{total.toFixed(0)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleCheckout}
                                disabled={!selectedAddressId || processing}
                                className="w-full mt-8 bg-black hover:bg-gray-800 text-white py-4 rounded-full font-bold uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                            >
                                {processing ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    <span className="flex items-center">
                                        {paymentMethod === 'PHONEPE' ? 'Pay Now' : 'Place Order'}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </span>
                                )}
                            </Button>

                            {!selectedAddressId && (
                                <p className="text-red-500 text-xs text-center mt-3 font-medium">
                                    Please select a shipping address to continue.
                                </p>
                            )}

                            {/* Trust Indicators */}
                            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center gap-4 text-gray-400">
                                <div className="flex items-center gap-1.5 text-xs">
                                    <Shield className="h-4 w-4" />
                                    <span>Secure</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs">
                                    <Lock className="h-4 w-4" />
                                    <span>Encrypted</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
