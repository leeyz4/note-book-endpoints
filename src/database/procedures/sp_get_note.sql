    CREATE OR REPLACE FUNCTION sp_get_all_note()
    RETURNS SET OF NOTE AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM note ORDER BY id;
END;
$$ LANGUAGE plpgsql;

 CREATE OR REPLACE FUNCTION sp_get_all_note()
    RETURNS SET OF NOTE AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM note ORDER BY id DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_get_note(p_id INT)
RETURNS SET OF NOTE AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM note WHERE id = p_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'note with ID % not found', p_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_get_note_with_title(p_title VARCHAR(100))
    RETURNS SET OF note AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM note WHERE title = p_title;

    IF NOT FOUND THEN
        RAISE EXCEPTION ' note with title % not found', p_title;
    END IF;
END;
$$ LANGUAGE plpgsql;