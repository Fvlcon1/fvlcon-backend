import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/types/@types'; // Import the payload type

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;  // Return the user with typed JwtPayload
  },
);
