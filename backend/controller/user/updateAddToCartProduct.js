// const addToCartModel = require("../../models/cartProduct")

// const updateAddToCartProduct = async(req,res)=>{
//     try{
//         const currentUserId = req.userId
//         const addToCartProductId = req?.body?._id

//         const qty = req.body.quantity

//         const updateProduct = await addToCartModel.updateOne({_id : addToCartProductId},{
//             ...(qty && {quantity : qty})
//         })

//         res.json({
//             message : "Product Updated",
//             data : updateProduct,
//             error : false,
//             success : true
//         })

//     }catch(err){
//         res.json({
//             message : err?.message || err,
//             error : true,
//             success : false
//         })
//     }
// }

// module.exports = updateAddToCartProduct

const addToCartModel = require("../../models/cartProduct");

const updateAddToCartProduct = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { _id: addToCartProductId, quantity } = req.body;

    // Check if the user is logged in
    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "User not authorized",
      });
    }

    // Validate if product ID and quantity are provided
    if (!addToCartProductId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Product ID is required",
      });
    }

    if (quantity === undefined || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Valid quantity is required",
      });
    }

    // Update the quantity of the product in the cart
    const updateProduct = await addToCartModel.updateOne(
      { _id: addToCartProductId, userId: currentUserId },
      { quantity }
    );

    // If no product was updated, return a 404
    if (updateProduct.nModified === 0) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Product not found in cart",
      });
    }

    // Respond with success
    return res.status(200).json({
      success: true,
      error: false,
      message: "Product updated successfully",
      data: updateProduct,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging

    return res.status(500).json({
      success: false,
      error: true,
      message: err.message || "An unexpected error occurred",
    });
  }
};

module.exports = updateAddToCartProduct;
