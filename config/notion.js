const axios = require('axios');

module.exports = axios.create({
    baseURL: "https://api.notion.com/v1/",
    headers: {
        'Authorization': "Bearer secret_LC9bGNPWbPfaQwRcxXsnBFwDdNQBHFC2K9XgkFjOS9B",
        'Notion-Version': '2022-02-22',
        'Content-Type': 'application/json'
    }
})