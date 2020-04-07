import Tarefa from '../models/Tarefa';
import User from '../models/User';
import Departamento from '../models/Departamento';

const moment = require('moment');

class IndicadorController {
  async index(req, res) {
    const where = {};

    if (req.query.user_id) {
      where.user_id = req.query.user_id;
    } else if (req.query.departamento_id) {
      where.departamento_id = req.query.departamento_id;
    } else {
      return res
        .status(400)
        .json({ erro: 'Nenhum critério de busca informado!' });
    }

    const tarefas = await Tarefa.findAll({
      where,
      attributes: [
        'descricao',
        'status',
        'data_inicio',
        'data_finalizacao',
        'created_at',
      ],
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
    });

    let qtdade = 0;
    let somaDiasCadIni = 0;
    let qtdeDiasCadIni = 0;
    let somaDiasIniFim = 0;
    let qtdeDiasIniFim = 0;
    let qtdadeTarefasAbertas = 0;
    let qtdadeTarefasAndamento = 0;
    let qtdadeTarefasFinalizada = 0;

    for (let i = 0; i < tarefas.length; i++) {
      qtdade += 1;
      if (tarefas[i].data_inicio !== null) {
        const criacao = moment(tarefas[i].created_at);
        const inicio = moment(tarefas[i].data_inicio);
        const duration = moment.duration(inicio.diff(criacao));
        somaDiasCadIni += duration.asDays();
        qtdeDiasCadIni += 1;
      }
      if (tarefas[i].data_inicio !== null && tarefas[i].data_finalizacao) {
        const inicio = moment(tarefas[i].data_inicio);
        const finalizacao = moment(tarefas[i].data_finalizacao);
        const duration = moment.duration(finalizacao.diff(inicio));
        somaDiasIniFim += duration.asDays();
        qtdeDiasIniFim += 1;
      }

      switch (tarefas[i].status) {
        case 'aberto':
          qtdadeTarefasAbertas += 1;
          break;
        case 'em andamento':
          qtdadeTarefasAndamento += 1;
          break;
        case 'finalizado':
          qtdadeTarefasFinalizada += 1;
          break;
        default:
          break;
      }
    }
    const mediaDiasEntreCadastroInicio = somaDiasCadIni / qtdeDiasCadIni;
    const mediaDiasEntreInicioFim = somaDiasIniFim / qtdeDiasIniFim;

    return res.json({
      qtdade,
      mediaDiasEntreCadastroInicio,
      mediaDiasEntreInicioFim,
      qtdadeTarefasAbertas,
      qtdadeTarefasAndamento,
      qtdadeTarefasFinalizada,
    });
  }
}

export default new IndicadorController();
