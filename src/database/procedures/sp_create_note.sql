CREATE OR REPLACE FUNCTION sp_create_note(
    p_title TEXT,
    p_content TEXT,
    p_created_at TIMESTAMP
)
RETURNS TABLE(
    id INT,
    title TEXT,
    content TEXT,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO note (title, content, created_at)
    VALUES (p_title, p_content)
    RETURNING note.id, note.title, note.content, note.created_at;
END;
$$ LANGUAGE plpgsql;