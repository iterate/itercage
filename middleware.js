const createError = require('http-errors');
const admin = require('firebase-admin');
const asyncHandler = require('express-async-handler');

module.exports = {
  validateAuthToken: asyncHandler(async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const idToken =
      authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length, authHeader.length) : null;

    if (idToken) {
      const { uid } = await admin.auth().verifyIdToken(idToken);
      req.uid = uid;
    } else if (process.env.NODE_ENV === 'development' && req.query.uid) {
      const { uid } = req.query;
      req.uid = uid;
    } else {
      return next(createError(403));
    }

    next();
  }),
};
