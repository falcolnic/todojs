const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({ storage: storage }).single("image");

router.post('/add', upload, async (req, res) => {
    console.log(req.body);
    const user = new User({
        title: req.body.title,
        email: req.body.email,
        description: req.body.description,
        status: req.body.status,
    });
    try {
        await user.save();
        req.session.message = { 
            message: "User added successfully", 
            type: "success"
        }; 
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find().exec();
        res.render('index', {
            title: 'Home Page',
            users: users,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.get('/add', async(req, res) => {
    res.render('add_users', { title: 'Add User' });
});

router.get('/edit/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const user = await User.findById(id).exec();
        if (user == null) {
            res.redirect("/");
        } else {
            res.render('edit_users', {
                title: 'Edit User',
                user: user,
            });
        }
    } catch (err) {
        res.redirect("/");
    }
});


router.post('/update/:id', upload, async (req, res) => {
    let id = req.params.id;

    try {
        await User.findByIdAndUpdate(id, {
            title: req.body.title,
            email: req.body.email,
            description: req.body.description,
            status: req.body.status,
        }).exec();

        req.session.message = {
            type: "success",
            message: "User updated"
        }
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

router.get('/delete/:id?', async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.json({ message: "No ID provided", type: "danger" });
    }
    try {
        await User.findByIdAndDelete(id).exec();
        req.session.message = {
            type: "info",
            message: "User deleted"
        }
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

module.exports = router;