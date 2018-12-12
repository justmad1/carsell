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
    UsedCar = require('./models/usedcar'),
    User = require('./models/user'),
    Admin = require('./models/admin'),
    Order = require('./models/order'),
    Feedback = require('./models/feedback'),
    dataObject = {},
    resCars = [];

//connection
mongoose.connection
.on('error', error => console.error(error))
.once('open', () => console.log("connected to database"));
mongoose.connect(config.MONGO_URL, { useNewUrlParser: true});

app.listen(process.env.PORT || 3000, function () {
    console.log('Server started!');
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

function sendmail(car, login) {
    var transporter = nodemailer.createTransport('smtps://dimakasper98@gmail.com:1gmailpass@smtp.gmail.com');

    var mailOptions = {
        from: '"Cars Admin" <admin@cars.com>', // sender address
        to: 'claywhoami@yandex.ru', // list of receivers
        subject: 'Новый автомобиль заказан', // Subject line
        text: `Пользователь ${login} только что заказал автомобиль ${car.model}`, // plaintext body
        html: `Пользователь ${login} только что заказал автомобиль ${car.model}` // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

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


app.post('/getusedcars', (req, res) => {
    UsedCar.find({}).then(cars => {
        res.json({
            ok: true,
            data: cars
        });
    });
});


app.post('/getclientcars', (req, res) => {
    resCars = [];
    console.log(req.session.userLogin);
    Order.find({ login: req.session.userLogin }).then(orders => {
        orders.forEach(order => {
            Car.find({ model: order.car_model }).then(car => {
                if (car.length) resCars.push(car[0]);
            });
            UsedCar.find({ model: order.car_model }).then(usedcar => {
                if (usedcar.length) resCars.push(usedcar[0]);
            });
        });
    });
    setTimeout(() => {
        res.json({
            cars: resCars
        });
    }, 1000);
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
    Order.find({}).then(cars => {
        cars = cars.filter(car => {
            return car.car_model.split(" ")[0] != "Model";
        });
        resCars[3] = cars.length;
    });

    setTimeout(() => {
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
            res.json({
                html: `
                    <div class="container top-100">
                    <form method="POST">
                        <div class="row">
                            <div class="input-field col s3">
                                <input value="" id="first_name2" type="text" class="validate" name="color">
                                <label class="active" for="first_name2">Color</label>
                            </div>

                            <div class="input-field col s3">
                                <input value="" id="first_name3" type="text" class="validate" name="price">
                                <label class="active" for="first_name3">Price</label>
                            </div>

                            <div class="input-field col s3">
                                <select name="model">
                                    <option value="Model 1">Model 1
                                    </option>
                                    <option value="Model 2">Model 2</option>
                                    <option value="Model 3">Model 3</option>
                                </select>
                                <label>Select model</label>
                            </div>

                            <div class="input-field col s3">
                                <select name="complectation">
                                    <option value="Standart">Standart
                                    </option>
                                    <option value="Standart Plus">Standart Plus</option>
                                    <option value="Premium">Premium</option>
                                    <option value="Premium Plus">Premium Plus</option>
                                    <option value="Luxury">Luxury</option>
                                </select>
                                <label>Select complectation</label>
                            </div>

                            <div class="input-field col s3">
                                <select name="engine">
                                    <option value="250 kW">250 kW
                                    </option>
                                    <option value="300 kW">300 kW</option>
                                    <option value="450 kW">450 kW</option>
                                    <option value="500 kW">500 kW</option>
                                </select>
                                <label>Select engine</label>
                            </div>

                        </div>
                        <div class="row">
                            <button class="btn waves-effect waves-light" type="submit" name="action">Добавить автомобиль
                            </button>
                        </div>
                    </form>
                </div>
                `
            });
        } else {
            res.redirect('/');
        }
    });
});

app.post('/admin', (req, res) => {
    Car.create({
        model: req.body.model,
        color: req.body.color,
        engine: req.body.engine,
        price: req.body.price,
        complectation: req.body.complectation,
        date: new Date(),
        available: true
    });
    res.redirect('/admin');
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

app.get('/used', (req, res) => {
    UsedCar.find({}).then(cars => {
        res.render('used', {
            cars: cars,
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
                sendmail(req.body, req.session.userLogin);

                res.json({
                    ok: true,
                    message: "Автомобиль оформлен!"
                });
            });
        });
    }
});


app.post('/buyusedcar', (req, res) => {
    if (req.session.userId === undefined) {
        res.json({
            ok: false,
            message: "Необходимо авторизоваться!"
        });
    } else {
        UsedCar.updateOne({
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
                    sendmail(req.body, req.session.userLogin);
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


app.get('/logout',(req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.get('/regadmin', (req, res) => {
    bcrypt.hash('admin', null, null, function (err, hash) {
        Admin.create({
            login: 'admin',
            password: hash
        });
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