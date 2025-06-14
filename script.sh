# !/bin/bash

echo " setting up book_notebook"

# create database
psql -U postgres -h localhost -c "CREATE DATABASE book_notebook;"


# Run migrations

psql -U postgres -h localhost -d book_catalog -f src/DATABASES/initial_schema.sql

# CREATE stored procedures 
psql -U postgres -h localhost -d book_notebook -f src/DATABASES/PROCEDURES/sp_create_book.sql
psql -U postgres -h localhost -d book_notebook -f src/DATABASES/PROCEDURES/sp_get_book.sql
psql -U postgres -h localhost -d book_notebook -f src/DATABASES/PROCEDURES/sp_update_book.sql
psql -U postgres -h localhost -d book_notebook -f src/DATABASES/PROCEDURES/sp_delete_book.sql






echo "DATABASE SETUP COMPLETE..."

echo "you can now run : npm run start:dev"

