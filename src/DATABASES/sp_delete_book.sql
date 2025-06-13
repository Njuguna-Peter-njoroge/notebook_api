
CREATE OR REPLACE FUNCTION sp_delete_book(p_id INTEGER)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    deleted_id INTEGER;
BEGIN
    SELECT books.id INTO deleted_id FROM books WHERE books.id = p_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'book with ID % not found', p_id;
    END IF;
    

    DELETE FROM books WHERE books.id = p_id;
    
    RETURN QUERY SELECT true, 'book ' || deleted_id || ' has been permanently deleted'
END;
$$ LANGUAGE plpgsql;
