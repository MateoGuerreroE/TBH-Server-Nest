import { LoggerService } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ControllerError, CustomError } from 'src/types';

interface SResponse<T> {
  data: T;
}
interface FResponse {
  error: string;
}

export class SuccessResponse {
  static send<T>(payload: T): SResponse<T> {
    return { data: payload };
  }
}

export class FailedResponse {
  static send(payload: string): FResponse {
    return { error: payload };
  }
}

export type ControllerResponse<T> = SResponse<T> | FResponse;

export function handleControllerError(
  e: unknown,
  logger: LoggerService,
): FResponse {
  if (e instanceof CustomError) {
    logger.debug(e.cause);
    return FailedResponse.send(e.message);
  }
  return FailedResponse.send((e as Error).message ?? 'Unknown error');
}

export async function validatePayload<T extends object>(
  dtoClass: new () => T,
  payload: unknown,
): Promise<T> {
  const instance = plainToInstance(dtoClass, payload);
  const errors = await validate(instance, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    const formatted = errors.map(
      (e) => `${Object.values(e.constraints).join('')}`,
    );

    throw new ControllerError('Validation failed', `${formatted.join(', ')}`);
  }
  return instance;
}
