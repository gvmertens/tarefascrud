import * as Yup from 'yup';
import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

import Tarefa from '../models/Tarefa';
import User from '../models/User';
import Departamento from '../models/Departamento';

class TarefaController {
  async index(req, res) {
    const where = {};

    if (req.query.user_id) {
      where.user_id = req.query.user_id;
    }
    if (req.query.departamento_id) {
      where.departamento_id = req.query.departamento_id;
    }
    if (req.query.status) {
      where.status = req.query.status;
    }
    if (req.query.descricao) {
      where.descricao = { [Op.like]: `%${req.query.descricao}%` };
    }

    if (req.query.data_criacao) {
      const { date } = req.query.data_criacao;
      const parsedDate = parseISO(date);
      where.created_at = {
        [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
      };
    }

    if (req.query.data_inicio) {
      const { date } = req.query.data_inicio;
      const parsedDate = parseISO(date);
      where.data_inicio = {
        [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
      };
    }

    if (req.query.data_finalizacao) {
      const { date } = req.query.data_finalizacao;
      const parsedDate = parseISO(date);
      where.data_finalizacao = {
        [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
      };
    }

    const { page = 1 } = req.query;
    const order = req.query.order ? req.query.order : 'id';
    const direction = req.query.direction ? req.query.direction : 'ASC';

    const Tarefas = await Tarefa.findAll({
      where,
      limit: 3,
      offset: (page - 1) * 3,
      attributes: ['descricao', 'status'],
      include: [
        {
          model: User,
          as: 'responsavel',
          attributes: ['nome', 'email'],
        },
        {
          model: Departamento,
          as: 'departamento',
          attributes: ['nome'],
        },
      ],
      order: [[`"${order}"`, `${direction}`]],
    });

    return res.json(Tarefas);
  }

  async delete(req, res) {
    const { id } = req.params;

    const TarefaCadastrado = await Tarefa.findByPk(id);

    if (!TarefaCadastrado) {
      return res.status(400).json({ erro: 'Tarefa não encontrada!' });
    }

    TarefaCadastrado.destroy();

    return res.status(200).json({ mensagem: 'Tarefa deletada com sucesso!' });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      descricao: Yup.string().required().min(10),
      user_id: Yup.number().required().positive().integer(),
      departamento_id: Yup.number().required().positive().integer(),
      status: Yup.mixed().oneOf(['aberto', 'em andamento', 'finalizado']),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        erro:
          'O campos descrição(min 10 caracteres), responsável e departamento são obrigatórios para cadastro do Tarefa.',
      });
    }

    const { user_id, departamento_id } = req.body;

    const usuarioCadastrado = await User.findByPk(user_id);

    if (user_id && !usuarioCadastrado) {
      return res
        .status(400)
        .json({ erro: 'Usuário associado a tarefa não encontrado!' });
    }

    const departamentoCadastrado = await Departamento.findByPk(departamento_id);

    if (departamento_id && !departamentoCadastrado) {
      return res
        .status(400)
        .json({ erro: 'Departamento associado a tarefa não encontrado!' });
    }

    const tarefa = await Tarefa.create(req.body);

    return res.json(tarefa);
  }

  async update(req, res) {
    const { id } = req.params;
    const schema = Yup.object().shape({
      descricao: Yup.string(),
      user_id: Yup.number().positive().integer(),
      departamento_id: Yup.number().positive().integer(),
      status: Yup.mixed().oneOf(['aberto', 'em andamento', 'finalizado']),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        erro: 'Falha na validação dos campos obrigatórios.',
      });
    }

    const tarefaCadastrado = await Tarefa.findByPk(id);

    if (!tarefaCadastrado) {
      return res.status(400).json({ erro: 'Tarefa não cadastrada!' });
    }

    await tarefaCadastrado.update(req.body);

    return res.json({
      tarefaCadastrado,
    });
  }
}

export default new TarefaController();
