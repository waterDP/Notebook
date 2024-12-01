/*
 * @Author: water.li
 * @Date: 2024-12-01 19:28:38
 * @Description:
 * @FilePath: \Notebook\Nest\application\src\shared\dtos\user.dto.ts
 */


import { EmailValidators, IsSuperValidators, IsUsernameUnique, MobileValidators, PasswordValidators, SortValaidators, StartsWith, StatusValidators } from '../validators/user-validator';

export class CreateUserDto {
  @StartsWith('user_')
  @IsUsernameUnique()
  username: string;
  @PasswordValidators()
  password: string;
  @MobileValidators()
  mobile: string;
  @EmailValidators()
  emile: string;
  @StatusValidators()
  status: number;
  @IsSuperValidators()
  is_super: boolean;
  @SortValaidators()
  sort: number;
}
export class UpdateUserDto extends CreateUserDto {
  id: number;
}