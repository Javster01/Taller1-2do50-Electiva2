//controllers/controll-Auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';

const Usuario = require('../models/usuario');

module.exports = {
  createUsuario: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const validacion = validarUsuario(name, email, password);

      if (validacion.length === 0) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const nuevoUsuario = new Usuario({ name, email, password: hashedPassword });
        await nuevoUsuario.save();

        // Generar token
        const token = jwt.sign({ id: nuevoUsuario._id }, JWT_SECRET, {
          expiresIn: JWT_EXPIRES,
        });

        const usuarioResponse = {
          id: nuevoUsuario._id,
          name: nuevoUsuario.name,
          email: nuevoUsuario.email,
          token: token,
        };

        return res.status(201).json({ 
          status: true, 
          message: 'Usuario creado exitosamente', 
          data: usuarioResponse 
        });
      } else {
        return res.status(400).json({ status: false, errors: validacion });
      }
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const validacion = validarLogin(email, password);
      
      if (validacion.length === 0) {
        const usuario = await Usuario.findOne({ email });
        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
          return res.status(401).json({ status: false, errors: ['Credenciales inválidas'] });
        }
        
        const token = jwt.sign({ id: usuario._id }, JWT_SECRET, {
          expiresIn: JWT_EXPIRES,
        });

        const usuarioResponse = {
          id: usuario._id,
          name: usuario.name,
          email: usuario.email,
          token: token,
        };

        return res.status(200).json({ 
          status: true, 
          message: 'Inicio de sesión exitoso', 
          data: usuarioResponse 
        });
      } else {
        return res.status(400).json({ status: false, errors: validacion });
      }
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  }
};

const validarUsuario = (name, email, password) => {
  let errors = [];
  if (!name || name.trim() === '') {
    errors.push('El nombre no puede estar vacío');
  }
  if (!email || email.trim() === '') {
    errors.push('El email no puede estar vacío');
  }
  if (!password || password.trim() === '' || password.length < 8) {
    errors.push('La contraseña no puede estar vacía o tener menos de 8 caracteres');
  }
  return errors;
};

const validarLogin = (email, password) => {
  let errors = [];
  if (!email || email.trim() === '') {
    errors.push('El email no puede estar vacío');
  }
  if (!password || password.trim() === '') {
    errors.push('La contraseña no puede estar vacía');
  }
  return errors;
};