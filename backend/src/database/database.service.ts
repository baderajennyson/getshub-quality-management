import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    // Only seed if migrations haven't already created the data
    await this.seedUsersIfNeeded();
  }

  private async seedUsersIfNeeded() {
    try {
      // Check if users already exist (from migrations or previous seeding)
      const existingUsers = await this.userRepository.count();
      if (existingUsers > 0) {
        console.log('Users already exist, skipping additional seeding');
        return;
      }

      console.log('No users found, seeding initial users...');
      await this.createInitialUsers();
    } catch (error) {
      console.error('Error in database seeding:', error);
      // Don't throw error - let app continue even if seeding fails
    }
  }

  private async createInitialUsers() {
    const users = [
      {
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        email: 'admin@getshub.com',
        firstName: 'Super',
        lastName: 'Admin',
        role: UserRole.SUPER_ADMIN,
      },
      {
        username: 'manager1',
        password: await bcrypt.hash('admin123', 10),
        email: 'manager@getshub.com',
        firstName: 'John',
        lastName: 'Manager',
        role: UserRole.MANAGER,
      },
      {
        username: 'auditor1',
        password: await bcrypt.hash('admin123', 10),
        email: 'auditor@getshub.com',
        firstName: 'Jane',
        lastName: 'Auditor',
        role: UserRole.QA_AUDITOR,
      },
    ];

    for (const userData of users) {
      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);
    }

    console.log('Initial users seeded successfully');
  }
}