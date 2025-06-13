CREATE OR REPLACE FUNCTION sp_update_book(
    p_id INTEGER,
    p_title VARCHAR(255),
    P_content VARCHAR(255),
    P_createdAt TIMESTAMP
)
RETURNS TABLE(
    id INTEGER,
    title VARCHAR(255),
    content VARCHAR(255),
    createdAt TIMESTAMP
) AS $$
DECLARE
current_id INTEGER;
BEGIN
    SELECT books.id INTO current_id FROM books WHERE books.id = p_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION ' book with id % not found',p_id;
    END IF;

    IF p_id IS NOT NULL AND p_id != current_id THEN
        IF EXISTS (SELECT 1 FROM books WHERE books.id = p.id AND books.id !=p.id) THEN
            RAISE EXCEPTION 'Another book with this id exists';
        END IF;
    END IF;

    RETURN QUERY 
    UPDATE books SET
        
       title = COALESCE(p_title, books.title),
        content = COALESCE(p_content, books.content),
        createdAt = COALESCE(p_createdAt, books.createdAt)
      
    WHERE books.id = p_id
    RETURNING books.id, books.name, books.content, books.createdAt
END;
$$ LANGUAGE plpgsql;