   CREATE OR REPLACE FUNCTION sp_get_all_note()
   RETURNS TABLE(
    id INTEGER,
    title VARCHAR(255),
)
   RETURNS TABLE(
    id INTEGER,
    title VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
BEGIN
     IF EXISTS (SELECT 1 FROM users WHERE notes.title = p_title) THEN
        RAISE EXCEPTION ' NOtes with title % already exists', p_title;
    END IF;

    RETURN QUERY
    INSERT INTO users (title, content, created_at)
    VALUES(p_title, p_content p_created_at)
    RETURNING notes.id, notes.title, notes.content, notes.created_at, notes.updated_at;
    END;
    $$ language plpgsql;

CREATE OR REPLACE FUNCTION sp_get_note(p_id INT)
RETURNS TABLE(
    id INTEGER,
    title VARCHAR(255),
    content VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT id, title, content, created_at, updated_at
    FROM notes
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;
