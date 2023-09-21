const { prefixAdmin } = require('../../config/system')
const databaseRoute = require('./database.route')
// const pageRoute = require('./page.route')

module.exports = (app) => {
    const PATH_ADMIN = '/' + prefixAdmin;

    app.use(PATH_ADMIN +  '/databases', databaseRoute)
    
}