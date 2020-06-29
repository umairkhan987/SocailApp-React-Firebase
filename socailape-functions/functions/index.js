const functions = require('firebase-functions');
const app = require('express')();

const { getAllScreams, postOneScreams } = require('./handlers/screams');
const { signup, login, uploadImage } = require('./handlers/users');
const { FBAuth } = require('./util/fbAuth');

// Screams routes
app.get('/screams', getAllScreams);
app.post("/screams", FBAuth, postOneScreams);

// user routes
app.post("/signup", signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage)

exports.api = functions.https.onRequest(app);