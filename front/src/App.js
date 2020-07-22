import React, {useState, useEffect} from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Home from './components/pages/Home';
import Axios from 'axios';
import Login from './components/auth/Login';
import Approval from './components/Approval';
import Register from './components/auth/Register';
import Header from './components/layouts/Header';
import UserContext from './context/UserContext';
import MeetingContext from './context/MeetingContext';
import "./style.css";
import AllMeetings from './components/AllMeetings';
export default function App() {

    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
    });
    const [meetingData, setMeetingData] = useState({
        token: undefined,
        user: undefined,
    });
      
    useEffect(()=> {
        const checkLoggedIn = async ()=> {
           let token = localStorage.getItem("auth-token");
           if( token === null){
               localStorage.setItem(
                   "auth-token", ""
               );
               token = "";
           }
           const tokenRes = await Axios.post(
                "http://127.0.0.1:5000/users/tokenIsValid", 
                 null, 
                {headers: {
                    "x_auth": token,
                    'Content-Type': 'application/json',
                    }
                }
           );
           if(tokenRes.data){
               const userRes = await Axios.get("http://127.0.0.1:5000/users/",
               {headers: {
                    "x_auth": token,
                    }
                }
               );
               setUserData({
                    token,
                    user: userRes.data,
               });
           }
        };
        checkLoggedIn();
    }, [])

    return (
        <BrowserRouter>
        <UserContext.Provider value={{userData, setUserData}}>
        <MeetingContext.Provider value={{meetingData, setMeetingData}}>
            <Header />
            <div className="container">
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
                <Route path="/approval" component={Approval}/>
                <Route path="/mymeetings" component={AllMeetings}/>
            </Switch>
            </div>
        </MeetingContext.Provider>
        </UserContext.Provider>
        </BrowserRouter>
    )
}
