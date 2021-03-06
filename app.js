const http = require('http')
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const helmet = require('helmet');
const cors = require('cors');

const app = express();

const userRouter = require('./server/routes/user');
const productRouter = require('./server/routes/product');
const companyRouter = require('./server/routes/company');
const quoteRouter = require('./server/routes/quote');
const customerRouter = require('./server/routes/customer');
const quoteProductRouter = require('./server/routes/quoteProduct');
const emailRouter = require('./server/routes/email');
const schedulerRouter = require('./server/routes/scheduler');
const customerContactRouter = require('./server/routes/customerContact');
const activityTaskHistRouter = require('./server/routes/activityTaskHist');
const taskEmailRouter = require('./server/routes/taskEmail');
const emailLogRouter = require('./server/routes/emailLog');
const currencyTypeRouter = require('./server/routes/currencyType');
const reminderRouter = require('./server/routes/reminder');
const termConditionRouter = require('./server/routes/termCondition');
const marketingRouter = require('./server/routes/marketing');
const authRouter = require('./server/routes/auth');

app.use(bodyParser.json());

app.use(helmet());

app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/company', companyRouter);
app.use('/api/quote', quoteRouter);
app.use('/api/customer', customerRouter);
app.use('/api/quoteProduct', quoteProductRouter);
app.use('/api/email', emailRouter);
app.use('/api/scheduler', schedulerRouter);
app.use('/api/customerContact', customerContactRouter);
app.use('/api/activityTaskHist', activityTaskHistRouter);
app.use('/api/taskEmail', taskEmailRouter);
app.use('/api/currencyType', currencyTypeRouter);
app.use('/api/emailLog', emailLogRouter);
app.use('/api/reminder', reminderRouter);
app.use('/api/termCondition', termConditionRouter);
app.use('/api/marketing', marketingRouter);
app.use('/api/auth', authRouter);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = http.createServer(app)
server.listen(process.env.PORT || 3000, function onListen() {
  const address = server.address()
  console.log('Listening on: %j', address)
  console.log(' -> that probably means: http://localhost:%d', address.port)
})