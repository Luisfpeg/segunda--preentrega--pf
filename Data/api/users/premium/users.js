// routes/api/users.js

const express = require('express');
const router = express.Router();
const User = require('../../models/user');

// Ruta para cambiar el rol de un usuario a "premium" o "user"
router.put('/:uid', async (req, res) => {
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

router.param('id', async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', (req, res) => {
  res.render('user', { user: req.user });
});

router.put('/:id', async (req, res) => {
  try {
    const { role } = req.body;

    if (!['admin', 'premium', 'regular'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    await User.updateOne({_id: req.user.id}, {role: role});
    res.json({ ...req.user._doc, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await User.deleteOne({_id: req.user.id});
    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
