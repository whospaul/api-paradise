import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsInt()
  role: number;

  @IsNotEmpty()
  @IsUUID()
  sender_id: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
