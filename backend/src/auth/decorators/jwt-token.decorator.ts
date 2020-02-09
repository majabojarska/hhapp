import { ReflectMetadata, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const JwtToken = createParamDecorator((data, req: Request) => {
  return /.*Bearer *(\S+)$/.exec(req.headers.authorization)[1];
});
