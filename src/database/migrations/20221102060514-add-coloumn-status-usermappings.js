module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn("UserMappings", "status", {
                    type: Sequelize.ENUM("active", "inactive"),
                    defaultValue: "active"
                }, { transaction: t }),
            ]);
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn("UserMappings", "status", {
                    transaction: t
                })
            ]);
        });
    },
};