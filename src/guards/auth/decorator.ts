import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/main';

export function Authenticate() {
    return applyDecorators(UseGuards(AuthGuard));
}
