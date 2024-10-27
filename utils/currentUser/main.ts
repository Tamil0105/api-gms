import { Injectable, Scope } from '@nestjs/common';
import { User } from 'src/entity';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserService {
    private user: User = {
        email: '',
        id: 0,
        username: "",
        phone: "",
        emailVerified:false,
        password: '',
        generateId: function (): void {
            throw new Error('Function not implemented.');
        }
    };

    get get() {
        return this.user;
    }

    set set(params: typeof this.user) {
        this.user = params;
        return;
    }
}
