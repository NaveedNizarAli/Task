import React, {useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import CompCalendar from '../calendar/ComCalendar';

export default function Home() {
   const {userData} = useContext(UserContext);
   const history = useHistory(); 
   useEffect(()=>{
        if(!userData.user) history.push("/login");
    });

    const submit = (e) => {
        history.push("/approval");
    }
    const submit1 = (e) => {
        history.push("/mymeetings");
    }
    return (
        <div>
            Welcome to Appointment App :

            <form className="form"  onSubmit={submit}>   
                 <input type="submit" value="Requested Meeting" />
            </form>
            <form className="form"  onSubmit={submit1}>   
                 <input type="submit" value="My Meetings" />
            </form>
          
            <CompCalendar />
        </div>

    )
}
