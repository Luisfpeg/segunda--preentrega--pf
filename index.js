// index.js
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const logger = require('./config/logging');
const config = require('./config/config');
const User = require('./models/user'); 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paymentRouter = require('./Data/payment');
app.use('/payment', paymentRouter);
const userApiRoutes = require('./routes/userApiRoutes');
const adminRoutes = require('./routes/admin');


// Configure MongoDB connection
mongoose.connect(config.mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  logger.info('Connected to MongoDB');
}).catch((error) => {
  logger.error('Error connecting to MongoDB:', error);
});

// Set up view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set up session middleware
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// Use the admin routes
app.use('/admin', adminRoutes);

// Set up Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set up connect-flash for flash messages
app.use(flash());

// Middleware to add the current user to all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Error handler middleware
app.use((err, req, res, next) => {
  logger.error(`An error occurred: ${err.message}`);
  res.status(500).send('An error occurred');
});

// Use the new user API routes
app.use('/api/users', userApiRoutes);

// Routes
const cartsRouter = require('./routes/carts');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const loggerTestRouter = require('./routes/loggerTest');
const usersRouter = require('./routes/api/users'); 

app.use('/carts', cartsRouter);
app.use('/products', productsRouter);
app.use('/auth', authRouter);
app.use('/loggerTest', loggerTestRouter);
app.use('/api/users', usersRouter); 
app.listen(config.port, () => {
  console.log(`Servidor iniciado en el puerto ${config.port}`);
});

// Stripe payment processing route
app.post('/process-payment', async (req, res) => { 
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000, // Monto en centavos
    currency: 'usd',
  });

  res.json({ client_secret: paymentIntent.client_secret });
}); 

// Start the server
app.listen(config.port, () => {
  console.log(`Servidor iniciado en el puerto ${config.port}`);
});
