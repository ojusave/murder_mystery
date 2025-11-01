-- SQL script to update character display names
-- Run this in your Render Postgres database console

-- Update Laura Kohlhepp to Bribara Kohlhepp
UPDATE characters SET display_name = 'Bribara Kohlhepp' WHERE display_name = 'Laura Kohlhepp';

-- Other name updates (uncomment if needed):
-- UPDATE characters SET display_name = 'Morticia Adams' WHERE display_name = 'Mala "Ria" Adams';
-- UPDATE characters SET display_name = 'Gomez Adams' WHERE display_name = 'Gone Case Adam';
-- UPDATE characters SET display_name = 'Creep Lurch' WHERE display_name = 'Lurch';

-- Verify the updates
SELECT id, display_name, guest_id 
FROM characters 
WHERE display_name IN ('Morticia Adams', 'Gomez Adams', 'Bribara Kohlhepp', 'Creep Lurch')
ORDER BY display_name;

