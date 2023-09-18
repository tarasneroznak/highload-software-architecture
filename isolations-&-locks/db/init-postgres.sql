-- Active: 1690543510694@@127.0.0.1@5432@postgres

CREATE TABLE
    "users" (
        id serial PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        status VARCHAR(10) NOT NULL,
        score INT NOT NULL
    );