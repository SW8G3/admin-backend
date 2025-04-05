const express = require('express');
const router = express.Router();

const graph = require('../controller/qr');

router.get('/:id', graph.getQrCode);

module.exports = router;