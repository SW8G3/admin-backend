const express = require('express');
const router = express.Router();

const edge = require('../controller/edge');

router.get('/get', edge.getEdges);
router.get('/get/:id', edge.getEdgeById);

router.post('/create', edge.createEdge);

module.exports = router;