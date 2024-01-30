const { hasUser } = require('../middlewears/guards');
const Post = require('../models/Post');
const User = require('../models/User');
const { getPostByUserId, getByUserId } = require('../services/postServices');

const profileController = require('express').Router();

profileController.get('/profile', hasUser(), async (req, res) => {
    const posts = await Post.find({owner: req.user._id});
    posts.titleList = Object.assign(posts).map(v => v.title);
    const shared = await getPostByUserId(req.user._id);
   res.locals.user.titles = Object.assign(shared).map(v => v.title)
    const names = Object.assign(shared).map(v => v.title);
    console.log(posts.titleList);
    console.log(posts)
    res.render('profile', {
        title: 'Profile page',
        posts,
    });
});


module.exports = profileController;