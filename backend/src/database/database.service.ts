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
    await this.seedUsers();
  }

  private async seedUsers() {
    try {
      // Check if users already exist
      const existingUsers = await this.userRepository.count();
      if (existingUsers > 0) {
        console.log('Users already exist in PostgreSQL, skipping seed');
        return;
      }

      // Create test users
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

      console.log('Database seeded with test users in PostgreSQL');
    } catch (error) {
      console.error('Error seeding PostgreSQL database:', error);
    }
  }
}