module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "Users",
          "lastLoggedTenantId",
          {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: "Tenants",
              key: "id",
            },
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "Users",
          "outlookId",
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "Users",
          "googleId",
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "Users",
          "refreshToken",
          {
            type: Sequelize.STRING(1000),
            allowNull: true,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "Users",
          "emailVerified",
          {
            type: Sequelize.BOOLEAN,
            default: false,
          },
          { transaction: t }
        ),
        queryInterface.changeColumn(
          "Users",
          "email",
          {
            type: Sequelize.STRING,
            unique: true,
          },
          { transaction: t }
        ),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("Users", "lastLoggedTenantId", {
          transaction: t,
        }),
        queryInterface.removeColumn("Users", "outlookId", {
          transaction: t,
        }),
        queryInterface.removeColumn("Users", "googleId", {
          transaction: t,
        }),
        queryInterface.removeColumn("Users", "refreshToken", {
          transaction: t,
        }),
        queryInterface.removeColumn("Users", "emailVerified", {
          transaction: t,
        }),
        queryInterface.changeColumn(
          "Users",
          "email",
          {
            type: Sequelize.STRING,
          },
          { transaction: t }
        ),
      ]);
    });
  },
};
