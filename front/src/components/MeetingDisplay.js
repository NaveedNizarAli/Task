import React from 'react'

export default function MeetingDisplay(props) {
    return (
        <div>
            <table>
               
                <tr>
                    <td className="col1">{props.data.meetingId}</td>
                    <td className="col2">{props.data.email}</td>
                    <td className="col3">{props.data.senderEmail}</td>
                    <td className="col4">{props.data.date}</td>
                    <td className="col5">{(!props.data.approval) ? "no" : "yes"}</td>
                </tr>
            </table>
        </div>
    )
}
