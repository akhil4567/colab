'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SlotExceptions', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      slotId: {
        type: Sequelize.UUID,
        references: {
          model: 'Slots',
          key: 'id'
        }
      },
      slotDateTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      exceptionDescription: {
        type: Sequelize.STRING
      },
      exceptionType: {
        type: Sequelize.ENUM('EDIT','DELETE'),
        allowNull: false
      },
      newAssignee: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      newDateTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      newDescription: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      updatedBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SlotExceptions');
  }
};