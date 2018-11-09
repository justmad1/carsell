const express = require('express'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    path = require('path'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    app = express();

let Car = require('./models/car'),
    User = require('./models/user'),
    Order = require('./models/order');

mongoose.connection
.on('error', error => console.error(error))
.on('close', () => console.log("closed"))
.once('open', () => console.log("connected to database"));
mongoose.connect(config.MONGO_URL, { useNewUrlParser: true});

app.listen(3000, function () {
    console.log('Server started!');
});

app.engine('ejs', require('ejs-locals'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "media")));

app.get('/add', (req, res) => {
    Car.find({}).then(cars => {
        res.render('add', {cars: cars});
    });
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

module.exports = app;