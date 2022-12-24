'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Subscriptions', {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            tenantId: {
                type: Sequelize.UUID,
                references: {
                    model: "Tenants",
                    key: "id",
                },
                allowNull: false,
            },
            planId: {
              type: Sequelize.UUID,
              references: {
                  model: "Plans",
                  key: "id",
              },
            },
            recurringPaymentId: {
                allowNull: true,
                type: Sequelize.STRING
            },
            status: {
              type: Sequelize.ENUM("pending", "active", "inactive", "suspended", "revoked", "cancelled", "expired"),
              defaultValue: "active"
            },
            trialStartDate: {
              type: Sequelize.DATE
            },
            trialEndDate: {
              type: Sequelize.DATE
            },
            subscribeAfterTrial: {
              type: Sequelize.BOOLEAN,
              defaultValue: false
            },
            dateSubscribed: {
              type: Sequelize.DATE
            },
            dateUnsubscribed: {
              type: Sequelize.DATE
            },
            paymentType: {
              type: Sequelize.ENUM("contract", "subscription"),
              defaultValue: "subscription"
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE
            },
            createdBy: {
                allowNull: true,
                type: Sequelize.UUID,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            updatedBy: {
                allowNull: true,
                type: Sequelize.UUID,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Subscriptions');
    }
};
