const admin = require('firebase-admin');
const express = require('express');
const asyncHandler = require('express-async-handler');
const sendgrid = require('@sendgrid/mail');

const logger = require('./logger');

const router = express.Router();

const firestore = admin.firestore();

const increment = admin.firestore.FieldValue.increment(1);
const decrement = admin.firestore.FieldValue.increment(-1);

sendgrid.setApiKey(process.env.SENDGRID_API_KEY.replace(/\n/g, ''));

const encodeName = (name) => {
  return Buffer.from(name).toString('base64');
};

const addAttendee = (name) => {
  return firestore.collection(`attendees`).doc(encodeName(name)).set({name, timestamp: admin.firestore.FieldValue.serverTimestamp()});
};

const removeAttendee = (name) => {
  return firestore.collection(`attendees`).doc(encodeName(name)).delete();
};

const addNonAttendee = (name) => {
  return firestore.collection(`nonAttendees`).doc(encodeName(name)).set({name, timestamp: admin.firestore.FieldValue.serverTimestamp()});
};

const removeNonAttendee = (name) => {
  return firestore.collection(`nonAttendees`).doc(encodeName(name)).delete();
};

const removeAllAttendees = async (batch) => {
  const attendeesSnapshot = await firestore.collection(`attendees`).get();

  await Promise.all(attendeesSnapshot.docs.map(doc => batch.delete(doc.ref)));
};

const removeAllNonAttendees = async (batch) => {
  const nonAttendeesSnapshot = await firestore.collection(`nonAttendees`).get();

  await Promise.all(nonAttendeesSnapshot.docs.map(doc => batch.delete(doc.ref)));
};

const incrementTop = async (name) => {
  const topDocRef = firestore.collection('top').doc(encodeName(name));
  const topSnapshot = await topDocRef.get();
  if (topSnapshot.exists) {
    return topDocRef.update({count: increment, name});
  } else {
    return topDocRef.set({count: 1, name})
  }
};

const decrementTop = async (name) => {
  const topDocRef = firestore.collection('top').doc(encodeName(name));
  const topSnapshot = await topDocRef.get();
  if (topSnapshot.exists) {
    return topDocRef.update({count: decrement, name});
  }
};

const generateHtml = (user) => {
  const encodedName = encodeURIComponent(user.name);

  return `
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width"/>
  </head>
  <body>
    <h1>Itercage</h1>
    <p>Cageball Nydalen - Mandager kl. 20:45</p>
    <h3>Hei ${user.name}</h3>
    <p>Bli med på cageball?</p>
    <p>
      <a href="http://itercage.app.iterate.no?n=${encodedName}&a=y"
        style="font-size: 16px; padding: 5px 20px; background-color: #4285f4; color: white; text-decoration: none;">
          Jeg er med!
      </a>
      <a href="http://itercage.app.iterate.no?n=${encodedName}&a=n"
        style="margin-left: 16px;">
          Jeg kommer ikke
      </a>
    </p>
    <p style="margin-top: 25px;">Se hvem som kommer: <a href="http://itercage.app.iterate.no/">itercage.app.iterate.no</a></p>
    <br/>
    <p style="font-size: 10px;">Ikke svar på denne eposten. Spørsmål sendes til <a href="mailto:brynjar@iterate.no">brynjar@iterate.no</a>.</p>
  </body>
</html>`
};

const sendInvites = async () => {
  const usersSnapshot = await firestore.collection(`users`).get();

  const emails = usersSnapshot.docs.map(doc => {
    const user =  doc.data();

    return {
      to: user.email,
      from: {
        email: 'cage@fodmapnorge.no',
        name: "itercage"
      },
      subject: 'Påmelding itercage ⚽',
      text: 'Meld deg på cage: https://itercage.app.iterate.no',
      html: generateHtml(user).replace(/\n/g, '')
    };
  });

  try {
    await sendgrid.send(emails);
  } catch(e) {
    logger.error(e);
  }
};

router.post('/attendee', asyncHandler(async (req, res) => {
  const {name} = req.body;

  const attendee = await firestore.collection(`attendees`).doc(encodeName(name)).get();

  if (attendee.exists) {
    return res.end();
  }

  await Promise.all([addAttendee(name), incrementTop(name)]);

  res.end();
}));

router.delete('/attendee', asyncHandler(async (req, res) => {
  const {name} = req.body;

  await Promise.all([removeAttendee(name), decrementTop(name)]);

  res.end();
}));

router.post('/non-attendee', asyncHandler(async (req, res) => {
  const {name} = req.body;

  const nonAttendee = await firestore.collection(`nonAttendee`).doc(encodeName(name)).get();

  if (nonAttendee.exists) {
    return res.end();
  }

  await Promise.all([addNonAttendee(name)]);

  res.end();
}));

router.delete('/non-attendee', asyncHandler(async (req, res) => {
  const {name} = req.body;

  await removeNonAttendee(name);

  res.end();
}));

router.get('/send-invites', asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    sendInvites();
  }

  res.end();
}));

router.get('/reset', asyncHandler(async (req, res) => {

  let batch = firestore.batch();

  await Promise.all([removeAllAttendees(batch), removeAllNonAttendees(batch)]);

  await batch.commit();

  res.end();
}));

module.exports = router;
