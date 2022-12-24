"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("EmailProviders", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        allowNull: true,
        type: Sequelize.UUID,references: {
          model: "Users",
          key: "id",
        },
      },
      
      tenantId: {
        allowNull: true,
        type: Sequelize.UUID,references: {
          model: "Tenants",
          key: "id",
        },
      },
      
      name: { allowNull: true, type: Sequelize.STRING },
      email: { allowNull: false, type: Sequelize.STRING },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      refreshToken: {
        allowNull: false,
        type: Sequelize.STRING(1000),
      },
      provider: {
        allowNull: false,
        type: Sequelize.ENUM("gmail", "outlook"),
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
          model: "Users",
          key: "id",
        },
      },
      updatedBy: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
        },
      },
    }, {
      indexes: [{
          unique: true,
          fields: ['userId', 'email']
      }]
  });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("EmailProviders");
  },
};
