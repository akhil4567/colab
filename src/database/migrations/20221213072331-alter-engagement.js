module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction((t) => {
          return Promise.all([
              queryInterface.addColumn("Engagements", "calendarEventId",{
                type: Sequelize.STRING, 
                allowNull: true,
              },
               { transaction: t }),
              queryInterface.addColumn("Engagements", "calendarProvider", {
                  type: Sequelize.STRING,
                  allowNull: true,
              }, { transaction: t }),
          ]);
      });
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction((t) => {
        return Promise.all([
          queryInterface.removeColumn("Engagements", "calendarEventId",
           { transaction: t }),
          queryInterface.removeColumn("Engagements", "calendarProvider",
           { transaction: t }),
      ]);
      });
  },
};