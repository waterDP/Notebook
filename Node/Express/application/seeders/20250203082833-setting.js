'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Settings', [{
      name: '长乐未央',
      icp: '鄂ICP备13016268号-11',
      copyright: '© 2013 Changle Weiyang Inc. All Rights Reserved.',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Settings', null, {});
  }
};
