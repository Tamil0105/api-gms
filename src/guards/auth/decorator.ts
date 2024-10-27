import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '../auth/main';

export function Authenticate() {
    return applyDecorators(UseGuards(AuthGuard));
}
