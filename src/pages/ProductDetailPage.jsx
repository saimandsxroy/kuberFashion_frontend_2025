import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Product from '../components/Product';
import { getProductById, getProductBySlug } from '../data/products';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Loading product with ID:', productId);

        let productData;

        // Try to get product by ID first, then by slug
        if (!isNaN(productId)) {
          productData = await getProductById(parseInt(productId));
        } else {
          productData = await getProductBySlug(productId);
        }

        console.log('Loaded product:', productData);

        if (!productData) {
          setError('not_found');
          return;
        }

        setProduct(productData);
      } catch (err) {
        console.error('Error loading product:', err);

        // Distinguish between network errors and other errors
        if (err.message?.includes('Network Error') || err.message?.includes('connect')) {
          setError('network_error');
        } else if (err.response?.status === 500) {
          setError('server_error');
        } else {
          setError('unknown_error');
        }
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessages = {
      not_found: {
        title: 'Product Not Found',
        message: "The product you're looking for doesn't exist or has been removed.",
        showRetry: false
      },
      network_error: {
        title: 'Connection Error',
        message: 'Unable to connect to server. Please check your internet connection and try again.',
        showRetry: true
      },
      server_error: {
        title: 'Server Error',
        message: 'The server encountered an error. Please try again in a few moments.',
        showRetry: true
      },
      unknown_error: {
        title: 'Oops!',
        message: 'Something went wrong. Please try again.',
        showRetry: true
      }
    };

    const errorInfo = errorMessages[error] || errorMessages.unknown_error;

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{errorInfo.title}</h2>
          <p className="text-gray-600 mb-6">{errorInfo.message}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleBack}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
            {errorInfo.showRetry && (
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <Product
      product={product}
      onBack={handleBack}
    />
  );
};

export default ProductDetailPage;
