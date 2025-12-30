import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, CreditCard, Truck, Check } from 'lucide-react';
import { Button } from '../../components/Button';
import { useCart } from '../../context/CartContext';
import { addressesAPI, ordersAPI, paymentsAPI } from '../../services/api';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('PHONEPE');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
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

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await addressesAPI.getAll();
            if (response.data?.success) {
                const addrs = response.data.data || [];
                setAddresses(addrs);
                // Auto-select default address
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

        setProcessing(true);

        try {
            // Prepare cart items for backend
            const cartItems = cart.items.map(item => ({
                productId: item.productId || item.id,
                quantity: item.quantity,
                selectedSize: item.size || null,
                selectedColor: item.color || null
            }));

            // Create order
            const orderResponse = await ordersAPI.createOrder({
                cartItems,
                addressId: selectedAddressId,
                paymentMethod
            });

            if (orderResponse.data?.success) {
                const order = orderResponse.data.data;

                if (paymentMethod === 'PHONEPE') {
                    // Initiate PhonePe payment
                    const paymentResponse = await paymentsAPI.initiate(order.id);
                    if (paymentResponse.data?.success) {
                        const { redirectUrl, merchantOrderId } = paymentResponse.data.data;
                        // Store merchantOrderId for status check
                        localStorage.setItem('pendingPayment', JSON.stringify({
                            merchantOrderId,
                            orderId: order.id
                        }));
                        // Clear cart before redirect
                        clearCart();
                        // Redirect to PhonePe or simulated payment page
                        window.location.href = redirectUrl;
                    } else {
                        alert('Payment initiation failed. Please try again.');
                    }
                } else {
                    // Cash on Delivery - order is placed directly
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
            alert('Checkout failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const subtotal = cart.totalAmount || 0;
    const shipping = subtotal >= 500 ? 0 : 50;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <Button onClick={() => navigate('/')} className="bg-[#047BD2] text-white">
                    Continue Shopping
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={() => navigate('/cart')}
                            variant="ghost"
                            className="flex items-center space-x-2 text-[#047BD2]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to Cart</span>
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Address & Payment */}
                    <div className="flex-1 space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold flex items-center">
                                    <MapPin className="h-5 w-5 mr-2 text-[#047BD2]" />
                                    Shipping Address
                                </h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAddressForm(!showAddressForm)}
                                    className="flex items-center"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add New
                                </Button>
                            </div>

                            {loading ? (
                                <div className="text-center py-4">Loading addresses...</div>
                            ) : (
                                <>
                                    {/* Address Selection */}
                                    {addresses.length > 0 ? (
                                        <div className="space-y-3">
                                            {addresses.map((addr) => (
                                                <div
                                                    key={addr.id}
                                                    onClick={() => setSelectedAddressId(addr.id)}
                                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAddressId === addr.id
                                                            ? 'border-[#047BD2] bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium">{addr.firstName} {addr.lastName}</span>
                                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                                    {addr.label}
                                                                </span>
                                                                {(addr.default || addr.isDefault) && (
                                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                                        Default
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-600 mt-1">{addr.phone}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {addr.addressLine1}
                                                                {addr.addressLine2 && `, ${addr.addressLine2}`}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {addr.city}, {addr.state} - {addr.postalCode}
                                                            </p>
                                                        </div>
                                                        {selectedAddressId === addr.id && (
                                                            <Check className="h-5 w-5 text-[#047BD2]" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">
                                            No saved addresses. Add one to continue.
                                        </p>
                                    )}

                                    {/* Add Address Form */}
                                    {showAddressForm && (
                                        <form onSubmit={handleAddAddress} className="mt-4 p-4 border rounded-lg bg-gray-50">
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="First Name *"
                                                    value={newAddress.firstName}
                                                    onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
                                                    className="p-2 border rounded"
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Last Name *"
                                                    value={newAddress.lastName}
                                                    onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
                                                    className="p-2 border rounded"
                                                    required
                                                />
                                                <input
                                                    type="tel"
                                                    placeholder="Phone (10 digits) *"
                                                    value={newAddress.phone}
                                                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                    className="p-2 border rounded col-span-2"
                                                    pattern="[0-9]{10}"
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Address Line 1 *"
                                                    value={newAddress.addressLine1}
                                                    onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                                                    className="p-2 border rounded col-span-2"
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Address Line 2"
                                                    value={newAddress.addressLine2}
                                                    onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                                                    className="p-2 border rounded col-span-2"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="City *"
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    className="p-2 border rounded"
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="State *"
                                                    value={newAddress.state}
                                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                    className="p-2 border rounded"
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Postal Code *"
                                                    value={newAddress.postalCode}
                                                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                                    className="p-2 border rounded"
                                                    required
                                                />
                                                <select
                                                    value={newAddress.label}
                                                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                                                    className="p-2 border rounded"
                                                >
                                                    <option value="Home">Home</option>
                                                    <option value="Office">Office</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <Button type="submit" className="bg-[#047BD2] text-white">
                                                    Save Address
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setShowAddressForm(false)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold flex items-center mb-4">
                                <CreditCard className="h-5 w-5 mr-2 text-[#047BD2]" />
                                Payment Method
                            </h2>

                            <div className="space-y-3">
                                <div
                                    onClick={() => setPaymentMethod('PHONEPE')}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'PHONEPE'
                                            ? 'border-[#047BD2] bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-purple-600 font-bold text-sm">PP</span>
                                            </div>
                                            <div>
                                                <p className="font-medium">PhonePe</p>
                                                <p className="text-sm text-gray-500">UPI, Cards, Net Banking</p>
                                            </div>
                                        </div>
                                        {paymentMethod === 'PHONEPE' && (
                                            <Check className="h-5 w-5 text-[#047BD2]" />
                                        )}
                                    </div>
                                </div>

                                <div
                                    onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'CASH_ON_DELIVERY'
                                            ? 'border-[#047BD2] bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                <Truck className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Cash on Delivery</p>
                                                <p className="text-sm text-gray-500">Pay when you receive</p>
                                            </div>
                                        </div>
                                        {paymentMethod === 'CASH_ON_DELIVERY' && (
                                            <Check className="h-5 w-5 text-[#047BD2]" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:w-96">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                            {/* Items */}
                            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <img
                                            src={item.image || '/placeholder.jpg'}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                                        {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax (5% GST)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span className="text-[#047BD2]">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleCheckout}
                                disabled={!selectedAddressId || processing}
                                className="w-full mt-6 bg-[#047BD2] hover:bg-[#0369A1] text-white py-3 disabled:opacity-50"
                            >
                                {processing ? 'Processing...' :
                                    paymentMethod === 'PHONEPE' ? 'Pay Now' : 'Place Order'}
                            </Button>

                            {!selectedAddressId && (
                                <p className="text-red-500 text-sm text-center mt-2">
                                    Please select a shipping address
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
