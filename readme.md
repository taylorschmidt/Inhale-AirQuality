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


1. Fork and Clone
2. Install dependencies
(npm i)
3. Create a config.json with the following code:
```
{
  "development": {
    "database": "insert db name here",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "database": "insert db name here",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "database": "insert db name here",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```
4. Create a database (sequelize db:create (insert db name here))
5. Migrate the `user` model to your database.
```
sequelize db:migrate
```
6. Add a 'SESSION_SECRET' environment variable in a `.env` file (can be any string)

7. Run `nodemon` to start up app.