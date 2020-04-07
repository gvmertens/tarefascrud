import jwt from 'jsonwebtoken';
import authConfig from '../../config/authConfig';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const usuario = await User.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não cadastrado!' });
    }

    if (!(await usuario.validaSenha(password))) {
      return res.status(401).json({ erro: 'Usuário/Senha incorretos!' });
    }

    const { id, nome, administrador } = usuario;

    return res.json({
      user: {
        id,
        nome,
        administrador,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
