const express = require('express');
const router = express.Router();
const {callOpenAI} = require("../utility/OpenAiReply")

router.post('/', callOpenAI);

module.exports = router;