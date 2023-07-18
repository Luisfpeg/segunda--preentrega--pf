const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const User = require('../models/user');

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Ruta para manejar el registro de un nuevo usuario
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });
    await user.save();
    res.redirect('/login');
  } catch (error) {
    res.status(500).send('Error al registrar el usuario');
  }
});

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login');
});

// Ruta para manejar el inicio de sesión de un usuario usando sesión
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
  // Si el inicio de sesión es exitoso, generamos y enviamos el token JWT
  const token = passport.generateToken(req.user);
  res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // Guardamos el token en una cookie (configura el tiempo de expiración según tus necesidades)
  res.redirect('/');
});

// Ruta para manejar el inicio de sesión de un usuario usando JWT
router.post('/login-jwt', passport.authenticate('local', { session: false }), (req, res) => {
  // Si el inicio de sesión es exitoso, generamos y enviamos el token JWT
  const token = passport.generateToken(req.user);
  res.json({ token });
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie('jwt');
  res.redirect('/login');
});

// Ruta para obtener el usuario actual usando sesión
router.get('/current', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Usuario no autenticado' });
  }
});

// Ruta para obtener el usuario actual usando JWT (estrategia 'current')
router.get('/current-jwt', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});

module.exports = router;
