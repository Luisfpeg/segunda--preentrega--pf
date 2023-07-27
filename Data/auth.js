const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../dao/models/user');
const config = require('../config/config');
const bcrypt = require('bcrypt');

// Ruta para manejar el inicio de sesión de un usuario usando sesión
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
  // Verificar si el usuario es superadmin
  if (req.user.email === config.adminEmail && req.user.password === config.adminPassword) {
    // Si el inicio de sesión es exitoso para el superadmin, generamos y enviamos el token JWT
    const token = jwt.sign({ id: req.user._id }, config.secretKey, { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // Guardamos el token en una cookie (configura el tiempo de expiración según tus necesidades)
    res.redirect('/');
  } else {
    // Si no es superadmin, lo redirigimos a la página de inicio de sesión con un mensaje de error
    req.flash('error', 'Acceso no autorizado.');
    res.redirect('/login');
  }
});

module.exports = router;
