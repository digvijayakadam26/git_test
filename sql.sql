this is a SQL file. You can write your SQL queries here

-- Example: Create a table named 'users'
CREATE TABLE users ( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    username VARCHAR(50) NOT NULL, 
    email VARCHAR(100) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);
-- Example: Insert a new user into the 'users' table
INSERT INTO users (username, email) VALUES ('john_doe', 'john.doe@example.com');
