const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

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

// Configurar el middleware de sesión
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// Configurar el middleware de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configurar la estrategia de autenticación local
passport.use(new LocalStrategy(
  async function (username, password, done) {
    try {
      const user = await User.findOne({ username: username });
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

// Configurar la estrategia de autenticación de GitHub
passport.use(new GitHubStrategy({
  clientID: 'YOUR_GITHUB_CLIENT_ID',
  clientSecret: 'YOUR_GITHUB_CLIENT_SECRET',
  callbackURL: 'YOUR_GITHUB_CALLBACK_URL'
},
function(accessToken, refreshToken, profile, done) {
  // Lógica para autenticar con GitHub
  // ...
}));

// Serializar y deserializar al usuario en la sesión
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
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
