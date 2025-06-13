import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { NoteService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './interface/notes.interface';
import { ApiResponse } from '../shared/api-response.interface';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateNoteDto): Promise<ApiResponse<Note>> {
    try {
      const note = await this.noteService.create(data);
      return {
        success: true,
        message: 'Note created successfully',
        data: note,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get()
  async findAll(): Promise<ApiResponse<Note[]>> {
    try {
      const note = await this.noteService.findAll();
      return {
        success: true,
        message: 'Note retrieved successfully',
        data: note,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve note',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<Note>> {
    try {
      const note = await this.noteService.findOne(id);
      return {
        success: true,
        message: `Note with ID ${id} retrieved successfully`,
        data: note,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to retrieve note with ID ${id}`,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('search')
  async findByTitle(
    @Query('title') title: string,
  ): Promise<ApiResponse<Note[]>> {
    try {
      const note = await this.noteService.findByTitle(title);
      return {
        success: true,
        message: `Note with title "${title}" retrieved successfully`,
        data: note,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to retrieve note with title  "${title}"`,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateNoteDto,
  ): Promise<ApiResponse<Note>> {
    try {
      const updatedNote = await this.noteService.update(id, data);
      return {
        success: true,
        message: `Book updated successfully`,
        data: updatedNote,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to update note with ID ${id}`,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<{ message: void }>> {
    try {
      const result = await this.noteService.remove(id);
      return {
        success: true,
        message: `Note with ID ${id} deleted successfully`,
        data: { message: result },
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to delete note with ID ${id}`,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
