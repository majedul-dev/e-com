import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getAllProducts = async (searchParamsPromise) => {
    try {
      const searchParams = await searchParamsPromise;
        const query = new URLSearchParams(
            Object.fromEntries(
                Object.entries(searchParams).map(([key, value]) => [key, String(value)])
            )
        ).toString();

        const res = await fetch(`${process.env.BACKEND_URL}/api/product/get-product?${query}`);
        
        if (!res.ok) {
            throw new Error(`Failed to fetch products: ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error(error.message);
    }
};

export async function getProductDetails(productId) {
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/api/product/product-details/${productId}`, {
        cache: "no-store", // Ensures fresh data
      });
  
      if (!res.ok) {
        throw new Error(`Failed to fetch product: ${res.statusText}`);
      }
  
      return await res.json();
    } catch (error) {
      console.error("Error fetching product:", error);
      return null; // Return null instead of crashing
    }
  }
  
export const createProduct = async (productData) => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/product/upload-product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }

    return await res.data;
  } catch (error) {
    console.error("Error fetching to create product:", error);
  }
}