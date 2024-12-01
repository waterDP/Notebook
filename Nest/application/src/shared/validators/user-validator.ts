/*
 * @Author: water.li
 * @Date: 2024-12-01 21:38:04
 * @Description:
 * @FilePath: \Notebook\Nest\application\src\shared\validators\user-validator.ts
 */

import { applyDecorators, Injectable, Type } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator, IsBoolean, IsEmail, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Repository } from "typeorm";
import { User } from "../entities/user.entities";

@Injectable()
@ValidatorConstraint({ name: 'startsWith', async: false })
class StartsWithConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const { constraints } = validationArguments;
    return typeof value === 'string' && value.startsWith(constraints[0]);
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    const { property, constraints } = validationArguments;
    return `${property} must start with ${constraints[0]}`;
  }
}

export function StartsWith(
  prefix: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [prefix], // 传递给验证器的参数
      validator: StartsWithConstraint,
    });
  };
}

@Injectable()
@ValidatorConstraint({ name: 'startsWith', async: true })
class IsUsernameUniqueConstraint implements ValidatorConstraintInterface {
  // ?
  constructor(@InjectRepository(User) protected repository: Repository<User>) {}
  async validate(value: any, validationArguments?: ValidationArguments) {
    // 查询数据库是否存在用户名记录
    const result = await this.repository.findOneBy({ username: value });
    return !result;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    const { property, value } = validationArguments;
    return `${property} ${value} is already exists`;
  }
}

export function IsUsernameUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [], // 传递给验证器的参数
      validator: IsUsernameUniqueConstraint,
    });
  };
}

export function PasswordValidators() {
  return applyDecorators(IsString(), MinLength(6), MaxLength(8));
}

export function MobileValidators() {
  return applyDecorators(IsEmail(), IsOptional());
}

export function EmailValidators() {
  return applyDecorators(IsEmail(), IsOptional());
}
export function StatusValidators() {
  return applyDecorators(
    IsNumber(),
    IsOptional(),
    Type(() => Number),
  );
}

export function IsSuperValidators() {
  return applyDecorators(
    IsBoolean(),
    IsOptional(),
    Type(() => Boolean),
  );
}

export function SortValaidators() {
  return applyDecorators(
    IsNumber(),
    IsOptional(),
    Type(() => Number),
  );
}
