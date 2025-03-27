ALTER TABLE posts
DROP CONSTRAINT fk_category,
DROP COLUMN category_id,
ADD COLUMN category text NOT NULL DEFAULT 'Uncategorized';

DROP TABLE IF EXISTS categories;