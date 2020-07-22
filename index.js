const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require('path');

//set up express

const app = express();
//middleware
app.use(express.json());
app.use(cors());

//port setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("the server is started"));

//mangoose setup
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
     useUnifiedTopology:true,
     useCreateIndex: true
    },
    (err)=>{
        if(err) throw err;
        console.log("mongo db connection succesfully connected");
    }
);

//setup routes

app.use("/users", require("./routes/userRoutes"));
app.use("/meeting", require("./routes/meetingRoutes"));

//herouku setting
if(process.env.NODE_ENV === 'production')
{
    app.use(express.static('front/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'front', 'build', 'index.html'));
    });
    
}