import { IsDate, IsNotEmpty, IsString, IsUUID, IsUrl } from 'class-validator';

export class UrlDto {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  image_url: string;

  @IsNotEmpty()
  @IsString()
  scheduled_time: Date;

  @IsNotEmpty()
  @IsString()
  channel: string;

  @IsNotEmpty()
  @IsUUID()
  sender_id: string;
}

export class InfoDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsDate()
  scheduled_time: Date;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  channel: string;

  @IsNotEmpty()
  @IsString()
  source: string;

  @IsNotEmpty()
  @IsUrl()
  image_url?: string;
}

export class UpdateDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsDate()
  scheduled_time: Date;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  channel: string;

  @IsNotEmpty()
  @IsString()
  source: string;

  @IsNotEmpty()
  @IsUrl()
  image_url?: string;
}

export class DeleteDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class GetDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class ForceDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
