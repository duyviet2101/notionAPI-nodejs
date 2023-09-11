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

//!config urlencoded
app.use(
    express.urlencoded({
        extended: true,
    }),
); //TH gửi thông tin qua dạng form html
app.use(express.json()); // TH gửi từ code JS


app.post('/databases/:databaseId/query', async (req, res) => {
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

})

app.get('/pages/:pageId', async (req, res) => {
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

})

app.get('/', (req, res) => {
    res.send('<a href="https://github.com/duyviet2101/trash/tree/master#readme">Supported APIs</a>')
})

app.listen(3005, () => {
    console.log('http://127.0.0.1:3005')
})