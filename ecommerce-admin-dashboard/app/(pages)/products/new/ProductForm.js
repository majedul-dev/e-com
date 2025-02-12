'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters long'),
  description: z.string().optional(),
  price: z.number().positive('Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  image: z.instanceof(FileList).optional(),
});

export default function ProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(productSchema) });
  
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('price', data.price);
    formData.append('category', data.category);
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to submit');
      router.push('/products');
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input {...register('name')} className="w-full border p-2 rounded" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea {...register('description')} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input type="number" {...register('price', { valueAsNumber: true })} className="w-full border p-2 rounded" />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select {...register('category')} className="w-full border p-2 rounded">
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Product Image</label>
          <input type="file" {...register('image')} accept="image/*" onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />}
        </div>
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => router.push('/products')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
