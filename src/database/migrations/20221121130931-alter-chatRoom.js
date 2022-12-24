"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn("ChatRooms", "tenantId", {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: "Tenants",
              key: "id",
            },
          },
          { transaction: t }
        ),
        queryInterface.removeColumn("ChatRooms", "isChannel", {
          transaction: t,
        }),
        queryInterface.addColumn("ChatRooms", "isChannel", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
          },
          { transaction: t }
        ),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("ChatRooms", "tenantId", {
          transaction: t,
        }),
        queryInterface.removeColumn("ChatRooms", "isChannel", {
          transaction: t,
        }),
      ]);
    });
  },
};
