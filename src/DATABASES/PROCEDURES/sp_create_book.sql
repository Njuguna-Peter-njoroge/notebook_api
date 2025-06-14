CREATE OR REPLACE FUNCTION sp_create_book(
    p_title VARCHAR(255),
    p_content VARCHAR(255),
     p_createdAt TIMESTAMP  DEFAULT CURRENT_TIMESTAMP
)
RETURNS TABLE (
    id INT,
    title VARCHAR(255),
    content VARCHAR(255),
    createdAt TIMESTAMP
) AS $$


BEGIN
    RETURN QUERY 
    INSERT INTO books(title,content,createdAt)
    VALUES (p_title, p_content, p_createdAt)
    RETURNING id, title, content, createdAt;
END;
$$ LANGUAGE plpgsql;

