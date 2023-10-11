const Account = require('../models/Account');
const authController = require('../auth/AuthController');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');

class SiteController {

    // [GET] /register
    register(req, res, next) {
        res.render('register', { UserName: req.cookies.name });
    }


    //[POST] /register/user
    registerUser(req, res, next) {

       
        const nameUser = req.body.nameUser;
        const emailUser = req.body.email;
        const passwordUser = req.body.password;
        const confirmPassword = req.body.confirmpassword;
        const newUser = new Account(req.body);
         if(passwordUser !== confirmPassword){
         
            return res.render('register', {
                message: 'Пароль и подтверждение пароля не совпадают',
                UserName: req.cookies.name,
            });
         }

         if(passwordUser.length < 6 && passwordUser.length > 0){
            return res.render('register', {
                message: 'Пароль слишком короткий',
                UserName: req.cookies.name,
            });
         }
         if(passwordUser.length > 20){
            return res.render('register', {
                message: 'Пароль слишком длинный',
                UserName: req.cookies.name,
            });
         }
         // if password = blank

         if(nameUser === ''){
            return res.render('register', {
                message: 'Имя пусто',
                UserName: req.cookies.name,
            });
        }
        if(emailUser === ''){
            return res.render('register', {
                message: 'Электронная почта пуста',
                UserName: req.cookies.name,
            });
        }
         if(passwordUser === ''){
            return res.render('register', {
                message: 'Пароль пуст',
                UserName: req.cookies.name,
            });
        }
      
       
        if(confirmPassword === ''){
            return res.render('register', {
                message: 'Подтвердите пароль пуст',
                UserName: req.cookies.name,
            });
        }
           else
           {
            const adminEmail = 'danghienxk@gmail.com'
            const adminPassword = 'udaemkagvmgkmmqf'
            const transporter = nodeMailer.createTransport({
                service: 'gmail',
                auth: {
                  user: adminEmail,
                  pass: adminPassword,
                }
              })
            const options = {
                from: adminEmail, // địa chỉ admin email bạn dùng để gửi
                to: `${emailUser}`, // địa chỉ gửi đến
                subject:'From MH Guitar', // Tiêu đề của mail
                html: `<h1  style = "color: Green; text-align:center"> your Account is created successfully !!!!!</h1>
                       <h3  style = "text-align:center"> your password: ${passwordUser}</h3>`
                         
            };
            transporter.sendMail(options, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            newUser.save()
            .then(() => {
                res.render('login', {message: 'Зарегистрировать успех'})
            })
            .catch(error => {
                res.render('register', {
                    message: 'Электронная почта уже используется ',
                })
            });

           
        }
    

    }


    // [GET] /login
    login(req, res, next) {
        res.render('login', { UserName: req.cookies.name });
    }


    //[POST] /login/user
    loginUser(req, res, next) {

        const emailUser = req.body.email;
        const passwordUser = req.body.password;

        Account.findOne({
            email: emailUser,
            password: passwordUser,
        })
            .then(data => {

                if (data) {
                    const accessToken = authController.generateAccessToken(data);
                    const name = data.nameUser;
                    res.cookie('token', accessToken, {
                        httpOnly: true,
                        secure: false,
                        path: '/',
                        sameSite: 'strict',
                    });
                    res.cookie('name', name);

                   // res.json(data);

                    res.redirect('/');
                }
                else {
                    if(emailUser === ''){
                        return res.render('login', {
                            message: 'Электронная почта пуста',
                            UserName: req.cookies.name,
                        });
                    }
                    if(passwordUser === ''){
                        return res.render('login', {
                            message: 'Пароль пуст',
                            UserName: req.cookies.name,
                        });
                    }
                  else{
                    return res.render('login', {

                        message: 'Пароль или электронная почта неверны',
                    })
                    
                  }
                   
                }

            })
            .catch(err => {
                console.log(err);
                res.status(500).send('Server error');
                
            });

    }


    //[POST] /logout
    userLogout(req, res, next) {

        Promise.all([])
            .then(() => {
                res.clearCookie('name');
                res.clearCookie('token');
                res.status(200).redirect(`/`);
            })
            .catch(next);

    }

    // [GET] /home
    index(req, res, next) {

        res.render('home', { UserName: req.cookies.name });
    }

    // [POST] /forgotPassword
    forgotPassword(req, res, next) {
        res.render('forgotPassword', { UserName: req.cookies.name });
    }
    forgotPasswordUser(req, res, next) {
        const emailUser = req.body.email;
        if(emailUser === ''){
            return res.render('forgotPassword', {
                message: 'Электронная почта пуста',
                UserName: req.cookies.name,
            });
        }
        else{
            
            Account.findOne({
                email: emailUser,
            })
            .then(data => {
                if(data){
                    const adminEmail = 'danghienxk@gmail.com'
                    const adminPassword = 'udaemkagvmgkmmqf'
                    const transporter = nodeMailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: adminEmail,
                            pass: adminPassword,
                        }
                        })
                    const options = {
                        from: adminEmail, // địa chỉ admin email bạn dùng để gửi
                        to: `${emailUser}`, // địa chỉ gửi đến
                        subject:'From MH Guitar', // Tiêu đề của mail
                        html: `<h1  style = "color: Green; text-align:center"> your Account is created successfully !!!!!</h1>
                                 <h3  style = "text-align:center"> your password: ${data.password}</h3>`

                    };
                    transporter.sendMail(options, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    res.render('login', {
                        message: 'Пароль отправлен на почту',
                    })
                }
                else{
                    return res.render('forgotPassword', {
                        message: 'Электронная почта не найдена',
                        UserName: req.cookies.name,
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('Server error');

            });
            
        }
    }

}

module.exports = new SiteController;