// routes/admin.js
const express = require('express');
const router = express.Router();
const Usuario = require('../modelos/usuario');

// Ruta para la vista de administración de usuarios
router.get('/users', async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, 'nombre email rol');
    res.render('admin/users', { usuarios });
  } catch (error) {
    res.status(500).send('Error al obtener usuarios para la administración');
  }
});

// Ruta para la vista de edición de usuario
router.get('/users/edit/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.render('admin/editUser', { usuario });
  } catch (error) {
    res.status(500).send('Error al obtener usuario para la edición');
  }
});

// Ruta para actualizar la información del usuario
router.put('/users/edit/:id', async (req, res) => {
  try {
    // Implement logic to update user information
    // Example: const updatedUser = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect('/admin/users');
  } catch (error) {
    res.status(500).send('Error al actualizar la información del usuario');
  }
});

// Ruta para eliminar un usuario
router.delete('/users/delete/:id', async (req, res) => {
  try {
    const deletedUser = await Usuario.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.redirect('/admin/users');
  } catch (error) {
    res.status(500).send('Error al eliminar el usuario');
  }
});

module.exports = router;
