module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'cargo', {
      type: Sequelize.ENUM,
      values: ['Administrador', 'Agente'],
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'cargo');
  },
};
