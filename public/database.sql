CREATE DATABASE `peta`;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    hashed_pass TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expense (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount DECIMAL(10, 2) NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS blacklisted_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )


CREATE TRIGGER update_users_updated_at
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    UPDATE users
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

CREATE TRIGGER update_expense_updated_at
AFTER UPDATE ON expense
FOR EACH ROW
BEGIN
    UPDATE expense
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;


SELECT 
expense.id as expense_id,
expense.amount as amount,
expense.category as category,
expense.notes as notes,
expense.date as date,
expense.user_id as user_id,
users.username as username,
users.email as email
FROM expense INNER JOIN users 
ON expense.user_id = users.id
WHERE user_id = 8 AND expense.id = 15 OR category LIKE 'j'