import {UseInterceptors, UploadedFile,Injectable, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFiles } from '@nestjs/common';
import { Express } from 'express';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Injectable()
export class FileUpload {
    @UseInterceptors(FileInterceptor('photo'))
    uploadFile(@UploadedFile(
        new ParseFilePipe({
            validators:[
                new MaxFileSizeValidator({maxSize:1000000}),
                new FileTypeValidator({fileType:'image/'})
            ]
        })
    ) file:Express.Multer.File){
        return {filename:file.filename}
    }

    
    uploadFiles(@UploadedFiles() files:{cover:Express.Multer.File[] , images:Express.Multer.File[]}){
        const coverFilenames = files.cover.map(c => c.filename);
        const imageFilenames = files.images.map(c => c.filename);

        return {
            cover: coverFilenames,
            images: imageFilenames
        };
    }
}
