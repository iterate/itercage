const admin = require("firebase-admin");
const glob = require("glob");

function getServiceAccount() {
  if (process.env.NODE_ENV === 'production') {
    return {
      "project_id": process.env.FIREBASE_PROJECT_ID,
      "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      "client_email": process.env.FIREBASE_CLIENT_EMAIL
    };
  }
  const serviceAccountJson = glob.sync('itercage-d4495-*.json');

  if (serviceAccountJson.length === 0) {
    throw new Error("Cannot find service account JSON for noba-dev.");
  }

  return require(`./${serviceAccountJson[0]}`);
}

admin.initializeApp({
  credential: admin.credential.cert(getServiceAccount())
});
