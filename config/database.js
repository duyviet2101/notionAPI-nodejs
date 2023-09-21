const mongoose = require('mongoose')

module.exports.connect = async () => {
    try {
        await mongoose.connect("mongodb://duyviet2101:123456@101.96.66.219:8000/codelab1?authMechanism=DEFAULT&authSource=codelab1")
        console.log('DATABASE CONNECTED!!!')
    } catch (error) {
        console.log('>>>>>',error)
        console.log('Cant connect to database!!!')
    }
}