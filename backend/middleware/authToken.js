// const jwt = require('jsonwebtoken')

// async function authToken(req,res,next){
//     try{
//         const token = req.cookies?.token

//         console.log("token",token)
//         if(!token){
//             return res.status(200).json({
//                 message : "Please Login...!",
//                 error : true,
//                 success : false
//             })
//         }

//         jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
//             console.log(err)
//             console.log("decoded",decoded)
            
//             if(err){
//                 console.log("error auth", err)
//             }

//             req.userId = decoded?._id

//             next()
//         });


//     }catch(err){
//         res.status(400).json({
//             message : err.message || err,
//             data : [],
//             error : true,
//             success : false
//         })
//     }
// }


// module.exports = authToken

const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        let token = req.cookies?.token || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

        // Check if token is provided
        if (!token) {
            return res.status(401).json({
                message: "Please login to access this resource.",
                error: true,
                success: false,
            });
        }

        // Verify token
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err);

                // Handle expired token
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        message: "Session expired. Please login again.",
                        error: true,
                        success: false,
                    });
                }

                // Other errors
                return res.status(401).json({
                    message: "Invalid token. Please login again.",
                    error: true,
                    success: false,
                });
            }

            // Token is valid, set userId from decoded token
            req.userId = decoded?._id;
            next();
        });

    } catch (err) {
        console.error("Auth Middleware Error:", err);
        res.status(500).json({
            message: "An unexpected error occurred.",
            error: true,
            success: false,
        });
    }
}

module.exports = authToken;
