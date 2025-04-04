const express = require('express');
const router = express.Router();

const graph = require('../controller/graph');

router.get('/download', graph.downloadGraph);

router.post('/upload', graph.uploadGraph);

module.exports = router;