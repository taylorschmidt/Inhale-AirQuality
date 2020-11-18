const express = require('express');
const app = express()
const router = express.Router()
const db = require('../models')
const passport = require('../config/ppConfig.js')

router.get('/login', (req,res)=>{
    res.render('auth/login')
})

router.post('/signup', (req, res)=>{
    console.log(req.body)
    console.log('posting to /auth/signup')

    //check if user already exists
    db.user.findOrCreate({
        where: {email: req.body.email},
        defaults: {
            name: req.body.name,
            password: req.body.password
        }
    }) //create new user if email wasn't found
    .then(([createdUser, wasCreated])=>{
        if(wasCreated){
            console.log('Just created the following user: ', createdUser)
            //log the new user in
            passport.authenticate('local', {
                successRedirect: '/',
                successFlash: 'Account created and logged in!' //flash!
            })(req,res) //IIFE = immediately invoked function
        } else {
            req.flash('error', 'email already exists, try logging in')
            res.redirect('/auth/login')
        }
    })
    .catch(err=>{
        req.flash('error', err.message)
        res.redirect('/auth/signup') //redirect to signup page so they can try again
    })
})

router.get('/signup', (req, res)=> {
    res.render('auth/signup')
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/',
    failureFlash: 'Invalid email or password.', //flash
    successFlash: 'You are now logged in!', //flash
}))

router.get('/logout', (req,res)=>{
    req.logout()
    req.flash('success', 'Successfully logged out! Breathe easy today.')
    res.redirect('/')
})

module.exports = router;