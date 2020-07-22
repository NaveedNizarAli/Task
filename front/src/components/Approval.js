import React, {useContext,useState} from 'react'
import MeetingContext from '../context/MeetingContext';
import Axios from 'axios';
import {useHistory} from 'react-router-dom';
import ErrorNotice from './misc/errorNotice';
import Push from 'push.js';
import UserContext from '../context/UserContext';
import MeetingDisplay from '../components/MeetingDisplay';


export default function Home() {


   const {meetingData,setMeetingData} = useContext(MeetingContext);
   const [meetingId, setMeetingId] = useState(); 
   const [error, setError] = useState(); 
   const [meetings, setMeetings] = useState([]);
   const {userData} = useContext(UserContext);
   

   const history = useHistory(); 
   if(!userData.user) 
   { 
       history.push("/login");
   }
   else{
   try{
        const email = userData.user.email;
        Axios.get("http://127.0.0.1:5000/meeting/requestdata",
        {headers: {
            "email": email,
        } }
        ).then(res => {
            res.data && setMeetings(res.data);   
        });
    }catch(err)
    {
        err.response.data.msg && setError(err.response.data.msg);
    }
}

   

   const getData= async (e) => {
   
        e.preventDefault();
        try{
            const meetingRes = await Axios.get("http://127.0.0.1:5000/meeting/",
            {headers: {
            "meetingId": meetingId,
            } }
            );
            setMeetingData({
            meeting: meetingRes.data,
            });
        }catch(err)
        {
            err.response.data.msg && setError(err.response.data.msg);
        }
    }



  
    function start(){
        Push.create("Hello world!", {
            body: "The Meeting has Been Scheduled",
            icon: '/icon.png',
            timeout: 4000,
            onClick: function () {
                window.focus();
                this.close();
            }
        });
   }
  
    const approved = async (e) => {
        const senderEmail = userData.user.email;
        e.preventDefault();
        try{
            await Axios.put("http://127.0.0.1:5000/meeting/approved", meetingData,
            {headers: {
                "meetingId": meetingId,
                "senderEmail": senderEmail,
            } }
            );
           
        }catch(err)
        {
            err.response.data.msg && setError(err.response.data.msg);
        }
    
   }
  
   const reject = async (e) => {
    const senderEmail = userData.user.email;
        e.preventDefault();
        try{
         await Axios.delete("http://127.0.0.1:5000/meeting/reject",
            {headers: {
                "meetingId": meetingId,
                "senderEmail": senderEmail,
            } }
        );
       
        }catch(err)
        {
            err.response.data.msg && setError(err.response.data.msg);
        }
    }
    
    return (
        <div>
            <p> All Requested Meetings </p>
            <table>
                <tr>
                    <td className="col1">MeetingID</td>
                    <td className="col2">Email</td>
                    <td className="col3">Receiver Email </td>
                    <td className="col4">Date</td>
                    <td className="col5">Approval</td>
                </tr>
            </table>
            {
                meetings
                .map((item, idx)=>(
                  <MeetingDisplay key={idx} data={item}/>
                ))
                
            }           
            {error && <ErrorNotice message={error} clearError={()=> setError(undefined)}/>}
            <form className="form"  onSubmit={getData}>
                <label htmlFor="login-id">Enter Meeting Id to approve Meeting</label>
                <input id="login-id" type="text" 
                onChange={(e) => setMeetingId(e.target.value)}/>
            </form>
            <form className="form"  onSubmit={approved}>
                <input type="submit"  onClick={start} value="Approved" />
            </form>
            <form className="form"  onSubmit={reject}>
                <input type="submit" value="Reject" />
            </form>
        </div>

    )
}