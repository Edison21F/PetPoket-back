import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserProfile } from '../models/schemas/user-profile.schema';

@Injectable()
export class UserProfilesService {
  constructor(
    @InjectModel(UserProfile.name)
    private userProfileModel: Model<UserProfile>,
  ) {}

  async create(userId: number, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const existingProfile = await this.userProfileModel.findOne({ userId });
    
    if (existingProfile) {
      return this.update(userId, profileData);
    }

    const newProfile = new this.userProfileModel({
      userId,
      ...profileData,
    });

    return await newProfile.save();
  }

  async findByUserId(userId: number): Promise<UserProfile | null> {
    return await this.userProfileModel.findOne({ userId }).exec();
  }

  async update(userId: number, updateData: Partial<UserProfile>): Promise<UserProfile> {
    const profile = await this.userProfileModel.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    ).exec();

    return profile;
  }

  async delete(userId: number): Promise<void> {
    const result = await this.userProfileModel.deleteOne({ userId }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException('Perfil de usuario no encontrado');
    }
  }

  async findAll(): Promise<UserProfile[]> {
    return await this.userProfileModel.find().exec();
  }
}