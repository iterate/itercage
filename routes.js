const admin = require('firebase-admin');
const express = require('express');
const asyncHandler = require('express-async-handler');
const sendgrid = require('@sendgrid/mail');
const createError = require('http-errors');

const router = express.Router();

const increment = admin.firestore.FieldValue.increment(1);

const encodeName = (name) => {
  return Buffer.from(name).toString('base64');
};

const addAttendee = (name) => {
  return admin.firestore().collection(`attendees`).doc(encodeName(name)).set({name, timestamp: admin.firestore.FieldValue.serverTimestamp()});
};

const incrementTop = async (name) => {
  const topDocRef = admin.firestore().collection('top').doc(encodeName(name));
  const topSnapshot = await topDocRef.get();
  if (topSnapshot.exists) {
    return topDocRef.update({count: increment, name});
  } else {
    return topDocRef.set({count: 1, name})
  }
};

function sendEmail(productId, comment, email) {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'ida@fodmapnorge.no',
    from: 'tilbakemelding@fodmapnorge.no',
    subject: 'Ny tilbakemelding på produkt',
    text: `Produkt: ${productId}\nKommentar: ${comment}\nHilsen: ${email}`
  };
  sendgrid.send(msg);
}

router.post('/attendee', asyncHandler(async (req, res, next) => {
  const {name} = req.body;

  const attendee = await admin.firestore().collection(`attendees`).doc(encodeName(name)).get();

  if (attendee.exists) {
    return res.end();
  }

  await Promise.all([addAttendee(name), incrementTop(name)]);

  res.end();
}));

router.get('/send-invites', asyncHandler(async (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    sendEmail();
  }

  res.end();
}));

module.exports = router;
