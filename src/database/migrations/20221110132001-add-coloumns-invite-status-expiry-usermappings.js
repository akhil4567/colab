module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn("UserMappings", "inviteStatus", {
                    type: Sequelize.STRING,
                    allowNull:true
                }, { transaction: t }),
                queryInterface.addColumn("UserMappings", "inviteExpiry", {
                  type: Sequelize.DATE,
                  allowNull:true

              }, { transaction: t }),
            ]);
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn("UserMappings", "inviteStatus", {
                    transaction: t
                }),
                queryInterface.removeColumn("UserMappings", "inviteExpiry", {
                  transaction: t
              })
            ]);
        });
    },
  };