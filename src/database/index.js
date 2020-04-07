import Sequelize from 'sequelize';

// importação dos modelos
import User from '../app/models/User';
import Departamento from '../app/models/Departamento';
import Tarefa from '../app/models/Tarefa';

import databaseConfig from '../config/database';

const models = [User, Departamento, Tarefa];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map((model) => model.init(this.connection));
    models.map(
      (model) => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
