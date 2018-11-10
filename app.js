const express = require('express'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    path = require('path'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    app = express();

let Car = require('./models/car'),
    User = require('./models/user'),
    Order = require('./models/order'),
    dataObject = {};

//connection
mongoose.connection
.on('error', error => console.error(error))
.on('close', () => console.log("closed"))
.once('open', () => console.log("connected to database"));
mongoose.connect(config.MONGO_URL, { useNewUrlParser: true});

app.listen(3000, function () {
    console.log('Server started!');
});

//sets and uses
app.engine('ejs', require('ejs-locals'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "media")));


//routers
app.get('/add', (req, res) => {
    res.render('add');
});

app.get('/auth', (req, res) => {
    res.render('auth');
});

app.get('/buy', (req, res) => {
    Car.find({}).then(cars => {
        res.render('buy', {cars: cars});
    });
});

app.get('/', (req, res) => {
    res.render('main');
});

app.post('/add', (req, res) => {
    Car.create({
        color: req.body.color,
        model: req.body.model,
        complectation: req.body.complectation
    });
    res.redirect('/add');
});

app.post('/auth', (req, res) => {
    dataObject = req.body;
    console.log(dataObject)
    if (dataObject.type === 'register') {
        User.create({
            fio: dataObject.fio,
            login: dataObject.login,
            password: dataObject.password
        });
        res.json({
            res: 'Registered sucsessfully!'
        });
        
    } else {

    }

    //res.redirect('/');
});

module.exports = app;