const express = require('express');
const router = express.Router();

const edge = require('../controller/edge');

router.get('/getAll', edge.getEdges);
router.get('/get/node', edge.getNodeEdges);
router.get('/get', edge.getEdgeById);

router.post('/drop', edge.dropEdges);
router.post('/create', edge.createEdge);
router.post('/append', edge.appendEdge);
router.post('/delete', edge.deleteEdge);

module.exports = router;