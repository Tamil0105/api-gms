import { Global, Module } from "@nestjs/common";
import { CacheService } from "./main";

@Global()
@Module({
    providers: [CacheService],
    exports: [CacheService]
})
export class CacheModule { }


