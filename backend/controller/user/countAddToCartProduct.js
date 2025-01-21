// const addToCartModel = require("../../models/cartProduct")

// const countAddToCartProduct = async(req,res)=>{
//     try{
//         const userId = req.userId

//         const count = await addToCartModel.countDocuments({
//             userId : userId
//         })

//         res.json({
//             data : {
//                 count : count
//             },
//             message : "ok",
//             error : false,
//             success : true
//         })
//     }catch(error){
//         res.json({
//             message : error.message || error,
//             error : false,
//             success : false,
//         })
//     }
// }

// module.exports = countAddToCartProduct

const addToCartModel = require("../../models/cartProduct");

const countAddToCartProduct = async (req, res) => {
  try {
    const userId = req.userId;

    // Check if the user is logged in
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "User not authorized",
      });
    }

    // Count the number of products in the user's cart
    const count = await addToCartModel.countDocuments({ userId });

    // Respond with the count of products in the cart
    return res.status(200).json({
      success: true,
      error: false,
      data: { count },
      message: "Cart product count fetched successfully",
    });
  } catch (error) {
    console.error(error); // Log the error for debugging

    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "An unexpected error occurred",
    });
  }
};

module.exports = countAddToCartProduct;
