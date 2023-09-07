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
const { specs, swaggerUi } = require('./swagger'); // Importa la configuración de Swagger
const User = require('./models/user');

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

// Set up session middleware
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

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

// Routes
const cartsRouter = require('./routes/carts');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const loggerTestRouter = require('./routes/loggerTest');
const usersRouter = require('./routes/api/users');

// Ruta para la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/carts', cartsRouter);
app.use('/products', productsRouter);
app.use('/auth', authRouter);
app.use('/loggerTest', loggerTestRouter);
app.use('/api/users', usersRouter);

// Start the server
app.listen(config.port, () => {
  logger.info(`Server started on port ${config.port}`);
});
