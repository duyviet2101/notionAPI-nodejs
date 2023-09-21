const express = require("express");
const Router = express.Router();

const controller = require("../../controllers/admin/database.controller.js")

Router.post('/transfer-notion-2-mongo/tests-reading-ielts', controller.transferDataReadingIelst)

module.exports = Router