import { Body, Controller, Post } from '@nestjs/common';

import { UserService } from '../services/User.service';
import { CreateUserDTO, LoginUserDTO, UserLogin } from '../types';
import {
  ControllerResponse,
  handleControllerError,
  SuccessResponse,
  validatePayload,
} from 'src/utils/response';
import { LoggingService } from 'src/modules/logging';
import { UserRecord } from 'src/modules/datasource';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggingService,
  ) {}

  @Post('login')
  async loginUser(@Body() body): Promise<ControllerResponse<UserLogin>> {
    try {
      const loginPayload = await validatePayload(LoginUserDTO, body);
      const result = await this.userService.loginUser(loginPayload.token);
      return SuccessResponse.send(result);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }

  @Post('create')
  async createUser(@Body() body): Promise<ControllerResponse<UserRecord>> {
    try {
      const userToCreate = await validatePayload(CreateUserDTO, body);
      const result = await this.userService.createUser(userToCreate);
      return SuccessResponse.send(result);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }
}
