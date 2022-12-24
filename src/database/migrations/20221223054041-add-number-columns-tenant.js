module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction((t) => {
          return Promise.all([
              queryInterface.addColumn("Tenants", "voiceNumber", {
                  type: Sequelize.STRING,
                  allowNull:true
              }, { transaction: t }),
              queryInterface.addColumn("Tenants", "messageNumber", {
                type: Sequelize.STRING,
                allowNull:true
            }, { transaction: t }),
          ]);
      });
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction((t) => {
          return Promise.all([
              queryInterface.removeColumn("Tenants", "voiceNumber", {
                  transaction: t
              }),
              queryInterface.removeColumn("Tenants", "messageNumber", {
                transaction: t
            })
          ]);
      });
  },
};