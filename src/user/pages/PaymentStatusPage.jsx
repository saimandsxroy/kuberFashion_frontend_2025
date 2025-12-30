import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { paymentsAPI } from '../../services/api';

const PaymentStatusPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('checking'); // checking, success, failed, pending
    const [orderInfo, setOrderInfo] = useState(null);

    useEffect(() => {
        const merchantOrderId = searchParams.get('merchantOrderId');
        const simulated = searchParams.get('simulated');

        if (merchantOrderId) {
            if (simulated === 'true') {
                // For simulated payment, auto-confirm after delay
                setTimeout(() => {
                    confirmSimulatedPayment(merchantOrderId);
                }, 2000);
            } else {
                checkPaymentStatus(merchantOrderId);
            }
        } else {
            // Check localStorage for pending payment
            const pending = localStorage.getItem('pendingPayment');
            if (pending) {
                const { merchantOrderId: moid } = JSON.parse(pending);
                checkPaymentStatus(moid);
            } else {
                setStatus('failed');
            }
        }
    }, [searchParams]);

    const confirmSimulatedPayment = async (merchantOrderId) => {
        try {
            // Call confirm endpoint for simulation mode
            await paymentsAPI.confirm(merchantOrderId);
            setStatus('success');
            localStorage.removeItem('pendingPayment');

            // Get order info
            const statusResponse = await paymentsAPI.getStatus(merchantOrderId);
            if (statusResponse.data?.success) {
                setOrderInfo(statusResponse.data.data);
            }
        } catch (error) {
            console.error('Payment confirmation error:', error);
            setStatus('failed');
        }
    };

    const checkPaymentStatus = async (merchantOrderId) => {
        try {
            const response = await paymentsAPI.getStatus(merchantOrderId);
            if (response.data?.success) {
                const data = response.data.data;
                setOrderInfo(data);

                if (data.status === 'COMPLETED') {
                    setStatus('success');
                    localStorage.removeItem('pendingPayment');
                } else if (data.status === 'FAILED') {
                    setStatus('failed');
                    localStorage.removeItem('pendingPayment');
                } else {
                    setStatus('pending');
                    // Poll again after 3 seconds
                    setTimeout(() => checkPaymentStatus(merchantOrderId), 3000);
                }
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
            setStatus('failed');
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'checking':
                return (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#047BD2] mx-auto"></div>
                        <h2 className="text-2xl font-bold mt-6">Verifying Payment...</h2>
                        <p className="text-gray-600 mt-2">Please wait while we confirm your payment</p>
                    </div>
                );

            case 'success':
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mt-6 text-green-600">Payment Successful!</h2>
                        <p className="text-gray-600 mt-2">Your order has been placed successfully</p>
                        {orderInfo && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Order ID</p>
                                <p className="font-medium">{orderInfo.orderId}</p>
                                <p className="text-sm text-gray-500 mt-2">Amount Paid</p>
                                <p className="font-medium text-lg">₹{orderInfo.amount}</p>
                            </div>
                        )}
                        <div className="mt-8 space-y-3">
                            <Button
                                onClick={() => navigate('/orders')}
                                className="w-full bg-[#047BD2] text-white"
                            >
                                View Orders <ArrowRight className="ml-2 h-4 w-4 inline" />
                            </Button>
                            <Button
                                onClick={() => navigate('/')}
                                variant="outline"
                                className="w-full"
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                );

            case 'failed':
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <XCircle className="h-12 w-12 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold mt-6 text-red-600">Payment Failed</h2>
                        <p className="text-gray-600 mt-2">Something went wrong with your payment</p>
                        <div className="mt-8 space-y-3">
                            <Button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-[#047BD2] text-white"
                            >
                                Try Again
                            </Button>
                            <Button
                                onClick={() => navigate('/')}
                                variant="outline"
                                className="w-full"
                            >
                                Return Home
                            </Button>
                        </div>
                    </div>
                );

            case 'pending':
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                            <Clock className="h-12 w-12 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold mt-6 text-yellow-600">Payment Processing</h2>
                        <p className="text-gray-600 mt-2">Your payment is being processed. Please wait...</p>
                        <div className="mt-4">
                            <div className="animate-pulse flex justify-center space-x-2">
                                <div className="w-2 h-2 bg-[#047BD2] rounded-full"></div>
                                <div className="w-2 h-2 bg-[#047BD2] rounded-full"></div>
                                <div className="w-2 h-2 bg-[#047BD2] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                {renderContent()}
            </div>
        </div>
    );
};

export default PaymentStatusPage;
