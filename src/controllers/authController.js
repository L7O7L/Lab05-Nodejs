const { Router } = require('express');
const router = Router();
var path = require('path');
const http = require('http')
var options = {
    port: 3000,
    host: '127.0.0.1',
  };
var request = http.request(options);
const jwt = require('jsonwebtoken');
const config = require('../config');
const verifyToken = require('./verifyToken');


const User = require('../models/User');

router.get('/', (req, res) => {

    res.sendFile(path.resolve('templates/login.html'))

})

router.get('/register', (req, res) => {

    res.sendFile(path.resolve('templates/register.html'))

})

router.get('*', (req, res) => {

    res.sendFile(path.resolve('templates/error.html'), 404)

})

router.post('/signup', async (req, res, next) => {
    const { username, email, password } = req.body;
    const user = new User(
       {
          username,
          email,
          password
       } 
    );

    console.log(username, email, password)
    console.log(user)
    user.password = await user.encryptPassword(user.password)
    await user.save();

    const token = jwt.sign({id: user._id}, config.secret, {
        expiresIn: 60 * 60 * 24
    })

    res.cookie('token', token, {

        expire: 1 / 24, // One hour
        httpOnly: true // If served over HTTPS

    });

    res.redirect('/me')

    //res.json({message: 'Received'})

})

router.get('/me', verifyToken, async (req, res, next) => {
    const user = await User.findOne(req.email, { password: 0 });
    if(!user){
        return res.status(404).send('No user found....!!!');
    }
    res.json(user);
})

router.post('/signin', async (req, res, next) => {
    const { email, password } = req.body; 
    //console.log(email, password);
    const user = await User.findOne({email: email})

    if(!user){
        return res.status(404).send("The user doesn't exists");
    }

    const validPassword = await user.validatePassword(password);
    //console.log(passwordIsValid);
    if(!validPassword){
        return res.status(401).json({auth: false, token: null});
    }

    const token = jwt.sign({id: user._id}, config.secret, {
        expiresIn: 60 * 60 * 24
    });

    res.cookie('token', token, {

        expire: 1 / 24, // One hour
        httpOnly: true // If served over HTTPS

    });

    res.redirect('/dashboard')


})

router.get('/dashboard', verifyToken, (req, res, next) => {
    res.sendFile(path.resolve('templates/index.html'))
})


module.exports = router