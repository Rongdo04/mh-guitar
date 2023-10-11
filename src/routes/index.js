
const siteRoutes = require('./site');
const introRoutes = require('./Introduction');
const coursesRoutes = require('./courses');
const EditUserRoutes = require('./Edit_user');
const meRoutes = require('./me');
const middlewareController = require('../app/middleware/MiddlewareController');
const CheckAuth = require('../app/auth/CheckAuth');


function route (app) {
    app.use('/me', middlewareController.verifyTokenAndAdmin,  meRoutes);
    app.use('/courses', middlewareController.verifyToken, coursesRoutes);
    app.use('/Introduction', introRoutes);
    app.use('/edit-user', EditUserRoutes);
    app.use('/', siteRoutes);
    //app.use('/', siteRoutes);
      
}

module.exports = route;