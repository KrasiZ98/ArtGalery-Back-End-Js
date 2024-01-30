const authController = require('express').Router();
const validator = require('validator');
const { register, login } = require('../services/userService');
const { parserErrors } = require('../util/parser');

authController.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register Page',
    });
});


authController.post('/register', async (req, res) => {
    console.log(req.body);
    try {
        if (req.body.username == '' || req.body.password == '' || req.body.repass == '' || req.body.address == '') {
            throw new Error('All fields are required');
        }
        if (req.body.password.length < 3) {
            throw new Error('The password should be at least 3 characters long');
        }
        if (req.body.password !== req.body.repass) {
            throw new Error('Password dont match');
        }

        const token = await register(req.body.username, req.body.password, req.body.address);
        res.cookie('token', token);
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.render('register', {
            title: 'Register page',
            errors: parserErrors(error),
            body: {
                username: req.body.username,
            }
        });
    };
});

authController.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login Page',
    });
});


authController.post('/login', async (req, res) => {
    console.log(req.body);
    try {
        if(req.body.username == '' || req.body.password == '') {
            throw new Error('All fields are required');
        }

        const token = await login(req.body.username, req.body.password);
        res.cookie('token', token);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('login', {
            title: 'Login Page',
            errors: parserErrors(error),
            body: {
                username: req.body.username,
            }
        });
    }
});

authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

module.exports = authController;