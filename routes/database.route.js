const express = require('express');
const Router = express.Router();

const controller = require('../controllers/database.controller')

Router.post('/:databaseId/query', controller.getDatabase)


module.exports = Router