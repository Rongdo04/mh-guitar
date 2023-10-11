const Account = require("../models/Account");
const { mongooseToObject } = require('../../util/mongoose');

const middlewareController = require('../middleware/MiddlewareController');


class EditUserController {


    // [GET] /update/:id
    update(req, res, next) {
       
        const nameofuser = req.body.nameUser;
        middlewareController.verifyToken(req, res, () => {
        Promise.all([
            Account.updateOne({_id: res.user._id}, req.body)
        ])
        .then(() => {
                    
            res.clearCookie('name');
            res.cookie('name', nameofuser)
            res.redirect('/');
        })
        .catch(next);
    })
        
    }
    

    // [GET] /edit-user
    edit(req, res, next) {
        middlewareController.verifyToken(req, res, () => {

            Account.findById(res.user._id)
                .then(Account => res.render('edit-user', {
                    Account: mongooseToObject(Account),
                    UserName: req.cookies.name,
                }))
                .catch(next);
        })
    }


}

module.exports = new EditUserController;