// const addToCartModel = require("../../models/cartProduct")

// const addToCartController = async(req,res)=>{
//     try{
//         const { productId } = req?.body
//         const currentUser = req.userId

//         const isProductAvailable = await addToCartModel.findOne({ productId })

//         console.log("isProductAvailabl   ",isProductAvailable)

//         if(isProductAvailable){
//             return res.json({
//                 message : "Already exits in Add to cart",
//                 success : false,
//                 error : true
//             })
//         }

//         const payload  = {
//             productId : productId,
//             quantity : 1,
//             userId : currentUser,
//         }

//         const newAddToCart = new addToCartModel(payload)
//         const saveProduct = await newAddToCart.save()


//         return res.json({
//             data : saveProduct,
//             message : "Product Added in Cart",
//             success : true,
//             error : false
//         })
        

//     }catch(err){
//         res.json({
//             message : err?.message || err,
//             error : true,
//             success : false
//         })
//     }
// }


// module.exports = addToCartController


const addToCartModel = require("../../models/cartProduct");

const addToCartController = async (req, res) => {
  try {
    const { productId } = req.body;
    const currentUser = req.userId;

    // Check if the productId is provided
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Product ID is required",
      });
    }

    // Check if the user is logged in
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "User not authorized",
      });
    }

    // Check if the product already exists in the cart for the user
    const isProductInCart = await addToCartModel.findOne({
      productId,
      userId: currentUser,
    });

    if (isProductInCart) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Product already exists in the cart",
      });
    }

    // Create a new cart item
    const payload = {
      productId,
      quantity: 1,
      userId: currentUser,
    };

    const newAddToCart = new addToCartModel(payload);
    const savedProduct = await newAddToCart.save();

    // Respond with success
    return res.status(201).json({
      success: true,
      error: false,
      message: "Product added to cart",
      data: savedProduct,
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

module.exports = addToCartController;
