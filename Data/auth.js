const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../dao/models/user');
const config = require('../config/config');
const bcrypt = require('bcrypt');



// Ruta para manejar el inicio de sesión de un usuario
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
  // Actualiza la propiedad "last_connection" al iniciar sesión
  if (req.user) {
    req.user.last_connection = new Date();
    await req.user.save();
  }

  res.redirect('/');
});

// Ruta para cerrar sesión
router.get('/logout', async (req, res) => {
  // Actualiza la propiedad "last_connection" al cerrar sesión
  if (req.user) {
    req.user.last_connection = new Date();
    await req.user.save();
  }

  req.logout();
  res.redirect('/login');
});

module.exports = router;

