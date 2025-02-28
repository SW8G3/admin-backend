const express = require('express');
const router = express.Router();

const edge = require('../controller/edge');

router.get('/get/:id', edge.getEdges);

module.exports = router;