const express = require('express');
const router = express.Router();

const introController = require('../app/controllers/IntroController');


router.get('/:slug', introController.show);
router.get('/', introController.new);


module.exports = router;