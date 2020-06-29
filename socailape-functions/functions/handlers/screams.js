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
        createdAt: new Date().toISOString()
    };

    db.collection('screams').add(newScream)
        .then(doc => {
            response.json({ message: `document ${doc.id} created.` });
        })
        .catch(error => {
            response.status(500).json({ error: "some thing went wrong" });
            console.error(error);
        })
};