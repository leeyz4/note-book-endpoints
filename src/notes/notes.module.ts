import { Module } from '@nestjs/common';
import { NoteService } from './notes.service';
import { NoteController } from './notes.controller';

@Module({
  controllers: [NoteController],
  providers: [NoteService],
})
export class NotesModule {}
