/*
 * @Author: water.li
 * @Date: 2025-02-05 22:01:32
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\seeders\20250205140132-course.js
 */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Courses', [
      {
        categoryId: 1,
        userId: 1,
        name: 'CSS 入门',
        recommended: true,
        introductory: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        categoryId: 2,
        userId: 1,
        name: 'Node.js 项目实践（2024 版）',
        recommended: true,
        introductory: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Courses', null, {});
  }
};
