class IntroController {

    
    // [GET] /new
    new(req, res) {
        res.render('Introduction', {UserName: req.cookies.name});
    }
    // [GET] /new/:slug
    show(req, res) {
        res.send('News DETAIL!!!',{UserName: req.cookies.name});
    }
    
   
}

module.exports = new IntroController;