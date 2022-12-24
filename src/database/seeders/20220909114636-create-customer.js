'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Customers', [{
            "id": "67e9e41b-31cf-44c0-b889-cca05d922bb6",
            "firstName": "Seed First Name",
            "middleName": "Seed Middle Name",
            "lastName": "Seed Last Name",
            "customerType": "Seed Customer type",
            "gender": "male",
            "dateOfBirth": "05/04/1997",
            "contactNumber": "9873456325",
            "email": "apoorv@yopmail.com",
            "addressLine1": "Seed addressLine1",
            "addressLine2": "Seed addressLine2",
            "city": "Mumbai",
            "country": "India",
            "zipcode": "403514",
            "additionalData": null,
            "tenantId": "467447cb-32d6-4121-8418-345e74c50750",

            "createdBy": "ff1b11fd-030e-4f0c-afe3-9b63426d8fab",
            "updatedBy": "ff1b11fd-030e-4f0c-afe3-9b63426d8fab",
            "updatedAt": "2022-08-30T14:43:29.914Z",
            "createdAt": "2022-08-30T14:43:29.914Z"
        }], {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Customers', null, {});
    }
};