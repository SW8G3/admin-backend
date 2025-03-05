const express = require('express');
const router = express.Router();

const graph = require('../controller/graph');

//router.get('/get', edge.getEdges);

router.post('/upload', graph.uploadGraph);

module.exports = router;