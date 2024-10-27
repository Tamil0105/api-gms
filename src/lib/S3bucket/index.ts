import { Global, Module } from '@nestjs/common';
import { StorageService } from './main';
import { StorageServiceS3 } from './s3';

@Global()
@Module({
    providers: [StorageService,StorageServiceS3],
    exports: [StorageService,StorageServiceS3],
})
export class S3StorageServiceModule {}
    