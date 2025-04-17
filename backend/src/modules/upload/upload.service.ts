import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { CreateUploadDto } from './upload.dto';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { Upload } from 'src/types/modules/upload';
import { createReadStream } from 'fs';

@Injectable()
export class UploadService {
  route = join(process.cwd(), 'src', 'database', 'uploads.txt');

  async create({ file }: CreateUploadDto) {
    try {
      const { originalname, mimetype, path } = file;

      const fileExists = await this.getAllFromFile();

      const content = JSON.stringify({
        originalname,
        mimetype,
        path,
        id: fileExists ? fileExists.length + 1 : 1,
      });

      writeFile(this.route, `${content}\n`, { flag: 'a+' });
      return file;
    } catch (err) {
      throw new BadRequestException(`Error trying to upload the file: ${err}`);
    }
  }

  async getAllFromFile() {
    const data = await readFile(this.route, 'utf-8').catch(() => {
      return false;
    });

    if (!data) return [];

    const arr = data
      .toString()
      .split('\n')
      .filter((item) => item)
      .map((item) => JSON.parse(item) as Upload);
    return arr;
  }

  async findOne(id: number) {
    const uploads = await this.getAllFromFile();

    if (uploads.length === 0) {
      throw new NotFoundException('No uploads found');
    }

    const found = uploads.find((u) => u.id === id);

    if (!found) {
      throw new NotFoundException('Upload not found');
    }

    const { path, originalname, mimetype: type } = found;

    const file = createReadStream(path);

    return new StreamableFile(file, {
      type,
      disposition: `inline; filename=${originalname}`,
    });
  }
}
