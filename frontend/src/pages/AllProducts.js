// import React, { useEffect, useState } from 'react'
// import UploadProduct from '../components/UploadProduct'
// import SummaryApi from '../common'
// import AdminProductCard from '../components/AdminProductCard'

// const AllProducts = () => {
//   const [openUploadProduct,setOpenUploadProduct] = useState(false)
//   const [allProduct,setAllProduct] = useState([])

//   const fetchAllProduct = async() =>{
//     const response = await fetch(SummaryApi.allProduct.url)
//     const dataResponse = await response.json()

//     console.log("product data",dataResponse)

//     setAllProduct(dataResponse?.data || [])
//     console.log(dataResponse)
//   }

//   useEffect(()=>{
//     fetchAllProduct()
//   },[])
  
//   return (
//     <div>
//         <div className='bg-white py-2 px-4 flex justify-between items-center'>
//             <h2 className='font-bold text-lg'>All Product</h2>
//             <button  className='border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full ' onClick={()=>setOpenUploadProduct(true)}>Upload Product</button>
//         </div>

//         {/**all product */}
//         <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
//           {
//             allProduct.map((product,index)=>{
//               return(
//                 <AdminProductCard data={product} key={index+"allProduct"} fetchdata={fetchAllProduct}/>
                
//               )
//             })
//           }
//         </div>





//         {/**upload prouct component */}
//         {
//           openUploadProduct && (
//             <UploadProduct onClose={()=>setOpenUploadProduct(false)} fetchData={fetchAllProduct}/>
//           )
//         }
      

//     </div>
//   )
// }

// export default AllProducts

import React, { useEffect, useState } from 'react';
import UploadProduct from '../components/UploadProduct';
import SummaryApi from '../common';
import AdminProductCard from '../components/AdminProductCard';

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    perPage: 10,
  });

  const fetchAllProducts = async (page = 1) => {
    try {
      const response = await fetch(`${SummaryApi.allProduct.url}?page=${page}`);
      const dataResponse = await response.json();

      if (dataResponse.success) {
        setAllProducts(dataResponse.data || []);
        setPagination(dataResponse.pagination || {});
      } else {
        console.error('Failed to fetch products:', dataResponse.message);
      }
    } catch (error) {
      console.error('Fetch Products Error:', error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      fetchAllProducts(pageNumber);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="bg-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">All Products</h2>
        <button
          className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full"
          onClick={() => setOpenUploadProduct(true)}
        >
          Upload Product
        </button>
      </div>

      {/* Products Section */}
      <div className="flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll">
        {allProducts.map((product, index) => (
          <AdminProductCard
            data={product}
            key={product._id || `${index}-allProduct`}
            fetchdata={fetchAllProducts}
          />
        ))}
      </div>

      <div className="flex justify-center items-center mt-4">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          className={`mx-1 px-3 py-1 rounded ${
            pagination.currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          disabled={pagination.currentPage === 1}
        >
          Prev
        </button>

        {/* Page Numbers */}
        {Array.from({ length: pagination.totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              pagination.currentPage === i + 1 ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          className={`mx-1 px-3 py-1 rounded ${
            pagination.currentPage === pagination.totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
        </button>
      </div>


      {/* Upload Product Modal */}
      {openUploadProduct && (
        <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProducts} />
      )}
    </div>
  );
};

export default AllProducts;
