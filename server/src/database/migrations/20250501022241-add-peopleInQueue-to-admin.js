'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Admin', 'peopleInQueue', {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to `false` if the column should not allow null values
      defaultValue: 0, // Optional: Set a default value, e.g., 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Admin', 'peopleInQueue');
  },
};
