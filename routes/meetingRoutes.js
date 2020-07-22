const router = require("express").Router();
const Meeting = require("../models/meetingModel");
var nodemailer = require('nodemailer');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path'); 
const { findById } = require("../models/meetingModel");

// const publiVapidKey = 'BGtGFGMfKdHLsZk3FIMBWWOOpIhnKKXzUnS_75pEk9zLUvoaSSQckpun2qG304G5r7dz3KPPocq2Pr2lrTDYhfE';
// const privateVapidKey = 'hZXV-vhwvmvv4HwlwPFg1kdW89w0Mtoe9ryD__45pWo';

// webpush.setVapidDetails();
// webpush.setVapidDetails('mailto:naveednizar9@gmail.com', publiVapidKey, privateVapidKey);

router.post("/register", async (req, res)=>{

    try{
        let {meetingId, email, senderEmail, date} = req.body;

        if(!senderEmail || !meetingId)
            return res.status(400).json({msg: "email field have not been entered. "});
        const existingMeetingId = await Meeting.findOne({meetingId: meetingId});
        if(existingMeetingId)
            return res.status(400).json({msg: "Meeting with this id already exist"});
        const existingMeeting = await Meeting.findOne({email: email, date: date});
        if(existingMeeting)
            return res.status(400).json({msg: "The meeting already scheduled on this day "});
    
        const newMeeting= new Meeting({
            meetingId,
            email,
            senderEmail,
            date,
        });
        const savedMeeting = await newMeeting.save();
        res.json(savedMeeting);
        
        sendEmail({
            user: 'kikis.art22@gmail.com',
            pass: '<Karachi90!!1/>'
        }, {
            from: '"Mern Meet" kikis.art22@gmail.com',
            to: senderEmail,
            subject: 'Meeting Scheduled',
            text: 'Your meeting has been scheduled with ' + email + ' on the Date ' + date + 'Meeting Id ' + meetingId +
                    ' This is the link to approve or reject meeting : ' + ' http://127.0.0.1:3000/login',
        });
    
    }catch(err){
        throw err;
    }
});

//mailer is person who is sending = {user, pass}, mailObject={from: , to: , subject: , text: }
function sendEmail (mailer, mailObject) {
    let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,    
            service: 'gmail',
            secure: false,
            auth: {
            user: mailer.user,
            pass: mailer.pass
            },
            tls: {
                rejectUnauthorized: false
            }
      });

      let mailOptions = mailObject;
      
      transporter.sendMail(mailOptions, (error, info)=>{
        if (error) {
          return console.log(error);
        } else {
          return console.log('Email sent: ' + info);
        }
      });
}

router.get("/", async (req, res) => {
    const meetingId = req.header("meetingId");
    const meeting = await Meeting.findOne({meetingId: req.header("meetingId")});
    if(!meeting)
        return res.status(400).json({msg: "The meeting with this id not registered "});
    
    res.json({
        meetingId: meeting.meetingId,
        email: meeting.email,
        senderEmail: meeting.senderEmail,
        date: meeting.date,
        approval: meeting.approval,
    });
});


router.put("/approved", async (req, res) => {
    const meetings = await Meeting.findOneAndUpdate({meetingId: req.header("meetingId"), senderEmail: req.header("senderEmail")},{approval: true});
    if(!meetings)
        return res.status(400).json({msg: "The meeting with this id not registered for you"});
    
    //subtraction of 5 min for notification
    // date = meetings.date - 300000;
    // const subscription = date;
    // const payload = JSON.stringify();
    // if(date)
    // {
    //  webpush.sendNotification(subscription,payload).catch(err => console.error(err));
    // }
});


router.delete("/reject", async (req, res) => {
    const meeting = await Meeting.findOneAndDelete({meetingId: req.header("meetingId"), senderEmail: req.header("senderEmail")});
    if(!meeting)
        return res.status(400).json({msg: "The meeting with this id not registered "});
    
});



router.get("/alldata", async (req, res) => {
    const meeting = await Meeting.find({
        $or: [
            {email: req.header("email")},
            {senderEmail: req.header("email")}
        ]}
    );
    if(!meeting)
        return res.status(400).json({msg: "No meeting Find "});
    
    res.json(meeting);
});


router.get("/requestdata", async (req, res) => {
    const meeting = await Meeting.find({senderEmail: req.header("email"),approval: false}
    );
    if(!meeting)
        return res.status(400).json({msg: "No Requested meetings find "});
    
    res.json(meeting);
});


module.exports = router;