// const productModel = require("../../models/productModel")

// const getProductController = async(req,res)=>{
//     try{
//         const allProduct = await productModel.find().sort({ createdAt : -1 })

//         res.json({
//             message : "All Product",
//             success : true,
//             error : false,
//             data : allProduct
//         })

//     }catch(err){
//         res.status(400).json({
//             message : err.message || err,
//             error : true,
//             success : false
//         })
//     }

// }

// module.exports = getProductController

const productModel = require("../../models/productModel");

const getProductController = async (req, res) => {
    try {
        // Extract pagination and filter parameters from the request
        const { page = 1, limit = 10, category, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = -1 } = req.query;

        // Build the filter object dynamically based on query parameters
        let filter = {};
        
        if (category) {
            filter.category = category;
        }
        
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = minPrice;
            if (maxPrice) filter.price.$lte = maxPrice;
        }

        // Set up pagination and sorting
        const skip = (page - 1) * limit;
        const sort = { [sortBy]: parseInt(sortOrder) };

        // Fetch the products from the database with filters, pagination, and sorting
        const products = await productModel
            .find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort(sort);

        // Get the total number of products to calculate the total pages
        const totalProducts = await productModel.countDocuments(filter);

        // Calculate the total pages for pagination
        const totalPages = Math.ceil(totalProducts / limit);

        // Return the response with the products and pagination info
        res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            error: false,
            data: products,
            pagination: {
                page,
                totalPages,
                totalProducts,
                limit: parseInt(limit)
            }
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({
            message: err.message || "Error fetching products",
            error: true,
            success: false
        });
    }
};

module.exports = getProductController;
