const jwt = require("jsonwebtoken");
const { json } = require("express");

const auth = (req, res, next) => {
    try{
        const token = req.header("x_auth");
        if(!token)
            return res.status(401).json({msg: "No authentication token , access denied"});
    
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified)
            return res.status(401).json({msg: " token verification failed , access failed"});
        
        req.user = verified.id;
        next();
    }catch(err){
        throw err;
    }
};

module.exports = auth;