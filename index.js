const express = require('express');
const hbs = require('express-handlebars').create({
    extname: '.hbs',
});

const cookieParser = require('cookie-parser');
const database = require('./config/database');
const session = require('./middlewears/session');
const trimBody = require('./middlewears/trimBody');
const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const actionContrroller = require('./controllers/actionController');
const profileController = require('./controllers/profileController');


const app = express();

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));

start();

async function start() {

    app.use(cookieParser());
    app.use(session());
    app.use(trimBody());

    await database(app)

    app.use(homeController);
    app.use('/auth', authController);
    app.use('/action', actionContrroller);
    app.use(profileController);
    
    app.listen(3000, () => console.log('Server start on port 3000'));
}