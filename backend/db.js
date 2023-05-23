const mongoose = require('mongoose')

const DBConnect = () => {
    const URL = process.env.MONGO_URI

    mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false
    })

    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('DB connected....')
    })
}

module.exports = DBConnect