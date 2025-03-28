CREATE EXTENSION IF NOT EXISTS citext;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id bigserial PRIMARY KEY,
    name varchar(255) NOT NULL,
    email citext UNIQUE NOT NULL,
    username varchar(255) UNIQUE NOT NULL,
    password bytea NOT NULL,
    profile_picture varchar(255) DEFAULT '',
    role user_role NOT NULL DEFAULT 'user',
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW()
);