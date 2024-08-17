const admin = require('firebase-admin')

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG)),
    storageBucket: process.env.STORAGEBUCKET
})

const bucket = admin.storage().bucket()

module.exports = bucket