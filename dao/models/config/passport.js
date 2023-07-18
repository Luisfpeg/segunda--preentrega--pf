const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Configurar la estrategia de autenticación local
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

// Configurar la estrategia de autenticación con JWT
passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'YOUR_SECRET_KEY', // Aquí debes colocar una clave secreta para la firma del token
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

// Función para generar el token JWT
function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, 'YOUR_SECRET_KEY', { expiresIn: '1h' }); // Configura el tiempo de expiración según tus necesidades
}

module.exports = { passport, generateToken };