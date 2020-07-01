const { db } = require('../util/admin');

exports.getAllScreams = (request, response) => {
    db.collection('screams').orderBy("createdAt", 'desc').get()
        .then((data) => {
            let screams = [];

            data.forEach((doc) => {
                screams.push({
                    screamId: doc.id,
                    ...doc.data(),
                });
            });
            return response.json(screams);
        })
        .catch(error => console.error(error));
};

exports.postOneScreams = (request, response) => {
    const newScream = {
        body: request.body.body,
        userHandle: request.user.handle,
        userImage: request.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0,
    };

    db.collection('screams').add(newScream)
        .then(doc => {
            const resScream = newScream;
            resScream.screamId = doc.id;
            response.json(resScream);
        })
        .catch(error => {
            response.status(500).json({ error: "some thing went wrong" });
            console.error(error);
        })
};

exports.getScream = (req, res) => {
    let screamData = {};
    db.doc(`/screams/${req.params.screamId}`).get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: "Scream not found" });
            }
            screamData = doc.data();
            screamData.screamId = doc.id;
            return db.collection('comments').orderBy('createdAt', 'desc').where('screamId', '==', req.params.screamId).get();
        })
        .then(data => {
            screamData.comments = [];
            data.forEach(doc => {
                screamData.comments.push(doc.data());
            })
            return res.json(screamData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        })
}

exports.commentOnScream = (req, res) => {
    if (req.body.body.trim() === '') return res.status(400).json({ error: "Must not be empty" })
    const newComment = {
        body: req.body.body,
        createAt: new Date().toISOString(),
        screamId: req.params.screamId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    db.doc(`/screams/${req.params.screamId}`).get()
        .then(doc => {
            if (!doc.exists) return res.status(404).json({ error: "Scream not found." });

            return db.collection('comments').add(newComment);
        })
        .then(() => {
            res.json(newComment);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: "some thing went wrong" });
        })
}

exports.likeScream = (req, res) => {

}

exports.unlikeScream = (req, res) => {

}