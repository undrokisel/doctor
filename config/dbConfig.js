const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL)

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('successed connection to mongoose')
})

connection.on('error', (error) => {
    console.log('error in MongoDB connection', error)
})

module.export = mongoose;