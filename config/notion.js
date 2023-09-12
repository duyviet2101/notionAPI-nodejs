const axios = require('axios');

module.exports = axios.create({
    baseURL: "https://api.notion.com/v1/",
    headers: {
        'Authorization': process.env.TOKEN_NOTION,
        'Notion-Version': process.env.NOTION_VERSION,
        'Content-Type': 'application/json'
    }
})