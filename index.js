require('dotenv').config()
const express = require('express');
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')
const axios = require('axios')

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

//show route with axios api
app.get('/show', (req,res)=> {
    console.log(req.query.long)
    let searchLat = req.query.lat 
    let searchLong = req.query.long 
    axios.get(`https://api.breezometer.com/air-quality/v2/current-conditions?lat=${searchLat}&lon=${searchLong}&key=74bb9e59084046568b581405e452edb7&features=breezometer_aqi,local_aqi,health_recommendations,sources_and_effects,pollutants_concentrations,pollutants_aqi_information`)
    .then((response)=>{
        let aqi = response.data.data.indexes.baqi.aqi
        res.render('show', {aqi: aqi})


        // res.send(response.data)
    })
    .catch(err=>{
        console.log('API error:', err)
    })
})

app.get('/profile', isLoggedIn, (req, res)=>{
    res.render('profile')
})

app.listen(3000, ()=>{
    console.log('listening at 3000!')
})