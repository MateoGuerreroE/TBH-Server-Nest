import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/datasource';
import { BusinessError, CustomError } from 'src/types';
import { err, ok, Result } from 'neverthrow';
import { FirebaseService } from './Firebase.service';
import { LoggingService } from 'src/modules/logging';
import { JwtService } from './Jwt.service';
import { ICreateUser, IUserLoginData, IUserRecord } from 'tbh-shared-types';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly firebaseService: FirebaseService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggingService,
  ) {}

  async getUserById(userId: string): Promise<IUserRecord | null> {
    this.logger.debug(`Fetching user with ID: ${userId}`);
    return this.userRepository.getUserById(userId);
  }

  async getUserByEmailAddress(
    emailAddress: string,
  ): Promise<Result<IUserRecord, string>> {
    this.logger.debug(`Fetching user with email: ${emailAddress}`);
    const user = await this.userRepository.getUserByEmailAddress(emailAddress);
    if (!user) {
      return err('User not found');
    }
    return ok(user);
  }

  async updateUser(
    userData: Partial<IUserRecord> & { userId: string },
  ): Promise<string | null> {
    this.logger.debug(`Updating user with ID: ${userData.userId}`);
    const user = await this.userRepository.updateUser(userData);
    if (!user) {
      throw new BusinessError('User not found', 'Unable to update user');
    }
    return this.userRepository.updateUser(userData);
  }

  async createUser(userToCreate: ICreateUser): Promise<IUserRecord> {
    const { emailAddress, firebaseId } = userToCreate;
    const existentUser =
      await this.userRepository.getUserByEmailAddress(emailAddress);

    if (existentUser) {
      if (existentUser.firebaseId || !userToCreate.firebaseId) {
        throw new BusinessError(
          'Unable to create user',
          'Email already exists',
        );
      }

      this.logger.debug(
        `User existed as visitor, updating firebaseId: ${firebaseId}`,
      );
      const result = await this.userRepository.updateUser({
        userId: existentUser.userId,
        firebaseId,
      });

      return this.userRepository.getUserById(result);
    }

    return this.userRepository.createUser(userToCreate);
  }

  async loginUser(token: string): Promise<IUserLoginData> {
    try {
      this.logger.debug(`Attempting to log user with token: ${token}`);
      const firebaseUser = await this.firebaseService.verifyToken(token);
      const userEmail = firebaseUser.email;
      if (!userEmail)
        throw new BusinessError(
          'Unable to login',
          'User Email not found on firebase auth',
        );

      const userRecord =
        await this.userRepository.getUserByEmailAddress(userEmail);
      if (!userRecord) {
        throw new BusinessError('Unable to login', 'User record not found');
      }

      this.verifyUser(userRecord);

      await this.userRepository.updateUser({
        userId: userRecord.userId,
        lastLoginAt: new Date(),
      });

      const { token: userToken, expiration } =
        this.jwtService.signUserData(userRecord);

      return {
        emailAddress: userRecord.emailAddress,
        entityId: userRecord.userId,
        role: 'user',
        fullName: `${userRecord.firstName} ${userRecord.lastName}`,
        token: userToken,
        expiration: new Date(Date.now() + expiration * 1000).toISOString(),
      };
    } catch (e) {
      const message = (e as Error).message ?? 'Unable to login';
      const cause = (e as CustomError).cause ?? 'Unknown';
      this.logger.debug(`${message}: ${cause}`);
      throw new BusinessError(message, cause);
    }
  }

  private verifyUser(user: IUserRecord): Result<boolean, string> {
    if (!user.isEmailVerified) return err('Email not verified');
    if (!user.isEnabled) return err('User not found');
    return ok(true);
  }
}
