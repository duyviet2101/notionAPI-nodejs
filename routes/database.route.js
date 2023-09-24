const express = require('express');
const Router = express.Router();

const controller = require('../controllers/database.controller')

Router.post('/:databaseId/query', controller.queryDatabase)

Router.post('/:databaseId/query-mix', controller.queryDatabaseMix)

module.exports = Router