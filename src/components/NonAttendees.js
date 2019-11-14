import React from "react";
import {formatDistance} from "date-fns";
import {nb} from "date-fns/locale";
import fetch from "../util/fetch";

const removeRegisteredUser = (name) => {
  return fetch.delete(`/api/registered-users`, {name});
};

const NonAttendees = ({nonAttendees, showRemoveNonAttendeeButton}) => {
  const attendeeElements = nonAttendees.map((nonAttendee, index) => (
    <li key={index} className="attendees-list-item">
      <span className="name">{nonAttendee.name}</span>
      <span className="timestamp">{formatDistance(nonAttendee.timestamp, new Date(), {locale: nb, addSuffix: true})}</span>
      {showRemoveNonAttendeeButton && <button className="remove-attendee link-button" onClick={(e) => {e.preventDefault(); removeRegisteredUser(nonAttendee.name)}}>Fjern</button>}
    </li>
  ));

  if (nonAttendees.length === 0) {
    return false;
  }

  return (
    <div>
      <h3>Kommer ikke</h3>
      <ul className="attendees-list">
        {attendeeElements}
      </ul>
    </div>
  )
};

export default NonAttendees;
