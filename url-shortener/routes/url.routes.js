const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url.controller');

router.post('/api/shorten', urlController.shortenUrl);
router.get('/:code', urlController.redirectUrl);

module.exports = router;
