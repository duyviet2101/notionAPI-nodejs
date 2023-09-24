require('dotenv').config()
const express = require('express');
const route = require('./routes/index.route')
const cors = require('./middleware/cors.js')

const app = express();
const port = 3005;

cors(app)
// const database = require('./config/database');
// database.connect();

//!config urlencoded
app.use(
    express.urlencoded({
        extended: true,
    }),
); //TH gửi thông tin qua dạng form html
app.use(express.json()); // TH gửi từ code JS


route(app);

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`)
})


app.get('/pages/:pageId', )