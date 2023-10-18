// userApiRoutes.js
const express = require('express');
const router = express.Router();
const Usuario = require('../modelos/usuario');
const { enviarCorreo } = require('../utilidades/correo');

router.delete('/', async (req, res) => {
    try {
        const tiempoInactivo = 2 * 24 * 60 * 60 * 1000; // 2 días en milisegundos
        const fechaLimite = new Date(Date.now() - tiempoInactivo);

        const usuariosEliminados = await Usuario.deleteMany({ ultimoAcceso: { $lt: fechaLimite } });

        // Enviar correos a los usuarios eliminados
        usuariosEliminados.forEach(usuario => {
            enviarCorreo(usuario.email, 'Cuenta eliminada por inactividad', 'Tu cuenta ha sido eliminada por inactividad.');
        });

        res.json({ mensaje: 'Usuarios eliminados correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar usuarios inactivos' });
    }
});

module.exports = router;
