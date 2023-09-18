// routes/api/users.js

const express = require('express');
const router = express.Router();
const User = require('../../models/user');

// Ruta para cambiar el rol de un usuario a "premium" o "user"
router.put('/premium/:uid', async (req, res) => {
  const { uid } = req.params;
  const { newRole } = req.body;

  try {
    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (newRole === 'premium' || newRole === 'user') {
      user.role = newRole;
      await user.save();
      return res.json({ message: `Rol del usuario ${user.email} cambiado a ${newRole}.` });
    } else {
      return res.status(400).json({ message: 'El nuevo rol debe ser "premium" o "user".' });
    }
  } catch (error) {
    console.error('Error al cambiar el rol del usuario:', error);
    res.status(500).json({ message: 'Error al cambiar el rol del usuario.' });
  }
});

module.exports = router;
