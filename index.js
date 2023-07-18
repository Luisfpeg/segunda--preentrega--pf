const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./config/passport'); // Importar la configuración de Passport
const User = require('./models/user'); // Importar el modelo User
const Cart = require('./models/cart'); // Importar el modelo Cart
const Product = require('./models/product'); // Importar el modelo Product
const path = require('path');
const bodyParser = require('body-parser'); // Importar bodyParser para parsear el cuerpo de las solicitudes
const flash = require('connect-flash'); // Importar connect-flash para mostrar mensajes flash

// Configurar la conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch((error) => {
  console.error('Error al conectar a MongoDB:', error);
});

// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar el middleware de sesión
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// Configurar el middleware de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configurar el middleware de connect-flash para mostrar mensajes flash
app.use(flash());

// Middleware para agregar el usuario actual a todas las vistas
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Configurar las rutas
const cartsRouter = require('./routes/carts');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');

app.use('/carts', cartsRouter);
app.use('/products', productsRouter);
app.use('/auth', authRouter);

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});