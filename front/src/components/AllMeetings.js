import React, {useContext, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Axios from 'axios';
import UserContext from '../context/UserContext';
import MeetingDisplay from '../components/MeetingDisplay';

export default function AllMeetings() {
    const {userData} = useContext(UserContext);

    const [meetings, setMeetings] = useState([]);

    const history = useHistory(); 
    if(!userData.user) 
    { 
        history.push("/");
    }
    else{
        try{
            const email = userData.user.email;
            Axios.get("http://127.0.0.1:5000/meeting/alldata",
            {headers: {
                "email": email,
            } }
            ).then(res => {
                res.data && setMeetings(res.data);   
            });
        }catch(err)
        {
            throw err;
        }
     
}



    return (
        <div>
            <p>see all your meetings</p>
            <p>Approved only those meetings where you are Reciever by going on requested meeting button:</p>
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
        </div>
    )
}
