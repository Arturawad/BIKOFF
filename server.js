const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const session = require('express-session')

const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(session({secret: '962473Kk', resave: false, saveUninitialized: false}))
app.set('view engine', 'ejs')
app.set('views', './public/views')

async function connectToDb() {
    try {
        const connect = await MongoClient.connect('mongodb+srv://artur:2007@cluster0.ezeapwz.mongodb.net/bykoff-db?retryWrites=true&w=majority&appName=Cluster0')
        const db = connect.db('bykoff-db')
        return db
    } catch(err) {
        console.log(`An error occurred while connecting to the database: ${err}`)
        return null
    }
}

app.get('/', async (req, res) => {
    try {
        res.render('index')
    } catch(err) {
        console.log(`An error occurred while processing the Middleware: ${err}`)
    }
})

app.get('/menu', (req, res) => {
    try {
        res.render('menu')
    } catch(err) {
        console.log(`An error occurred while processing the Middleware: ${err}`)
    }
})

app.get('/delivery', (req, res) => {
    try {
        res.render('delivery')
    } catch(err) {
        console.log(`An error occurred while processing the Middleware: ${err}`);
    }
})

app.get('/action', (req, res) => {
    try {
        res.render('action')
    } catch(err) {
        console.log(`An error occurred while processing the Middleware: ${err}`);
    }
})

app.get('/about', (req, res) => {
    try {
        res.render('about')
    } catch(err) {
        console.log(`An error occurred while processing the Middleware: ${err}`);
    }
})

app.get('/reviews', (req, res) => {
    try {
        res.render('reviews')
    } catch(err) {
        console.log(`An error occurred while processing the Middleware: ${err}`);
    }
})

app.get('/contacts', (req, res) => {
    try {
        res.render('contacts')
    } catch(err) {
        console.log(`An error occurred while processing the Middleware: ${err}`);
    }
})

app.get('/getDataProducts', async (req, res) => {
    try {
        const categoryFind = req.query.categoryFind || null
        const viewFilterSearch = req.query.viewFilter || null
        
        if (!categoryFind) {
            res.json({error: 'Category is not fined'})
            // ToDo Сделать обработку ошибки на клиенте об отсутствии товаров по заданным параметрам
            return
        }
        
        const filterParams = {}
        
        if (categoryFind) {
            filterParams.category = categoryFind
        }
        if (viewFilterSearch) {
            filterParams.view_filter = viewFilterSearch
        }

        const db = await connectToDb()
        const dataProducts = await db.collection('products').find(filterParams).toArray()
    
        if (dataProducts.length === 0) {
            res.json({error: 'Category is not fined'})
            // ToDo Сделать обработку ошибки на клиенте об отсутствии товаров по заданным параметрам
            return
        }
    
        res.json({dataProducts: dataProducts})
    } catch(err) {
        console.log(`An error occurred while processing the Middleware: ${err}`);
    }
})

app.get('/getDataProductsTag', async (req, res) => {
    try {
        const filterSearch = req.query.filter ? req.query.filter : {}

        const db = await connectToDb()
        const dataProducts = await db.collection('products_popular').find({"tag": filterSearch}, {projection: {_id: 0}}).limit(9).toArray()
        res.json({dataProducts: dataProducts})
    } catch(err) {
        console.log(`An error occurred while processing the Middleware: ${err}`);
    }
})

app.use((req, res) => {
    res.status(404).render('404')
})

app.listen(3000, () => console.log('Server started on the port: 3000'))