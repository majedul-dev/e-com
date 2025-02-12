// app/products/new/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  TagIcon,
  DocumentTextIcon,
  ChartBarIcon,
  SquaresPlusIcon,
  StarIcon,
  HashtagIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import uploadImage from '@/utils/uploadImage';
import { getSession, useSession } from 'next-auth/react';
// import { createProduct } from '@/app/lib/productAction';
// import { createProduct } from '@/lib/productAction';

// Sample data - replace with API calls
const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Books'];
const brands = ['Apple', 'Samsung', 'Nike', 'Sony'];

export default function ProductForm() {
  const router = useRouter();
  const [status, setStatus] = useState('draft');
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    productName: '',
    description: '',
    price: '',
    sellingPrice: '',
    costPerItem: '',
    sku: '',
    stock: 0,
    weight: '',
    status: 'draft',
    variants: [],
    productImage: selectedImages,
    seoTitle: '',
    seoDescription: '',
    category: '',
    brandName: '',
    tags: [],
    isPublished: true,
    isFeatured: false,
    discount: 0
  });

  const [tempTag, setTempTag] = useState('');
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('basic');

  const validateForm = () => {
    const newErrors = {};
    if (!productData.productName) newErrors.productName = 'Product title is required';
    if (!productData.price) newErrors.price = 'Price is required';
    if (!productData.sku) newErrors.sku = 'SKU is required';
    if (productData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    // if (productData.productImage.length < 1) newErrors.productImage = 'At list one product image required';
    if (!productData.category) newErrors.category = 'Category is required';
    if (status === 'published' && !productData.description) {
      newErrors.description = 'Description is required for publishing';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const session = await getSession()
    
    console.log("accesstoken", session?.accessToken)
    // Submit logic here
    try {
      const response = await fetch(
        `https://8080-majeduldev-ecom-dxiwo2blvmm.ws-us117.gitpod.io/api/product/upload-product`,
        {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.accessToken}`  // Send token in header
            },
            credentials: "include",  
            body: JSON.stringify(productData)
        }
    );
      console.log(productData, response) 
      // if (!response.ok) throw new Error('Failed to create product');

      // router.push('/products');
    } catch (error) {
      console.log(error)
      console.error('Error submitting product:', error);
      setErrors({ submit: 'Failed to create product. Try again later.' });
    } finally {
      setLoading(false);
    }
    // console.log(newProduct)
    // router.push('/products');
  };

  const handleAddVariant = () => {
    setProductData(prev => ({
      ...prev,
      variants: [...prev.variants, { option: '', values: '' }]
    }));
  };

  // const handleImageUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   const newImages = files.map(file => ({
  //     url: URL.createObjectURL(file),
  //     file
  //   }));
  //   setProductData(prev => ({ ...prev, productImage: [...prev.productImage, ...newImages] }));
  // };
  // const handleRemoveImage = (index) => {
    
  //   setProductData((prev) => ({
  //     ...prev,
  //     productImage: prev.productImage.filter((image) => image !== index),
  //   }));
  // };

  // const handleImageUpload = async (e) => {
  //   const files = Array.from(e.target.files);
  
  //   try {
  //     // Upload images to Cloudinary
  //     const uploadPromises = files.map(async (file) => {
  //       const formData = new FormData();
  //       formData.append("file", file);
  //       formData.append("upload_products", "products_images"); // Replace with your Cloudinary upload preset
  
  //       console.log("formdata ",formData)
  //       const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
  //         method: "POST",
  //         body: formData,
  //       });
  
  //       const data = await response.json();
  //       return { url: data.secure_url, file }; // Store the Cloudinary URL
  //     });
  
  //     const uploadedImages = await Promise.all(uploadPromises);
  
  //     // Update state with uploaded image URLs
  //     setProductData(prev => ({
  //       ...prev,
  //       productImage: [...prev.productImage, ...uploadedImages]
  //     }));
  //     console.log(productData.productImage)
  //   } catch (error) {
  //     console.error("Image upload failed:", error);
  //     alert("Failed to upload images. Please try again.");
  //   }
  // };
  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  // Remove selected image before upload
  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

   // Upload all selected images
   const handleUploadImages = async () => {
    const uploaded = await Promise.all(selectedImages.map((image) => uploadImage(image)));

    setProductData((prev) => ({
      ...prev,
      productImage: [...uploaded.map((img) => img.secure_url)]
    }));
     
    setSelectedImages([]);
  };

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files
  //   const uploadImageCloudinary = await uploadImage(file)
  //   console.log(uploadImageCloudinary)

  //   setProductData((preve) => {
  //     return{
  //       ...preve,
  //       productImage: [...preve.productImage, {
  //         url: uploadImageCloudinary.url,
  //         publicId: uploadImageCloudinary.public_id,
  //         deleteToken: uploadImageCloudinary.delete_token
  //       }]
  //     }
  //   })
  // };

  // const handleDeleteImage = async (publicId, deleteToken) => {
  //   console.log(deleteToken)
  //   try {
  //     await fetch(`https://api.cloudinary.com/v1_1/majedul/${deleteToken}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({ public_id: publicId })
  //     });
  
  //     // Remove image from state
  //     setProductData((prev) => ({
  //       ...prev,
  //       productImage: prev.productImage.filter(image => image.publicId !== publicId)
  //     }));
  //   } catch (error) {
  //     console.error("Error deleting image:", error);
  //   }
  // };
  const handleDeleteImage = async (publicId, deleteToken) => {
    try {
      // 3. Make the delete request
      const response = await fetch(`https://api.cloudinary.com/v1_1/majedul/image/destroy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          public_id: publicId,
          token: deleteToken
        }),
        credentials: "include"
      });
  
      // 4. Handle the response
      const result = await response.json();

      console.log(result)
      
      if (result.result !== "ok") {
        throw new Error('Failed to delete image from Cloudinary');
      }
  
      // 5. Update local state after successful deletion
      setProductData(prev => ({
        ...prev,
        productImage: prev.productImage.filter(
          image => image.public_id !== publicId
        ),
      }));
  
    } catch (error) {
      console.error("Delete error:", error);
      // Handle errors in your UI here
    }
  };

  console.log(productData.productImage)

  const handleAddTag = () => {
    if (tempTag.trim() && !productData.tags.includes(tempTag.trim())) {
      setProductData(prev => ({
        ...prev,
        tags: [...prev.tags, tempTag.trim()]
      }));
      setTempTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/products"
          className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Products
        </Link>
        <div className="flex gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {status === 'draft' ? 'Save Draft' : 'Publish Product'}
          </button>
        </div>
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {['basic', 'inventory', 'media', 'variants', 'seo'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeSection === section 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {section === 'basic' && <DocumentTextIcon className="h-5 w-5 mr-2 inline dark:text-gray-400" />}
              {section === 'inventory' && <HashtagIcon className="h-5 w-5 mr-2 inline dark:text-gray-400" />}
              {section === 'media' && <PhotoIcon className="h-5 w-5 mr-2 inline dark:text-gray-400" />}
              {section === 'variants' && <SquaresPlusIcon className="h-5 w-5 mr-2 inline dark:text-gray-400" />}
              {section === 'seo' && <ChartBarIcon className="h-5 w-5 mr-2 inline dark:text-gray-400" />}
              {section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-gray-900 transition-colors">
          {activeSection === 'basic' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Title *
                  <input
                    type="text"
                    value={productData.productName}
                    onChange={(e) => setProductData({ ...productData, productName: e.target.value })}
                    className={`mt-1 block w-full rounded-lg border ${errors.productName ? 'border-red-500' : 'border-gray-200'} p-2`}
                  />
                  {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description *
                  <textarea
                    value={productData.description}
                    onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                    className={`mt-1 block w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-200'} p-2 h-32`}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category *
                    <select
                      value={productData.category}
                      onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                      className={`mt-1 block w-full rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-200'} p-2`}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Brand
                    <select
                      value={productData.brandName}
                      onChange={(e) => setProductData({ ...productData, brandName: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-gray-200 p-2"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tags
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      value={tempTag}
                      onChange={(e) => setTempTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      className="flex-1 rounded-lg border border-gray-200 p-2"
                      placeholder="Add tags (press enter)"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {productData.tags.map(tag => (
                      <span key={tag} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeSection === 'inventory' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    SKU *
                    <input
                      type="text"
                      value={productData.sku}
                      onChange={(e) => setProductData({ ...productData, sku: e.target.value })}
                      className={`mt-1 block w-full rounded-lg border ${errors.sku ? 'border-red-500' : 'border-gray-200'} p-2`}
                    />
                    {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stock *
                    <input
                      type="number"
                      value={productData.stock}
                      onChange={(e) => setProductData({ 
                        ...productData, 
                        stock: Math.max(0, parseInt(e.target.value) || 0)
                      })}
                      className={`mt-1 block w-full rounded-lg border ${errors.stock ? 'border-red-500' : 'border-gray-200'} p-2`}
                    />
                    {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price *
                    <input
                      type="number"
                      value={productData.price}
                      onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                      className={`mt-1 block w-full rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-200'} p-2`}
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Compare at Price
                    <input
                      type="number"
                      value={productData.sellingPrice}
                      onChange={(e) => setProductData({ ...productData, sellingPrice: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-gray-200 p-2"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Discount (%)
                    <input
                      type="number"
                      value={productData.discount}
                      onChange={(e) => setProductData({
                        ...productData,
                        discount: Math.min(100, Math.max(0, parseFloat(e.target.value) || 0))
                      })}
                      className="mt-1 block w-full rounded-lg border border-gray-200 p-2"
                    />
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2 mt-6">
                    <input
                      type="checkbox"
                      checked={productData.isFeatured}
                      onChange={(e) => setProductData({ ...productData, isFeatured: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Featured Product</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'media' && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer"
                >
                  <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="mt-2 text-gray-600">
                    Drag and drop images or click to upload
                  </p>
                </label>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Product ${index + 1}`}
                      className="rounded-lg h-32 w-full object-cover"
                    />
                    <button onClick={() => handleRemoveImage(index)} className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-sm hover:bg-red-100">
                      <TrashIcon className="h-5 w-5 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleUploadImages}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                // disabled={loading}
              >Upload</button>
            </div>
          )}

          {activeSection === 'variants' && (
            <div className="space-y-6">
              <button
                onClick={handleAddVariant}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Variant Option
              </button>
              {productData.variants.map((variant, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Option Name (e.g., Size, Color)
                        <input
                          type="text"
                          value={variant.option}
                          onChange={(e) => {
                            const newVariants = [...productData.variants];
                            newVariants[index].option = e.target.value;
                            setProductData({ ...productData, variants: newVariants });
                          }}
                          className="mt-1 block w-full rounded-lg border border-gray-200 p-2"
                        />
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Values (comma-separated)
                        <input
                          type="text"
                          value={variant.values}
                          onChange={(e) => {
                            const newVariants = [...productData.variants];
                            newVariants[index].values = e.target.value;
                            setProductData({ ...productData, variants: newVariants });
                          }}
                          className="mt-1 block w-full rounded-lg border border-gray-200 p-2"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'seo' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  SEO Title
                  <input
                    type="text"
                    value={productData.seoTitle}
                    onChange={(e) => setProductData({ ...productData, seoTitle: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-200 p-2"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  SEO Description
                  <textarea
                    value={productData.seoDescription}
                    onChange={(e) => setProductData({ ...productData, seoDescription: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-200 p-2 h-32"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
}