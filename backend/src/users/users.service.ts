import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(userData: {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
      role: userData.role || UserRole.QA_AUDITOR,
    });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findAuditors(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: UserRole.QA_AUDITOR, isActive: true }
    });
  }
}