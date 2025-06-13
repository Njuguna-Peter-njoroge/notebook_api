CREATE OR REPLACE FUNCTION sp_get_books()
RETURNS SETOF books AS $$
BEGIN
    RETURN QUERY SELECT * FROM books ORDER BY id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_get_book_by_id(p_id INTEGER)
RETURNS SETOF books AS $$
BEGIN
    RETURN QUERY SELECT * FROM books WHERE id = p_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Book with ID % not found', p_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

END IF;

END;

$$ LANGUAGE plpgsql;