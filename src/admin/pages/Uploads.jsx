import React, { useState } from 'react';
import { Upload, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';

const CATEGORIES = [
  { slug: 'mens-fashion', name: "Men's Fashion" },
  { slug: 'womens-fashion', name: "Women's Fashion" },
  { slug: 'kids-fashion', name: 'Kids Fashion' },
  { slug: 'kvision', name: 'KVision Membership' },
  { slug: 'accessories', name: 'Accessories' },
  { slug: 'sports-active', name: 'Sports & Active' }
];

export default function AdminUploads() {
  const [category, setCategory] = useState('mens-fashion');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const BASE = import.meta.env.VITE_API_BASE_URL || 'https://kuberfashion-backend-2025.onrender.com/api';

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setUrl('');
      setError('');
      setSuccess(false);
    }
  };

  const onUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('categorySlug', category);

      // Generate unique filename
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
        setUrl(data.data?.publicUrl || '');
        setSuccess(true);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (e) {
      setError(e.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Image Upload</h1>
        <p className="text-gray-600">Upload product images to Supabase storage</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={onUpload} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CATEGORIES.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-contain p-4" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-12 h-12 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Upload Button */}
          <button
            disabled={loading || !file}
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
          >
            <Upload className="h-5 w-5" />
            <span>{loading ? 'Uploading...' : 'Upload Image'}</span>
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Success Message with URL */}
        {success && url && (
          <div className="mt-4 space-y-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800">Image uploaded successfully!</p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Public URL:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
                  onClick={(e) => e.target.select()}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                    alert('URL copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Copy
                </button>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 text-sm text-blue-600 hover:underline"
              >
                View Image →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
