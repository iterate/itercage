import 'bootstrap/dist/css/bootstrap.css';
import React, { useState } from 'react';
import { InfoAlert } from './components/Alerts';
import Attendees from './components/Attendees';
import Loading from './components/Loading';
import Login from './components/Login';
import NonAttendees from './components/NonAttendees';
import { useAuth } from './hooks/useAuth';
import useRegisteredUsers from './hooks/useRegisteredUsers';
import fetch from './util/fetch';

const sendInvites = () => {
  return fetch.get(`/api/send-invites`);
};

const reset = () => {
  return fetch.get(`/api/reset`);
};

export default () => {
  const [sendingInvites, setSendingInvites] = useState(false);
  const [sentInviteEmails, setSentInviteEmails] = useState(false);
  const { attendees, nonAttendees, loading } = useRegisteredUsers();

  const onSendInvites = async () => {
    setSendingInvites(true);
    await sendInvites();
    setSendingInvites(false);
    setSentInviteEmails(true);
  };

  const auth = useAuth();

  if (!auth.user) {
    return <Login />;
  }

  if (auth.loading || loading) {
    return <Loading />;
  }

  return (
    <>
      <h1>Itercage admin</h1>
      <br />
      {sentInviteEmails && <InfoAlert message="Invitasjoner er sendt på e-post." />}
      <br />
      <div className="admin-btn-group">
        <button onClick={onSendInvites} className="btn btn-success" disabled={sendingInvites}>
          Send invitasjoner
        </button>
        <button onClick={reset} className="btn btn-danger">
          Slett påmeldingslisten
        </button>
      </div>
      <br />
      <Attendees attendees={attendees} showRemoveAttendeeButtons />
      <NonAttendees nonAttendees={nonAttendees} showRemoveNonAttendeeButton />
    </>
  );
};
