// app/categories/new/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, FolderIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]); // Fetch existing categories from API
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentCategory: null,
    status: 'active',
    image: null
  });
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch existing categories for parent selection
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await fetch('/api/categories');
  //       const data = await response.json();
  //       setCategories(data);
  //     } catch (error) {
  //       console.error('Error fetching categories:', error);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Remove selected image
  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setPreviewImage('');
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Category slug is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('slug', formData.slug);
      formPayload.append('description', formData.description);
      formPayload.append('parentCategory', formData.parentCategory);
      formPayload.append('status', formData.status);
      if (formData.image) formPayload.append('image', formData.image);

      const response = await fetch('/api/categories', {
        method: 'POST',
        body: formPayload
      });

      if (response.ok) {
        router.push('/categories');
      } else {
        const errorData = await response.json();
        setErrors({ server: errorData.message || 'Failed to create category' });
      }
    } catch (error) {
      setErrors({ server: 'An error occurred while saving the category' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Create New Category</h1>
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.server && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg dark:bg-red-900/30 dark:text-red-400">
            {errors.server}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium dark:text-gray-300">
              Category Image (Optional)
            </label>
            <div className="relative group">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {previewImage ? (
                    <>
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg mb-4"
                      />
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        Change Image
                      </span>
                    </>
                  ) : (
                    <>
                      <PhotoIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Click to upload an image
                      </p>
                    </>
                  )}
                </label>
              </div>
              {previewImage && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-1 rounded-full shadow-sm hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700 ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Category Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className={`w-full rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700 ${
                  errors.slug ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.slug && (
                <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
              )}
            </div>

            {/* Parent Category */}
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Parent Category
              </label>
              <select
                value={formData.parentCategory || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  parentCategory: e.target.value || null 
                })}
                className="w-full rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">None (Top-level Category)</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700"
            rows="4"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 border-t pt-6">
          <button
            type="button"
            onClick={() => router.push('/categories')}
            className="px-6 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Saving...
              </>
            ) : (
              'Create Category'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}