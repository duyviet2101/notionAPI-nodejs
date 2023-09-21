const databaseRoute = require('./database.route')
const pageRoute = require('./page.route')

module.exports = (app) => {
    app.use('/databases', databaseRoute)
    app.use('/pages', pageRoute)
    app.get('/', (req, res) => {
        res.send('<a href="https://github.com/duyviet2101/trash/tree/master#readme">Supported APIs</a>')
    })
}