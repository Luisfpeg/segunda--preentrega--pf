const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const config = require('./config/config');

// Models
const User = require('./dao/models/user');
const Cart = require('./dao/models/cart');
const Product = require('./dao/models/product');

// Configurar la conexión a MongoDB
mongoose.connect(config.mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch((error) => {
  console.error('Error al conectar a MongoDB:', error);
});

// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configurar el middleware de sesión
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));

// Configurar el middleware de Passport
passport.use(new LocalStrategy(
  async function(username, password, done) {
    try {
      const user = await User.findOne({ email: username });
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey,
  },
  async function(jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

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
app.listen(config.port, () => {
  console.log(`Servidor iniciado en el puerto ${config.port}`);
});
