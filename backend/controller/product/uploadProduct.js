// const uploadProductPermission = require("../../helpers/permission")
// const productModel = require("../../models/productModel")

// async function UploadProductController(req,res){
//     try{
//         const sessionUserId = req.userId

//         if(!uploadProductPermission(sessionUserId)){
//             throw new Error("Permission denied")
//         }
    
//         const uploadProduct = new productModel(req.body)
//         const saveProduct = await uploadProduct.save()

//         res.status(201).json({
//             message : "Product upload successfully",
//             error : false,
//             success : true,
//             data : saveProduct
//         })

//     }catch(err){
//         res.status(400).json({
//             message : err.message || err,
//             error : true,
//             success : false
//         })
//     }
// }

// module.exports = UploadProductController

const Joi = require('joi');
const uploadProductPermission = require("../../helpers/permission");
const productModel = require("../../models/productModel");

async function UploadProductController(req, res) {
    try {
        const sessionUserId = req.userId;

        // Check if the user has permission to upload products
        if (!uploadProductPermission(sessionUserId)) {
            return res.status(403).json({
                message: "Permission denied",
                error: true,
                success: false,
            });
        }

        // Define Joi schema for validation
        const productSchema = Joi.object({
            productName: Joi.string().min(2).max(50).required(),
            description: Joi.string().min(10).required(),
            price: Joi.number().positive().required(),
            category: Joi.string().valid('Electronics', 'Clothing', 'Food', 'Accessories').required(),
            quantity: Joi.number().integer().min(1).required(),
            sku: Joi.string().alphanum().min(5).max(10).required(),
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

        const { productName, description, price, category, quantity, imageUrl, tags, sku } = req.body;

        // Check if the product with the same SKU already exists
        const existingProduct = await productModel.findOne({ sku });
        if (existingProduct) {
            return res.status(400).json({
                message: "Product with this SKU already exists.",
                error: true,
                success: false,
            });
        }

        // Prepare the product data
        const productData = {
            productName,
            description,
            price,
            category,
            quantity,
            sku,
            ...(imageUrl && { imageUrl }),
            ...(tags && { tags }),
        };

        // Create and save the new product
        const uploadProduct = new productModel(productData);
        const saveProduct = await uploadProduct.save();

        res.status(201).json({
            message: "Product uploaded successfully",
            error: false,
            success: true,
            data: saveProduct,
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

module.exports = UploadProductController;
