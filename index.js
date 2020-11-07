require('dotenv').config()
const express = require('express');
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')

//setup ejs and ejs layouts
app.set('view engine', 'ejs')
app.use(ejsLayouts)

//body parser middleware that makes req.body work
app.use(express.urlencoded({extended:false}))

//session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//flash middleware
app.use(flash())

//CUSTOM middleware
app.use((req,res,next)=>{
    //before evey route, attach the flash messages and current user to res.locals
    //this will give us access to these values in all of our ejs pages
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next() //move on to the next piece of middleware
})

//controllers middleware that make controllers folder work
app.use('/auth', require('./controllers/auth.js'))

app.get('/', (req,res)=> {
res.render('home')
})

app.get('/profile', isLoggedIn, (req, res)=>{
    res.render('profile')
})

app.listen(2000, ()=>{
    console.log('listening at 2000!')
})