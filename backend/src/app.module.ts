import { Global, Module } from '@nestjs/common';
import { UploadModule } from './modules/upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';

@Global()
@Module({
  imports: [
    UploadModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  exports: [MulterModule],
})
export class AppModule {}
