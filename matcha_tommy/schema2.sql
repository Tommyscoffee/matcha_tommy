awk '/CREATE TABLE/,/ENGINE=InnoDB/' schema.sql > create_tables_only.sql
