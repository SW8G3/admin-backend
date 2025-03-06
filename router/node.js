const express = require('express');
const router = express.Router();

const node = require('../controller/node');

router.get('/get', node.getNodes);
router.get('/get/:id', node.getNodeById);

router.post('/create', node.createNode); 

module.exports = router;