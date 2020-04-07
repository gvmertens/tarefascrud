import * as Yup from 'yup';

import Departamento from '../models/Departamento';

class DepartamentoController {
  async index(req, res) {
    const departamentos = await Departamento.findAll({
      attributes: ['id', 'nome'],
    });

    return res.json(departamentos);
  }

  async delete(req, res) {
    const { id } = req.params;

    const departamentoCadastrado = await Departamento.findByPk(id);

    if (!departamentoCadastrado) {
      return res.status(400).json({ erro: 'Departamento não encontrado!' });
    }

    departamentoCadastrado.destroy();

    return res
      .status(200)
      .json({ mensagem: 'Departamento deletado com sucesso!' });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        erro: 'O campos nome é obrigatórios para cadastro do departamento.',
      });
    }

    const departamentoCadastrado = await Departamento.findOne({
      where: { nome: req.body.nome },
    });

    if (departamentoCadastrado) {
      return res.status(400).json({ erro: 'Departamento já cadastrado!' });
    }

    const { id, nome } = await Departamento.create(req.body);

    return res.json({
      id,
      nome,
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const schema = Yup.object().shape({
      nome: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        erro: 'O campos nome é obrigatórios.',
      });
    }

    const { nome } = req.body;

    const departamentoCadastrado = await Departamento.findOne({
      where: { nome },
    });

    if (departamentoCadastrado) {
      return res.status(400).json({ erro: 'Departamento já cadastrado!' });
    }

    const departamento = await Departamento.findByPk(id);

    await departamento.update(req.body);

    return res.json({
      id,
      nome,
    });
  }
}

export default new DepartamentoController();
