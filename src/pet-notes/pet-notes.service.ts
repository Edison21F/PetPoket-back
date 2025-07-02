import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PetNotes } from '../models/schemas/pet-notes.schema';

@Injectable()
export class PetNotesService {
  constructor(
    @InjectModel(PetNotes.name)
    private petNotesModel: Model<PetNotes>,
  ) {}

  async create(createPetNoteData: any): Promise<PetNotes> {
    const newNote = new this.petNotesModel(createPetNoteData);
    return await newNote.save();
  }

  async findByPetId(petId: number): Promise<PetNotes[]> {
    return await this.petNotesModel
      .find({ petId })
      .sort({ fecha: -1 })
      .exec();
  }

  async findById(id: string): Promise<PetNotes | null> {
    return await this.petNotesModel.findById(id).exec();
  }

  async update(id: string, updateData: any): Promise<PetNotes | null> {
    return await this.petNotesModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.petNotesModel.findByIdAndDelete(id).exec();
  }

  async findAll(): Promise<PetNotes[]> {
    return await this.petNotesModel.find().sort({ fecha: -1 }).exec();
  }
}