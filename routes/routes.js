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
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename
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

router.get('/', (req, res) => {
    User.find().exec((err, users) => {
        if (err) {
            res.json({ message: err.message});
        } else {
            res.render('index', {
            title: 'Home Page',
            users: users,
            });
        }
    });
});

router.get('/add', (req, res) => {
    res.render('add_users', { title: 'Add User' });
});

module.exports = router;