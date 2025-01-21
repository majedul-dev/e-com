// const addToCartModel = require("../../models/cartProduct")

// const addToCartViewProduct = async(req,res)=>{
//     try{
//         const currentUser = req.userId

//         const allProduct = await addToCartModel.find({
//             userId : currentUser
//         }).populate("productId")

//         res.json({
//             data : allProduct,
//             success : true,
//             error : false
//         })

//     }catch(err){
//         res.json({
//             message : err.message || err,
//             error : true,
//             success : false
//         })
//     }
// }

// module.exports =  addToCartViewProduct

const addToCartModel = require("../../models/cartProduct");

const addToCartViewProduct = async (req, res) => {
  try {
    const currentUser = req.userId;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "User not authorized",
      });
    }

    // Fetch all products in the user's cart and populate the product details
    const allProducts = await addToCartModel
      .find({ userId: currentUser })
      .populate("productId");

    // Check if the cart is empty
    if (!allProducts || allProducts.length === 0) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No products found in the cart",
      });
    }

    // Respond with the populated cart products
    return res.status(200).json({
      success: true,
      error: false,
      data: allProducts,
      message: "Products retrieved from cart successfully",
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

module.exports = addToCartViewProduct;
