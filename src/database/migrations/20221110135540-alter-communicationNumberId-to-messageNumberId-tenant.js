module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction((t) => {
          return Promise.all([
              queryInterface.renameColumn("Tenants", "communicationNumberId", "messageNumberId",
               { transaction: t }),
              queryInterface.addColumn("Tenants", "voiceNumberId", {
                  type: Sequelize.UUID,
                  allowNull: true,
              }, { transaction: t }),
          ]);
      });
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction((t) => {
        return Promise.all([
          queryInterface.renameColumn("Tenants", "messageNumberId", "communicationNumberId",
           { transaction: t }),
          queryInterface.removeColumn("Tenants", "voiceNumberId",
           { transaction: t }),
      ]);
      });
  },
};