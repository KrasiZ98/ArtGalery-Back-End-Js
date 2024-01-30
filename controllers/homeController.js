const { getAllPost } = require('../services/postServices');

const homeController = require('express').Router();

homeController.get('/', async (req, res) => {
    const post = await getAllPost();
    console.log(req.user)
    res.render('home', {
        title: 'Home Page',
        post,
        
    });
});

homeController.get('/catalog', async (req, res) => {
    const post = await getAllPost();

    res.render('catalog', {
        title: 'Catalog Page',
        post,
    });
});



module.exports = homeController