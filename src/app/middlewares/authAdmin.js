import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/authConfig';

import User from '../models/User';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Usuário não autenticado.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;

    const usuario = await User.findByPk(req.userId);
    console.log(`ADM: ${usuario.administrador}`);
    if (!usuario.administrador) {
      return res.status(401).json({
        erro: 'Usuário sem permissão para acessar esta funcionalidade.',
      });
    }

    return next();
  } catch (err) {
    return res.status(401).json({ erro: 'Usuário não autenticado.' });
  }
};
