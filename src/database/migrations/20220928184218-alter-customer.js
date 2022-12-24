module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([

        queryInterface.removeColumn("Customers", "createdBy", {
          transaction: t,
        }),
        queryInterface.removeColumn("Customers", "updatedBy", {
          transaction: t,
        }),
        queryInterface.addColumn("Customers", "createdBy",
          {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: "Users",
              key: "id",
            },
          },
          { transaction: t }
        ),
        queryInterface.addColumn("Customers", "updatedBy",
          {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: "Users",
              key: "id",
            },
          },
          { transaction: t }
        ),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([

        queryInterface.removeColumn("Customers", "createdBy", {
          transaction: t,
        }),
        queryInterface.removeColumn("Customers", "updatedBy", {
          transaction: t,
        }),
        queryInterface.addColumn("Customers", "createdBy",
          {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: "Users",
              key: "id",
            },
          },
          { transaction: t }
        ),
        queryInterface.addColumn("Customers", "updatedBy",
          {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: "Users",
              key: "id",
            },
          },
          { transaction: t }
        ),
      ]);
    });
  },
};
