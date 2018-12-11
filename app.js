const express = require('express'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    path = require('path'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    nodemailer = require("nodemailer"),
    xoauth2 = require('xoauth2'),
    app = express();

let Car = require('./models/car'),
    User = require('./models/user'),
    Admin = require('./models/admin'),
    Order = require('./models/order'),
    Feedback = require('./models/feedback'),
    dataObject = {},
    resCars = [];

//connection
// mongoose.connection
// .on('error', error => console.error(error))
// .once('open', () => console.log("connected to database"));
// mongoose.connect(config.MONGO_URL, { useNewUrlParser: true});

app.listen(3000, function () {
    console.log('Server started! 3');
});

//sets and uses
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    })
);
app.engine('ejs', require('ejs-locals'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "media")));

//routers
app.get('/', (req, res) => {
    res.render('main', {
        user: {
            id: req.session.userId,
            login: req.session.userLogin
        }
    });
});


app.get('/cabinet', (req, res) => {
    Admin.findOne({
        _id: req.session.userId,
        login: req.session.userLogin
    }).then(user => {
        if (user) {
            res.redirect('/admin');
        } else {
            res.render('client', {
                user: {
                    id: req.session.userId,
                    login: req.session.userLogin
                }
            });
        }
    });
});


app.post('/getcars', (req, res) => {
    resCars = [];

    if (req.body[0])
        Car.find({ model: 'Model 1' }).then(cars => {
            resCars = resCars.concat(cars);
        });
    if (req.body[1])
        Car.find({ model: 'Model 2' }).then(cars => {
            resCars = resCars.concat(cars);
        });
    if (req.body[2])
        Car.find({ model: 'Model 3' }).then(cars => {
            resCars = resCars.concat(cars);
        });
    
    setTimeout(() => {
        res.json({
            ok: true,
            data: resCars
        });
    }, 1000);
});


app.post('/getclientcars', (req, res) => {
    Order.find({  })
});


app.post('/getboughtcars', (req, res) => {
    resCars = [];

    Order.find({ car_model: 'Model 1' }).then(cars => {
        resCars[0] = cars.length;
    });
    Order.find({ car_model: 'Model 2' }).then(cars => {
        resCars[1] = cars.length;
    });
    Order.find({ car_model: 'Model 3' }).then(cars => {
        resCars[2] = cars.length;
    }); 

    setTimeout(() => {
        console.log(resCars);
        res.json({
            data: resCars
        });
    }, 1000);
    
});


app.get('/add', (req, res) => {
    Admin.findOne({
        _id: req.session.userId,
        login: req.session.userLogin
    }).then(user => {
        if (user) {
            res.render('add', {
                user: {
                    id: req.session.userId,
                    login: req.session.userLogin
                }
            });
        } else {
            res.redirect('/');
        }
    });
});

app.post('/add', (req, res) => {
    Car.create({
        model: req.body.model,
        color: req.body.color,
        engine: req.body.engine,
        price: req.body.price,
        complectation: req.body.complectation,
        date: new Date(),
        available: true
    });
    res.redirect('/add');
});

app.get('/buy', (req, res) => {
    Car.find({}).then(cars => {
        res.render('buy', {cars: cars,
            user: {
                id: req.session.userId,
                login: req.session.userLogin
            }
        });
    });
});

app.post('/buycar', (req, res) => {
    if (req.session.userId === undefined) {
        res.json({
            ok: false,
            message: "Необходимо авторизоваться!"
        });
    } else {
        Car.updateOne({
            _id: req.body._id,
        }, {
            $set: { available: false }
        }).then(cars => {
            Order.create({
                client_id: req.session.userId,
                car_id: req.body._id,
                car_model: req.body.model,
                login: req.body.login
            }).then(() => {
                res.json({
                    ok: true,
                    message: "Автомобиль оформлен!"
                });
            });
        });
    }
});


app.get('/about', (req, res) => {
    Feedback.find({}).then(f => {
        res.render('about', {f: f,
            user: {
                id: req.session.userId,
                login: req.session.userLogin
            },
        });
    });
});

app.post('/about', (req, res) => {
    Feedback.create({
        login: req.session.userLogin,
        message: req.body.message
    }).then((result) => {
        Feedback.find({}).then(f => {
            res.json({
                ok: true,
                data: f
            });
        });
    }).catch((err) => {
        res.json({
            ok: false
        });
    });
});

app.post('/register', (req, res) => {
    dataObject = req.body;

    bcrypt.hash(dataObject.password, null, null, function(err, hash) {
        User.create({
            fio: dataObject.fio,
            login: dataObject.login,
            password: hash
        })
        .then(user => {
            req.session.userId = user.id;
            req.session.userLogin = user.login;
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
});

app.post('/login', (req, res) => {
    dataObject = req.body;
    Admin.findOne({
        login: dataObject.login
    })
    .then(user => {
        if (user) {
            bcrypt.compare(dataObject.password, user.password, function (err, r) {
                if (r) {
                    req.session.userId = user.id;
                    req.session.userLogin = user.login;
                    res.json({
                        ok: true,
                        admin: true,
                        res: 'Успешно!'
                    });
                }
            });
        } else {
            User.findOne({
                login: dataObject.login
            })
                .then(user => {
                    if (user) {
                        bcrypt.compare(dataObject.password, user.password, function (err, r) {
                            if (r) {
                                req.session.userId = user.id;
                                req.session.userLogin = user.login;
                                res.json({
                                    ok: true,
                                    admin: false,
                                    res: 'Успешно!'
                                });
                            }
                            else
                                res.json({
                                    ok: false,
                                    res: 'Введенные данные не верны!'
                                });
                        });
                    } else {
                        res.json({
                            ok: false,
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
        }
    });
});

app.get('/sendemail', (req, res) => {
    var transporter = nodemailer.createTransport('smtps://dimakasper98@gmail.com:1gmailpass@smtp.gmail.com');

    var mailOptions = {
        from: '"Fred Foo ?" <foo@blurdybloop.com>', // sender address
        to: 'claywhoami@yandex.ru', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ?', // plaintext body
        html: '<b>Hello world ?</b>' // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
});

app.get('/logout',(req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.get('/admin', (req, res) => {
    Admin.findOne({
        _id: req.session.userId,
        login: req.session.userLogin
    }).then(user => {
        if (user) {
            res.render('admin');
        } else {
            res.redirect('/');
        }
    });
});

module.exports = app;