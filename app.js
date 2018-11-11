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
app.get('/', (req, res) => {
    res.render('main');
});


app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    Car.create({
        color: req.body.color,
        model: req.body.model,
        complectation: req.body.complectation
    });
    res.redirect('/add');
});


app.get('/buy', (req, res) => {
    Car.find({}).then(cars => {
        res.render('buy', {cars: cars});
    });
});



app.get('/auth', (req, res) => {
    res.render('auth');
});

app.post('/register', (req, res) => {
    dataObject = req.body;

    bcrypt.hash(dataObject.password, null, null, function(err, hash) {
        User.create({
            fio: dataObject.fio,
            login: dataObject.login,
            password: hash
        })
        .then(() => {
            res.json({
                ok: true,
                res: 'Вы зарегистрированы успешно!'
            });
        })
        .catch(err => {
            if (err.code == 11000)
                res.json({
                    ok: false,
                    res: 'Пользователь с таким логином уже существует!'
                });
        });
    });

    //res.redirect('/');
});

app.post('/login', (req, res) => {
    dataObject = req.body;
    User.findOne({
        login: dataObject.login
    })
    .then(user => {
        if (user) {
            bcrypt.compare(dataObject.password, user.password, function(err, r) {
                if (r) 
                    res.json({
                        ok: true,
                        res: 'Успешно!'
                    });
                else
                    res.json({
                        ok: true,
                        res: 'Введенные данные не верны!'
                    });  
            });
        } else {
            res.json({
                ok: true,
                res: 'Введенные данные не верны!'
            });
        }
    })
    .catch(error => {
        res.json({
            ok: true,
            res: 'Введенные данные не верны!'
        });
    });
});

module.exports = app;