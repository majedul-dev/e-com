// const uploadProductPermission = require('../../helpers/permission')
// const productModel = require('../../models/productModel')

// async function updateProductController(req,res){
//     try{

//         if(!uploadProductPermission(req.userId)){
//             throw new Error("Permission denied")
//         }

//         const { _id, ...resBody} = req.body

//         const updateProduct = await productModel.findByIdAndUpdate(_id,resBody)
        
//         res.json({
//             message : "Product update successfully",
//             data : updateProduct,
//             success : true,
//             error : false
//         })

//     }catch(err){
//         res.status(400).json({
//             message : err.message || err,
//             error : true,
//             success : false
//         })
//     }
// }


// module.exports = updateProductController

const Joi = require('joi');
const uploadProductPermission = require('../../helpers/permission');
const productModel = require('../../models/productModel');
const userModel = require('../../models/userModel');  // Assuming you have a User model

async function updateProductController(req, res) {
    try {
        // Check if the user has permission to update the product
        if (!uploadProductPermission(req.userId)) {
            return res.status(403).json({
                message: "Permission denied",
                error: true,
                success: false,
            });
        }

        // Define Joi schema for validation
        const productSchema = Joi.object({
            name: Joi.string().min(2).max(50).optional(),
            description: Joi.string().min(10).optional(),
            price: Joi.number().positive().optional(),
            category: Joi.string().valid('Electronics', 'Clothing', 'Food', 'Accessories').optional(),
            quantity: Joi.number().integer().min(1).optional(),
            sku: Joi.string().alphanum().min(5).max(10).optional(),
            imageUrl: Joi.string().uri().optional(),
            tags: Joi.array().items(Joi.string()).optional(),
        });

        // Validate the incoming data
        const { error } = productSchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
                error: true,
                success: false,
            });
        }

        const { _id, name, description, price, category, quantity, imageUrl, tags, sku } = req.body;

        // Get the current user's name for the 'updatedBy' field
        const currentUser = await userModel.findById(req.userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        // Find the product by ID
        const existingProduct = await productModel.findById(_id);
        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false,
            });
        }

        // Check if the SKU is being updated and if the new SKU already exists
        if (sku && sku !== existingProduct.sku) {
            const productWithSameSku = await productModel.findOne({ sku });
            if (productWithSameSku) {
                return res.status(400).json({
                    message: "Product with this SKU already exists.",
                    error: true,
                    success: false,
                });
            }
        }

        // Prepare the updated product data
        const updatedData = {
            ...(name && { name }),
            ...(description && { description }),
            ...(price && { price }),
            ...(category && { category }),
            ...(quantity && { quantity }),
            ...(imageUrl && { imageUrl }),
            ...(tags && { tags }),
            ...(sku && { sku }),
            updatedBy: currentUser.name,  // Store the user's name who updated the product
        };

        // Update the product in the database
        const updatedProduct = await productModel.findByIdAndUpdate(_id, updatedData, { new: true });

        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct,
            success: true,
            error: false,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = updateProductController;
