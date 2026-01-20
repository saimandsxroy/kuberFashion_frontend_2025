import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, EyeOff, Star, Package, Upload as UploadIcon, X, CheckCircle, AlertCircle } from 'lucide-react';
import { productsAPI } from '../../services/api';
import { useNotification } from '../../components/Notification';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { showNotification } = useNotification();

  // Use centralized API base URL
  const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

  // Form state for add/edit product
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    price: '',
    originalPrice: '',
    discount: 0,
    categorySlug: '',
    image: '',
    images: [],
    description: '',
    sizes: [],
    colors: [],
    inStock: true,
    featured: false,
    stockQuantity: 0,
    active: true,
    isOffer: false
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      showNotification('error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      // Mock categories - replace with actual API call if available
      setCategories([
        { slug: 'mens-fashion', name: 'Men\'s Fashion' },
        { slug: 'womens-fashion', name: 'Women\'s Fashion' },
        { slug: 'kids-fashion', name: 'Kids Fashion' },
        { slug: 'kvision', name: 'KVision Membership' },
        { slug: 'accessories', name: 'Accessories' },
        { slug: 'sports-active', name: 'Sports & Active' }
      ]);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      slug: '',
      price: '',
      originalPrice: '',
      discount: 0,
      categorySlug: '',
      image: '',
      images: [],
      description: '',
      sizes: [],
      colors: [],
      inStock: true,
      featured: false,
      stockQuantity: 0,
      active: true,
      isOffer: false
    });
    setShowAddModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      discount: product.discount || 0,
      categorySlug: product.category,
      image: product.image,
      images: product.images || [],
      description: product.description,
      sizes: product.sizes || [],
      colors: product.colors || [],
      inStock: product.inStock,
      featured: product.featured,
      stockQuantity: product.stockQuantity || 0,
      active: product.active !== false,
      isOffer: product.isOffer || false
    });
    setShowAddModal(true);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
        images: Array.isArray(productForm.images) ? productForm.images :
          productForm.images.split(',').map(img => img.trim()).filter(img => img),
        sizes: Array.isArray(productForm.sizes) ? productForm.sizes :
          productForm.sizes.split(',').map(size => size.trim()).filter(size => size),
        colors: Array.isArray(productForm.colors) ? productForm.colors :
          productForm.colors.split(',').map(color => color.trim()).filter(color => color)
      };

      let response;
      if (editingProduct) {
        // Update existing product
        response = await fetch(`${BASE}/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(productData)
        });
      } else {
        // Create new product
        response = await fetch(`${BASE}/admin/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(productData)
        });
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to save product');
      }

      showNotification('success', editingProduct ? 'Product updated successfully' : 'Product created successfully');
      setShowAddModal(false);
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      showNotification('error', error.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await fetch(`${BASE}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      showNotification('success', 'Product deleted successfully');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification('error', 'Failed to delete product');
    }
  };

  const handleToggleStatus = async (productId, field, currentValue) => {
    try {
      await fetch(`${BASE}/admin/products/${productId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ [field]: !currentValue })
      });
      showNotification('success', `Product ${field} updated`);
      loadProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      showNotification('error', 'Failed to update product');
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleImageUpload = async (file, isMainImage = true) => {
    if (!file) return null;

    setUploadingImage(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('categorySlug', productForm.categorySlug || 'general');

      const extension = file.name.split('.').pop();
      const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      form.append('filename', `${unique}.${extension}`);

      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE}/admin/storage/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const imageUrl = data.data?.publicUrl;

        if (isMainImage) {
          setProductForm({ ...productForm, image: imageUrl });
        } else {
          const currentImages = Array.isArray(productForm.images) ? productForm.images : [];
          setProductForm({ ...productForm, images: [...currentImages, imageUrl] });
        }

        showNotification('success', 'Image uploaded successfully');
        return imageUrl;
      } else {
        showNotification('error', data.message || 'Upload failed');
        return null;
      }
    } catch (error) {
      showNotification('error', 'Failed to upload image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && product.active) ||
      (filterStatus === 'inactive' && !product.active) ||
      (filterStatus === 'featured' && product.featured) ||
      (filterStatus === 'offer' && product.isOffer) ||
      (filterStatus === 'out-of-stock' && !product.inStock);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-light text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1 font-light">Manage your product catalog</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          <span className="font-medium text-sm tracking-wide uppercase">Add Product</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Products', value: products.length, icon: Package, color: 'text-black' },
          { label: 'Active', value: products.filter(p => p.active).length, icon: CheckCircle, color: 'text-green-600' },
          { label: 'Featured', value: products.filter(p => p.featured).length, icon: Star, color: 'text-orange-500' },
          { label: 'Out of Stock', value: products.filter(p => !p.inStock).length, icon: AlertCircle, color: 'text-red-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-heading font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 bg-gray-50 rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <select
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black cursor-pointer flex-1 sm:flex-none"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.slug} value={category.slug}>{category.name}</option>
              ))}
            </select>
            <select
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black cursor-pointer flex-1 sm:flex-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="featured">Featured</option>
              <option value="offer">Offers</option>
              <option value="out-of-stock">Stockout</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                        <img
                          className="h-full w-full object-cover"
                          src={product.image}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900 group-hover:text-black">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5 max-w-[150px] truncate">
                          {product.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {categories.find(c => c.slug === product.category)?.name || product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      ₹{product.price}
                    </div>
                    {product.originalPrice && (
                      <div className="text-xs text-gray-400 line-through">₹{product.originalPrice}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${product.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {product.inStock ? 'In Stock' : 'Out Stock'}
                    </span>
                    {product.stockQuantity > 0 && (
                      <div className="text-[10px] text-gray-400 mt-1 pl-2">{product.stockQuantity} units</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(product.id, 'active', product.active)}
                        className={`p-1.5 rounded-lg transition-colors ${product.active
                          ? 'text-green-600 bg-green-50 hover:bg-green-100'
                          : 'text-gray-400 bg-gray-50 hover:bg-gray-100'}`}
                        title={product.active ? 'Active' : 'Inactive'}
                      >
                        {product.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleToggleStatus(product.id, 'featured', product.featured)}
                        className={`p-1.5 rounded-lg transition-colors ${product.featured
                          ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                          : 'text-gray-400 bg-gray-50 hover:bg-gray-100'}`}
                        title={product.featured ? 'Featured' : 'Not Featured'}
                      >
                        <Star className={`h-4 w-4 ${product.featured ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(product.id, 'isOffer', product.isOffer)}
                        className={`p-1.5 rounded-lg transition-colors ${product.isOffer
                          ? 'text-purple-600 bg-purple-50 hover:bg-purple-100'
                          : 'text-gray-400 bg-gray-50 hover:bg-gray-100'}`}
                        title={product.isOffer ? 'Offer Product' : 'Not Offer'}
                      >
                        <Package className={`h-4 w-4 ${product.isOffer ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-gray-50/50">
            <div className="bg-white p-4 rounded-full shadow-sm inline-block mb-4">
              <Package className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">No products found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search filters.' : 'Get started by adding a product.'}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal - Premium Style */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden scale-100 animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
              <h2 className="text-xl font-heading font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-8 custom-scrollbar">
              <form onSubmit={handleSubmitProduct} className="space-y-8">

                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none"
                        value={productForm.name}
                        onChange={(e) => {
                          setProductForm({
                            ...productForm,
                            name: e.target.value,
                            slug: generateSlug(e.target.value)
                          });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slug</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none font-mono text-sm text-gray-600"
                        value={productForm.slug}
                        onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none font-mono"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Original Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none font-mono"
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stock Qty</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none font-mono"
                        value={productForm.stockQuantity}
                        onChange={(e) => setProductForm({ ...productForm, stockQuantity: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                    <select
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none appearance-none cursor-pointer"
                      value={productForm.categorySlug}
                      onChange={(e) => setProductForm({ ...productForm, categorySlug: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.slug} value={category.slug}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Media */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">Media</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Main Image URL</label>
                    <div className="flex gap-4 items-start">
                      <div className="flex-1 space-y-2">
                        <input
                          type="url"
                          required
                          className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-sm"
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors text-xs font-bold uppercase tracking-wide">
                          <UploadIcon className="h-4 w-4" />
                          {uploadingImage ? 'Uploading...' : 'Upload File'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingImage}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, true);
                            }}
                          />
                        </label>
                      </div>
                      {productForm.image && (
                        <div className="w-24 h-24 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0">
                          <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Additional Images (comma separated)</label>
                    <textarea
                      rows="2"
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-sm"
                      value={Array.isArray(productForm.images) ? productForm.images.join(', ') : productForm.images}
                      onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">Details</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sizes (comma separated)</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none"
                        value={Array.isArray(productForm.sizes) ? productForm.sizes.join(', ') : productForm.sizes}
                        onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                        placeholder="S, M, L, XL"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Colors (comma separated)</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none"
                        value={Array.isArray(productForm.colors) ? productForm.colors.join(', ') : productForm.colors}
                        onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                        placeholder="Red, Blue, Black"
                      />
                    </div>
                  </div>
                </div>

                {/* Flags */}
                <div className="flex gap-6 p-4 bg-gray-50 rounded-xl">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${productForm.inStock ? 'bg-black border-black text-white' : 'bg-white border-gray-300'}`}>
                      {productForm.inStock && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={productForm.inStock} onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })} />
                    <span className="text-sm font-bold text-gray-700">In Stock</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${productForm.featured ? 'bg-black border-black text-white' : 'bg-white border-gray-300'}`}>
                      {productForm.featured && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} />
                    <span className="text-sm font-bold text-gray-700">Featured</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${productForm.active ? 'bg-black border-black text-white' : 'bg-white border-gray-300'}`}>
                      {productForm.active && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={productForm.active} onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })} />
                    <span className="text-sm font-bold text-gray-700">Active</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${productForm.isOffer ? 'bg-black border-black text-white' : 'bg-white border-gray-300'}`}>
                      {productForm.isOffer && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={productForm.isOffer} onChange={(e) => setProductForm({ ...productForm, isOffer: e.target.checked })} />
                    <span className="text-sm font-bold text-gray-700">Add to Offers</span>
                  </label>
                </div>

              </form>
            </div>

            <div className="flex justify-end gap-3 px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProduct}
                className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-900 font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
