export const getAllProducts = async (searchParamsPromise) => {
  try {
    const searchParams = await searchParamsPromise;
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(searchParams).map(([key, value]) => [key, String(value)])
      )
    ).toString();

    const res = await fetch(
      `${process.env.BACKEND_URL}/api/product/get-product?${query}`
    );

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
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/product/product-details/${productId}`,
      {
        cache: "no-store", // Ensures fresh data
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null; // Return null instead of crashing
  }
}
