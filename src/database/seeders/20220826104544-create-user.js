'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Users', [{
            "id": "ff1b11fd-030e-4f0c-afe3-9b63426d8fab",
            "firstName": "Seed First Name",
            "lastName": "Seed Last Name",
            "email": "apoorv@yopmail.com",
            "contactNumber": "9873456325",
            "createdBy": "ff1b11fd-030e-4f0c-afe3-9b63426d8fab",
            "updatedBy": "ff1b11fd-030e-4f0c-afe3-9b63426d8fab",
            "updatedAt": "2022-08-25T14:43:29.914Z",
            "createdAt": "2022-08-25T14:43:29.914Z"
        }], {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Users', null, {});
    }
};