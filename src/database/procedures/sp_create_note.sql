CREATE OR REPLACE FUNCTION sp_create_note(
    p_title VARCHAR(100),
    p_content VARCHAR(500),
)
RETURNS TABLE(
    id INT Unique,
    title VARCHAR(100),
    content VARCHAR(500),
    created_at TIMESTAMP
) AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM note WHERE note.title = p_title) THEN
        RAISE EXCEPTION 'A note with this title already exists: %', p_title;
    END IF;

    RETURN QUERY
    INSERT INTO note (title, content)
    VALUES (p_title, p_content)
    RETURNING note.id, note.title, note.content, note.created_at;
END;
$$ LANGUAGE plpgsql;