# Express Auth Boilerplate

* create a node app
* touch .gitignore
* npm i express
* set up index.js with 
    const express = require('express');
    const app = express()
    app.listen(2000, ()=>{
        console.log('listening at 2000!')
    })
* create controllers folder with an auth.js file
* add middleware for controllers in index.js:
    app.use('/auth', require('./controllers/auth.js'))
* create views folder and appropriate ejs files
* enable ejs in index.js with this code:
    const ejsLayouts = require('express-ejs-layouts')
    app.set('view engine', 'ejs')
    app.use(ejsLayouts)
* res.render appropriate ejs files
* make forms in ejs files
* enable form middleware in index.js by coding the following:
    app.use(express.urlencoded({extended:false}))
* add req.body to post routes to test the forms
* install sequelize and pg with "npm i sequelize pg"
* initialize sequelize with "sequelize init"
* create new model
