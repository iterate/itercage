import React, {useState, useEffect} from 'react';

export default () => {
  const [sendingInvitations, setSendingInvitations] = useState(false);
  const [password, setPassword] = useState('');


  return (
    <>
      <h1>Itercage admin</h1>

      <div className="form-group">
        <input type="password" className="form-control" id="password" placeholder="Passord" value={password} onChange={e => setPassword(e.target.value)} />
      </div>

      <div className="form-group">
          <textarea className="form-control" defaultValue="Bli med på cageball?" rows="3"/>
      </div>

      <div className="admin-btn-group">
        <button id="getMailinglist" className="btn btn-info" data-toggle="modal" data-target="#mailinglistModal">Se mailingliste</button>
        <button id="sendInvitations" className="btn btn-success" disabled={sendingInvitations}>Send invitasjoner til interne</button>
        <button id="sendInvitationsToExternals" className="btn btn-warning" disabled={sendingInvitations}>Send invitasjoner til eksterne</button>
        <button id="clearAttendees" className="btn btn-danger">Slett påmeldingslisten</button>
      </div>

      <br />

      <h3>Påmeldte</h3>
    </>
  )
};
