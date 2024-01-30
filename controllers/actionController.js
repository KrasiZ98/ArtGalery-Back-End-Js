const { hasUser } = require('../middlewears/guards');
const { create, getPostById, update, deleteById, sharedPublication } = require('../services/postServices');
const { parserErrors } = require('../util/parser');

const actionContrroller = require('express').Router();

actionContrroller.get('/create', hasUser(), (req, res) => {
    res.render('create', {
        title: 'Create page',
    });
});

actionContrroller.post('/create', hasUser(), async (req, res) => {
    console.log(req.body);
    
    const createPost = {
        title: req.body.title,
        technique: req.body.technique,
        picture: req.body.picture,
        certificate: req.body.certificate,
        owner: req.user._id,
        author: req.user.username,
    };
    try {
        if (req.body.title == '' || req.body.technique == '' || req.body.picture == '' || req.body.certificate == '') {
            throw new Error('All fields are required');
        }
        if (req.body.certificate !== 'Yes' && req.body.certificate !== 'No') {
            throw new Error('The Certificate of authenticity there must be value "Yes" or "No"');
        }
        await create(createPost);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('create', {
            title: 'Create page',
            errors: parserErrors(error),
            body: createPost,
        });
    }
});

actionContrroller.get('/:id/details', async (req, res) => {
    const post = await getPostById(req.params.id);
    let hbsTemplate;
    
    if (req.user) {
        post.isOwner = post.owner.toString() == req.user._id;
        if(post.shared.toString().includes(req.user._id)) {
            post.isShared = true;
        }
        hbsTemplate = 'details';
    } else {
        hbsTemplate = 'detailsGuest'
    }

    console.log(post);
    res.render(hbsTemplate, {
        title: 'Details page',
        post,
    });
});

actionContrroller.get('/:id/edit', hasUser(), async (req, res) => {
    const post = await getPostById(req.params.id);

    if(post.owner.toString() !== req.user._id) {
        return res.redirect('/auth/login');
    }

    res.render('edit', {
        title: 'Edit page',
        post,
    });
});

actionContrroller.post('/:id/edit', hasUser(), async (req, res) => {
    const post = await getPostById(req.params.id);

    if(post.owner.toString() !== req.user._id) {
        return res.redirect('/auth/login');
    }
    const edited = {
        title: req.body.title,
        technique: req.body.technique,
        picture: req.body.picture,
        certificate: req.body.certificate,
    };
    try {
        if (req.body.title == '' || req.body.technique == '' || req.body.picture == '' || req.body.certificate == '') {
            throw new Error('All fields are required');
        }
        if (req.body.certificate !== 'Yes' && req.body.certificate !== 'No') {
            throw new Error('The Certificate of authenticity there must be value "Yes" or "No"');
        }
        await update(req.params.id, edited);
        res.redirect(`/action/${req.params.id}/details`);
    } catch (error) {
        console.error(error);
        res.render('edit', {
            title: 'Edit page',
            error: parserErrors(error),
            body: edited,
            post,
        });   
    }
});

actionContrroller.get('/:id/shared', hasUser(), async (req, res) => {
    const post = await getPostById(req.params.id);

    try {
        if(post.owner.toString() == req.user._id) {
            throw new Error('Cannot shared your own post');
        }

        await sharedPublication(req.params.id, req.user._id);
        res.redirect(`/action/${req.params.id}/details`);

    } catch (error) {
        console.error(error);
        res.render('details', {
            title: 'Details page',
            errors: parserErrors(error),
            post,
        })
    }

})

actionContrroller.get('/:id/delete', hasUser(), async (req, res) => {
    const post = await getPostById(req.params.id);

    if(post.owner.toString() !== req.user._id) {
        return res.redirect('/auth/login');
    }

    await deleteById(req.params.id);
    res.redirect('/catalog');
});



module.exports = actionContrroller;