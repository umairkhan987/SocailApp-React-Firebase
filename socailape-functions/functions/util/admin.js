const admin = require('firebase-admin');

// admin.initializeApp();
var serviceAccount = require("../socailape-7b83c-bb9628f7f020.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://socailape-7b83c.firebaseio.com",
    storageBucket: "socailape-7b83c.appspot.com",
});
const db = admin.firestore();


module.exports = { admin, db };