import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { Link } from 'react-router-dom';

const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const categoryLoading = new Array(13).fill(null);

    const fetchCategoryProduct = async () => {
        try {
            const response = await fetch(SummaryApi.categoryProduct.url);
            const dataResponse = await response.json();
            if (dataResponse.success) {
                setCategoryProduct(dataResponse.data);
            } else {
                console.error('Error fetching category products:', dataResponse.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryProduct();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center gap-4 justify-between overflow-scroll scrollbar-none">
                {loading
                    ? categoryLoading.map((_, index) => (
                          <div
                              className="h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse"
                              key={`categoryLoading-${index}`}
                          ></div>
                      ))
                    : categoryProduct.map((product, index) => (
                          <Link
                              to={`/product-category?category=${product?.category}`}
                              className="cursor-pointer"
                              key={product?.category || index}
                          >
                              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center">
                                  {product.products[0]?.productImage?.[0] ? (
                                      <img
                                          src={product.products[0].productImage[0]}
                                          alt={product?.category}
                                          className="h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all"
                                      />
                                  ) : (
                                      <div className="h-full w-full bg-gray-300"></div>
                                  )}
                              </div>
                              <p className="text-center text-sm md:text-base capitalize">
                                  {product?.category || 'Unknown'}
                              </p>
                          </Link>
                      ))}
            </div>
        </div>
    );
};

export default CategoryList;
