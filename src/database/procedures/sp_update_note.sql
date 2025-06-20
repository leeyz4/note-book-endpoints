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

 -- Update the note details
     UPDATE notes
    SET
        title = p_title,
        content = p_content,
        updated_at = NOW()
    WHERE id = p_id;

    RETURN QUERY
    SELECT id, title, content, created_at, updated_at
    FROM notes
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

