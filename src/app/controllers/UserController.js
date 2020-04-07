import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async index(req, res) {
    const usuarios = await User.findAll({
      attributes: ['id', 'nome', 'email', 'administrador'],
    });

    return res.json(usuarios);
  }

  async delete(req, res) {
    const { id } = req.params;

    const usuarioCadastrado = await User.findByPk(id);

    if (!usuarioCadastrado) {
      return res.status(400).json({ erro: 'Usuário não encontrado!' });
    }

    usuarioCadastrado.destroy();

    return res.status(200).json({ mensagem: 'Usuário deletado com sucesso!' });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        erro:
          'Os campos nome, email e senha são obrigatórios e a senha deve conter no minimo 6 caracteres.',
      });
    }

    const usuarioCadastrado = await User.findOne({
      where: { email: req.body.email },
    });

    if (usuarioCadastrado) {
      return res.status(400).json({ erro: 'E-mail já cadastrado!' });
    }

    const { id, nome, email, administrador } = await User.create(req.body);

    return res.json({
      id,
      nome,
      email,
      administrador,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email(),
      oldpassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldpassword', (oldpassword, field) =>
          oldpassword ? field.required() : field
        ),
      confirmpassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        erro:
          'Os campos nome, email e senha são obrigatórios e a senha deve conter no minimo 6 caracteres.',
      });
    }

    const { email, oldpassword } = req.body;

    const usuario = await User.findByPk(req.userId);

    // Validade se o novo email informado já não existe na base
    if (email && email !== usuario.email) {
      const usuarioCadastrado = await User.findOne({
        where: { email },
      });

      if (usuarioCadastrado) {
        return res.status(400).json({ erro: 'E-mail já cadastrado!' });
      }
    }

    // Verificar se a senha antiga está correta, para atualizar a nova caso esteja trocando a senha
    if (oldpassword && !(await usuario.validaSenha(oldpassword))) {
      return res.status(401).json({ erro: 'Senha antiga incorreta!' });
    }

    const { id, nome, administrador } = await usuario.update(req.body);

    return res.json({
      id,
      nome,
      email,
      administrador,
    });
  }
}

export default new UserController();
