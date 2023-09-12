const requestNotion = require('../config/notion');

module.exports.getDatabase = async (req, res) => {
    const databaseId = req.params.databaseId;
    try {
        //! get thông tin của database
        var responseDatabase = await requestNotion({
            method: 'GET',
            url: `/databases/${databaseId}`,
        }).then((responseDatabase) => responseDatabase.data)
        
        const database = {
            object: responseDatabase.object,
            id: responseDatabase.id,
            created_time: responseDatabase.created_time,
            last_edited_time: responseDatabase.last_edited_time,
            title: responseDatabase.title[0].plain_text,
            description: responseDatabase.description,
            properties: responseDatabase.properties,
            parent: responseDatabase.parent
        }
        //! get thông tin của các pages trong database
        const responsePages = await requestNotion({
            method: 'POST',
            url: `/databases/${databaseId}/query`,
            data: req.body
        }).then (respone => respone.data.results)

        //! get blocks in page (page chỉ có 1 block duy nhất)
        const blocks =  await Promise.all(responsePages.map(async (page, index) => {
            const content = await requestNotion({
                method: 'GET',
                url: `/blocks/${page.id}/children?page_size=100`
            }).then(response => response.data)
            return {
                object: page.object,
                id: page.id,
                parent: page.parent,
                properties: page.properties,
                content: content
            }
        }));
        database.data = blocks;
        res.send(database)
    } catch (error) {
        console.log(error)
        if(error.respone){
            console.log('response>>>',error.respone)
            res.send({error: error.respone.data})
        } else
        if (error.request) {
            console.log('request>>>',error.request.data)
            res.send({error: `request error`})
        } else
        if (error.message) {
            console.log('message>>>',error.message)
            res.send({error: error.message})
        } else
        res.send({error: "UNKNOWN ERROR"})
    }

}