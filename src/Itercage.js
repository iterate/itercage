import React, {useState, useEffect} from 'react';
import queryString from 'query-string';

import logo from './logo.png';
import fetch from './util/fetch';
import Attendees from "./components/Attendees";
import useRegisteredUsers from "./hooks/useRegisteredUsers";
import Loading from "./components/Loading";
import {InfoAlert} from "./components/Alerts";

const addAttendee = (name) => {
  return fetch.post(`/api/registered-users`, {name, isAttending: true});
};

const addNonAttendee = (name) => {
  return fetch.post(`/api/registered-users`, {name, isAttending: false});
};

const NewAttendee = () => {
  const [ name, setName ] = useState('');
  const [ updating, setUpdating ] = useState(false);

  const onSubmit = async e => {
    e.preventDefault();

    if (name === '') {
      return;
    }

    setUpdating(true);

    await addAttendee(name);

    setName('');
    setUpdating(false);
  };

  return (
    <form onSubmit={onSubmit} name="newAttendee" className="new-attendee">
      <div className="attendee-group">
        <input type="text"
               name="name"
               className="attendee-input"
               placeholder="Navn"
               value={name}
               onChange={e => setName(e.target.value)}
               disabled={updating}
               autoComplete="off"
               autoFocus />
          <button className="submit-attendee" type="submit" disabled={updating || name.length === 0}>Meld meg på</button>
      </div>
    </form>
  )
};

const TimePlaceInfo = () => {
  var daysUntilChange = () => {
    const now = new Date();
    const changeAt = new Date("2020-10-10");
    const msPerDay = 1000 * 60 * 60 * 24
    return Math.floor((to.getTime() - from.getTime()) / msPerDay);
  }

  var beforeChange = {
    slot: "Cageball Nydalen – mandager kl. 20:45",
    warn: `Nytt tidspunkt om ${daysBetween(now, changeAt)} dager.`
  }

  var afterChange = {
    slot: "Cageball Nydalen – mandager kl. 20:00 (kan du kontrollere, Brynjar?)",
  }

  if (daysUntillChange > 0) {
    return (<>
              <p className="subtitle">{beforeChange.slot}</p>
              <p className="subtitle">{beforeChange.warn}</p>
            </>);
  } else {
    return (<>
              <p className="subtitle">{afterChange.slot}</p>
            </>);
  }
}

export default ({location}) => {
  const {attendees} = useRegisteredUsers();
  const [answerRegistered, setAnswerRegistered] = useState(false);

  useEffect(() => {
    const {a: answer, n: name} = queryString.parse(location.search);

    if (name && answer) {

      if (answer === 'y') {
        addAttendee(name)
      } else {
        addNonAttendee(name)
      }
      setAnswerRegistered(true);
    }
  }, [location.search]);

  if (!attendees) {
    return <Loading />;
  }

  return (
    <>
      <img src={logo} className="logo" alt="logo" />

      <TimePlaceInfo />

      <p className="subtitle">Cageball Nydalen – mandager kl. 20:45</p>

      <br />

      {answerRegistered && <InfoAlert message="Takk. Ditt svar er registrert." />}

      <br />

      <NewAttendee />

      <Attendees attendees={attendees} showRemoveAttendeeButtons={false}/>
    </>
  )
}
