import { Module } from '@nestjs/common';
import { NoteService } from './notes.service';
import { NoteController } from './notes.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NotesModule {}
