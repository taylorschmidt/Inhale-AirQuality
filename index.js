const express = require('express');
const app = express()
const ejsLayouts = require('express-ejs-layouts')

//setup ejs and ejs layouts
app.set('view engine', 'ejs')
app.use(ejsLayouts)

//body parser middleware that makes req.body work
app.use(express.urlencoded({extended:false}))

app.use('/auth', require('./controllers/auth.js'))

app.get('/', (req,res)=> {
    res.send('Express Auth Home Route')
})

app.listen(2000, ()=>{
    console.log('listening at 2000!')
})