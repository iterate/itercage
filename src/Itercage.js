import { isAfter, parseISO } from 'date-fns';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { InfoAlert } from './components/Alerts';
import Attendees from './components/Attendees';
import Loading from './components/Loading';
import useRegisteredUsers from './hooks/useRegisteredUsers';
import logo from './logo.png';
import fetch from './util/fetch';

const addAttendee = (name) => {
  return fetch.post(`/api/registered-users`, { name, isAttending: true });
};

const addNonAttendee = (name) => {
  return fetch.post(`/api/registered-users`, { name, isAttending: false });
};

const NewAttendee = () => {
  const [name, setName] = useState('');
  const [updating, setUpdating] = useState(false);

  const onSubmit = async (e) => {
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
        <input
          type="text"
          name="name"
          className="attendee-input"
          placeholder="Navn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={updating}
          autoComplete="off"
          autoFocus
        />
        <button className="submit-attendee" type="submit" disabled={updating || name.length === 0}>
          Meld meg på
        </button>
      </div>
    </form>
  );
};

export default ({ location }) => {
  const { attendees } = useRegisteredUsers();
  const [answerRegistered, setAnswerRegistered] = useState(false);
  const isNewStarttime = isAfter(new Date(), parseISO('2020-10-11T00:00:00Z'));

  useEffect(() => {
    const { a: answer, n: name } = queryString.parse(location.search);

    if (name && answer) {
      if (answer === 'y') {
        addAttendee(name);
      } else {
        addNonAttendee(name);
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

      <p className="subtitle">
        Cageball Nydalen – mandager kl. 20:{isNewStarttime ? '00' : '45'}
        {isNewStarttime && (
          <>
            <br />
            Bane: Innovation Support
          </>
        )}
      </p>

      <br />

      {answerRegistered && <InfoAlert message="Takk. Ditt svar er registrert." />}

      <br />

      <NewAttendee />

      <Attendees attendees={attendees} showRemoveAttendeeButtons={false} />
    </>
  );
};
