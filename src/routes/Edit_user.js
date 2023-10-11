const express = require('express');
const router = express.Router();

const EditUserController = require('../app/controllers/EditUserController');


router.put('/updateuser', EditUserController.update);
router.get('/', EditUserController.edit);


module.exports = router;