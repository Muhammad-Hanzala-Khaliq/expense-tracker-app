const jwt = require('jsonwebtoken');
const User = require('../models/User');

// generate Token
const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d'
    });
}

// Register User
const registerUser = async (req,res) => {
    const {fullName,email,password,profileImageUrl} = req.body;

    // validation check for missing fields  
    if(!fullName || !email || !password){
        return res.status(400).json({message:"Please fill all fields"});
    }
    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        // create the new user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl
        });

        res.status(201).json({
            id:user._id,
            user,
            token:generateToken(user._id)  

        })
        
    } catch (error) {
        res.status(500).json({message:"Error Registering User",error:error.message});
    }

}
// Login User
const loginUser = async (req,res) => {
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"Please fill all fields"});
    }

    try {
        const user = await User.findOne({email});
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({message:"Invalid Credentials"});
        }

        res.status(200).json({
            id:user._id,
            user,
            token:generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({message:"Error Logging In",error:error.message});
        
    }

}
// get User
const getUserInfo = async (req,res) => {
try {
    const user = await User.findById(req.user.id).select('-password');
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    res.status(200).json(user);
} catch (error) {
    res.status(500).json({message:"Error Logging In",error:error.message});
}
}

module.exports = { registerUser, loginUser, getUserInfo };