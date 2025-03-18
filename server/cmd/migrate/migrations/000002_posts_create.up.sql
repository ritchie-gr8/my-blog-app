CREATE TABLE IF NOT EXISTS posts (
    id bigserial PRIMARY KEY,
    title text NOT NULL,
    introduction text,
    content text NOT NULL,
    category text NOT NULL,
    user_id bigint NOT NULL,
    thumbnail_image bytea,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW()
);