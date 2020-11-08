require('dotenv').config()
const express = require('express');
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')
const axios = require('axios')
let db = require('./models')

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

//////////////////////HOME ROUTE/////////////////////
app.get('/', (req,res)=> {
res.render('home')
})

//////////////////////SHOW ROUTE - AXIOS/////////////////////////
app.get('/show', (req,res)=> {
    console.log('HERE ARE PARAMS', req.params)
    let searchLat = req.query.lat 
    let searchLong = req.query.long 
    axios.get(`https://api.breezometer.com/air-quality/v2/current-conditions?lat=${searchLat}&lon=${searchLong}&key=74bb9e59084046568b581405e452edb7&features=breezometer_aqi,local_aqi,health_recommendations,sources_and_effects,pollutants_concentrations,pollutants_aqi_information&metadata=true`)
    .then((response)=>{
        let data = response.data
        res.render('show', {data: data, searchLat:searchLat, searchLong:searchLong})
    
    })
    .catch(err=>{
        console.log('API error:', err)
    })
})

/////////////////////PROFILE ROUTE////////////////////////
app.get('/profile', isLoggedIn, (req, res)=>{
    db.location.findAll({
        where: {
            userId: req.user.id
        }
    })
    .then(favorites => {
        res.render('profile.ejs', {favorites: favorites});
      })
    let deleteLat = req.query.latitude
    let deleteLong = req.query.longitude
    db.location.destroy({
        where: {
            userId: req.user.id,
            latitude: deleteLat,
            longitude: deleteLong
        }
    }).then(numRowsDeleted=>{
        console.log('Rows Deleted:', numRowsDeleted)
    })
})

 
///////////////POST FAVORITE LOCATIONS ROUTE/////////////////
app.post('/profile', isLoggedIn, (req, res) => {
    db.location.create({
      userId: req.user.id,
      latitude: req.body.latitude,
      longitude: req.body.longitude
    })
    .then((post) => {
      res.redirect('/profile')
    })
    .catch((error) => {
        console.log('error posting to database', error)
    })
  })


///////////JOURNAL ROUTE//////////////
app.get('/profile/journal', isLoggedIn, (req, res)=>{
        db.location.findAll({
            where: {
                userId: req.user.id
            }
        })
        .then(location=>{
            db.journal.findAll({
                where: {
                    userId: req.user.id
                   },
                include: [db.location]
               })
        .then(journal=>{
            res.render('journal', {location: location, journal:journal})
        })
    })
        .catch(err=>{
            console.log('ERROR HERE:', err)
        })
    })

   
///////////////POST JOURNAL ENTRIES ROUTE/////////////////
// app.post('/profile/journal', isLoggedIn, (req, res) => {
//     db.journal.create({
//       userId: req.user.id,
//       //location id?
//       title: req.body.title,
//       content: req.body.content
//     })
//     .then((post) => {
//       res.redirect('/profile/journal')
//     })
//     .catch((error) => {
//         console.log('error posting journal to database', error)
//     })
//   })
app.post('/profile/journal', isLoggedIn, (req, res) => {
    db.journal.create({
      userId: req.user.id,
      //location id?
      title: req.body.title,
      content: req.body.content
    })
    .then((post) => {
      res.redirect('/profile/journal')
    })
    .catch((error) => {
        console.log('error posting journal to database', error)
    })
  })


/////////////////PORT////////////////
app.listen(3000, ()=>{
    console.log('listening at 3000!')
})