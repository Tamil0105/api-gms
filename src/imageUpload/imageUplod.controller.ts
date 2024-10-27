import { Controller, Delete, FileTypeValidator, Injectable, MaxFileSizeValidator, ParseFilePipe, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageUploadService } from "./imageUpload.service";

@Controller('/api/v1/image-upload')

export class ImageUploadController{
    constructor(private readonly IMG: ImageUploadService) {}


 @Post('')
  @UseInterceptors(FileInterceptor('file'))

  async getProfileUploadUrl(
    @Query() param:{folderKey:string},
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ 
            fileType: /image\/(jpeg|png|jpg|gif)|video\/(mp4|avi|mov|mkv)/ 
          })                   ,
           new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 50 }), // Max file size set to 50MB
        ],
        exceptionFactory: (errors:any) => {
          // Customize the error message for file validation
          const errorMessages = errors.map(err => {
            if (err instanceof FileTypeValidator) {
              return 'Invalid file type. Only JPEG, PNG, JPG, and GIF are allowed.';
            }
            if (err instanceof MaxFileSizeValidator) {
              return 'File size exceeds the maximum limit of 5MB.';
            }
            return 'File validation error.';
          });
          return new Error(errorMessages.join(' '));
        }
      }),
    )
    file: any, // File type defined using Express Multer
  ): Promise<any> { // Return type is Promise<any>, but you can replace 'any' with the correct type if known.
    try {
      // Log to ensure file is parsed correctly
      console.log(file);
  
      // If file is undefined, throw an error
      if (!file) {
        throw new Error('File upload failed: No file provided.');
      }
  
      // Call your profile upload service with the file
      return await this.IMG.createImage({ file,folderKey:param.folderKey });
  
    } catch (err) {
      // Handle any other errors
      console.error('Error during file upload:', err.message);
      throw new Error('An error occurred during file upload. Please try again later.');
    }
  }

  
  @Put('/')
  @UseInterceptors(FileInterceptor('file'))
  async updatetImageUploadUrl(
    @Query() param:{oldKey:string,folderKey:string},
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ 
            fileType: /image\/(jpeg|png|jpg|gif)|video\/(mp4|avi|mov|mkv)/ 
          })   ,          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // Max file size set to 5MB
        ],
        exceptionFactory: (errors:any) => {
          // Customize the error message for file validation
          const errorMessages = errors.map(err => {
            if (err instanceof FileTypeValidator) {
              return 'Invalid file type. Only JPEG, PNG, JPG, and GIF are allowed.';
            }
            if (err instanceof MaxFileSizeValidator) {
              return 'File size exceeds the maximum limit of 5MB.';
            }
            return 'File validation error.';
          });
          return new Error(errorMessages.join(' '));
        }
      }),
    )
    file: any // File type defined using Express Multer
  ): Promise<any> { // Return type is Promise<any>, but you can replace 'any' with the correct type if known.
    try {
      // Log to ensure file is parsed correctly
      console.log(file,param.oldKey);
  const oldKey = param.oldKey
  const folderKey = param.oldKey
      // If file is undefined, throw an error
      if (!file) {
        throw new Error('File upload failed: No file provided.');
      }
  
      // Call your profile upload service with the file
      return await this.IMG.updateImage({ file,oldKey,folderKey});
  
    } catch (err) {
      // Handle any other errors
      console.error('Error during file upload:', err.message);
      throw new Error('An error occurred during file upload. Please try again later.');
    }
  }
  
  @Delete('')
  async deleteProfile(@Query() params: { fileKey: string ,folderKey:string}) {
    console.log(params)
    return await this.IMG.deleteImage(params);
  }
}
