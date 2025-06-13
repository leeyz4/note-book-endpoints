CREATE OR REPLACE FUNCTION sp_update_note(
    p_id INT,
    p_title VARCHAR(100),
    p_content VARCHAR(500)
)
RETURNS TABLE(
    id INT UNIQUE,
    title VARCHAR(100),
    content VARCHAR(500),
    created_at TIMESTAMP
) AS $$
BEGIN 
    -- Check if the note exists
    IF NOT EXISTS (SELECT 1 FROM note WHERE id = p_id) THEN
        RAISE EXCEPTION 'Note with ID % not found', p_id;
    END IF;

    -- Check if the title already exists for another note
    IF EXISTS (SELECT 1 FROM note WHERE title = p_title AND id != p_id) THEN
        RAISE EXCEPTION 'note with title % already exists', p_title;
    END IF;

    -- Update the note details
    RETURN QUERY
    UPDATEs note SET 
        title = p_title,
        content = p_content
    WHERE note.id = p_id
    RETURNING note.id, note.title, note.content, note.created_at;
END;
$$ LANGUAGE plpgsql;