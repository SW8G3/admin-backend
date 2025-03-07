const express = require('express');
const router = express.Router();

const node = require('../controller/node');

router.get('/getAll', node.getNodes);
router.get('/get', node.getNodeById);

router.post('/create', node.createNode);
router.post('/update', node.updateNode);
router.post('/delete', node.deleteNode);
router.post('/drop', node.dropNodes);

module.exports = router;