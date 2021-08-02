const admin = require('firebase-admin');
const express = require('express');
const asyncHandler = require('express-async-handler');
const sendgrid = require('@sendgrid/mail');
const { isAfter, parseISO } = require('date-fns');
const axios = require('axios');
const middleware = require('./middleware');

const logger = require('./logger');

const router = express.Router();

const firestore = admin.firestore();

const increment = admin.firestore.FieldValue.increment(1);
const decrement = admin.firestore.FieldValue.increment(-1);

if (process.env.SENDGRID_API_KEY) {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY.replace(/\n/g, ''));
}

const encodeName = (name) => {
  return Buffer.from(name).toString('base64');
};

const setRegisteredUser = (name, isAttending) => {
  return firestore.collection(`registered-users`).doc(encodeName(name)).set({
    name,
    isAttending,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
};

const removeRegisteredUser = (name) => {
  return firestore.collection(`registered-users`).doc(encodeName(name)).delete();
};

const removeAllRegisteredUsers = async (batch) => {
  const registeredUsersSnapshot = await firestore.collection(`registered-users`).get();

  await Promise.all(registeredUsersSnapshot.docs.map((doc) => batch.delete(doc.ref)));
};

const getExistingUser = async (name) => {
  const registeredUserDoc = await firestore.collection(`registered-users`).doc(encodeName(name)).get();

  return registeredUserDoc.data();
};

const incrementTop = async (name) => {
  const topDocRef = firestore.collection('top').doc(encodeName(name));
  const topSnapshot = await topDocRef.get();
  if (topSnapshot.exists) {
    return topDocRef.update({ count: increment, name });
  } else {
    return topDocRef.set({ count: 1, name });
  }
};

const decrementTop = async (name) => {
  const topDocRef = firestore.collection('top').doc(encodeName(name));
  const topSnapshot = await topDocRef.get();
  if (topSnapshot.exists) {
    return topDocRef.update({ count: decrement, name });
  }
};

const generateInviteEmailHtml = (user) => {
  const encodedName = encodeURIComponent(user.name);

  const isNewStarttime = isAfter(new Date(), parseISO('2020-10-11T00:00:00Z'));

  return `
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width"/>
  </head>
  <body>
    <h1>Itercage</h1>
    <p>Cageball Nydalen - Mandager kl. 20:${isNewStarttime ? '00' : '45'}</p>
    ${isNewStarttime ? '<p style="font-size: 32px; font-weight: 900; color: red;">NB! Ny starttid kl. 20:00</p>' : ''}
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
</html>`;
};

const sendInvites = async () => {
  const usersSnapshot = await firestore.collection(`users`).get();

  const emails = usersSnapshot.docs.map((doc) => {
    const user = doc.data();

    return {
      to: user.email,
      from: {
        email: 'cage@fodmapnorge.no',
        name: 'itercage',
      },
      subject: 'Påmelding itercage ⚽',
      text: 'Meld deg på cage: https://itercage.app.iterate.no',
      html: generateInviteEmailHtml(user).replace(/\n/g, ''),
    };
  });

  try {
    await sendgrid.send(emails);
  } catch (e) {
    logger.error(e);
  }
};

async function getAttendeesCount() {
  try {
    const registered = await firestore
      .collection('registered-users')
      .get()
      .then((snap) => snap.docs.map((doc) => doc.data()));

    const attendees = registered.filter((x) => x.isAttending);

    return attendees.length;
  } catch (error) {
    return '🤷‍♂️';
  }
}

router.post(
  '/registered-users',
  asyncHandler(async (req, res) => {
    const { name, isAttending } = req.body;

    const existingUser = await getExistingUser(name);

    if (existingUser && existingUser.isAttending === isAttending) {
      return res.end();
    }

    await setRegisteredUser(name, isAttending);

    if (isAttending) {
      await incrementTop(name);

      if (process.env.SLACK_HOOK_URL) {
        const count = await getAttendeesCount();
        axios.post(process.env.SLACK_HOOK_URL, {
          text: `*${name}* er med! ${count} påmeldte`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${name}* er med! 💪\n${count} påmeldte${count === 8 ? ' 🥳' : ''}`,
              },
            },
          ],
        });
      }
    } else if (existingUser && existingUser.isAttending && !isAttending) {
      await decrementTop(name);
    }

    res.end();
  })
);

router.delete(
  '/registered-users',
  middleware.validateAuthToken,
  asyncHandler(async (req, res) => {
    const { name } = req.body;

    const existingUser = await getExistingUser(name);

    if (!existingUser) {
      return res.end();
    }

    if (existingUser.isAttending) {
      await decrementTop(name);
    }
    await removeRegisteredUser(name);

    res.end();
  })
);

router.get(
  '/send-invites',
  middleware.validateAuthToken,
  asyncHandler(async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      sendInvites();
    }

    res.end();
  })
);

router.get(
  '/reset',
  middleware.validateAuthToken,
  asyncHandler(async (req, res) => {
    let batch = firestore.batch();

    await removeAllRegisteredUsers(batch);

    await batch.commit();

    res.end();
  })
);

router.get('/email-test', (req, res) => {
  res.status(200).send(generateInviteEmailHtml({ name: 'Test Testesen' }));
});

module.exports = router;
