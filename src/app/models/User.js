import { Model, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        administrador: Sequelize.BOOLEAN,
        cargo: {
          type: Sequelize.ENUM,
          values: ['Administrador', 'Agente'],
        },
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  validaSenha(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
