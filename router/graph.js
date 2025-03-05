const express = require('express');
const router = express.Router();

const graph = require('../controller/graph');

router.get('/get', graph.downloadGraph);

router.post('/upload', graph.uploadGraph);

module.exports = router;