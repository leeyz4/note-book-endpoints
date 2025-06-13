CREATE OR REPLACE FUNCTION sp_soft_delete_note(p_id INT)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT
) AS $$
BEGIN
    -- Check if the note exists
    IF NOT EXISTS (SELECT 1 FROM note WHERE note.id = p_id) THEN
        RETURN QUERY SELECT FALSE, 'note not found';
    END IF;

    --soft delete note
    UPDATE note SET deleted = true WHERE note.id = p_id;

    RETURN QUERY SELECT true, 'note successfully deleted';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_hard_delete_note(p_id INT)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT
) AS $$
BEGIN
    -- Check if the note exists
    IF NOT EXISTS (SELECT 1 FROM note WHERE note.id = p_id) THEN
        RETURN QUERY SELECT FALSE, 'note not found';
    END IF;

    --hard delete note
    DELETE FROM note WHERE note.id = p_id;

    RETURN QUERY SELECT true, 'note successfully deleted';
END;
$$ LANGUAGE plpgsql;