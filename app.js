const express = require('express');
const morgan = require('morgan')
const jsxEngine = require('jsx-view-engine')
const methodOverride = require('method-override')
const userRoutes = require('./controllers/auth/routeController')
// const 
const apiRoutes = require('./routes/apiRoutes')
const app = express()

app.set('view engine', 'jsx')
app.engine('jsx', jsxEngine())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use((req, res, next) => {
    res.locals.data = {}
    next()
})

app.use(express.static('public'))
app.use(morgan('dev'))

app.use('/users', userRoutes)    
app.use('/api', apiRoutes)




module.exports = app