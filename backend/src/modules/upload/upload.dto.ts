import { ApiProperty } from '@nestjs/swagger';

export class CreateUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  file: Express.Multer.File;
}
