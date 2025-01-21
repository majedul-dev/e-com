// const addToCartModel = require("../../models/cartProduct")

// const deleteAddToCartProduct = async(req,res)=>{
//     try{
//         const currentUserId = req.userId
//         const addToCartProductId = req.body._id

//         const deleteProduct = await addToCartModel.deleteOne({ _id : addToCartProductId})

//         res.json({
//             message : "Product Deleted From Cart",
//             error : false,
//             success : true,
//             data : deleteProduct
//         })

//     }catch(err){
//         res.json({
//             message : err?.message || err,
//             error : true,
//             success : false
//         })
//     }
// }

// module.exports = deleteAddToCartProduct

const addToCartModel = require("../../models/cartProduct");

const deleteAddToCartProduct = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { _id: addToCartProductId } = req.body;

    // Check if the user is logged in
    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "User not authorized",
      });
    }

    // Check if product ID is provided
    if (!addToCartProductId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Product ID is required",
      });
    }

    // Delete the product from the cart
    const deleteProduct = await addToCartModel.deleteOne({
      _id: addToCartProductId,
      userId: currentUserId, // Ensuring the product belongs to the current user
    });

    // If no product was deleted, return a 404
    if (deleteProduct.deletedCount === 0) {
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
      message: "Product deleted from cart successfully",
      data: deleteProduct,
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

module.exports = deleteAddToCartProduct;
