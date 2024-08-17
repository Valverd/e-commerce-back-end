const admin = require('firebase-admin')
const service_account = require('./serviceAccountKey.json')

admin.initializeApp({
    credential: admin.credential.cert(service_account),
    storageBucket: process.env.STORAGEBUCKET
})

const bucket = admin.storage().bucket()

module.exports = bucket