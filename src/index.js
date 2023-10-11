const path = require('path');   // path module
const express = require('express');   // express module
const methodOverride = require('method-override');  // method-override module Create a new middleware function to override the req.method property with a new value. This value will be pulled from the provided getter.
const morgan = require('morgan'); // morgan module
const { engine } = require ('express-handlebars'); // handlebars module 
const cookieParser = require('cookie-parser') // cookie-parser module


const route = require('./routes');
const db  = require('./config/db');





// Connect to DB
db.connect();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({
  extended:true,
}))
app.use(methodOverride('_method'));
app.use(cookieParser())


// HTTP logger
app.use(morgan('combined'));

// Template engines
app.engine('hbs', engine({
  extname: '.hbs',
  helpers: {
    sum: (a, b) => a +b,
    admin : (a) => {return a === 'Hiền'},
  
  }
 
  
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources','views'));


//route init
route(app);


// 127.0.0.1 - localhost (http://localhost:${port})
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
