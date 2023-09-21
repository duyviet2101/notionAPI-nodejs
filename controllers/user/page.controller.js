const requestNotion = require('../../config/notion')

module.exports.getPage = async (req, res) => {
    const pageId = req.params.pageId;
    try {
        //! get thông tin của page
        var responsePage = await requestNotion({
            method: 'GET',
            url: `/pages/${pageId}`,
        }).then((response) => response.data)
        
        const page = {
            object: responsePage.object,
            id: responsePage.id,
            created_time: responsePage.created_time,
            last_edited_time: responsePage.last_edited_time,
            properties: responsePage.properties,
            parent: responsePage.parent
        }

        //! get blocks in page
        const blocks =  await requestNotion({
            method: 'GET',
            url: `/blocks/${pageId}/children?page_size=100`
        }).then(response => response.data)
        page.data = blocks;
        res.send(page)
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

