CREATE TABLE IF NOT EXISTS categories (
    id bigserial PRIMARY KEY,
    name text NOT NULL UNIQUE
);

ALTER TABLE posts
DROP COLUMN category,
ADD COLUMN category_id bigint,
ADD CONSTRAINT fk_category
FOREIGN KEY (category_id) REFERENCES categories(id);