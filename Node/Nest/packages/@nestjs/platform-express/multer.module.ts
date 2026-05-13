import { DynamicModule, Module } from "@nestjs/common";
import { MulterModuleOptions } from "./multer-options.interface";
import { MulterConfigService } from "./multer-config.service";
import { MULTER_MODULE_OPTIONS } from "./constants"

@Module({})
export class MulterModule {
  static register(options: MulterModuleOptions): DynamicModule {
    return {
      module: MulterModule,
      providers: [
        {
          provide: MULTER_MODULE_OPTIONS,
          useService: options,
        },
        MulterConfigService,
      ],
      exports: [MulterConfigService],
    };
  }
}
