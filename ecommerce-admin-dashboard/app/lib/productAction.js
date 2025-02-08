export const getAllProducts = async (searchParams = {}) => {
    try {
        // Convert searchParams into a valid query string
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

export const getProductDetails = async (productId) => {
    try {
        const res = await fetch(`https://8080-majeduldev-ecom-dxiwo2blvmm.ws-us117.gitpod.io/api/product/product-details/${productId}`);
        console.log(res)
        // if (!res.ok) {
        //     throw new Error(`Failed to fetch products: ${res.statusText}`);
        // }

        return await res.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error(error.message);
    }

}
