const mongoose = require('mongoose')

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('DATABASE CONNECTED!!!')
    } catch (error) {
        console.log('Cant connect to database!!!')
    }
}