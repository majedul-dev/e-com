// const userModel = require("../../models/userModel")

// async function updateUser(req,res){
//     try{
//         const sessionUser = req.userId

//         const { userId , email, name, role} = req.body

//         const payload = {
//             ...( email && { email : email}),
//             ...( name && { name : name}),
//             ...( role && { role : role}),
//         }

//         const user = await userModel.findById(sessionUser)

//         console.log("user.role",user.role)



//         const updateUser = await userModel.findByIdAndUpdate(userId,payload)

        
//         res.json({
//             data : updateUser,
//             message : "User Updated",
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


// module.exports = updateUser

const userModel = require("../../models/userModel");

async function updateUser(req, res) {
    try {
        const sessionUser = req.userId; // Get the authenticated user ID from the token
        const { email, name, role, status, address } = req.body;

        // Check if the current user is an "ADMIN" before allowing role update
        const currentUser = await userModel.findById(sessionUser);
        const userToUpdate = await userModel.findById(sessionUser);

        if (!userToUpdate) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        // If the current user is not an "ADMIN", they cannot change the "role"
        if (currentUser.role !== 'ADMIN' && role) {
            return res.status(403).json({
                message: "Only admins can change the role",
                error: true,
                success: false,
            });
        }

        // Prepare the payload with valid fields
        const payload = {
            ...(email && { email }),
            ...(name && { name }),
            ...(role && { role }), // Role can only be updated by an ADMIN
            ...(status && { status }),
            ...(address && { address }),
        };

        // If no fields to update, return an error
        if (Object.keys(payload).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update",
                error: true,
                success: false,
            });
        }

        // Update the user data
        const updatedUser = await userModel.findByIdAndUpdate(sessionUser, payload, { new: true }).select("-password");

        res.json({
            data: updatedUser,
            message: "User updated successfully",
            success: true,
            error: false,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = updateUser;
