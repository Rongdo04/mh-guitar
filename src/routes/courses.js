const express = require('express');
const router = express.Router();

const coursesController = require('../app/controllers/CoursesController');


router.get('/:slug', coursesController.show);
router.get('/', coursesController.course);


module.exports = router;