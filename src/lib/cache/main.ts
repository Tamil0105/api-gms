import { Injectable } from "@nestjs/common";
import { LRUCache } from "lru-cache";

@Injectable()
export class CacheService {

    private cache = new LRUCache({
        max: 1000,
        allowStale: false,
        updateAgeOnGet: false,
        updateAgeOnHas: false,
        ttl: 60 * 60 * 1000
    });

    get<T>(key: string): T {
        return this.cache.get(key) as T;
    }

    set({ key, payload }: { key: string, payload: any; }): void {
        this.cache.set(key, payload);
    }

}