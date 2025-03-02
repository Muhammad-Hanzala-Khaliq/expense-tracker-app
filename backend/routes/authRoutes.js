const express = require("express");
const protect = require("../middlewares/authMiddlware");

const {registerUser,loginUser,getUserInfo} = require("../controllers/authController");  
const upload = require("../middlewares/uploadMiddleware");


const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/getUser",protect,getUserInfo);
router.post('/upload-image',upload.single("image"),(req,res)=>{
    if(!req.file){
        return res.status(400).json({message:"No File Uploaded"});
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(201).json({imageUrl});
})


module.exports = router;
