import React, {useState, useEffect} from 'react';
import { formatDistance } from 'date-fns';
import { nb } from 'date-fns/locale'

import logo from './logo.png';
import { database } from './firebase'
import Loading from "./components/Loading";
import fetch from './util/fetch';


const addAttendee = (name) => {
  return fetch.post(`/api/attendee`, {name});
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
    <form onSubmit={onSubmit} role="form" name="newAttendee" className="new-attendee">
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

const MAX_NUMBER_OF_ATTENDEES = 10;

const getProgressBarMode = (numberOfAttendees) => {
  if (numberOfAttendees >= 10) {
    return 'danger';
  } else if (numberOfAttendees > 5) {
    return 'warning';
  } else {
    return 'success';
  }
};

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
      {showRemoveAttendeeButtons && <a href="#" className="remove-attendee">Fjern</a>}
    </li>
  ));

  return (
    <div>
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

export default () => {
  const [loading, setLoading] = useState(false);
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    database.collection('attendees').onSnapshot(snapshot => {
      const attendees = snapshot.docs.filter(doc => doc.data().timestamp).map(doc => {
        const data = doc.data();

        return {
          ...data,
          timestamp: data.timestamp.toDate()
        }
      }).sort((a, b) => a.timestamp - b.timestamp);
      setAttendees((attendees && Object.values(attendees)) || []);
      setLoading(false);
    })
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <img src={logo} className="logo" />

        <p className="subtitle">Cageball Nydalen – mandager kl. 20:40</p>

        <NewAttendee />

        <Attendees attendees={attendees} showRemoveAttendeeButtons={false}/>
    </>
  )
}


