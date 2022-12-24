'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Tenants', [{
            "id": "467447cb-32d6-4121-8418-345e74c50750",
            "name": "tenant ABCD 4",
            "contactName": "Contact VFX 4",
            "email": "apoorv@yopmail.com",
            "contactNumber": 9873456325,
            "status": "active",
            "parentTenantId": null,
            "type": "individual",
            "createdBy": "ff1b11fd-030e-4f0c-afe3-9b63426d8fab",
            "updatedBy": "ff1b11fd-030e-4f0c-afe3-9b63426d8fab",
            "updatedAt": "2022-08-26T14:43:29.914Z",
            "createdAt": "2022-08-26T14:43:29.914Z"
        }], {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Tenants', null, {});
    }
};