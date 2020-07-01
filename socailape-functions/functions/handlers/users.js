const { admin, db } = require('../util/admin');
const { config } = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../util/validators');

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    const { valid, errors } = validateSignupData(newUser);
    if (!valid) return res.status(400).json(errors);

    const noImage = 'no_image.webp';

    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ handle: "this handle is aleardy taken." })
            }
            else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(idToken => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImage}?alt=media`,
                userId: userId,
            };

            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ token: token });
        })
        .catch(err => {
            console.error(err)
            if (err.code === "auth/email-already-in-use") {
                return res.status(400).json({ email: "Email is aleardy in use" });
            }
            else {
                return res.status(500).json({ error: err.code })
            }
        });
}

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };


    const { valid, errors } = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({ token });
        })
        .catch(err => {
            console.error(err)
            if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found")
                return res.status(400).json({ message: "Wrong credentials, please try again." });
            else return res.status(500).json({ error: err.code })
        });
}


exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    let imageFileName;
    let imageToBeUploaded = {};

    const busboy = BusBoy({ headers: req.headers });

    busboy.on('file', (fieldname, file, filename, encoding, mimtype) => {
        console.log(fieldname);
        console.log(filename);
        console.log(mimtype);

        if (mimtype !== "image/jpeg" && mimtype !== "image/png") {
            return res.status(400).json({ error: "Wrong file type submitted." });
        }

        const imageExtension = filename.split(".")[filename.split('.').length - 1];
        imageFileName = `${Math.round(Math.random() * 1000000000000).toString()}.${imageExtension}`;

        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filePath, mimtype };
        file.pipe(fs.createWriteStream(filePath))
    });

    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimtype,
                }
            }
        })
            .then(() => {
                const imageUrl =
                    `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
                return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
            })
            .then(() => {
                return res.json({ message: "Image uploaded successfully" });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err.code });
            })
    })
    busboy.end(req.rawBody);

}

exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return res.json({ message: "Detail added successfully" });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                userData.credentials = doc.data();
                return db.collection('likes').where("userHandle", "==", req.user.handle).get();
            }
        })
        .then(data => {
            userData.likes = [];
            data.forEach((doc) => {
                userData.likes.push(doc.data());
            });

            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}