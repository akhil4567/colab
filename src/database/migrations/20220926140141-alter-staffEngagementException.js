module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn("StaffEngagementExceptions", "duration", {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }, { transaction: t }),
                queryInterface.addColumn("StaffEngagementExceptions", "meetingMode", {
                    type: Sequelize.ENUM('AUDIO', 'VIDEO', 'IN-PERSON'),
                    allowNull: true,
                }, { transaction: t }),
                queryInterface.addColumn("StaffEngagementExceptions", "videoMeetingProvider", {
                    type: Sequelize.STRING,
                    allowNull: true,
                }, { transaction: t }),
                queryInterface.addColumn("StaffEngagementExceptions", "meetingLocation", {
                    type: Sequelize.STRING,
                    allowNull: true,
                }, { transaction: t }),
            ]);
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn("StaffEngagementExceptions", "duration", {
                    transaction: t,
                }),
                queryInterface.removeColumn("StaffEngagementExceptions", "meetingMode", {
                    transaction: t,
                }),
                queryInterface.removeColumn("StaffEngagementExceptions", "videoMeetingProvider", {
                    transaction: t,
                }),
                queryInterface.removeColumn("StaffEngagementExceptions", "meetingLocation", {
                    transaction: t,
                }),
            ]);
        });
    },
};