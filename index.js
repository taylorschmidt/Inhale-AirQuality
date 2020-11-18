//global variables
require('dotenv').config()
const express = require('express');
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')
const axios = require('axios')
let db = require('./models');


//setup ejs and ejs layouts
app.set('view engine', 'ejs')
app.use(ejsLayouts)

//set up style.css
app.use(express.static('public'))

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
    let searchZip = req.query.zip 
    axios.get(`https://www.zipcodeapi.com/rest/1uuXmYig9EYOlED4Xvk1QF7mpLfFXzzR7aNijQPIrwletSFWfFgrkSDSHt6yrAxJ/info.json/${searchZip}/degrees`)
    .then((response)=> {
        console.log("HELLOOOOO", response)
        let city = response.data.city
        let lat = response.data.lat
        let long = response.data.lng
        axios.get(`https://api.breezometer.com/air-quality/v2/current-conditions?lat=${lat}&lon=${long}&key=74bb9e59084046568b581405e452edb7&features=breezometer_aqi,local_aqi,health_recommendations,sources_and_effects,pollutants_concentrations,pollutants_aqi_information&metadata=true`)
    .then((response)=>{
        let data = response.data
        res.render('show', {data: data, lat:lat, long:long, searchZip:searchZip, city:city})
    })
    .catch(err=>{
        console.log('API error:', err)
    })
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
    db.location.findOrCreate({
        where: {
        userId: req.user.id,
        zip: req.body.zip,
        latitude: req.body.latitude,
        longitude: req.body.longitude
        }
      })
    .then((post) => {
      res.redirect('/profile')
    })
    .catch((error) => {
        console.log('error posting to database', error)
    })
})


/////////////////GET JOURNAL ROUTE INCL. DELETE JOURNAL ROUTE//////////////
app.get('/profile/journal', isLoggedIn, (req, res)=>{
        db.location.findAll({
            where: {
                userId: req.user.id,
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
    let deleteTitle = req.query.title
    let deleteContent = req.query.content
    db.journal.destroy({
         where: {
                userId: req.user.id,
                title: deleteTitle,
                content: deleteContent
        }
    }).then(numRowsDeleted=>{
        console.log('Rows Deleted:', numRowsDeleted)
        res.redirect('/profile/journal')
    })
        .catch(err=>{
            console.log('ERROR HERE:', err)
        })
    })
})
   
///////////////POST AND MODIFY JOURNAL ENTRIES ROUTE/////////////////
app.post('/profile/journal', isLoggedIn, (req, res) => {
    let latz = req.body.latz

//finds the location where the journal is trying to add
db.location.findOrCreate({
    where:{
        userId: req.user.id, zip: latz
    }
}).then(function([location, created]) {
    db.journal.findOrCreate({
        where: {title: req.body.title, content: req.body.content, userId: req.user.id, zip: latz, feeling: req.body.feeling}
        //adds journal to that location, creating locationId in the journals model
    }).then(function([journal,created]){
        location.addJournal(journal).then(function(relationInfo) {
            console.log(journal.title, "added to", location.zip)
        })
        res.redirect('/profile/journal')
    })
})
    //UPDATE: modify the actual journal database
    let newTitle = req.body.newTitle
    let newContent = req.body.newContent
    let journalId = req.body.journalId
    let newFeeling = req.body.feeling
    db.journal.update({
        title: newTitle,
        content: newContent,
        feeling: newFeeling
    } , {
        where: {
            id: journalId
        }
    }).then(numRowsChanged=>{
        console.log('Rows Modified', numRowsChanged)
        res.redirect('/profile/journal')
    })
    .catch((error) => {
        console.log('error posting journal to database', error)
    })
})

/////////////////////UPDATE JOURNAL ROUTE//////////////////
app.get('/profile/journal/modify', isLoggedIn, (req,res)=>{
    let modifyTitle = req.query.title
    let modifyContent = req.query.content
    db.journal.findOne({
        where: {
            title: modifyTitle,
            content: modifyContent
        }
    })
    .then(foundJournal=>{
        res.render('updateJournal', {foundJournal, foundJournal})
    })
})

///////////POLLUTANTS INFO ROUTES////////////
app.get('/co', (req,res)=> {
    res.render('info/co')
})

app.get('/no2', (req,res)=> {
    res.render('info/no2')
})

app.get('/o3', (req,res)=> {
    res.render('info/o3')
})

app.get('/pm10', (req,res)=> {
    res.render('info/pm10')
})

app.get('/so2', (req,res)=> {
    res.render('info/so2')
})




/////////////////PORT////////////////
app.listen(process.env.PORT, ()=>{
    console.log('listening at port you chose!')
})