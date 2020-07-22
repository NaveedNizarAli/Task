const bcrypt = require("bcryptjs");
const router = require("express").Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { findById } = require("../models/userModel");
router.post("/register", async (req, res)=>{
   
   try{
        let {email, password, passwordCheck, displayName} = req.body;
       
        //validation
        if(!email || !password || !passwordCheck)
            return res.status(400).json({msg: "not all fields have been entered. "});
        if(password.length < 6)
            return res.status(400).json({msg: "Password must be minimum of 6 character. "});
        if(password != passwordCheck)
            return res.status(400).json({msg: "Password is not matching"});
       
        const existingUser = await User.findOne({email: email});
        if(existingUser)
            return res.status(400).json({msg: "Account with email id already exist"});
       
        if(!displayName) displayName = email;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);

        const newUser = new User({
            email,
            password: passwordHash,
            displayName
        });
        const savedUser = await newUser.save();
        res.json(savedUser);
    }
   catch(err){
       res.status(500).json({error: err.message});
   }
});

router.post("/login", async (req, res)=> {
    try{
        const {email, password} = req.body;

        //validation
        if(!email || !password)
            res.status(400).json({msg: "Fields are empty"});
        
        const user = await User.findOne({email: email});
        if(!user)
            res.status(400).json({msg: "There is no account with this user"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            res.status(400).json({msg: "Invalid password"});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.json({
            token,
            user:{
                id: user._id,
                displayName: user.displayName,
                email: user.email,
            },
        })
    }
    catch(err){
        throw err;
    }
});

router.delete("/delete", auth, async (req, res)=>{
    try{
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    }
    catch(err){
        throw err;
    }
});

router.post("/tokenIsValid", async (req, res) =>{
    try{
        const token = req.header("x_auth");
        if(!token)
            return res.json({msg: "1"});
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified)
            return res.json({msg: "2"});
        const user= await User.findById(verified.id);
        if(!user)
            return res.json({msg: "3"});
        
        return res.json(true);       
    }
    catch(err){
        throw err;
    }
});

router.get("/", auth, async (req, res) => {
    const user = await User.find(req.user.id);
    res.json({
        displayName: user.displayName,
        id: user._id,
        email: user.email,
    });
});
module.exports = router;