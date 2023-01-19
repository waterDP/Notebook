/*
 * @Author: water.li
 * @Date: 2023-01-19 10:53:32
 * @Description:
 * @FilePath: \Notebook\Axios\cancel\Cancel.ts
 */
import { Cancel } from "../types";
export default class implements Cancel {
  message?: string;
  constructor(message: string) {
    this.message = message;
  }
}
