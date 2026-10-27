import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, EyeOff, Star, Package, Upload as UploadIcon, X, CheckCircle, AlertCircle, Sparkles, Wand2, Lightbulb, Copy, ArrowRight, ChevronDown, ChevronUp, Layers, RefreshCw } from 'lucide-react';
import { productsAPI } from '../../services/api';
import { useNotification } from '../../components/Notification';
import { clearProductsCache } from '../../data/products';

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

  // AI Catalog Assistant state
  const [generatingAi, setGeneratingAi] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiHints, setAiHints] = useState({
    fabric: '',
    intendedUse: '',
    additionalNotes: ''
  });
  const [aiDraft, setAiDraft] = useState(null);

  // Variant inventory management state
  const [selectedVariantProduct, setSelectedVariantProduct] = useState(null);
  const [productVariants, setProductVariants] = useState([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [variantForm, setVariantForm] = useState({
    size: '',
    color: '',
    stockQuantity: 0,
    sku: '',
  });
  const [editingVariantStock, setEditingVariantStock] = useState({});
  const [savingVariantId, setSavingVariantId] = useState(null);
  const [switchingTrackingMode, setSwitchingTrackingMode] = useState(false);

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

  // ── VARIANT INVENTORY MANAGEMENT HANDLERS ─────────────────────────────────
  const handleOpenVariantManager = async (product) => {
    setSelectedVariantProduct(product);
    setVariantForm({ size: '', color: '', stockQuantity: 0, sku: '' });
    setEditingVariantStock({});
    await loadProductVariants(product.id);
  };

  const loadProductVariants = async (productId) => {
    try {
      setLoadingVariants(true);
      const response = await productsAPI.getVariants(productId);
      const variants = response.data?.data || [];
      setProductVariants(variants);
      const initialStockMap = {};
      variants.forEach(v => {
        initialStockMap[v.id] = v.stockQuantity;
      });
      setEditingVariantStock(initialStockMap);
    } catch (error) {
      console.error('Error loading variants:', error);
      showNotification('error', 'Failed to load product variants');
    } finally {
      setLoadingVariants(false);
    }
  };

  const handleAddVariant = async (e) => {
    e.preventDefault();
    if (!variantForm.size.trim() || !variantForm.color.trim()) {
      showNotification('error', 'Size and Color are required for a variant');
      return;
    }
    if (variantForm.stockQuantity < 0) {
      showNotification('error', 'Stock quantity cannot be negative');
      return;
    }

    try {
      await productsAPI.configureVariants(selectedVariantProduct.id, [
        {
          size: variantForm.size.trim(),
          color: variantForm.color.trim(),
          stockQuantity: parseInt(variantForm.stockQuantity, 10),
          sku: variantForm.sku.trim() || undefined,
          active: true,
        }
      ]);
      showNotification('success', 'Variant configured successfully');
      setVariantForm({ size: '', color: '', stockQuantity: 0, sku: '' });
      clearProductsCache();
      await loadProductVariants(selectedVariantProduct.id);
      loadProducts();
    } catch (error) {
      console.error('Error configuring variant:', error);
      showNotification('error', error.response?.data?.message || 'Failed to configure variant');
    }
  };

  const handleSaveStock = async (variantId) => {
    const newStock = editingVariantStock[variantId];
    if (newStock === undefined || newStock < 0) {
      showNotification('error', 'Please enter a valid non-negative stock quantity');
      return;
    }

    try {
      setSavingVariantId(variantId);
      await productsAPI.updateVariantStock(selectedVariantProduct.id, variantId, parseInt(newStock, 10));
      clearProductsCache();
      showNotification('success', 'Variant stock updated');
      await loadProductVariants(selectedVariantProduct.id);
      loadProducts();
    } catch (error) {
      console.error('Error updating variant stock:', error);
      showNotification('error', error.response?.data?.message || 'Failed to update variant stock');
    } finally {
      setSavingVariantId(null);
    }
  };

  const handleToggleTrackingMode = async () => {
    const currentMode = selectedVariantProduct.inventoryTrackingMode || 'LEGACY';
    const targetMode = currentMode === 'VARIANT' ? 'LEGACY' : 'VARIANT';

    try {
      setSwitchingTrackingMode(true);
      await productsAPI.updateTrackingMode(selectedVariantProduct.id, targetMode);
      clearProductsCache();
      showNotification('success', `Tracking mode updated to ${targetMode}`);
      setSelectedVariantProduct(prev => ({ ...prev, inventoryTrackingMode: targetMode }));
      loadProducts();
    } catch (error) {
      console.error('Error updating tracking mode:', error);
      showNotification('error', error.response?.data?.message || 'Failed to update tracking mode');
    } finally {
      setSwitchingTrackingMode(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setAiDraft(null);
    setShowAiAssistant(false);
    setAiHints({ fabric: '', intendedUse: '', additionalNotes: '' });
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
    setAiDraft(null);
    setShowAiAssistant(false);
    setAiHints({ fabric: '', intendedUse: '', additionalNotes: '' });
    setProductForm({
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      discount: product.discount || 0,
      categorySlug: product.categorySlug || product.category || '',
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

  const handleGenerateAiContent = async () => {
    if (!productForm.name || !productForm.name.trim()) {
      showNotification('error', 'Please enter a product name first before generating AI content');
      return;
    }

    try {
      setGeneratingAi(true);
      const parsedSizes = Array.isArray(productForm.sizes)
        ? productForm.sizes
        : (typeof productForm.sizes === 'string'
            ? productForm.sizes.split(',').map(s => s.trim()).filter(Boolean)
            : []);
      const parsedColors = Array.isArray(productForm.colors)
        ? productForm.colors
        : (typeof productForm.colors === 'string'
            ? productForm.colors.split(',').map(c => c.trim()).filter(Boolean)
            : []);

      const payload = {
        productName: productForm.name.trim(),
        categoryHint: productForm.categorySlug || null,
        fabric: aiHints.fabric?.trim() || null,
        sizes: parsedSizes,
        colors: parsedColors,
        intendedUse: aiHints.intendedUse?.trim() || null,
        additionalNotes: aiHints.additionalNotes?.trim() || null
      };

      const res = await productsAPI.generateAiContent(payload);
      const draft = res.data?.data;
      if (draft) {
        setAiDraft(draft);
        showNotification('success', 'AI catalog content generated! Review the draft below.');
      }
    } catch (err) {
      console.error('AI generation error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to generate AI content';
      showNotification('error', msg);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleApplyAiDescription = () => {
    if (aiDraft?.description) {
      setProductForm(prev => ({ ...prev, description: aiDraft.description }));
      showNotification('success', 'Applied AI description to product form');
    }
  };

  const handleApplyAiCategory = () => {
    if (aiDraft?.suggestedCategorySlug) {
      setProductForm(prev => ({ ...prev, categorySlug: aiDraft.suggestedCategorySlug }));
      showNotification('success', `Category set to ${aiDraft.suggestedCategorySlug}`);
    }
  };

  const handleAppendBulletPoints = () => {
    if (aiDraft?.bulletPoints && aiDraft.bulletPoints.length > 0) {
      const bulletsText = '\n\nKey Highlights:\n' + aiDraft.bulletPoints.map(b => `• ${b}`).join('\n');
      setProductForm(prev => {
        const combined = (prev.description || '') + bulletsText;
        return {
          ...prev,
          description: combined.length > 950 ? combined.substring(0, 947) + '...' : combined
        };
      });
      showNotification('success', 'Appended bullet highlights to description');
    }
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

      clearProductsCache();
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
      clearProductsCache();
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
      clearProductsCache();
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
                    <div className="flex flex-col gap-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide w-fit ${product.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {product.inStock ? 'In Stock' : 'Out Stock'}
                      </span>
                      {product.inventoryTrackingMode === 'VARIANT' ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-700 font-semibold">
                            <span>{product.stockQuantity ?? 0} units total</span>
                            <span className="text-[10px] text-gray-400 font-normal">({product.variants?.length ?? 0} variants)</span>
                          </div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 w-fit">
                            <Layers className="h-3 w-3" />
                            Variant Mode
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] text-gray-500">
                          <span>{product.stockQuantity} units</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-gray-100 text-gray-500 font-mono">Legacy</span>
                        </div>
                      )}
                    </div>
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
                        onClick={() => handleOpenVariantManager(product)}
                        className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Manage Variant Inventory"
                      >
                        <Layers className="h-4 w-4" />
                      </button>
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

                {/* AI Catalog Assistant Section */}
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/20 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                        <Sparkles className="h-5 w-5 text-white animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white tracking-wide">AI Catalog Assistant</h3>
                          <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 rounded-full">
                            Gemini AI
                          </span>
                        </div>
                        <p className="text-xs text-indigo-200/80 font-light mt-0.5">
                          Draft high-converting descriptions, bullet highlights, and SEO tags in seconds.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAiAssistant(!showAiAssistant)}
                        className="px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/15 text-indigo-100 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        {showAiAssistant ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        <span>{showAiAssistant ? 'Hide Hints' : 'Add Hints'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={generatingAi}
                        onClick={handleGenerateAiContent}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:from-purple-600 hover:to-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {generatingAi ? (
                          <>
                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-3.5 w-3.5" />
                            <span>Generate with AI</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Hints Panel */}
                  {showAiAssistant && (
                    <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-150">
                      <div>
                        <label className="block text-[11px] font-bold text-indigo-200 uppercase tracking-wider mb-1.5">
                          Fabric / Material
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Pure Mulberry Silk, 100% Linen"
                          className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-indigo-300/40 text-xs focus:ring-2 focus:ring-indigo-400 outline-none"
                          value={aiHints.fabric}
                          onChange={(e) => setAiHints({ ...aiHints, fabric: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-indigo-200 uppercase tracking-wider mb-1.5">
                          Intended Occasion / Use
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Festive weddings, Casual brunch"
                          className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-indigo-300/40 text-xs focus:ring-2 focus:ring-indigo-400 outline-none"
                          value={aiHints.intendedUse}
                          onChange={(e) => setAiHints({ ...aiHints, intendedUse: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-indigo-200 uppercase tracking-wider mb-1.5">
                          Custom Instructions (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Highlight breathable weaves"
                          className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-indigo-300/40 text-xs focus:ring-2 focus:ring-indigo-400 outline-none"
                          value={aiHints.additionalNotes}
                          onChange={(e) => setAiHints({ ...aiHints, additionalNotes: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {/* AI Generated Output Draft Card */}
                  {aiDraft && (
                    <div className="mt-4 bg-white text-gray-900 rounded-xl p-5 space-y-4 shadow-lg border border-indigo-100 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">AI Content Draft (Review Before Saving)</h4>
                        </div>
                        <span className="text-[11px] text-gray-400 italic">Not yet saved to database</span>
                      </div>

                      {/* Generated Description */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Generated Description</span>
                          <button
                            type="button"
                            onClick={handleApplyAiDescription}
                            className="px-3 py-1 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <ArrowRight className="h-3 w-3" />
                            <span>Apply to Form</span>
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3.5 rounded-xl border border-gray-100 leading-relaxed">
                          {aiDraft.description}
                        </p>
                      </div>

                      {/* Bullet Highlights */}
                      {aiDraft.bulletPoints && aiDraft.bulletPoints.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Key Highlights</span>
                            <button
                              type="button"
                              onClick={handleAppendBulletPoints}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                              + Append to Description
                            </button>
                          </div>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-700 bg-indigo-50/40 p-3 rounded-xl border border-indigo-100/60">
                            {aiDraft.bulletPoints.map((bp, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-indigo-500 font-bold">•</span>
                                <span>{bp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Search Tags & Category Suggestion */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {aiDraft.searchTags && aiDraft.searchTags.length > 0 && (
                          <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Search Tags</span>
                            <div className="flex flex-wrap gap-1.5">
                              {aiDraft.searchTags.map((tag, idx) => (
                                <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-mono">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {aiDraft.suggestedCategorySlug && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Suggested Category</span>
                              {productForm.categorySlug !== aiDraft.suggestedCategorySlug && (
                                <button
                                  type="button"
                                  onClick={handleApplyAiCategory}
                                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                                >
                                  Apply Category
                                </button>
                              )}
                            </div>
                            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-semibold">
                              {aiDraft.suggestedCategorySlug}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Google SEO Snippet Preview */}
                      {(aiDraft.seoTitle || aiDraft.seoMetaDescription) && (
                        <div className="pt-2 border-t border-gray-100 space-y-1">
                          <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Search Engine Snippet Preview
                          </span>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 font-sans">
                            <p className="text-xs text-gray-500 mb-0.5">https://www.kuberfashions.in › products › {productForm.slug || 'product-slug'}</p>
                            <h5 className="text-sm font-medium text-blue-700 hover:underline cursor-pointer line-clamp-1">
                              {aiDraft.seoTitle || productForm.name}
                            </h5>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {aiDraft.seoMetaDescription || aiDraft.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Missing Details / Advice */}
                      {aiDraft.missingDetails && aiDraft.missingDetails.length > 0 && (
                        <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2.5">
                          <Lightbulb className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-amber-900">
                            <span className="font-bold">Catalog Quality Suggestion: </span>
                            Consider adding: {aiDraft.missingDetails.join(', ')} before publishing.
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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

      {/* Variant Inventory Management Modal */}
      {selectedVariantProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 flex-shrink-0 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-gray-900">
                    Variant Inventory Management
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    {selectedVariantProduct.name} (ID: {selectedVariantProduct.id})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVariantProduct(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto space-y-6 flex-grow">
              {/* Tracking Mode Status Card */}
              <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tracking Mode:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedVariantProduct.inventoryTrackingMode === 'VARIANT'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedVariantProduct.inventoryTrackingMode || 'LEGACY'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 max-w-md">
                    {selectedVariantProduct.inventoryTrackingMode === 'VARIANT'
                      ? 'Checkout deducts stock from discrete (size, color) variant rows with pessimistic locking.'
                      : 'Checkout currently uses legacy aggregate stock. To activate variant tracking, configure valid variants below and switch mode.'}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={switchingTrackingMode}
                  onClick={handleToggleTrackingMode}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${
                    selectedVariantProduct.inventoryTrackingMode === 'VARIANT'
                      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {switchingTrackingMode
                    ? 'Updating...'
                    : selectedVariantProduct.inventoryTrackingMode === 'VARIANT'
                    ? 'Switch to Legacy'
                    : 'Switch to Variant Tracking'}
                </button>
              </div>

              {/* Add Variant Form */}
              <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Plus className="h-4 w-4 text-indigo-600" />
                  Add / Configure Sellable Variant
                </h4>
                <form onSubmit={handleAddVariant} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Size *</label>
                    <input
                      type="text"
                      placeholder="e.g. M, 42, Free"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-black focus:outline-none"
                      value={variantForm.size}
                      onChange={(e) => setVariantForm({ ...variantForm, size: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Color *</label>
                    <input
                      type="text"
                      placeholder="e.g. Navy Blue"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-black focus:outline-none"
                      value={variantForm.color}
                      onChange={(e) => setVariantForm({ ...variantForm, color: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Stock Count *</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-black focus:outline-none"
                      value={variantForm.stockQuantity}
                      onChange={(e) => setVariantForm({ ...variantForm, stockQuantity: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">SKU (Optional)</label>
                    <input
                      type="text"
                      placeholder="SKU-..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-black focus:outline-none"
                      value={variantForm.sku}
                      onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-black hover:bg-gray-900 text-white font-bold text-xs rounded-lg uppercase tracking-wider transition-all h-[38px]"
                    >
                      Add Variant
                    </button>
                  </div>
                </form>
              </div>

              {/* Variants Table */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
                  <span>Configured Sellable Variants ({productVariants.length})</span>
                  {loadingVariants && <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />}
                </h4>

                {productVariants.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-medium">No variants configured yet</p>
                    <p className="text-xs text-gray-400 mt-0.5">Add variants above to specify available sizes, colors, and stock</p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Size</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Color</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">SKU</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                          <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100 text-sm">
                        {productVariants.map((variant) => (
                          <tr key={variant.id} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3 font-bold text-gray-900">{variant.size}</td>
                            <td className="px-4 py-3 text-gray-700">{variant.color}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-500">{variant.sku || '-'}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  className="w-20 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm font-semibold"
                                  value={editingVariantStock[variant.id] ?? variant.stockQuantity}
                                  onChange={(e) => setEditingVariantStock({
                                    ...editingVariantStock,
                                    [variant.id]: parseInt(e.target.value, 10) || 0
                                  })}
                                />
                                <span className="text-xs text-gray-400">units</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                disabled={savingVariantId === variant.id}
                                onClick={() => handleSaveStock(variant.id)}
                                className="px-3 py-1 bg-gray-100 hover:bg-black hover:text-white rounded-lg text-xs font-bold transition-colors"
                              >
                                {savingVariantId === variant.id ? 'Saving...' : 'Update Stock'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
              <button
                type="button"
                onClick={() => setSelectedVariantProduct(null)}
                className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-900 font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
