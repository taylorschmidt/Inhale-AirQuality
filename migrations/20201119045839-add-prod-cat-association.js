'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addColumn(
      'journals', // name of source model
      'feeling', // name of the key we are adding
      {
        type: Sequelize.TEXT
      }
    )
  },


  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.removeColumn(
      'journals', // name of source model
      'feeling', // name of the key we are adding
      {
        type: Sequelize.TEXT
      }
    )
  }
};
