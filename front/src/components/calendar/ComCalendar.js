import React, { useState, useContext } from "react";
import Calendar from "react-calendar";
import MeetingContext from "../../context/MeetingContext";
import {useHistory} from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import UserContext from '../../context/UserContext';
import ErrorNotice from '../misc/errorNotice';
import DateTimePicker from 'react-datetime-picker';
import Axios from 'axios';

const CompCalendar = () => {

  const [date, setDate] = useState(new Date());
  const [currDate] = useState(new Date());
  const [myDate, setMyDate] = useState(new Date());
  const {userData} = useContext(UserContext);
  const history = useHistory();
  let email;
  console.log(userData);


  const [senderEmail, setsenderEmail] = useState();
  const [meetingId, setMeetingId] = useState();
  const [error, setError] = useState();
  const {setMeetingData} = useContext(MeetingContext);

  (!userData.user) ? history.push("/login") : email = userData.user.email

  const onChange = date => {
    setDate(date);
  };
  const onChange2 = myDate => {
    setMyDate(myDate);
  };
    
  const submit = async (e) => {
      e.preventDefault();
      try{
        const newMeeting = {meetingId, email, senderEmail, date};
        await Axios.post
          ("http://127.0.0.1:5000/meeting/register",
          newMeeting
        );
        const meetingRes = await Axios.get("http://127.0.0.1:5000/meeting/",
        {headers: {
          "meetingId": meetingId,
          } }
        );
        setMeetingData({
          meeting: meetingRes.data,
        });
      }catch(err){
        err.response.data.msg && setError(err.response.data.msg);
      }

      
  };
  return (
      <div>
        
        <div>
            <div> 
                <Calendar showWeekNumbers onChange={onChange2} value={myDate} />
                <h4>Pickup Date from above Calendar</h4>
                <h6>{date.toDateString()}</h6>
            </div>
           <div>
           <DateTimePicker onChange={onChange} value={date}/>
                  <h4>Pickup Time 2</h4>
                  <h6>{date.toString()}</h6>
            </div>
            <div>
                <h4>Curent Timezone</h4>
                <h6>{currDate.toString()}</h6>
            </div>
        </div>
        {error && <ErrorNotice message={error} clearError={()=> setError(undefined)}/>}
        <div>
            <form className="form"  onSubmit={submit}>
                <label htmlFor="login-id">Meeting ID</label>
                <input id="login-id" type="text" 
                onChange={(e) => setMeetingId(e.target.value)}/>

                <label htmlFor="login-email">Email</label>
                <input id="login-email" type="email" 
                onChange={(e) => setsenderEmail(e.target.value)}/>
              
            <input type="submit" value="Register Meeting" />
            </form>
        </div>
    </div>
  );
};

export default CompCalendar;