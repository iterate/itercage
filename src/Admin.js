import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Attendees from "./components/Attendees";
import Loading from "./components/Loading";
import NonAttendees from "./components/NonAttendees";

import useAttendees from "./hooks/useAttendees";
import useNonAttendees from "./hooks/useNonAttendees";
import fetch from "./util/fetch";
import {useAuth} from "./hooks/useAuth";
import Login from "./components/Login";
import {InfoAlert} from "./components/Alerts";

const sendInvites = () => {
  return fetch.get(`/api/send-invites`);
};

const reset = () => {
  return fetch.get(`/api/reset`);
};

export default () => {
  const [sendingInvites, setSendingInvites] = useState(false);
  const [sentInviteEmails, setSentInviteEmails] = useState(false);
  const attendees = useAttendees();
  const nonAttendees = useNonAttendees();

  const onSendInvites = async () => {
    setSendingInvites(true);
    await sendInvites();
    setSendingInvites(false);
    setSentInviteEmails(true);
  };

  const auth = useAuth();

  if (auth.loading || !attendees || !nonAttendees) {
    return <Loading />;
  }

  if (!auth.user) {
    return <Login />;
  }

  return (
    <>
      <h1>Itercage admin</h1>
      <br />
      {sentInviteEmails && <InfoAlert message="Invitasjoner er sendt på e-post." /> }
      <br />
      <div className="admin-btn-group">
        <button disabled className="btn btn-info" data-toggle="modal" data-target="#mailinglistModal">Se mailingliste</button>
        <button onClick={onSendInvites} className="btn btn-success" disabled={sendingInvites}>Send invitasjoner til interne</button>
        <button onClick={reset} className="btn btn-danger">Slett påmeldingslisten</button>
      </div>
      <br />
      <Attendees attendees={attendees} showRemoveAttendeeButtons />
      <NonAttendees nonAttendees={nonAttendees} showRemoveNonAttendeeButton />
    </>
  )
};
