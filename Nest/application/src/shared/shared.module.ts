/*
 * @Author: water.li
 * @Date: 2024-11-22 21:33:42
 * @Description:
 * @FilePath: \Notebook\Nest\application\src\shared\shared.module.ts
 */
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from './services/configuration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { UserService } from './services/user.service';
import { IsUsernameUniqueConstraint } from './validators/user-validator';

@Global()
@Module({
  providers: [IsUsernameUniqueConstraint, ConfigurationService, UserService],
  exports: [IsUsernameUniqueConstraint, ConfigurationService, UserService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全局模块
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => ({
        type: 'mysql',
        ...configurationService.mysqlConfig,
        autoLoadEntities: true, // 自动加载实体
        synchronize: true, // 保持代码与数据库一致
        logging: true, // 输出内部生成的 SQL 语句
      }),
      imports: undefined,
    }),
    TypeOrmModule.forFeature([User]),
  ],
})
export class SharedModule {}
