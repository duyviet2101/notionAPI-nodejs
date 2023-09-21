const requestNotion = require('../../config/notion');
const databaseQuery = require('../../helpers/databaseQuery.js');

module.exports.getDatabase = async (req, res) => {
    try {
        const database = await databaseQuery(req.params.databaseId, req.body)
        res.send(database)
    } catch (error) {
        // console.log(">>>>>>>>>>>>>>>",error.code)
        if(error.respone){
            // console.log('response>>>',error.respone)
            res.send({error: error.respone.data})
        } else
        if (error.request) {
            // console.log('request>>>',error.request.data)
            res.send({error: error.code})
        } else
        if (error.message) {
            // console.log('message>>>',error.message)
            res.send({error: error.message})
        } else
        res.send({error: "UNKNOWN ERROR"})
    }

}