/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './interface/notes.interface';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class NoteService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(CreateNoteDto: CreateNoteDto): Promise<Note> {
    const { title, content } = CreateNoteDto;

    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_create_note($1, $2)',
        [title, content],
      );

      return result.rows[0];
    } catch (error) {
      if (error.code === 'P0001') {
        // PostgreSQL exception code for RAISE EXCEPTION
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  async findAll(): Promise<Note[]> {
    const result = await this.databaseService.query('SELECT * FROM note');
    return result.rows;
  }

  async findOne(id: number): Promise<Note> {
    const result = await this.databaseService.query(
      'SELECT * FROM note WHERE id = $1',
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return result.rows[0];
  }

  async findByTitle(title: string): Promise<Note[]> {
    const result = await this.databaseService.query(
      'SELECT * FROM note WHERE title ILIKE $1',
      [`%${title}%`],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`No note found with title "${title}"`);
    }

    return result.rows;
  }

  async findBycontent(content: string): Promise<Note[]> {
    const result = await this.databaseService.query(
      'SELECT * FROM note WHERE content ILIKE $1',
      [`%${content}%`],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`No note found by content "${content}"`);
    }

    return result.rows;
  }

  async update(id: number, UpdateNoteDto: UpdateNoteDto): Promise<Note> {
    const existingNote = await this.findOne(id);

    const { title, content } = UpdateNoteDto;
    const result = await this.databaseService.query(
      'UPDATE note SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title || existingNote.title, content || existingNote.content, id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return result.rows[0];
  }

  async remove(id: number): Promise<void> {
    const result = await this.databaseService.query(
      'DELETE FROM note WHERE id = $1 RETURNING *',
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`note with ID ${id} not found`);
    }
  }
}
