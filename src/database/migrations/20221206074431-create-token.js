'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tokens', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Users',
            schema: 'public'
          },
          key: 'id'
        },
        allowNull: false,
      },
      tokenSecret: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type:{
        type: Sequelize.STRING,
        allowNull: false
      },
      expiry:{
        type: Sequelize.DATE,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      createdBy: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    updatedBy: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tokens');
  }
};