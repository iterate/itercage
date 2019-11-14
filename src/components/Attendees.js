import React from "react";
import {formatDistance} from "date-fns";
import {nb} from "date-fns/locale";
import fetch from "../util/fetch";

const removeRegisteredUser = (name) => {
  return fetch.delete(`/api/registered-users`, {name});
};

const getProgressBarMode = (numberOfAttendees) => {
  if (numberOfAttendees >= 10) {
    return 'danger';
  } else if (numberOfAttendees > 5) {
    return 'warning';
  } else {
    return 'success';
  }
};

const MAX_NUMBER_OF_ATTENDEES = 10;

const ProgressBar = ({numberOfAttendees}) => {
  return (
    <div className="iter-progress">
      <div className={`iter-progress-bar iter-${getProgressBarMode(numberOfAttendees)}`} style={{width: `${numberOfAttendees * MAX_NUMBER_OF_ATTENDEES}%`}}>
        {numberOfAttendees && <strong>Påmeldte: {numberOfAttendees}</strong>}
      </div>
    </div>
  )
};

const Attendees = ({attendees, showRemoveAttendeeButtons}) => {
  const numberOfAttendees = attendees.length;

  const attendeeElements = attendees.map((attendee, index) => (
    <li key={index} className="attendees-list-item {{newItem date}}">
      <span className="name">{attendee.name}</span>
      <span className="timestamp">{formatDistance(attendee.timestamp, new Date(), {locale: nb, addSuffix: true})}</span>
      {showRemoveAttendeeButtons && <button className="remove-attendee link-button" onClick={(e) => {e.preventDefault();removeRegisteredUser(attendee.name)}}>Fjern</button>}
    </li>
  ));

  return (
    <div>
      <h3>Påmeldte</h3>
      {numberOfAttendees ?
        <ProgressBar numberOfAttendees={numberOfAttendees} /> :
        <strong>Det er ingen påmeldte</strong>
      }

      <ul className="attendees-list">
        {attendeeElements}
      </ul>
    </div>
  )
};

export default Attendees;
