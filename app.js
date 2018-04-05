
var express = require('express');
var mongoose = require('mongoose')


var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

var bodyparser = require('body-parser');
var cors = require('cors')
var path = require('path')

//add 

const imagesRoutes = require('./routes/images');
const uploadRoutes = require('./routes/upload');
const searchRoutes = require('./routes/search');
const categoryRoutes = require('./routes/category');
const appRoutes = require('./routes/app');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');

//connect to mongodb
mongoose.connect('mongodb://localhost:27017/buddybid');

//on connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database buddybid 27017');
});

mongoose.connection.on('error', (err) => {
  if (err) {
    console.log('Error in database connection' + err);
  }
});

const port = 3000;

//adding middleware - cors
app.use(cors());

//body-parser

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//static files
app.use(express.static(path.join(__dirname, 'public')));

//Routes

app.use('/images', imagesRoutes);
app.use('/upload', uploadRoutes);
app.use('/', searchRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/user', userRoutes);
app.use('/', appRoutes);

//testing Server

app.listen(port, () => {
  console.log('Express server started at port:' + port);
});



