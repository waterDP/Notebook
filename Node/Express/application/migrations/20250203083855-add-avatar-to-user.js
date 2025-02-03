/*
 * @Author: water.li
 * @Date: 2025-02-03 16:38:55
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\migrations\20250203083855-add-avatar-to-user.js
 */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'avatar', {
      type: Sequelize.STRING
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'avatar')
  }
};
