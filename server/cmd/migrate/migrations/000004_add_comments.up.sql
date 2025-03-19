CREATE TABLE IF NOT EXISTS comments (
    id bigserial PRIMARY KEY,
    post_id bigserial NOT NULL,
    user_id bigserial NOT NULL,
    content TEXT NOT NULL,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id) 
        ON DELETE CASCADE
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);