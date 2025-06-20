/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './interface/notes.interface';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class NoteService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    try {
      const createdAt = createNoteDto.createdAt ?? new Date().toISOString();
      const result = await this.databaseService.query(
        'SELECT * FROM sp_create_note($1, $2, $3)',
        [createNoteDto.title, createNoteDto.content, createdAt],
      );

      if (!result.rows[0]) {
        throw new InternalServerErrorException('Failed to create note');
      }

      return result.rows;
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new ConflictException('Note already exists');
      }
      console.error('Create note error:', error);
      throw new InternalServerErrorException('Failed to create note');
    }
  }

  async findAll(): Promise<Note[]> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_notes()',
      );
      return result.rows;
    } catch {
      throw new InternalServerErrorException('Failed to retrieve notes');
    }
  }

  async findOne(id: number): Promise<Note> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM note WHERE id = $1',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }

      return result.rows;
    } catch {
      if (Error instanceof Error && Error.message.includes('not found')) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to retrieve note');
    }
  }

  async update(id: number, UpdateNoteDto: UpdateNoteDto): Promise<Note> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_update_by_id($1, $2, $3, $4)',
        [
          id,
          UpdateNoteDto.title || null,
          UpdateNoteDto.content || null,
          UpdateNoteDto.createdAt || null,
        ],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }

      return result.rows;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          throw new NotFoundException(error.message);
        }
        if (error.message.includes('already exists')) {
          throw new ConflictException(error.message);
        }
      }

      throw new InternalServerErrorException('Failed to update note');
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_delete_by_id($1)',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }

      return result.rows;
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to delete note');
    }
  }
}
