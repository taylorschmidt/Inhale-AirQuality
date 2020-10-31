const express = require('express');
const app = express()
const router = express.Router()
const db = require('../models')

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
        } else {
            console.log('An account associated with that e-mail address already exists. Try logging in.')
        }
        res.redirect('/auth/login')
    })
})

router.get('/signup', (req, res)=> {
    res.render('auth/signup')
})

router.post('/login', (req,res)=> {
    console.log(req.body)
    console.log('posting to /auth/login')
    res.redirect('/')
})

module.exports = router;