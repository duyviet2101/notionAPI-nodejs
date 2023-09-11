const express = require('express');
const axios = require('axios');

const app = express();

const requestNotion = axios.create({
    baseURL: "https://api.notion.com/v1/",
    headers: {
        'Authorization': 'Bearer secret_LC9bGNPWbPfaQwRcxXsnBFwDdNQBHFC2K9XgkFjOS9B',
        'Notion-Version': '2022-02-22',
        'Content-Type': 'application/json'
    }
})



app.get('/database/:databaseId', async (req, res) => {
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

        //! get blocks in page
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
                content: content.results[0] ? content.results[0].paragraph.rich_text[0].text.content : ""
            }
        }));
        database.data = blocks;
        res.send(database)
    } catch (error) {
        console.log(error)
        if(error.respone){
            res.send({error: error.respone})
        } 
        if (error.request) {
            res.send({error: error.request})
        }
        if (error.message) {
            res.send({error: error.message})
        }
        res.send({error: "UNKNOWN ERROR"})
    }

})

app.listen(3005, () => {
    console.log('http://127.0.0.1:3005')
})