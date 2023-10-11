const express = require('express');
const router = express.Router();
const middlewareController = require('../app/middleware/MiddlewareController');
const CheckAuth = require('../app/auth/CheckAuth');

const SiteController = require('../app/controllers/SiteController');

router.get('/register', SiteController.register);
router.post('/register/user', SiteController.registerUser);

router.get('/login', CheckAuth.checkNotAuthenticated, SiteController.login);
router.post('/login/user',CheckAuth.checkNotAuthenticated, SiteController.loginUser);

router.get('/logout', middlewareController.verifyToken, SiteController.userLogout);
router.get('/', SiteController.index);

router.get('/forgot-password', SiteController.forgotPassword);
router.post('/forgot-password/user', SiteController.forgotPasswordUser);
module.exports = router;