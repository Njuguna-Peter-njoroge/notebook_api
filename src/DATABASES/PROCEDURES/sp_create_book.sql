CREATE OR REPLACE FUNCTION sp_create_book(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(255) NOT NULL,
    createdAt  DEFAULT CURRENT_TIMESTAMP

)
RETURNS SETOF books AS $$
BEGIN
    RETURN QUERY 
    INSERT INTO books(title,content,createdAt)
    VALUES (p_title, p_content, p_createdAt)
    RETURNING;
END;
$$ LANGUAGE plpgsql;

