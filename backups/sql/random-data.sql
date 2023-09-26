CREATE OR REPLACE PROCEDURE insert_random_books(num_rows_to_insert int)
LANGUAGE plpgsql
AS $$
DECLARE
    authors TEXT[] := ARRAY['Author A', 'Author B', 'Author C', 'Author D', 'Author E', 'Author F', 'Author G', 'Author H', 'Author I', 'Author J'];
    titles TEXT[] := ARRAY['Title 1', 'Title 2', 'Title 3', 'Title 4', 'Title 5', 'Title 6', 'Title 7', 'Title 8', 'Title 9', 'Title 10'];
    max_year INT := EXTRACT(YEAR FROM current_date)::INT;
BEGIN
    FOR i IN 1..num_rows_to_insert LOOP
        INSERT INTO books (id, category_id, author, title, year)
        VALUES (
            i,
            (i % 2) + 1,
            authors[1 + floor(random() * 3)],
            titles[1 + floor(random() * 4)],
            floor(random() * max_year) + 1
        );
    END LOOP;
END;
$$;

