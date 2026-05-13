/*
 * @Author: water.li
 * @Date: 2024-09-08 08:59:52
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\platform-express\multer-config.service.ts
 */

import { Inject, Injectable } from "@nestjs/common";
import { MULTER_MODULE_OPTIONS } from "./constants";
import multer from "multer";
import { MulterModuleOptions } from './multer-options.interface';

@Injectable()
export class MulterConfigService {
  constructor(@Inject(MULTER_MODULE_OPTIONS) private options: MulterModuleOptions) {}
  getMulterInstance() {
    return multer(this.options);
  }
}
