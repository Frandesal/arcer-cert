-- Migration to split full_name and change modules_completed structure
-- Run this in Supabase SQL Editor

-- 1. Add new name columns
ALTER TABLE students
ADD COLUMN first_name TEXT,
ADD COLUMN middle_name TEXT,
ADD COLUMN last_name TEXT;

-- 2. Migrate existing full_name data (best effort split)
UPDATE students
SET first_name = split_part(full_name, ' ', 1),
    last_name = CASE
                  WHEN array_length(string_to_array(full_name, ' '), 1) > 1 
                  THEN array_to_string((string_to_array(full_name, ' '))[2:array_length(string_to_array(full_name, ' '), 1)], ' ')
                  ELSE ''
                END;

-- 3. Make them required and drop old column
ALTER TABLE students ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE students ALTER COLUMN last_name SET NOT NULL;
ALTER TABLE students DROP COLUMN full_name;

-- 4. Update modules_completed from TEXT[] to JSONB array of objects
-- Rename old column to preserve data if any
ALTER TABLE students RENAME COLUMN modules_completed TO old_modules_completed;

-- Create new column
ALTER TABLE students ADD COLUMN modules_completed JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Basic migration of old active data (assumes old format was array of strings, giving them count 1)
UPDATE students
SET modules_completed = (
  SELECT jsonb_agg(jsonb_build_object('title', module, 'count', 1))
  FROM unnest(old_modules_completed) AS module
)
WHERE array_length(old_modules_completed, 1) > 0;

-- Clean up
ALTER TABLE students DROP COLUMN old_modules_completed;
