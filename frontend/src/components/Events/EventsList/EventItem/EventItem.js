import React from 'react';
import './EventItem.css'

const eventItem = (props) => {
    return (
    <li key={props._id} className="events__list-item">
        <div>
            <h1>
                {props.title}
            </h1>
            <h2>
                {props.price} - {new Date(props.date).toLocaleDateString()}
            </h2>
        </div>
        <div>
           <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>View Details</button>
        </div>
    </li>
)
}


export default eventItem