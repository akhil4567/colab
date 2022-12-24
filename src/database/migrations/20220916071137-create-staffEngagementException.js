'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StaffEngagementExceptions', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      staffEngagementId: {
        type: Sequelize.UUID,
        references: {
          model: 'StaffEngagements',
          key: 'id'
        }
      },
      oldDateTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      exceptionDescription: {
        type: Sequelize.STRING
      },
      exceptionType: {
        type: Sequelize.ENUM('EDIT','CANCELLED'),
        allowNull: false
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
  async down(queryInterface) {
    await queryInterface.dropTable('StaffEngagementExceptions');
  }
};