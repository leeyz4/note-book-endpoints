#!/bin/bash

echo " Setting up note_book..."

# Create database 
psql -U postgres -h localhost -c "CREATE DATABASE note_book;"

# Run-migration
psql -U postgres -h localhost -d note_book -f src/database/migrations/001_initial_schema.sql

# Create stored procedures
psql -U postgres -h localhost -d note_book -f src/database/procedures/sp_create_note.sql
psql -U postgres -h localhost -d note_book -f src/database/procedures/sp_delete_note.sql
psql -U postgres -h localhost -d note_book -f src/database/procedures/sp_get_note.sql
psql -U postgres -h localhost -d note_book -f src/database/procedures/sp_update_note.sql

echo "Database setup complete..."

echo "You can now run: npm run start:dev"