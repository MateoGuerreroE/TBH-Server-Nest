import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { LoggingService } from 'src/modules/logging';
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
  logger: LoggingService,
): FResponse {
  if (e instanceof CustomError) {
    logger.debug(e.message);
    throw new BadRequestException({ message: e.message });
  }
  throw new BadRequestException({
    message: (e as Error).message ?? 'An unexpected error occurred',
  });
}

export async function validatePayload<T extends object>(
  dtoClass: new () => T,
  payload: unknown,
  allowUnknownProperties = false,
): Promise<T> {
  const instance = plainToInstance(dtoClass, payload);
  const errors = await validate(instance, {
    whitelist: !allowUnknownProperties,
    forbidNonWhitelisted: !allowUnknownProperties,
  });

  if (errors.length > 0) {
    const formattedErrors: string[] = [];
    if (errors[0].children instanceof ValidationError) {
      const errorList = errors[0].children[0].children.map(
        (child) => `${Object.values(child.constraints).join('')}`,
      );
      formattedErrors.push(...errorList);
    } else {
      const errorList = errors.map(
        (e) => `${Object.values(e.constraints).join('')}`,
      );
      formattedErrors.push(...errorList);
    }

    throw new ControllerError(
      'Validation failed',
      `${formattedErrors.join(', ')}`,
    );
  }
  return instance;
}
