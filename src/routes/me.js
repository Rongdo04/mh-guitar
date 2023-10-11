const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/MeController');

// courses in to slug --- do with video
router.get('/stored/courses/:slug/:id/edit', meController.editVideo);
router.put('/stored/courses/:slug/:id', meController.updateVideo);
router.patch('/courses/:slug/:id/restore', meController.restoreVideo);
router.delete('/stored/courses/:slug/:id', meController.destroyVideo);
router.delete('/stored/courses/:slug/:id/force', meController.forceDestroyVideo);
router.get('/stored/courses/:slug', meController.showStoredVideo);
router.get('/trash/courses/:slug', meController.showTrashVideo);


// do with course
router.get('/stored/courses/:id/edit', meController.edit);
router.put('/courses/:id', meController.update);
router.patch('/courses/:id/restore', meController.restore);
router.delete('/courses/:id', meController.destroy);
router.delete('/courses/:id/force', meController.forceDestroy);
router.post('/courses/handle-form-actions', meController.handleFromActions);
router.post('/courses/handle-form-actions2', meController.handleFromActions2);



router.get('/stored/courses', meController.storedCourses);
router.get('/trash/courses', meController.trashCourses);
router.get('/course/add', meController.addCourse);
router.post('/course/new', meController.addVideo);
router.get('/create', meController.create);
router.post('/store', meController.postCourse);


module.exports = router;