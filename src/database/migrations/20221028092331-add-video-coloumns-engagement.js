'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction((t) => {
          return Promise.all([
              queryInterface.addColumn("Engagements", "videoProvider", {
                  type: Sequelize.STRING,
                  allowNull: true
              }, { transaction: t }),
              queryInterface.addColumn("Engagements", "videolocation", {
                type: Sequelize.STRING,
                allowNull: true
            }, { transaction: t }),
          ]);
      });
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction((t) => {
          return Promise.all([
              queryInterface.removeColumn("Engagements", "videoProvider", {
                  transaction: t
              }),
              queryInterface.removeColumn("Engagements", "videolocation", {
                transaction: t
            })
          ]);
      });
  },
};