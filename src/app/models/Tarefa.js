import { Model, Sequelize } from 'sequelize';

class Tarefa extends Model {
  static init(sequelize) {
    super.init(
      {
        descricao: Sequelize.STRING,
        status: {
          type: Sequelize.ENUM,
          values: ['aberto', 'em andamento', 'finalizado'],
          defaultValue: 'aberto',
        },
        data_inicio: Sequelize.DATE,
        data_finalizacao: Sequelize.DATE,
        created_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'responsavel' });
    this.belongsTo(models.Departamento, {
      foreignKey: 'departamento_id',
      as: 'departamento',
    });
  }
}

export default Tarefa;
