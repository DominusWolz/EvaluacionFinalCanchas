// src/middlewares/isAdmin.js
module.exports = function isAdmin(req, res, next) {
  if (req.user && req.user.email === 'pikachu234@gmail.com') {
    return next();
  }
  
  return res.status(403).json({ 
    error: true, 
    message: 'Acceso denegado: Solo el administrador puede realizar esta acción', 
    code: 'FORBIDDEN' 
  });
};