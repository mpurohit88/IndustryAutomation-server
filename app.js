const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const userRouter = require('./server/routes/user');
const productRouter = require('./server/routes/product');
const companyRouter = require('./server/routes/company');
const quoteRouter = require('./server/routes/quote');
const customerRouter = require('./server/routes/customer');
const authRouter = require('./server/routes/auth');

app.use(bodyParser.json());

app.use(helmet());

app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

// Set up mongoose connection
const mongoDB = "mongodb://mukesh:dhrDG!421@foodbox-shard-00-00-ogufn.mongodb.net:27017,foodbox-shard-00-01-ogufn.mongodb.net:27017,foodbox-shard-00-02-ogufn.mongodb.net:27017/foodbox?ssl=true&replicaSet=foodbox-shard-0&authSource=admin&retryWrites=true";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/company', companyRouter);
app.use('/api/quote', quoteRouter);
app.use('/api/customer', customerRouter);
app.use('/api/auth', authRouter);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

var port = process.env.PORT || 3001;

app.set('port', port);
app.listen(port);