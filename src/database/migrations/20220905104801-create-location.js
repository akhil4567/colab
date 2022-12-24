"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Locations", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      tenantId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "Tenants",
            schema: "public",
          },
          key: "id",
        },
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      locationLogitude: {
        type: Sequelize.STRING,
      },
      locationLatitude: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      unit: {
        type: Sequelize.STRING,
      },
      street: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      zipcode: {
        type: Sequelize.STRING,
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: "Users",
            schema: "public",
          },
          key: "id",
        },
      },
      updatedBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: "Users",
            schema: "public",
          },
          key: "id",
        },
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Locations");
  },
};
