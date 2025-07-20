import { Injectable } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { DataSourceClient } from '../DataSourceClient';
import { CreateUserData, UpdateUserData, UserRecord } from '../types/access';
import * as schema from '../schema/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserRepository {
  private client: NeonHttpDatabase<typeof schema>;
  constructor(private readonly datasource: DataSourceClient) {
    this.client = this.datasource.getClient();
  }

  async getAllUsers(): Promise<UserRecord[]> {
    return this.client.query.userTable.findMany({
      with: {
        updater: {},
      },
    });
  }

  async getUserById(userId: string): Promise<UserRecord | null> {
    return this.client.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.userId, userId),
    });
  }

  async getUserByEmailAddress(
    emailAddress: string,
  ): Promise<UserRecord | null> {
    return this.client.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.emailAddress, emailAddress),
    });
  }

  async createUser(userToCreate: CreateUserData): Promise<UserRecord> {
    const result = await this.client
      .insert(schema.userTable)
      .values(userToCreate)
      .returning();
    return result[0];
  }

  async updateUser(userToUpdate: UpdateUserData): Promise<string | null> {
    const { userId, ...updates } = userToUpdate;

    const update = await this.client
      .update(schema.userTable)
      .set(updates)
      .where(eq(schema.userTable.userId, userId))
      .returning({ userId: schema.userTable.userId });

    return update.length ? update[0].userId : null;
  }

  async changeUserAccess(
    userId: string,
    admin: string, // MUST BE ADMIN
    disable: boolean,
  ): Promise<string | null> {
    const update = await this.client
      .update(schema.userTable)
      .set({
        isEnabled: disable,
        deletedAt: disable ? new Date() : null,
        updatedBy: disable ? admin : null,
      })
      .where(eq(schema.userTable.userId, userId))
      .returning({ userId: schema.userTable.userId });

    return update.length ? update[0].userId : null;
  }
}
