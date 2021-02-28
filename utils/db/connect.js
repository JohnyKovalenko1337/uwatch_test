const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config()

module.exports = function connetcDB() {
    mongoose.connect(
        process.env.DB_CONNECT,
        {
            useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true 
        },
        () => console.log('Connected to db')
    )
}