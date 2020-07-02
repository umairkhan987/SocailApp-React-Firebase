const functions = require('firebase-functions');
const app = require('express')();

const { getAllScreams, postOneScreams, getScream, deleteScream, commentOnScream, likeScream, unlikeScream } = require('./handlers/screams');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationRead } = require('./handlers/users');
const { FBAuth } = require('./util/fbAuth');

const { db } = require('./util/admin');

// Screams routes
app.get('/screams', getAllScreams);
app.post("/scream", FBAuth, postOneScreams);
app.get("/scream/:screamId", getScream);
app.delete('/scream/:screamId', FBAuth, deleteScream);
app.get('/scream/:screamId/like', FBAuth, likeScream);
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);

// user routes
app.post("/signup", signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage)
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationRead);

exports.api = functions.https.onRequest(app);

// notification for like
exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: "like",
                        read: false,
                        screamId: doc.id
                    })
                }
            })
            .then(() => {
                return;
            })
            .catch(err => {
                console.error(err);
                return;
            });
    });

// delete notification when user unlike 
exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
    .onDelete((snapshot) => {
        db.doc(`/notifications/${snapshot.id}`).delete()
            .then(() => {
                return;
            })
            .catch((err) => {
                console.error(err);
            });
    });

// notification for comment
exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: "comment",
                        read: false,
                        screamId: doc.id
                    })
                }
            })
            .then(() => {
                return;
            })
            .catch(err => {
                console.error(err);
                return;
            });
    });
