ALTER TABLE posts ADD COLUMN status TEXT NOT NULL DEFAULT 'Published';
ALTER TABLE posts ADD CONSTRAINT valid_post_status CHECK (status IN ('Draft', 'Published'));