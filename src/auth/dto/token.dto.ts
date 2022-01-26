/* eslint-disable */

import { IsString, IsNotEmpty} from "class-validator";

export class TokenDto {

  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string
}
