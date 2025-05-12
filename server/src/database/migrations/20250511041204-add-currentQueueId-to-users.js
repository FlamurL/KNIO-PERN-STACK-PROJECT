'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'currentQueueId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Admin',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Optional: Add an index for the foreign key
    await queryInterface.addIndex('Users', ['currentQueueId'], {
      name: 'Users_currentQueueId_fk',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'currentQueueId');
    await queryInterface.removeIndex('Users', 'Users_currentQueueId_fk'); // Optional: Remove index in down
  },
};
