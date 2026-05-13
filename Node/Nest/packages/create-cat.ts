/*
 * @Author: water.li
 * @Date: 2024-09-01 13:37:33
 * @Description:
 * @FilePath: \Notebook\Nest\src\create-cat.schema.ts
 */
import { z } from "zod";

export const createCatSchema = z
  .object({
    name: z.string(),
    age: z.number(),
  })
  .required();

export type CreateCatDto = z.infer<typeof createCatSchema>