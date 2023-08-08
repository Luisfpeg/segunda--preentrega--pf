const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const config = require('./config/config');
const cartsRouter = require('./routes/carts');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');

mongoose.connect(config.mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/carts', cartsRouter);
app.use('/products', productsRouter);
app.use('/auth', authRouter);

app.listen(config.port, () => {
  console.log(`Server started on port ${config.port}`);
});
